'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataCustomer' })

        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        token: DataTypes.STRING,
        addressCustomer: DataTypes.STRING,
        phoneNumberCustomer: DataTypes.STRING,
        emailCustomer: DataTypes.STRING,
        nameCustomer: DataTypes.STRING,
        timeString: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};