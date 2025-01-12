require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"ChauSadec Floriculture" <chausadecfloriculture309>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: getSubjectEmail(dataSend), // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });
}

let getSubjectEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = 'Xác Nhận Lịch Đặt Mukbang'
    }

    if (dataSend.language === 'en') {
        result = 'Confirm Mukbang Appointment'
    }

    return result
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
            <p>Xin chào <b>${dataSend.customerName}</b></p>
            <p>Bạn nhận được email này vì đã đặt lịch Mukbang tại ChauSadec Floriculture</p>
            <h4>Thông tin đặt lịch: </h4>
            <div>Thời gian: <b>${dataSend.time}</b></div>
            <div>Địa điểm: <b>${dataSend.address}</b></div>
            <div>Người phụ trách: <b>${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin trên chính xác, vui lòng click vào đường link bên dưới để xác nhận thủ tục đặt lịch Mukbang.</p>
            <a href=${dataSend.redirectLink} target="_blank" style="text-decoration: none;">Xác nhận thông tin đặt lịch</a>
            <div>Xin chân thành cảm ơn!!!</div>
        `
    }

    if (dataSend.language === 'en') {
        result =
            `
            <p>Dear <b>${dataSend.customerName}</b></p>
            <p>You received this email because you booked a Mukbang session at ChauSadec Floriculture.</p>
            <h4>Booking Information: </h4>
            <div>Time: <b>${dataSend.time}</b></div>
            <div>Location: <b>${dataSend.address}</b></div>
            <div>Person in Charge: <b>${dataSend.doctorName}</b></div>
            <p>If the information above is correct, please click the link below to confirm your Mukbang booking process.</p>
            <a href=${dataSend.redirectLink} target="_blank" style="text-decoration: none;">Click here</a>
            <div>Thank you very much.!!!</div>
        `
    }

    return result
}

let sendConfirmEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"ChauSadec Floriculture" <chausadecfloriculture309>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: getSubjectEmailConfirm(dataSend), // Subject line
        html: getBodyHTMLEmailConfirm(dataSend), // html body
    });
}

let getSubjectEmailConfirm = (dataSend) => {
    let result = 'Đặt lịch hẹn thành công'

    return result
}

let getBodyHTMLEmailConfirm = (dataSend) => {
    let result =
        `
            <p>Xin chào</b></p>
            <div>Bạn nhận được email này vì đã <b>XÁC NHẬN</b> email đặt lịch hẹn tại ChauSadec Floriculture</div>
            <h4>Thông tin đặt lịch: </h4>
            <div>Thời gian: <b>${dataSend.time}</b></div>
            <div>Địa điểm: <b>${dataSend.address}</b></div> <br></br>
            <div>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể thông qua số điện thoại <b>${dataSend.phoneNumber}</b> mà bạn đã cung cấp.</div> <br>
            <div>Xin chân thành cảm ơn vì đã sử dụng dịch vụ chúng tôi.</div>
        `
    return result
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendConfirmEmail: sendConfirmEmail
}