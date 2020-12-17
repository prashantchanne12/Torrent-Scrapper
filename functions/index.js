const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const puppeteer = require('puppeteer');

const scrapeLinks = async (query) => {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://yts.mx/');

    await page.goto(`https://yts.mx/browse-movies/${query}/all/all/0/latest/0/all`);
    await page.screenshot({ path: '1.png' });


    // Execute in DOM
    const data = await page.evaluate(() => {

        const movies = document.querySelectorAll('.browse-movie-wrap > a');

        const urls = Array.from(movies).map(link => link.href);

        return urls;
    });

    let arrayOfLinks = [];

    for (let url of data) {

        await page.goto(url);

        const dowloadUrls = await page.evaluate(() => {

            const url_rows = document.querySelectorAll('p.hidden-md.hidden-lg a');

            const urls = Array.from(url_rows).map(link => link.href);

            return urls;
        });

        console.log(dowloadUrls);

        arrayOfLinks = arrayOfLinks.concat(dowloadUrls);
    }

    await browser.close();
    return arrayOfLinks;

}

const scrape1337X = async (query) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://1337x.to/');
    await page.screenshot({ path: '2.png' });


    await page.goto(`https://1337x.to/search/${query}/1/`);
    await page.screenshot({ path: '3.png' });

    const urls = await page.evaluate(() => {

        const movies = document.querySelectorAll('tbody tr td a:nth-child(2)');
        const urls = Array.from(movies).map(link => link.href);

        return urls;
    });

    let arrayOfLinks = [];

    for (let url of urls) {

        await page.goto(url);

        const dowloadUrls = await page.evaluate(() => {

            const link = document.querySelector('.clearfix > ul > li > a').href;
            const title = document.querySelector('h1').textContent.trim();

            return {
                title,
                link
            };
        });

        arrayOfLinks = arrayOfLinks.concat(dowloadUrls);
    }



    await browser.close();

    return arrayOfLinks;

}

// const scrapThePirateBay = async (query) => {

//     const browser = await puppeteer.launch({
//         headless: true
//     });
//     const page = await browser.newPage();

//     await page.goto(`https://thepiratebay10.org/search/${query}/1/99/0`);
//     await page.screenshot({ path: '4.png' });

//     const urls = page.evaluate(() => {
//         const movies = document.querySelectorAll('#searchResult tbody tr td:nth-child(2) > a');

//         const urls = Array.from(movies).map(link => link.href);

//         return urls;

//     });


//     let arrayOfLinks = [];

//     for (let url of urls) {

//         await page.goto(url);

//         const dowloadUrls = await page.evaluate(() => {

//             const link = '';
//             const title = '';

//             return {
//                 title,
//                 link
//             };
//         });

//         arrayOfLinks = arrayOfLinks.concat(dowloadUrls);
//     }

//     browser.close();

//     return arrayOfLinks;

// }

exports.scrapper = functions.https.onRequest(async (request, response) => {


    cors(request, response, async () => {

        // const data = await scrapeLinks('deadpool');
        // const data = await scrape1337X('deadpool');
        const data = await scrapThePirateBay('deadpool');

        response.send(data);

    });

});