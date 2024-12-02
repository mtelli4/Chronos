'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CoursGroupe extends Model {
    }

    CoursGroupe.init({
        coursId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cours',
                key: 'id',
            },
        },
        groupeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Groupe',
                key: 'id',
            },
        },
    }, {
        sequelize,
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'CoursGroupe',
        // Nom de la table dans mysql
        tableName: 'COURS_GROUPE',
        // Désactive les timestamps
        timestamps: false,
    });
    return CoursGroupe;
};
