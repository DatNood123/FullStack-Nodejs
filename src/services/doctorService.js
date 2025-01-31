import { where } from "sequelize";
import db from "../models/index";
import _, { reject } from 'lodash';
require('dotenv').config();
import emailService from './emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: { roleId: 'R2' },
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVie'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVie'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown',
        'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'note', 'specialtyId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInfoDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {

            let checkObject = checkRequiredFields(inputData)
            if (checkObject.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing value: ${checkObject.element}`
                })

            } else {

                //update or insert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updatedAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                //update or create to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })

                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save()

                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save succeed!!!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVie'] },

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVie'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVie'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVie'] },
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule && !data.doctorId && !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!!!'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                // get existing data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleDoctorByDateService = (doctorIdInput, dateInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorIdInput || !dateInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorIdInput,
                        date: dateInput
                    },
                    include: [
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVie'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInfoDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVie'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVie'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVie'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },

                    attributes: {
                        exclude: ['password']
                    },

                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVie'] },

                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVie'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVie'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVie'] },
                            ]
                        },

                        { model: db.Markdown, attributes: ['description'] }

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

let getListCustomerForStaffByIdService = (inputId, inputDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !inputDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: inputId,
                        date: inputDate,
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeDataCustomer',
                            attributes: ['valueVie', 'valueEn']
                        }
                    ]
                })

                resolve({
                    data,
                    errCode: 0,
                    errMessage: 'Ok'
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

let sendResultSurveyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.timeType
                || !data.doctorId || !data.customerId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!!!"
                })
            } else {
                // update customer status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.customerId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    }
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                //send email
                await emailService.sendEmailResultSurveyWithAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorService: getTopDoctorService,
    getAllDoctorService: getAllDoctorService,
    saveDetailInfoDoctorService: saveDetailInfoDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleDoctorByDateService: getScheduleDoctorByDateService,
    getExtraInfoDoctorByIdService: getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService: getProfileDoctorByIdService,
    getListCustomerForStaffByIdService: getListCustomerForStaffByIdService,
    sendResultSurveyService: sendResultSurveyService
}