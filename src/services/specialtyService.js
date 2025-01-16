import { where } from "sequelize";
import db from "../models/index";
import { raw } from "body-parser";

let handleCreateNewSpeacialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required value!!!'
                })
            } else {

                await db.Specialty.create({
                    name: data.name,
                    descriptionHTML: data.contentHTML,
                    descriptionMarkdown: data.contentMarkdown,
                    image: data.imageBase64,
                })

                resolve({
                    errCode: 0,
                    errMessage: "Create new specialty successfully!!!"
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Specialty.findAll();

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })
            }

            resolve({
                errCode: 0,
                errMessage: "Ok!!!",
                data
            })


        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required value!!!'
                })
            } else {

                // lấy thông tin của specialty và doctor theo specialty đó
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: [
                        'descriptionHTML', 'descriptionMarkdown'
                    ],

                    raw: true
                })

                if (data) {
                    let doctorSpecialty = [];

                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;

                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleCreateNewSpeacialtyService: handleCreateNewSpeacialtyService,
    getAllSpecialtyService: getAllSpecialtyService,
    getDetailSpecialtyByIdService: getDetailSpecialtyByIdService
}