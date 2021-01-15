const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
                    host:  process.env.SMTP_HOST,
                    port:  process.env.SMTP_PORT,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass:  process.env.SMTP_PASS
                    }
                },
                {
                    from: `${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`
                });

exports.sendMail = async (options) =>{

    let success = true;

    await transporter.sendMail(options, (error, info)=>{

        if(error){
            console.error(error);
            success = false;
            return;
        }else{
            console.log(info);
        }
    });

    return success;
}