import customerService from "../services/customerService";

let postBookAppointment = async (req, res) => {
    try {
        let info = await customerService.postBookAppointmentService(req.body);
        return res.status(200).json(
            info
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let info = await customerService.postVerifyBookAppointmentService(req.body);
        return res.status(200).json(
            info
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}