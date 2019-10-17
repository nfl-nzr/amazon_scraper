const NAME_SPACE = '8d9c4784-f756-413e-944f-d0ff5dc130b0';

const _ = require('lodash-id')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const uuidv3 = require('uuid/v3');

const adapter = new FileSync('db.json');
const db = low(adapter);

const init = () => {
    const productsName = db.has('products').value();
    const history = db.has('timeline').value();
    if (!productsName) db.set('products', []).write();
    if (!history) db.set('timeline', []).write();
}

const updateJob = products => {
    products.forEach(product => {
        const productId = product.id
        const productExists = checkIfProductExists(productId);
        if (!productExists) {
            initProductAndTimeline(productId, product)
        } else updateTimeline(productId, product)
    });
};

const updateTimeline = (productId, product) => {
    const { price } = product
    return db.get('timeline')
        .push({ product_uuid: productId, price, date: new Date() })
        .write();

}

const checkIfProductExists = productId => {
    const existingProduct = db.get('products')
        .filter({ product_uuid: productId })
        .value();
    if (existingProduct.length > 0) {
        return true;
    } else return false;
};

const initProductAndTimeline = (productId, product) => {

    db.get('products')
        .push({
            product_uuid: productId,
            name: product.name,
        })
        .write();
    db.get('timeline')
        .push({ product_uuid: productId, price: product.price, date: new Date() })
        .write();
}


const getAllProducts = () => db.get('products').value();

//TODO implement product object validation before creating.
const addProduct = product => {
    init();
    const existingProduct = db.get('products')
        .find({ product_uuid: uuidv3(product.name, NAME_SPACE) })
        .value();
    if (existingProduct) {
        console.log(`${product.name} already exists and price is being tracked`);
        return;
    }
    db.get('products')
        .push({
            product_uuid: uuidv3(product.name, NAME_SPACE),
            ...product
        })
        .write();
    console.log(`Added ${product.name} to list of items to be tracked`)
}

const getById = id => db.get('products')
    .find({ product_uuid: id })
    .value();

const getProductAndTimeline = id => {
    const data = {}
    data.timeline = db
        .get('timeline')
        .filter({ product_uuid: id })
        .value()
        .map(ele => {
            return { price: ele.price, date: ele.date }
        });
    data.product = getById(id);
    return data;
}
module.exports = {
    getById,
    updateJob,
    getAllProducts,
    addProduct,
    getProductAndTimeline
}