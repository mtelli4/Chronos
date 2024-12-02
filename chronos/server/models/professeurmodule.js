'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProfesseurModule extends Model {
        static associate(models) {
            // Lien associatif à la table MODULECOURS
            ProfesseurModule.belongsTo(models.ModuleCours, {
                foreignKey: 'moduleId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table PROFESSEUR
            ProfesseurModule.belongsTo(models.Professeur, {
                foreignKey: 'professeurId',
                onDelete: 'CASCADE',
            });
        }
    }

    ProfesseurModule.init({
        professeurId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Professeur',
                key: 'id',
            },
        },
        moduleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ModuleCours',
                key: 'id',
            },
        },
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'ProfesseurModule',
        // Nom de la table dans mysql
        tableName: 'PROFESSEUR_MODULE',
        // Désactive les timestamps
        timestamps: false,
    });
    return ProfesseurModule;
};