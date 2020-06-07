const puppeteer = require('puppeteer');

async function getCurrentEvents() {
  try {
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
    browser.close();
    console.log(currentEvents);
    return currentEvents;
  } catch (error) {
    console.log(error);
    browser.close();
  }
}

getCurrentEvents();

exports.getCurrentEvents = async function (req, res) {
  res.status(200).send(await getCurrentEvents());
};
