'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ModuleCours extends Model {
        static associate(models) {
            // Lien associatif à la table BLOC_COMPETENCE
            ModuleCours.belongsTo(models.BlocCompetence, {
                foreignKey: 'blocCompetenceId',
                onDelete: 'SET NULL'
            });

            // Lien associatif à la table FORMATION passant à travers la table FORMATION_MODULE
            ModuleCours.belongsToMany(models.Formation, {
                through: models.FormationModule,
                foreignKey: 'moduleCoursId',
                otherKey: 'formationId',
            });

            // Lien associatif à la table Professeur passant à travers la table PROFESSEUR_MODULE
            ModuleCours.belongsToMany(models.Professeur, {
                through: models.ProfesseurModule,
                foreignKey: 'moduleId',
                otherKey: 'professeurId',
            });
        }
    }

    ModuleCours.init({
        libelle: DataTypes.STRING,
        codeApogee: DataTypes.STRING,
        blocCompetenceId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'BlocCompetence',
                key: 'id',
            },
        }
    }, {
        sequelize,
        modelName: 'ModuleCours',
        tableName: 'MODULE_COURS'
    });
    return ModuleCours;
};