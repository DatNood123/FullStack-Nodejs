import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e)
    }

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let msg = await CRUDService.createNewUser(req.body);
    console.log(msg)
    return res.send('Post CRUD from V')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let editCRUD = async (req, res) => {
    let userId = req.query.id
    console.log(userId)
    if (userId) {
        let userData = await CRUDService.getUserInfoByID(userId)
        console.log(userData)

        return res.render('editCRUD.ejs', {
            user: userData
        })

    } else {
        return res.send('User not found')
    }

}

let updateCRUD = async (req, res) => {
    let data = req.body
    await CRUDService.updateUserData(data)
    return res.redirect("/display-crud");
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        await CRUDService.deleteUserById(userId)
        return res.redirect("/display-crud");
    } else {
        return res.send("User not found")
    }

}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    updateCRUD: updateCRUD,
    deleteCRUD: deleteCRUD,
}