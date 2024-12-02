'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Directeur extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Directeur.belongsTo(models.Utilisateur, {
                foreignKey: 'utilisateurId',
                onDelete: 'SET NULL',
            });
            Directeur.belongsToMany(models.Formation, {through: models.FormationDirecteur, foreignKey: 'directeurId'});
        }
    }

    Directeur.init({
        utilisateurId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Utilisateur',
                key: 'id',
            },
        },
    }, {
        sequelize,
        modelName: 'Directeur',
        tableName: 'DIRECTEUR'
    });
    return Directeur;
};