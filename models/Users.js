const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:  true
    },
    email: {
        type: String,
        required:  true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Provide a valid email')
            }
        }
    },
    password: {
        type: String,
        required:  true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                console.log('password issues')
                throw new Error ('invalid password')

            }
        }
    },
    date: {
        type: Date,
        default:Date.now
    },
})
const User = mongoose.model('User', UserSchema)

module.exports = User;