'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormationSecretaire extends Model {
        static associate(models) {
            // Lien associatif à la table FORMATION
            FormationSecretaire.belongsTo(models.Formation, {
                foreignKey: 'formationId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table SECRETAIRE
            FormationSecretaire.belongsTo(models.Secretaire, {
                foreignKey: 'secretaireId',
                onDelete: 'CASCADE',
            });
        }
    }

    // Définition des champs de la table FORMATION_SECRETAIRE
    FormationSecretaire.init({
        formationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Formation',
                key: 'id',
            },
        },
        secretaireId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Secretaire',
                key: 'id',
            },
        },
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'FormationSecretaire',
        // Nom de la table dans mysql
        tableName: 'FORMATION_SECRETAIRE',
        // Désactive les timestamps
        timestamps: false,
    });
    return FormationSecretaire;
};