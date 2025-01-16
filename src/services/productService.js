import { where } from "sequelize";
import db from "../models/index";

let handleCreateNewProductService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.contentHTML || !data.contentMarkdown
                || !data.price || !data.selectedOption) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required value!!!'
                })
            } else {

                await db.Product.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.contentHTML,
                    descriptionMarkdown: data.contentMarkdown,
                    price: data.price,
                    productId: data.selectedOption
                })

                resolve({
                    errCode: 0,
                    errMessage: "Create new product successfully!!!"
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllProductByTypeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required value!!!'
                })
            } else {
                let data = [];

                if (type === 'ALL') {

                    data = await db.Product.findAll();

                } else {

                    data = await db.Product.findAll({
                        where: {
                            productId: type
                        }
                    })

                    if (!data || data.length === 0) {
                        data = [],
                            resolve({
                                data,
                                errCode: 99,
                                errMessage: "No data!!!"
                            })
                    }
                }

                if (data && data.length > 0) {
                    data.map((item, index) => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })

                    resolve({
                        data,
                        errCode: 0,
                        errMessage: "Get product successfully!!!"
                    })

                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getDetailProductByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required value!!!'
                })
            } else {
                let data = await db.Product.findOne({
                    where: {
                        id: inputId
                    }
                })

                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                resolve({
                    data,
                    errCode: 0,
                    arrMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleCreateNewProductService: handleCreateNewProductService,
    getAllProductByTypeService: getAllProductByTypeService,
    getDetailProductByIdService: getDetailProductByIdService
}