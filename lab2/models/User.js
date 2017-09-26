const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    passwordHash: {
        type: String,
        required: 'Please provide a password hash'
    }
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);