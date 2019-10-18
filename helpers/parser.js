const cheerio = require('cheerio');

const _parsePriceFromSource = async (html, id) => {
    console.log('Parsing source...')
    const productDetails = {};
    productDetails.id = id;
    try {
        const $ = cheerio.load(html);

        //Find the product name/title
        const title = $("#productTitle").text().trim();
        if (title) productDetails.product = title;

        //Search for the span tag that holds the price.
        const price = $('td.a-span12 > span');

        //Determine the price from the class name.
        const priceFromClass = price.map(function () {
            const cls = $(this).attr('class');
            if (cls && cls.includes('price') && !cls.includes('a-text-strike')) return this
        }).get();

        if (priceFromClass.length) {
            productDetails.price = $(priceFromClass[0]).text();
            return productDetails;
        }

        //If price is not found using the class name find price using id's
        const priceFromIds = price.map(function () {
            const ids = $(this).attr('id');
            if (ids === 'priceblock_dealprice') {
                return ids
            }
        }).get();

        if (priceFromIds.length) {
            productDetails.price = $(priceFromIds[0]).text();
            return productDetails;
        }

        return null
    } catch (error) {
        throw error;
    }
};

module.exports = {
    _parsePriceFromSource
}