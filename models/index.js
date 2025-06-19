import dotenv from 'dotenv';
dotenv.config();

import { Sequelize, Op, DataTypes } from 'sequelize';

// Import all model files
import UserModel from './user.js';
import RoleModel from './role.js';
import AdminLogModel from './adminLog.js';
import CourseModel from './course.js';
import SuperLogModel from './superLog.js';
import UserGroupModel from './userGroup.js';
import QuizModel from './quiz.js';
import QuestionModel from './question.js';
import AnswerModel from './answer.js';
import ResultModel from './result.js';
import NotificationModel from './notification.js';
import LeaderboardEntryModel from './leaderboardEntry.js';
import ChatGroupModel from './chatGroup.js';
import ChatGroupMemberModel from './chatGroupMember.js';
import MessageModel from './message.js';
import AssignmentModel from './assignment.js';
import GroupModel from './group.js';
import ChatModel from './chat.js';
import MeetingModel from './meeting.js';
import GroupMemberModel from './groupMember.js'; // ADDED IMPORT

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const AdminLog = AdminLogModel(sequelize, DataTypes);
const Course = CourseModel(sequelize, DataTypes);
const SuperLog = SuperLogModel(sequelize, DataTypes);
const Quiz = QuizModel(sequelize, DataTypes);
const Question = QuestionModel(sequelize, DataTypes);
const Answer = AnswerModel(sequelize, DataTypes);
const Result = ResultModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);
const LeaderboardEntry = LeaderboardEntryModel(sequelize, DataTypes);
const ChatGroup = ChatGroupModel(sequelize, DataTypes);
const ChatGroupMember = ChatGroupMemberModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);
const Assignment = AssignmentModel(sequelize, DataTypes);
const Group = GroupModel(sequelize, DataTypes);
const Chat = ChatModel(sequelize, DataTypes);
const UserGroup = UserGroupModel(sequelize, DataTypes);
const Meeting = MeetingModel(sequelize, DataTypes);
const GroupMember = GroupMemberModel(sequelize, DataTypes); // INITIALIZED

// Enrollment model definition
const Enrollment = sequelize.define('Enrollment', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  status: DataTypes.STRING,
  enrolledAt: DataTypes.DATE
}, {
  tableName: 'enrollments'
});

// CourseStudent model definition
const CourseStudent = sequelize.define('CourseStudent', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  tableName: 'coursestudents'
});

// Define associations
function setupAssociations() {
  // User-Role relationship
  User.belongsTo(Role, { foreignKey: 'role_id' });
  Role.hasMany(User, { foreignKey: 'role_id' });

  // Group-UserGroup relationship
  Group.hasMany(UserGroup, { foreignKey: 'groupId', as: 'userGroups' });
  UserGroup.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

  // Enrollment relationships
  Enrollment.belongsTo(User, { foreignKey: 'userId' });
  Enrollment.belongsTo(Course, { foreignKey: 'courseId' });
  User.hasMany(Enrollment, { foreignKey: 'userId' });
  Course.hasMany(Enrollment, { foreignKey: 'courseId' });

  // UserGroup relationships (many-to-many for courses)
  Course.belongsToMany(User, { 
    through: UserGroup, 
    foreignKey: 'courseId', 
    otherKey: 'userId' 
  });
  User.belongsToMany(Course, { 
    through: UserGroup, 
    foreignKey: 'userId', 
    otherKey: 'courseId' 
  });

  // CourseStudent relationships (many-to-many for enrollments)
  Course.belongsToMany(User, { 
    through: CourseStudent, 
    foreignKey: 'courseId', 
    otherKey: 'userId' 
  });
  User.belongsToMany(Course, { 
    through: CourseStudent, 
    foreignKey: 'userId', 
    otherKey: 'courseId' 
  });

  // Group <-> User (for group chat/membership)
  Group.belongsToMany(User, { 
    through: UserGroup, 
    as: 'members', 
    foreignKey: 'groupId', 
    otherKey: 'userId' 
  });
  User.belongsToMany(Group, { 
    through: UserGroup, 
    as: 'groups', 
    foreignKey: 'userId', 
    otherKey: 'groupId' 
  });

  // Direct chat associations
  Chat.belongsTo(User, { 
    as: 'user', 
    foreignKey: 'userId' 
  });
  Chat.belongsTo(User, { 
    as: 'participant', 
    foreignKey: 'participantId' 
  });
  
  // Many-to-many for group chats
  Chat.belongsToMany(User, { 
    through: 'UserChat', 
    as: 'users', 
    foreignKey: 'chatId', 
    otherKey: 'userId' 
  });
  User.belongsToMany(Chat, { 
    through: 'UserChat', 
    as: 'chats', 
    foreignKey: 'userId', 
    otherKey: 'chatId' 
  });

  // GroupMember associations
  GroupMember.belongsTo(User, { foreignKey: 'userId' });
  GroupMember.belongsTo(Group, { foreignKey: 'groupId' });
  Group.hasMany(GroupMember, { 
    foreignKey: 'groupId',
    onDelete: 'CASCADE'
  });
  User.hasMany(GroupMember, { foreignKey: 'userId' });
}

// Setup all associations
setupAssociations();

// Export all models
export {
  sequelize,
  Op,
  User,
  Role,
  AdminLog,
  Course,
  SuperLog,
  Quiz,
  Question,
  Answer,
  Result,
  Notification,
  LeaderboardEntry,
  ChatGroup,
  ChatGroupMember,
  Message,
  Assignment,
  Group,
  Chat,
  Enrollment,
  Meeting,
  CourseStudent,
  UserGroup,
  GroupMember // ADDED EXPORT
};
