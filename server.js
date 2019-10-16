const JSON_HEADER = {
    'Content-Type': 'application/json; charset=utf-8'
};

const polka = require('polka');
const send = require('@polka/send-type');
const cron = require('node-cron');
const { join } = require('path');
const { renderFile } = require('ejs')

const scrape = require('./scraper')._main;
const _dbOps = require('./helpers/db');

const views = join(__dirname, 'views');

cron.schedule('*/5 * * * * *', () => {
    scrape()
});

const app = polka().listen(3000);

app.get('/products', (req, res) => {
    res.render = () => {
        const products = _dbOps.getAllProducts();
        renderFile(join(views, 'pages/products.ejs'), { products }, (err, html) => {
            // Handle Error, else return output
            if (err) return send(res, 500, err.message || err);
            res.setHeader('content-type', 'text/html');
            send(res, 200, html);
        });
    }
    res.render()
});
app.get('/products/:id/timeline', (req, res) => {
    res.render = () => {
        const products = _dbOps.getAllProducts();
        renderFile(join(views, 'pages/products.ejs'), { products }, (err, html) => {
            // Handle Error, else return output
            if (err) return send(res, 500, err.message || err);
            res.setHeader('content-type', 'text/html');
            send(res, 200, html);
        });
    }
    res.render()
});