import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL_ID,
        pass: process.env.ADMIN_EMAIL_PWD
    }
});

export async function sendEmail(body: {recipients: string[], subject: string, text: string, html: string}) {
    for (const recipient of body.recipients) {
        const emailInfo = await transporter.sendMail({
            from: `"Swaliga" <${process.env.ADMIN_EMAIL_ID}>`,
            to: recipient,
            subject: body.subject,
            text: body.text,
            html: body.html
        });

        try {
            console.log(emailInfo)
        } catch (err) {
            throw Error('Unable to send email');
        }
    }
}