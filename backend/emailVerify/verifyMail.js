import nodeMailer from "nodemailer"
import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import Handlebars from "handlebars"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {

    const emailTemplateSource = fs.readFileSync(path.join(__dirname, "template.hbs"), "utf-8");
    console.log(emailTemplateSource);

    const template = Handlebars.compile(emailTemplateSource);
    console.log(template)
    const htmlToSend = template({ token: encodeURIComponent(token) })
    console.log(htmlToSend)

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    const mailConfiguration = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email Verification",
        html: htmlToSend
    }
    console.log(mailConfiguration)

    transporter.sendMail(mailConfiguration, function (error, info) {
        console.log("email sending")
        if (error) {
            throw new Error(error)
        }
        console.log("Email send successfully")
    })
    console.log("email send")
}