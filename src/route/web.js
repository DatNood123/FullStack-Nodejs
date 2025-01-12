import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import customerController from "../controllers/customerController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    // CRUD ở NodeJs
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/display-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.updateCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // CRUD ở ReactJS phía Admin
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    // ReactJS phía người dùng
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctor);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/customer-book-appointment', customerController.postBookAppointment);
    router.post('/api/customer-verify-appointment', customerController.postVerifyBookAppointment);
    return app.use("/", router);
}

module.exports = initWebRoutes;