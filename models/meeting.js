// models/meeting.js
export default (sequelize, DataTypes) => {
  const Meeting = sequelize.define('Meeting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    meetingId: {
      type: DataTypes.STRING,
      allowNull: false,
      // Removed unique: true to prevent auto-index
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attendeePassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    moderatorPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    isRunning: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'meetings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        name: 'unique_meetingId',  // Fixed name prevents duplicates
        fields: ['meetingId']
      }
    ]
  });
  return Meeting;
};
