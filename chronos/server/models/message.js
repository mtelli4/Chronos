'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.Utilisateur, {foreignKey: 'UtilisateurId'});
            Message.belongsTo(models.ModuleCours, {foreignKey: 'ModuleId'});
        }
    }

    Message.init({
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        UtilisateurId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ModuleId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'MESSAGE'
    });

    return Message;
};
