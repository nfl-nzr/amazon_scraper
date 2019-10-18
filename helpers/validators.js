const yup = require('yup');

const schema = yup.object().shape({
    name: yup.string().required(),
    url: yup.string().url()
});

const validateProduct = product => schema.isValid(product);
module.exports = validateProduct