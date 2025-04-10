const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema(
    {
        fullName: {type: String, required: true},
        login: {type: String, required: true},
        password: {type: String, required: true},
        createdOn: {type: Date, default: new Date().getTime()},
        isDeleted: {type: Boolean, default: false}
    });

module.exports = mongoose.model('User', userSchema);
