// Storytelling Animation Engine - Stable Version
class StorytellingEngine {
    constructor() {
        this.canvas = document.getElementById('story-frame-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.frameSets = {
            honey: [],
            saffron: [],
            shilajit: []
        };
        this.activeProduct = 'saffron';
        this.currentFrame = 50;
        this.totalFrames = 192;
        this.isReady = false;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.preloadProductFrames('honey', 'ezgif-2fae6b36993927b6-jpg');
        this.preloadProductFrames('saffron', 'moon2222');
        this.preloadProductFrames('shilajit', 'moon333');
        this.setupScrollAnimation();
    }

    setProduct(productKey) {
        if (!this.frameSets[productKey]) return;
        this.activeProduct = productKey;

        const set = this.frameSets[productKey];
        this.isReady = set.length === this.totalFrames && set.every(img => img.complete);

        if (this.isReady) {
            this.drawFrame(this.currentFrame);
        }
    }

    setupCanvas() {
        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = this.canvas.getBoundingClientRect();

            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;

            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(dpr, dpr);
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';

            if (this.isReady) {
                this.drawFrame(this.currentFrame);
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
    }

    preloadProductFrames(productKey, folder) {
        console.log(`Loading frames for ${productKey}...`);

        let loadedInSet = 0;

        for (let i = 1; i <= this.totalFrames; i++) {
            const img = new Image();
            const frameNumber = String(i).padStart(3, '0');
            img.src = `${folder}/ezgif-frame-${frameNumber}.jpg`;

            img.onload = () => {
                loadedInSet++;
                if (loadedInSet === this.totalFrames) {
                    console.log(`${productKey} frames loaded!`);
                    if (this.activeProduct === productKey) {
                        this.isReady = true;
                        this.drawFrame(this.currentFrame);
                    }
                }
            };

            this.frameSets[productKey].push(img);
        }
    }

    drawFrame(frameIndex) {
        if (!this.isReady || frameIndex < 0 || frameIndex >= this.totalFrames) return;

        const img = this.frameSets[this.activeProduct][frameIndex];
        if (!img || !img.complete) return;

        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = this.canvas.width / dpr;
        const canvasHeight = this.canvas.height / dpr;

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    setupScrollAnimation() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateFrameOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateFrameOnScroll() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = window.innerHeight * 0.2; // Original comfortable speed

        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
        const frameRange = this.totalFrames - 50;
        const frameIndex = 50 + Math.floor(scrollFraction * frameRange);

        if (frameIndex !== this.currentFrame) {
            this.currentFrame = frameIndex;
            this.drawFrame(frameIndex);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.storytellingEngine = new StorytellingEngine();
});
