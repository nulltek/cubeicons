module.export = (temp, newsData) => {
    let shortNewsOutput = temp.replace(/{%IMG_ID%}/g, newsData.imgID);
    shortNewsOutput = shortNewsOutput.replace(/{%IMG_ALT%}/g, newsData.imgAlt);
    shortNewsOutput = shortNewsOutput.replace(/{%IMG_TITLE%}/g, newsData.imgTitle);
    shortNewsOutput = shortNewsOutput.replace(/{%TITLE%}/g, newsData.title);
    shortNewsOutput = shortNewsOutput.replace(/{%SHORT_DESCRIPTION%}/g, newsData.shortDescription);
}