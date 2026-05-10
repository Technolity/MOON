const env = require('../config/env');

async function revalidateStorefront(paths = [], tags = []) {
  const base = env.app.storefrontUrl;
  const secret = env.revalidate.secret;
  if (!secret) return;

  const calls = [
    ...paths.map((path) =>
      fetch(`${base}/api/revalidate?path=${encodeURIComponent(path)}`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
      })
    ),
    ...tags.map((tag) =>
      fetch(`${base}/api/revalidate?tag=${encodeURIComponent(tag)}`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
      })
    ),
  ];

  const results = await Promise.allSettled(calls);
  
  results.forEach((res, i) => {
    if (res.status === 'rejected') {
      console.error(`[Revalidate] Failed to revalidate:`, res.reason);
    } else if (!res.value.ok) {
      console.error(`[Revalidate] Error response: ${res.value.status} ${res.value.statusText}`);
    } else {
      console.log(`[Revalidate] Successfully revalidated tag/path.`);
    }
  });
}

module.exports = { revalidateStorefront };
