const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Increase limit to handle large HTML strings
app.use(express.json({ limit: '10mb' }));

app.post('/screenshot', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).send('Missing "html" in request body.');
  }

  let browser;

  try {
    // Launch browser with arguments strictly required for container/cloud environments
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process' // Helps with memory on smaller instances
      ]
    });

    const page = await browser.newPage();

    // Set viewport to a standard size (optional, adjust as needed)
    await page.setViewport({ width: 1280, height: 720 });

    // Load the HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Take the screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 80, // Adjust quality (0-100)
      fullPage: true // Captures the entire scrollable height
    });

    // Send the image back
    res.set('Content-Type', 'image/jpeg');
    res.send(screenshotBuffer);

  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).send('Failed to generate screenshot.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
