'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            const {Utilisateur, UtilisateurRole} = models
            Role.belongsToMany(Utilisateur, {through: UtilisateurRole, foreignKey: 'RoleId'});
        }
    }

    Role.init({
        label: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'ROLE'
    });
    return Role;
};
