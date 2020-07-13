const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema ({
    username:String, 
    socketID:String
})

module.exports = User = mongoose.model('sessions', SessionSchema);