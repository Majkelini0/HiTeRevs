const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    title: {type: String, required: true},
    review: {type: String, required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: String, required: true},
    tags: {type: [String], required: true},
    rating: {type: Number, required: true},
    img: {type: String, required: false},
    userID: {type: String, required: true},
    createdOn: {type: Date, default: new Date().getTime()},
    isDeleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Review', reviewSchema);