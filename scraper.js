const _dbOps = require('./helpers/db')
const _getPageSource = require('./helpers/api')._getPageSource;
const _parsePriceFromSource = require('./helpers/parser')._parsePriceFromSource;
const task = require('./server')

async function _main() {
    const products = _dbOps.getAllProducts();
    const sourcePromises = products.map(ele => _getPageSource(_dbOps.getById(ele.product_uuid).url, ele.product_uuid));
    Promise.all(sourcePromises)
        .then(sources => sources.map(source => _parsePriceFromSource(source.html, source.id)))
        .then(pricePromises => Promise.all(pricePromises))
        .then(data => _dbOps.updateJob(data))
        .catch(err => {
            console.log(err);
            //Stopping cron job to avoid detection.
            task.stop()
        });
};

module.exports = {
    _main
};