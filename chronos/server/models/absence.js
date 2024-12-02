'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Absence extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Clé étrangère eleveId de la table ELEVE
            Absence.belongsTo(models.Eleve, {
                foreignKey: 'eleveId',
                onDelete: 'SET NULL'
            });

            // Clé étrangère coursId de la table COURS
            Absence.belongsTo(models.Cours, {
                foreignKey: 'coursId',
                onDelete: 'SET NULL'
            });
        }
    }

    Absence.init({
        valide: DataTypes.BOOLEAN,
        justificatif: DataTypes.STRING,
        message: DataTypes.STRING,
        eleveId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Eleve',
                key: 'id',
            },
        },
        coursId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cours',
                key: 'id',
            },
        },
        retard: DataTypes.INTEGER,
        envoye: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Absence',
        tableName: 'ABSENCE'
    });
    return Absence;
};