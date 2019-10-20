const _dbOps = require('./helpers/db')
const _getPageSource = require('./helpers/api')._getPageSource;
const _parsePriceFromSource = require('./helpers/parser')._parsePriceFromSource;
const task = require('./server').task;

async function _main(products = _dbOps.getAllProducts()) {
    const sourcePromises = products.map(ele => _getPageSource(_dbOps.getById(ele.product_uuid).url, ele.product_uuid));
    Promise.all(sourcePromises)
        .then(sources => sources.map(source => _parsePriceFromSource(source.html, source.id)))
        .then(pricePromises => Promise.all(pricePromises))
        .then(data => {
            return _dbOps.updateJob(data)
        })
        .catch(err => {
            console.log(err);
            //Killing cron task.
            task.stop()
        });
};

module.exports = {
    _main
};