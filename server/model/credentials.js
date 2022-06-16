const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    client_secret: {
        type: String,
        required: true
    },
    redirect_uri: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    initial: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    },

});


const credentials = mongoose.model('credentials', credentialSchema);

module.exports = credentials;
