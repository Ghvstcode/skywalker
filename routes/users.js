const express = require('express')
const User =  require('../models/Users')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { welcomeEmail } = require('../emails/account')

//LOGIN TO THE DASHBOARD
router.get('/login', (req, res) => {
    res.render('login')
})

//REGISTER A NEW USER
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    
    /*if (name !== 'Juliana') {
        errors.push({ msg: 'you are not my girlfriend'})
    }*/
    
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all the required fields'})
    }

    if (password !== password2) {
        errors.push({ msg: 'passwords do not match'})
    }

    if (password.length < 7|| password === 'password') {
        errors.push({ msg: 'invalid pasword'})
    }

    if(errors.length > 0) {
        res.render('register', {
           errors,
           name,
           email,
           password,
           password2
        })
    } else {
        User.findOne({ email })
        .then(user => {
            if(user) {
                errors.push({ msg: 'Email is already in use'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2

                }) 
                console.log(errors)
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                })
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'you are now registered and can login')
                        res.redirect('/users/login')
                        //res.send('yikesssss')
                    })
                    .catch(err=> console.log(err))
                })) 
                welcomeEmail(newUser.email, newUser.name)
            }
        })

    }
})

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
}) 

router.get('/logout', (req,res) => {
    req.logOut()
    req.flash('success_msg', 'you are logged out')
    res.redirect('/users/login')
})

module.exports = router;