'use strict';

const puppeteer = require('puppeteer');

async function getChampTable(year) {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const url = `https://www.ewrc-results.com/season/${year}/1-wrc/`;

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const oddDriverTable = await page.evaluate(() => {
      const grabFromRow = (row, classname) =>
        row.querySelector(classname).innerText.trim();

      const DRIVER_ROW_SELECTOR = 'div#points + table tr.table_sude';

      const data = [];

      const driverRows = document.querySelectorAll(DRIVER_ROW_SELECTOR);

      for (const tr of driverRows) {
        data.push({
          position: grabFromRow(tr, 'td.points-pos'),
          firstName: grabFromRow(tr, 'a').split(' ')[1],
          lastName: grabFromRow(tr, 'a').split(' ')[0],
          pointsTotal: grabFromRow(tr, 'td.points-total'),
        });
      }
      return data;
    });

    const evenDriverTable = await page.evaluate(() => {
      const grabFromRow = (row, classname) =>
        row.querySelector(classname).innerText.trim();

      const DRIVER_ROW_SELECTOR = 'div#points + table tr.table_liche';

      const data = [];

      const driverRows = document.querySelectorAll(DRIVER_ROW_SELECTOR);

      for (const tr of driverRows) {
        data.push({
          position: grabFromRow(tr, 'td.points-pos'),
          firstName: grabFromRow(tr, 'a').split(' ')[1],
          lastName: grabFromRow(tr, 'a').split(' ')[0],
          pointsTotal: grabFromRow(tr, 'td.points-total'),
        });
      }
      return data;
    });

    let unsortedTable = oddDriverTable.concat(evenDriverTable);
    let sortedTable = unsortedTable.sort((a, b) => {
      return a.position - b.position;
    });
    browser.close();
    console.log(JSON.stringify(sortedTable, null, 2));
  } catch (error) {
    console.log(error);
  }
}

getChampTable(2020);
