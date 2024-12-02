'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cours extends Model {
        // Lien associatif à la table MODULE_COURS
        static associate(models) {
            Cours.belongsTo(models.ModuleCours, {
                foreignKey: 'moduleId',
                onDelete: 'SET NULL'
            });

            // Lien associatif à la table GROUPE passant à travers la table COURS_GROUPE
            Cours.belongsToMany(models.Groupe, {
                through: {
                    model: models.CoursGroupe,
                },
                foreignKey: 'coursId',
                otherKey: 'groupeId',
            });

            // Lien associatif à la table PROFESSEUR passant à travers la table COURS_PROFESSEUR
            Cours.belongsToMany(models.Professeur, {
                through: models.CoursProfesseur,
                foreignKey: 'coursId',
                otherKey: 'professeurId',
            });
        }
    }

    // Définition des champs de la table COURS
    Cours.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        // Champ classique
        libelle: DataTypes.STRING,
        debutCours: DataTypes.DATE,
        duree: DataTypes.INTEGER,
        appel: DataTypes.INTEGER,
        // Clé étrangère
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
        modelName: 'Cours',
        // Nom de la table dans mysql
        tableName: 'COURS',
    });
    return Cours;
};