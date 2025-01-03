import { raw } from "body-parser";
import db from "../models/index";
import { where } from "sequelize";

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

let saveDetailInfoDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing value'
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })

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

module.exports = {
    getTopDoctorService: getTopDoctorService,
    getAllDoctorService: getAllDoctorService,
    saveDetailInfoDoctorService: saveDetailInfoDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService
}