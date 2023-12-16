// shortLink.model.js
const mongoose = require('mongoose');

const shortLinkSchema = new mongoose.Schema({
    token: String,
    originalURL: String,
    expirationTime: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clickCount: {
        type: Number,
        default: 0,
    },
});

const ShortLink = mongoose.model('ShortLink', shortLinkSchema);

module.exports = ShortLink;
