const nodemailer = require("nodemailer");
const HTMLTemplate = require("./HTMLTemplate");
const Configs = require("../model/config");

const sendMail = async (options) => {
    const config = await Configs.find();
    const transporter = nodemailer.createTransport({
        host: config[0].smtp[0].host,
        port: config[0].smtp[0].port,
        service: config[0].smtp[0].service,
        auth:{
            user: config[0].smtp[0].mail,
            pass: config[0].smtp[0].password,
        },
    });

    const mailOptions = {
        from: config[0].smtp[0].mail,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: HTMLTemplate(options.message),
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;