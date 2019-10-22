const axios = require('axios');
const _dbOps = require('./db');

const _getPageSource = async (url, id) => {
    try {
        const response = await axios.get(url);
        return { html: response.data, id }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    _getPageSource
}