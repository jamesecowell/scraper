const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

exports.getCurrentEvents = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .https.onRequest((request, response) => {
    (async () => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const url = `https://www.ewrc-results.com/`;

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      await page.waitFor('.blok-table-event');

      const currentEvents = await page.$$eval('.blok-table-event', (events) => {
        return events.slice(0, 19).map((event) => {
          const properties = {};
          const eventElement = event.querySelector('a');
          properties.eventName = eventElement.innerText;
          properties.url = eventElement.getAttribute('href');
          return properties;
        });
      });
      await browser.close();
      response.status(200).send(currentEvents);
    })();
  });
