const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow large HTML payloads
app.use(express.json({ limit: '50mb' }));

app.post('/screenshot', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Missing "html" in request body.' });
  }

  let browser;

  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 1200 });

    console.log('Setting content...');
    // 'domcontentloaded' is faster and less likely to timeout than 'networkidle0'
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('Taking screenshot...');
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      fullPage: true
    });

    console.log('Success!');
    res.set('Content-Type', 'image/jpeg');
    res.send(screenshotBuffer);

  } catch (error) {
    console.error('Screenshot failed:', error);
    // Returns the ACTUAL error to n8n so you can debug it
    res.status(500).json({ 
        message: 'Failed to generate screenshot', 
        error: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
