const twilio = require('twilio');

/**
 * Sends an OTP via SMS using Twilio.
 * Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env
 */
const sendMobileOTP = async (mobile, otp) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

        // Normalize mobile number: Twilio requires '+' and country code.
        // If it's a 10-digit number like '9177831303', assume it's Indian (+91).
        let formattedMobile = mobile.trim();
        if (!formattedMobile.startsWith('+')) {
            if (formattedMobile.length === 10) {
                formattedMobile = `+91${formattedMobile}`;
            } else if (formattedMobile.startsWith('91') && formattedMobile.length === 12) {
                formattedMobile = `+${formattedMobile}`;
            }
        }

        const isPlaceholder = (val) => !val || val.includes('your_') || val.includes('_here');

        if (isPlaceholder(accountSid) || isPlaceholder(authToken) || isPlaceholder(twilioNumber)) {
            console.warn('[TWILIO] Placeholder or missing credentials. SMS will NOT be sent.');
            return true;
        }

        const client = twilio(accountSid, authToken);

        console.log(`[TWILIO] Attempting to send OTP ${otp} to ${formattedMobile}...`);

        const message = await client.messages.create({
            body: `Your Expense Tracker OTP is: ${otp}. It will expire in 5 minutes.`,
            from: twilioNumber,
            to: formattedMobile
        });

        console.log(`[TWILIO] SMS sent successfully. SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error('Twilio SMS sending error details:', {
            message: error.message,
            code: error.code,
            moreInfo: error.moreInfo,
            status: error.status
        });

        console.warn('[RECOVERY] Twilio failed. Falling back to terminal log for OTP.');
        console.log(`[TEST OTP] Mobile: ${formattedMobile}, OTP: ${otp}`);

        // Return true to avoid 500 status on frontend
        return true;
    }
};

module.exports = sendMobileOTP;
