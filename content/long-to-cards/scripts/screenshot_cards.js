const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function main() {
  const htmlFile = path.resolve(process.argv[2] || 'cards-ending.html');
  const outputDir = path.resolve(process.argv[3] || 'output_cards');

  if (!fs.existsSync(htmlFile)) {
    console.error(`HTML file not found: ${htmlFile}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1440 });

    const fileUrl = `file://${htmlFile}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait for cards to render
    await page.waitForSelector('.card');

    // Get all card elements
    const cards = await page.$$('.card');
    console.log(`Found ${cards.length} cards`);

    for (let i = 0; i < cards.length; i++) {
      const name = i === 0 ? 'cover.png' : i === cards.length - 1 ? 'ending.png' : `card_${String(i).padStart(2, '0')}.png`;
      await cards[i].screenshot({
        path: path.join(outputDir, name),
        type: 'png'
      });
      console.log(`  ✓ ${name}`);
    }

    console.log(`\n共生成 ${cards.length} 张卡片 → ${outputDir}/`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
