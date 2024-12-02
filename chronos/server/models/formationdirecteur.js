'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FormationDirecteur extends Model {
    }

    FormationDirecteur.init({
        directeurId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Directeur',
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
        modelName: 'FormationDirecteur',
        // Nom de la table dans mysql
        tableName: 'FORMATION_DIRECTEUR',
        // Désactive les timestamps
        timestamps: false,
    });
    return FormationDirecteur;
};