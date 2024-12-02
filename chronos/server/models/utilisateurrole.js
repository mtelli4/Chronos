'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UtilisateurRole extends Model {

        static associate(models) {
            UtilisateurRole.belongsTo(models.Utilisateur);
            UtilisateurRole.belongsTo(models.Role);
        }
    }

    UtilisateurRole.init({
        UtilisateurId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Utilisateur',
                key: 'id'
            }
        },
        RoleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Role',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'UtilisateurRole',
        tableName: 'UTILISATEUR_ROLE',
        timestamps: false, // Désactive les timestamps
    });
    return UtilisateurRole;
};