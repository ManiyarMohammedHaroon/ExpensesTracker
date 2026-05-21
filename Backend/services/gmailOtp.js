const nodemailer = require('nodemailer');

const sendEmailOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Login OTP for Expense Tracker',
            text: `Your OTP for login is: ${otp}. It expires in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to email: ${email}`);
        return true;
    } catch (error) {
        console.error('FULL EMAIL ERROR:', error);
        return false;
    }
};

module.exports = sendEmailOTP;
