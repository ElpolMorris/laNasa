const nodemailer = require('nodemailer')

const correoAuth = async (to,subject,html)=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nodemaileradl@gmail.com",
            pass:'desafiolatam'
        }
    })
    let info = await transporter.sendMail({
        from: 'nodemaileradl@gmail.com',
        to,
        subject,
        html
    })
    try {        
        await transporter.sendMail(info)
    } catch (error) {
        console.log('tuvimos un error')
        console.log(error)
    }
}

module.exports={
    correoAuth
}