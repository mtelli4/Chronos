'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Notification.belongsTo(models.Eleve, {foreignKey: 'eleveId', onDelete: 'SET NULL'});
            Notification.belongsTo(models.Absence, {foreignKey: 'absenceId', onDelete: 'SET NULL'});
            Notification.belongsTo(models.Evaluation, {foreignKey: 'evaluationId', onDelete: 'SET NULL'});
        }
    }

    Notification.init({
        type: DataTypes.STRING,
        eleveId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Eleve',
                key: 'id',
            },
        },
        absenceId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Absence',
                key: 'id',
            },
        },
        evaluationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Evaluation',
                key: 'id',
            },
        }
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'NOTIFICATION'
    });
    return Notification;
};