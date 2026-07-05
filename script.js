const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
};

const sendHtml = (res, html) => {
    res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
    });
    res.end(html);
};

const sendNotFound = (res) => {
    res.writeHead(404, {
        'Content-type': 'text/html; charset=utf-8',
    });
    res.end('<h1>Page not found!</h1>');
};

const shortNewsReplace = (temp, newsData) => {
    let shortNewsOutput = temp.replace(/{%IMG_ID%}/g, newsData.imgID);

    shortNewsOutput = shortNewsOutput.replace(/{%NEWS_ID%}/g, newsData.newsID);

    shortNewsOutput = shortNewsOutput.replace(/{%IMG_ALT%}/g, newsData.imgAlt);

    shortNewsOutput = shortNewsOutput.replace(/{%IMG_TITLE%}/g, newsData.imgTitle);

    shortNewsOutput = shortNewsOutput.replace(/{%TITLE%}/g, newsData.title);

    shortNewsOutput = shortNewsOutput.replace(/{%SHORT_DESCRIPTION%}/g, newsData.shortDescription);

    return shortNewsOutput;
};

const longNewsReplace = (temp, newsData) => {
    let longNewsOutput = temp.replace(/{%IMG_ID%}/g, newsData.imgID);

    longNewsOutput = longNewsOutput.replace(/{%NEWS_ID%}/g, newsData.newsID);

    longNewsOutput = longNewsOutput.replace(/{%IMG_ALT%}/g, newsData.imgAlt);

    longNewsOutput = longNewsOutput.replace(/{%IMG_TITLE%}/g, newsData.imgTitle);

    longNewsOutput = longNewsOutput.replace(/{%TITLE%}/g, newsData.title);

    longNewsOutput = longNewsOutput.replace(/{%LONG_DESCRIPTION%}/g, newsData.longDescription);

    return longNewsOutput;
};

const supporterReplace = (temp, supporterData) => {
    let supporterOutput = temp.replace(/{%SUPPORTER_ID%}/g, supporterData.supporterId);
    supporterOutput = supporterOutput.replace(/{%SUPPORTER_NAME%}/g, supporterData.supporterName);
    supporterOutput = supporterOutput.replace(/{%SUPPORTER_IMG_ID%}/g, supporterData.supporterImgId);
    supporterOutput = supporterOutput.replace(/{%SUPPORT_QUANTITY%}/g, supporterData.supportQuantity);
    supporterOutput = supporterOutput.replace(/{%SHORT_DESCRIPTION%}/g, supporterData.shortDescription);
    supporterOutput = supporterOutput.replace(/{%LONG_DESCRIPTION%}/g, supporterData.longDescription);

    return supporterOutput;
};

const nrReplace = (temp, nrData) => {
    let nrOutput = temp.replace(/{%EVENT%}/g, nrData.event);
    nrOutput = nrOutput.replace(/{%TIME%}/g, nrData.time);

    return nrOutput;
};

const cuberReplace = (temp, cuberData, nrsHtml) => {
    let cuberOutput = temp.replace(/{%CUBER_NAME%}/g, cuberData.cuberName);
    cuberOutput = cuberOutput.replace(/{%IMG_ID%}/g, cuberData.imgID);
    cuberOutput = cuberOutput.replace(/{%NRS%}/g, nrsHtml);

    return cuberOutput;
};

const szakkorReplace = (temp, szakkorData) => {
    let szakkorOutput = temp.replace(/{%SZAKKOR_ID%}/g, szakkorData.szakkorId.replace('.', '-'));
    szakkorOutput = szakkorOutput.replace(/{%TITLE%}/g, szakkorData.title);
    szakkorOutput = szakkorOutput.replace(/{%SHORT_DESCRIPTION%}/g, szakkorData.shortDescription);
    szakkorOutput = szakkorOutput.replace(/{%LONG_DESCRIPTION%}/g, szakkorData.longDescription);
    szakkorOutput = szakkorOutput.replace(/{%PLACE%}/g, szakkorData.place);
    szakkorOutput = szakkorOutput.replace(/{%DATE%}/g, szakkorData.date);

    return szakkorOutput;
};

"use strict";

// Reading HTMLs
const mainPage = fs.readFileSync(
    './index.html', 
    'utf-8'
);
const mainPageNoAnimation = fs.readFileSync(
    './index-no-animation.html', 
    'utf-8'
);

const tempShortNewsCard = fs.readFileSync(
    './hir-kartya-template.html',
    'utf-8'
);

const tempShortNews = fs.readFileSync(
    './hirek-template.html',
    'utf-8'
);

