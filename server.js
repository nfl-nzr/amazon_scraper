const JSON_HEADER = {
    'Content-Type': 'application/json; charset=utf-8'
};
const PORT = process.env.PORT || 3000;

const polka = require('polka');
const send = require('@polka/send-type');
const cron = require('node-cron');
const { join } = require('path');
const { renderFile } = require('ejs')

const scrape = require('./scraper')._main;
const _dbOps = require('./helpers/db');

const views = join(__dirname, 'views');

const app = polka().listen(PORT, ()=>console.log('App listening on ' + PORT));

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
        renderFile(join(views, 'pages/product.ejs'), { products }, (err, html) => {
            // Handle Error, else return output
            if (err) return send(res, 500, err.message || err);
            res.setHeader('content-type', 'text/html');
            send(res, 200, html);
        });
    }
    res.render()
});


//Temporarily coupled with the server. Will use concurrently in the future.
const task = cron.schedule('0 0 * * *', () => {
    scrape()
});

module.exports = task;