const { AWS, MAIL } = require('../config');
const { ACCESS_KEY_ID, ACCESS_KEY_SECRET } = AWS;

const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

const transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: ACCESS_KEY_SECRET,
}));

module.exports = sendPriceDropMail = (productName, price) => {
    const mailOptions = {
        from: 'nowfal.nzr.554@gmail.com',
        to: MAIL,
        subject: `Price drop detected`,
        html: `<h1>${productName}'s</h1> price just hit an all time low of ₹${price} at ${new Date().toLocaleString()}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Unable to send mail ', error);
        }
    });
}