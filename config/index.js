//Access Key ID:
// AKIAIBRGVC4BLCV445SQ
// Secret Access Key:
// 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

const MAIL = 'nowfal.nzr.554@gmail.com'
const AWS = {
    ACCESS_KEY_ID: process.env.KEY_ID || 'ACCESS KEY ID',
    ACCESS_KEY_SECRET: process.env.KEY_SECRET || 'ACCESS KEY SECRET'
};

module.exports = {
    AWS,
    MAIL
}