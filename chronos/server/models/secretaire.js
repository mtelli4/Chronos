'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Secretaire extends Model {
        static associate(models) {
            // Lien associatif à la table UTILISATEUR
            Secretaire.belongsTo(models.Utilisateur, {
                foreignKey: 'utilisateurId',
                onDelete: 'SET NULL',
            });

            // Lien associatif à la table FORMATION passant à travers la table FORMATION_SECRETAIRE
            Secretaire.belongsToMany(models.Formation, {
                through: models.FormationSecretaire,
                foreignKey: 'secretaireId',
                otherKey: 'formationId',
            });
        }
    }

    Secretaire.init({
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
        modelName: 'Secretaire',
        tableName: 'SECRETAIRE'
    });
    return Secretaire;
};