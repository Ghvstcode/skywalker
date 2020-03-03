const nodemailer = require("nodemailer");


const password = process.env.SENDER_PASS

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'thetechtekker@gmail.com', 
      pass: password
    }
})

const welcomeEmail = function (email, name) {
    const  mailOptions = {
        from: 'thetechtekker@gmail.com',//replace with your email
        to: email,//replace with your email
        //subject: `Contact name: ${req.body.name}`,
        subject: 'Registration confirmation',    
        text: `hello ${name}, welcome to my app!`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        res.status(500).send('error') // if error occurs send error as response to client
        }
        else {
        console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = {
   welcomeEmail
}


