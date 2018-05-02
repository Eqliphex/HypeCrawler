let puppeteer = require('puppeteer');
let scraper = require('./scrapers/careerjet-parallel-scraper-1.0.0');

async function main() {
    // Initialization:
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ // Håndtering af korrekt aflæsning af dansk alfabet
        'Accept-Language': 'da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    // let startTime = Date.now();
/*    await scraper.initializeDatabase()
        .catch((error) => {
            console.log("Error at main → initializeDatabase(): " + error);
        });*/

    printDatabaseResult(await scraper.beginScraping(page, browser, 1)
        .catch((error) => {
            console.log("Error at main → beginScraping(): " + error);
        }));

    // Clean up:
    browser.close();

}

main()
    .catch(() => {
        console.log("Something went wrong in main!")
    });

/**
 *
 */
function areaMapper() {

}


function printDatabaseResult(results) {
    let successCounter = results.successCounter;
    let existingCounter = results.existingCounter;
    let errorCounter = results.errorCounter;

    let totalEntries = successCounter + existingCounter + errorCounter;

    console.log("\x1b[0m", '----------------------------------------------------------');
    console.log('\t\t\t\t\tSCRAPER STATISTIK');
    console.log("\x1b[0m", '----------------------------------------------------------');
    console.log("\x1b[32m" + '\t\t\t' + successCounter + ' OUT OF ' + totalEntries
        + ` (${(successCounter / totalEntries) * 100} %) --- INSERTS`);
    console.log("\x1b[0m", '----------------------------------------------------------');

    console.log("\x1b[33m" + '\t\t\t' + existingCounter + ' OUT OF ' + totalEntries
        + ` (${(existingCounter / totalEntries) * 100} %) --- EXISTS`);
    console.log("\x1b[0m", '----------------------------------------------------------');
    console.log("\x1b[31m" + '\t\t\t' + errorCounter + ' OUT OF ' + totalEntries
        + ` (${(errorCounter / totalEntries) * 100} %) --- ERRORS`);

    console.log("\x1b[0m", '----------------------------------------------------------');
}