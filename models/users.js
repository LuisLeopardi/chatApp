const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const UserSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
      },
      avatar: {
        type: String,
        required: true,
      },
      chats: [
        {
          key:String,
          messages:[
            {
              type:Object,
              sender:String,
              body:String,
            }
          ]
        }
      ]
})

function validateUser (user) {

    const schema = joi.object({
        name:joi.string().required(),
        email:joi.string().required().email(),
        password:joi.string().required()
    })

    return schema.validate(user)

}

exports.validateUser = validateUser

module.exports = Session = mongoose.model('users', UserSchema);