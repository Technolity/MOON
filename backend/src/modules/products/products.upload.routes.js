const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const ApiError = require('../../core/errors/api-error');
const { requireAdmin, requireAuth } = require('../../core/middleware/require-auth');
const sendResponse = require('../../core/utils/send-response');
const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');

const BUCKET = 'product-images';
const MAX_FILES = 5;
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB per original image
const MAX_MB = Math.round(MAX_BYTES / 1024 / 1024);

const router = express.Router();

router.use(requireAuth, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: MAX_FILES },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new ApiError(400, 'Only image files are accepted.'));
    }
    cb(null, true);
  },
});

function uploadMiddleware(req, res, next) {
  upload.array('images', MAX_FILES)(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(413, `Each image must be ${MAX_MB} MB or smaller before optimization.`));
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new ApiError(400, `Upload a maximum of ${MAX_FILES} images at a time.`));
      }

      return next(new ApiError(400, `Image upload failed: ${err.message}`));
    }

    return next(err);
  });
}

function summarizeFiles(files = []) {
  return files.map((file) => ({
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  }));
}

async function processAndUpload(buffer, productId, index) {
  const db = getSupabaseAdminClient();
  if (!db) {
    throw new ApiError(503, 'Supabase storage is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const filename = `${productId}/${uuidv4()}.webp`;

  const [fullBuffer, blurBuffer] = await Promise.all([
    sharp(buffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
    sharp(buffer)
      .resize({ width: 10 })
      .webp({ quality: 30 })
      .toBuffer(),
  ]);

  const { error } = await db.storage
    .from(BUCKET)
    .upload(filename, fullBuffer, { contentType: 'image/webp', upsert: false });

  if (error) {
    throw new ApiError(502, `Supabase storage upload failed for bucket "${BUCKET}": ${error.message}`);
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(filename);
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  return { url: urlData.publicUrl, alt: '', order: index, blurDataUrl };
}

router.post('/:productId/upload', uploadMiddleware, async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return next(new ApiError(400, 'At least one image file is required.'));
    }

    req.log?.('upload:images:received', {
      productId: req.params.productId,
      maxFiles: MAX_FILES,
      maxBytesPerImage: MAX_BYTES,
      files: summarizeFiles(files)
    });

    const results = await Promise.all(
      files.map((file, i) => processAndUpload(file.buffer, req.params.productId, i))
    );

    req.log?.('upload:images:complete', {
      productId: req.params.productId,
      uploaded: results.map((image) => ({ url: image.url, order: image.order }))
    });

    return sendResponse(res, {
      message: 'Product images uploaded.',
      data: { images: results }
    });
  } catch (err) {
    req.log?.('upload:images:failed', {
      productId: req.params.productId,
      files: summarizeFiles(req.files),
      error: err
    }, 'error');
    next(err);
  }
});

module.exports = router;
