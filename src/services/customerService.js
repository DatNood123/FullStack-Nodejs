import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                //update or create customer (upsert)
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })

                let token = uuidv4()

                //create a booking record
                if (user && user[0]) {
                    const [booking, created] = await db.Booking.findOrCreate({
                        // nếu user đã đặt ngày đó và giờ đó thì sẽ không được đặt nữa
                        where: {
                            date: data.date,
                            patientId: user[0].id,
                            timeType: data.timeType
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            addressCustomer: data.address,
                            phoneNumberCustomer: data.phoneNumber,
                            emailCustomer: data.email,
                            nameCustomer: data.fullName,
                            timeString: data.timeString,
                            token: token
                        }
                    })
                    // nếu tạo record mới thì gửi mail
                    if (created) {
                        await emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            customerName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            address: data.address,
                            redirectLink: buildUrlEmail(data.doctorId, token)
                        })
                    }

                    if (!created) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Booking already have!!!'
                        })
                    }
                }



                resolve({
                    errCode: 0,
                    errMessage: 'Booking succeed!!!'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 3,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    }
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    await emailService.sendConfirmEmail({
                        customerName: appointment.nameCustomer,
                        receiverEmail: appointment.emailCustomer,
                        time: appointment.timeString,
                        date: appointment.date,
                        phoneNumber: appointment.phoneNumberCustomer,
                        address: appointment.addressCustomer,
                    })

                    resolve({
                        errCode: 0,
                        errMessage: "Confirm the appoinment succeed!!!"
                    })
                } else {
                    resolve({
                        errCode: 4,
                        errMessage: "The appointment has been confirmed or non-exist!!!"
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointmentService: postBookAppointmentService,
    postVerifyBookAppointmentService: postVerifyBookAppointmentService,
}