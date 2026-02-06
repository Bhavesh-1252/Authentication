import { createTransport } from "nodemailer"
import "dotenv/config"

export const sentOtpMail = async (email, otp) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        html: `<p> Your OTP for password reset is: <b>${otp}</b>. <br>OTP is valid for 10 minutes. <p>`
    }

    await transporter.sendMail(mailOptions);
}