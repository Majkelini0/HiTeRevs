const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    tags: {type: [String], required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: String, required: true},
    reviewIDs: {type: [String], required: true},
    rating: {type: Number, required: true},
    revsCount: {type: Number, required: true},
});

module.exports = mongoose.model('Product', productSchema);