const tempLongNews = fs.readFileSync(
    `./hosszu-hir-template.html`,
    'utf-8'
);
const tempSupportUs = fs.readFileSync(
    `./tamogatas.html`,
    'utf-8'
);
const tempSupporter = fs.readFileSync(
    `./supporter-template.html`,
    'utf-8'
);
const tempHosszuTamogato = fs.readFileSync(
    `./hosszu-tamogato-template.html`,
    'utf-8'
);
const tempCuberCard = fs.readFileSync(
    `./cuber-template.html`,
    'utf-8'
);
const tempCubers = fs.readFileSync(
    `./kockasok.html`,
    'utf-8'
);
const tempNR = fs.readFileSync(
    `./nr-template.html`,
    'utf-8'
);
const tempSzakkor = fs.readFileSync(
    `./szakkor-template.html`,
    'utf-8'
);
const tempSzakkorKartya = fs.readFileSync(
    `./szakkor-kartya-template.html`,
    'utf-8'
);
const tempHosszuSzakkor = fs.readFileSync(
    `./hosszu-szakkor-template.html`,
    'utf-8'
);

// Reading JSONs
const newsJSON = fs.readFileSync('./data/news.json', 'utf-8');
const newsObject = JSON.parse(newsJSON);

const supportersJSON = fs.readFileSync('./data/supporters.json', 'utf-8');
const supporterObject = JSON.parse(supportersJSON);

const cubersJSON = fs.readFileSync('./data/cubers.json', 'utf-8');
const cubersObject = JSON.parse(cubersJSON);

const szakkorJSON = fs.readFileSync('./data/szakkor.json', 'utf-8');
const szakkorObject = JSON.parse(szakkorJSON);

// Creating server
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // Request page
    if (pathname === '/') {

        sendHtml(res, mainPage);

    } else if (pathname === '/main') {
        sendHtml(res, mainPageNoAnimation);

    } else if (pathname === '/hirek') {

        res.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8'
        });

        const longNewsHtml = newsObject.map(el => longNewsReplace(tempLongNews, el)).join('');

        const shortNewsHtml = newsObject.map(el => shortNewsReplace(tempShortNewsCard, el)).join('');

        let outputNews = tempShortNews;

        outputNews = outputNews.replace(/{%LONG_NEWS%}/g, longNewsHtml);
        outputNews = outputNews.replace(/{%SHORT_NEWS%}/g, shortNewsHtml);

        res.end(outputNews);

    } else if (pathname === '/tamogatas') {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8'
        });

        const supporterModalsHtml = supporterObject.map(el => supporterReplace(tempHosszuTamogato, el)).join('');
        const supporterCardsHtml = supporterObject.map(el => supporterReplace(tempSupporter, el)).join('');

        let outputSupporterList = tempSupportUs;
        outputSupporterList = outputSupporterList.replace(/{%SUPPORTER_MODALS%}/g, supporterModalsHtml);
        outputSupporterList = outputSupporterList.replace(/{%SUPPORTERS%}/g, supporterCardsHtml);

        res.end(outputSupporterList);
        
    } else if (pathname === '/kockasok') {
        const cubersHtml = cubersObject.map(cuber => {
            const nrsHtml = cuber.nrs.map(nr => nrReplace(tempNR, nr)).join('');

            return cuberReplace(tempCuberCard, cuber, nrsHtml);
        }).join('');

        let outputCubers = tempCubers.replace(/{%CUBERS%}/g, cubersHtml);

        sendHtml(res, outputCubers);

    } else if (pathname === '/szakkor') {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8'
        });

        const longSzakkorHtml = szakkorObject.map(el => szakkorReplace(tempHosszuSzakkor, el)).join('');
        const shortSzakkorHtml = szakkorObject.map(el => szakkorReplace(tempSzakkorKartya, el)).join('');

        let outputSzakkor = tempSzakkor;
        outputSzakkor = outputSzakkor.replace(/{%LONG_SZAKKORS%}/g, longSzakkorHtml);
        outputSzakkor = outputSzakkor.replace(/{%SHORT_SZAKKORS%}/g, shortSzakkorHtml);

        res.end(outputSzakkor);

    } else if (pathname === '/healthz') {
        res.writeHead(200, {
            'Content-type': 'text/plain; charset=utf-8'
        });
        res.end('ok');

    } else if (pathname.startsWith('/public')) {
        const relativePath = pathname.replace(/^\/public\/?/, '');
        const filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

        if (!filePath.startsWith(PUBLIC_DIR)) {
            return sendNotFound(res);
        }

        fs.readFile(filePath, (err, file) => {
            if (err) {
                return sendNotFound(res);
            }

            const contentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
            res.writeHead(200, {
                'Content-type': contentType
            });
            res.end(file);
        });
    } else {
        sendNotFound(res);
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening to requests on port ${PORT}`);
});
