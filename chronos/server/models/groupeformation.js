'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class GroupeFormation extends Model {
        static associate(models) {
            // Lien associatif à la table GROUPE
            GroupeFormation.belongsTo(models.Groupe, {
                foreignKey: 'groupeId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table FORMATION
            GroupeFormation.belongsTo(models.Formation, {
                foreignKey: 'formationId',
                onDelete: 'CASCADE',
            });
        }
    }

    // Définition des champs de la table GROUPE_FORMATION
    GroupeFormation.init({
        groupeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Groupe',
                key: 'id',
            },
        },
        formationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Formation',
                key: 'id',
            },
        },
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'GroupeFormation',
        // Nom de la table dans mysql
        tableName: 'GROUPE_FORMATION',
        // Désactive les timestamps
        timestamps: false,
    });

    return GroupeFormation;
};