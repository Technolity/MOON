const host = "www.moonnaturallyyours.com";
const key = "8ef509905d28457eaad94fac582c5c13";
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/about`,
  `https://${host}/faqs`,
  `https://${host}/journal`,
  `https://${host}/journal/kashmirs-red-gold-guide-to-genuine-saffron`,
  `https://${host}/journal/shilajit-himalayan-resin-ancient-healer`,
  `https://${host}/journal/raw-kashmiri-honey-hive-to-table`,
  `https://${host}/journal/kashmiri-walnuts-superfood-from-the-valley`,
  `https://${host}/journal/moon-kashmiri-ghee-artisan-process`,
  `https://${host}/products/shilajit`,
  `https://${host}/products/kashmiri-saffron`,
  `https://${host}/products/kashmiri-honey`,
  `https://${host}/products/irani-saffron`,
  `https://${host}/products/kashmiri-almonds`,
  `https://${host}/products/kashmiri-walnuts`,
  `https://${host}/products/kashmiri-ghee`,
  `https://${host}/media`,
  `https://${host}/privacy-policy`,
  `https://${host}/terms`,
  `https://${host}/shipping-policy`,
];

async function submitToIndexNow() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    if (response.ok || response.status === 202 || response.status === 200) {
      console.log(`✅ Successfully submitted to IndexNow! (Status: ${response.status})`);
    } else {
      console.error(`❌ Failed to submit. Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error("Response:", text);
    }
  } catch (error) {
    console.error("❌ Error submitting to IndexNow:", error);
  }
}

submitToIndexNow();
