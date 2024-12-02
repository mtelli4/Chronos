'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Professeur extends Model {
        static associate(models) {
            Professeur.belongsTo(models.Utilisateur, {
                foreignKey: 'utilisateurId',
                onDelete: 'SET NULL',
            });

            // Lien associatif à la table MODULECOURS passant à travers la table PROFESSEUR_MODULE
            Professeur.belongsToMany(models.ModuleCours, {
                through: models.ProfesseurModule,
                foreignKey: 'professeurId',
                otherKey: 'moduleId',
            });

            // Lien associatif à la table COURS passant à travers la table COURS_PROFESSEUR
            Professeur.belongsToMany(models.Cours, {
                through: models.CoursProfesseur,
                foreignKey: 'professeurId',
                otherKey: 'coursId',
            });
        }
    }

    Professeur.init({
        vacataire: DataTypes.BOOLEAN,
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
        modelName: 'Professeur',
        tableName: 'PROFESSEUR'
    });
    return Professeur;
};