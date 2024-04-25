const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");


const sendEmail= asyncHandler(async(data,req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP
        }
      });
      
      var mailOptions = {
        from: '"Hey 👻" <tungkim615@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
})

module.exports = {sendEmail,}