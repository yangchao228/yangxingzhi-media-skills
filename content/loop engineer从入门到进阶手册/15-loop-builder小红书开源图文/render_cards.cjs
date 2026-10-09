const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = __dirname;
const htmlPath = path.join(root, "loop-builder-xhs-cards-8x3x4.html");
const outputDir = path.join(root, "png");
const names = [
  "01-cover.png",
  "02-pain.png",
  "03-mechanism.png",
  "04-output-map.png",
  "05-ci-scenario.png",
  "06-ui-case.png",
  "07-repository.png",
  "08-github-action.png",
];

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const executablePath = process.env.CHROME_PATH || (fs.existsSync(systemChrome) ? systemChrome : chromium.executablePath());
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });

  try {
    for (let i = 0; i < names.length; i += 1) {
      const url = `${pathToFileURL(htmlPath).href}?card=${i + 1}`;
      await page.goto(url, { waitUntil: "load" });
      await page.waitForSelector(".active-export");
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.images);
        await Promise.all(images.map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })));
      });
      await page.screenshot({ path: path.join(outputDir, names[i]), type: "png" });
      console.log(`rendered ${names[i]}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
