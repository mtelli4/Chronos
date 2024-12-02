'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Formation extends Model {
        static associate(models) {
            // Lien associatif à la table SECRETAIRE passant à travers la table FORMATION_SECRETAIRE
            Formation.belongsToMany(models.Secretaire, {
                through: models.FormationSecretaire,
                foreignKey: 'formationId',
                otherKey: 'secretaireId',
            });

            // Lien associatif à la table GROUPE passant à travers la table GROUPE_FORMATION
            Formation.belongsToMany(models.Groupe, {
                through: 'GROUPE_FORMATION',
                foreignKey: 'formationId',
                otherKey: 'groupeId',
            });

            // Lien associatif à la table MODULE_COURS passant à travers la table FORMATION_MODULE
            Formation.belongsToMany(models.ModuleCours, {
                through: models.FormationModule,
                foreignKey: 'formationId',
                otherKey: 'moduleCoursId',
            });

            // Lien associatif à la table DIRECTEUR passant à travers la table FORMATION_DIRECTEUR
            Formation.belongsToMany(models.Directeur, {
                through: models.FormationDirecteur,
                foreignKey: 'formationId'
            });

            // Lien associatif à la table ELEVE
            Formation.hasMany(models.Eleve, {
                foreignKey: 'formationId',
            });
        }
    }

    Formation.init({
        libelle: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Formation',
        tableName: 'FORMATION'
    });
    return Formation;
};