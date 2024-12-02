'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Eleve extends Model {
        static associate(models) {
            // Lien associatif à la table FORMATION
            Eleve.belongsTo(models.Formation, {
                foreignKey: 'formationId',
                onDelete: 'SET NULL',
            });

            // Lien associatif à la table UTILISATEUR
            Eleve.belongsTo(models.Utilisateur, {
                foreignKey: 'utilisateurId',
                onDelete: 'SET NULL',
            });

            // Lien associatif à la table GROUPE passant à travers la table GROUPE_ELEVE
            Eleve.belongsToMany(models.Groupe, {
                through: models.GroupeEleve,
                foreignKey: 'eleveId',
                otherKey: 'groupeId',
                timestamps: false
            });


            Eleve.hasMany(models.Absence, {
                foreignKey: 'eleveId',
                onDelete: 'SET NULL'
            });
        }
    }

    // Définition des champs de la table ELEVE
    Eleve.init({
        numeroEtudiant: DataTypes.STRING,
        trombinoscope: DataTypes.STRING,
        tiersTemps: DataTypes.BOOLEAN,
        delegue: DataTypes.BOOLEAN,
        formationId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Formation',
                key: 'id',
            },
        },
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
        // Nom du modèle à utiliser dans les fonctions js
        modelName: 'Eleve',
        // Nom de la table dans mysql
        tableName: 'ELEVE',
    });
    return Eleve;
};
