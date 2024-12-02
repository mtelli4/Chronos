'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormationModule extends Model {
        static associate(models) {
            // Lien associatif à la table FORMATION
            FormationModule.belongsTo(models.Formation, {
                foreignKey: 'formationId',
                onDelete: 'CASCADE',
            });

            // Lien associatif à la table MODULE_COURS
            FormationModule.belongsTo(models.ModuleCours, {
                foreignKey: 'moduleCoursId',
                onDelete: 'CASCADE',
            });
        }
    }

    FormationModule.init({
        formationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Formation',
                key: 'id'
            }
        },
        moduleCoursId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'ModuleCours',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'FormationModule',
        tableName: 'FORMATION_MODULE',
        // Désactive les timestamps
        timestamps: false,
    });
    return FormationModule;
};