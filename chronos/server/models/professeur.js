'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Professeur extends Model {
    static associate(models) {
      Professeur.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId',
        onDelete: 'SET NULL',
      });

      // Lien associatif à la table MODULECOURS passant à travers la table PROFESSEUR_MODULE
      Professeur.belongsToMany(models.ModuleCours, {
        through: {
          model: models.ProfesseurModule,
        },
        foreignKey: 'professeurId',
        otherKey: 'moduleId',
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