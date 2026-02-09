import nodeMailer from "nodemailer"
import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import Handlebars from "handlebars"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {

    console.log("========================================")
    console.log("MAIL USER: ", process.env.MAIL_USER)
    console.log("MAIL PASS: ", process.env.MAIL_PASS)
    console.log("========================================")

    const emailTemplateSource = fs.readFileSync(path.join(__dirname, "template.hbs"), "utf-8");
    // console.log(emailTemplateSource);

    const template = Handlebars.compile(emailTemplateSource);
    console.log(template)
    const htmlToSend = template({ token: encodeURIComponent(token) })
    // console.log(htmlToSend)

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })
    // console.log(transporter);

    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful!');

    const mailConfiguration = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email Verification",
        html: htmlToSend
    }
    // console.log(mailConfiguration)

    transporter.sendMail(mailConfiguration, function (error, info) {
        console.log(info)
        if (error) {
            throw new Error(error)
        }
        console.log("Email send successfully")
    })
    console.log("email send")
}