import { where } from "sequelize";
import db from "../models/index";
require('dotenv').config();

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
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

                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
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
                            timeType: data.timeType
                        }
                    })
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

module.exports = {
    postBookAppointmentService: postBookAppointmentService
}