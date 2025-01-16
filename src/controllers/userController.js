import { json } from "body-parser";
import userService from "../services/userService";


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            msg: 'Missing value'
        })
    }

    let userData = await userService.handleLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        msg: userData.errMsg,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //All or id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMsg: 'Missing value',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMsg: 'Ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let msg = await userService.createNewUser(req.body)
    return res.status(200).json(msg)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let msg = await userService.updateUserData(data)
    return res.status(200).json(msg)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            msg: "Missing value"
        })
    }
    let msg = await userService.deleteUser(req.body.id)
    return res.status(200).json(msg)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}



module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}