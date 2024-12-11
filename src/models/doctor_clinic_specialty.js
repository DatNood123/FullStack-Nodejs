'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Clinic_Specailty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Doctor_Clinic_Specailty.init({
        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specailtyId: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Doctor_Clinic_Specailty',
    });
    return Doctor_Clinic_Specailty;
};