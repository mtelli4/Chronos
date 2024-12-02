'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class GroupeEleve extends Model {
        static associate(models) {
            // Lien associatif à la table GROUPE
            GroupeEleve.belongsTo(models.Groupe, {
                foreignKey: 'groupeId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table ELEVE
            GroupeEleve.belongsTo(models.Eleve, {
                foreignKey: 'eleveId',
                onDelete: 'CASCADE',
            });
        }
    }

    // Définition des champs de la table GROUPE_ELEVE
    GroupeEleve.init({
        groupeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Groupe',
                key: 'id',
            },
        },
        eleveId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Eleve',
                key: 'id',
            },
        },
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'GroupeEleve',
        // Nom de la table dans mysql
        tableName: 'GROUPE_ELEVE',
        // Désactive les timestamps
        timestamps: false,
    });

    return GroupeEleve;
};