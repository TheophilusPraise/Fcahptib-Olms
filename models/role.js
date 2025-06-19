// models/Role.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Role = sequelize.define('Role', {
    id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      primaryKey: true, 
      autoIncrement: true 
    },
    name: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: 'unique_role_name'  // Named unique constraint to avoid duplicates
    },
  }, {
    tableName: 'roles',
    timestamps: false,
  });

  return Role;
};
