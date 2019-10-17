const JSON_HEADER = {
    'Content-Type': 'application/json; charset=utf-8'
};
const PORT = process.env.PORT || 3000;

const polka = require('polka');
const send = require('@polka/send-type');
const cron = require('node-cron');
const { join } = require('path');
const { urlencoded } = require('body-parser');
const { renderFile } = require('ejs');

const views = join(__dirname, 'views');
const static_dir = join(__dirname, "public");
console.log(static_dir)

const scrape = require('./scraper')._main;
const _dbOps = require('./helpers/db');

const serve = require('serve-static')(static_dir);

const app = polka().listen(PORT, ()=>console.log('App listening on ' + PORT));

app.use(serve);
app.use(urlencoded());

app.get('/', (req, res) => {
    res.render = () => {
        const products = _dbOps.getAllProducts();
        renderFile(join(views, 'pages/index.ejs'), { products }, (err, html) => {
            // Handle Error, else return output
            if (err) return send(res, 500, err.message || err);
            res.setHeader('content-type', 'text/html');
            send(res, 200, html);
        });
    }
    res.render()
});

app.get('/:id/timeline', (req, res) => {
    return send(res, 200, _dbOps.getProductAndTimeline(req.params.id), JSON_HEADER)
});

//Temporarily coupled with the server. Will use concurrently in the future.
const task = cron.schedule('0 0 * * *', () => {
    console.log('Scraping every day at midnight')
    scrape()
});

module.exports = task;