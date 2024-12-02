'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UtilisateursEAV extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UtilisateursEAV.belongsTo(models.Utilisateur, {
                foreignKey: 'id',
            });
        }
    }

    UtilisateursEAV.init({
        utilisateurId: DataTypes.INTEGER,
        attribute: DataTypes.STRING,
        value: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'UtilisateursEAV',
        tableName: 'UTILISATEURS_EAV',
        timestamps: false
    });
    return UtilisateursEAV;
};