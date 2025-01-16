import productService from '../services/productService';

let handleCreateNewProduct = async (req, res) => {
    try {
        let data = await productService.handleCreateNewProductService(req.body);
        return res.status(200).json(data)

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllProductByType = async (req, res) => {
    try {
        let data = await productService.getAllProductByTypeService(req.query.type);
        return res.status(200).json(data)

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailProductById = async (req, res) => {
    try {
        let data = await productService.getDetailProductByIdService(req.query.id);
        return res.status(200).json(data)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleCreateNewProduct: handleCreateNewProduct,
    getAllProductByType: getAllProductByType,
    getDetailProductById: getDetailProductById
}