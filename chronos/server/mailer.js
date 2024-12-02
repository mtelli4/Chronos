const nodemailer = require('nodemailer');
require('dotenv').config();

const software_mail = process.env.SENDER_EMAIL;
const software_password = process.env.APPLICATION_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: software_mail,
        pass: software_password,
    },
});

function sendEmail({recipient_email, subject, message}) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: software_mail,
            to: recipient_email,
            subject: subject,
            html: message,
            attachments: [
                {
                    filename: 'logo.png',
                    path: __dirname + "/images/logo.png",
                    cid: 'logo@logo'
                },
            ],
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return reject({message: `Failed to send email: ${error.message}`});
            }
            return resolve({message: "Email sent successfully"});
        });
    });
}

module.exports = {
    sendEmail
};
