'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CoursProfesseur extends Model {
        static associate(models) {
            // Lien associatif à la table FORMATION
            CoursProfesseur.belongsTo(models.Professeur, {
                foreignKey: 'professeurId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table MODULE_COURS
            CoursProfesseur.belongsTo(models.Cours, {
                foreignKey: 'coursId',
                onDelete: 'CASCADE',
            });
        }
    }

    CoursProfesseur.init({
        professeurId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Professeur',
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
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'CoursProfesseur',
        // Nom de la table dans mysql
        tableName: 'COURS_PROFESSEUR',
        // Désactive les timestamps
        timestamps: false,
    });
    return CoursProfesseur;
};
