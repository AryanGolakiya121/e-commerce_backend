const nodemailer = require('nodemailer')

const sendEmail = async(email, subject, text) => {

    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            // service: process.env.SMTP_SERVICE,
            auth:{
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
    
        })
    
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: text
        }
        await transporter.sendMail(mailOptions)

        console.log(`Email sent successfully to email: ${email}`);
    }catch(error){
        console.log("Email not send: ",error);
    }
    
};

module.exports = sendEmail;