'use strict';
const bcryptjs = require('bcryptjs')
let salt = bcryptjs.genSaltSync(8)

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Category,{
        through : 'Transactions',
        foreignKey : 'UserId'
      })
      User.hasOne(models.Profile,{
        foreignKey : 'UserId'
      })
    }
  }
  User.init({
    email : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : `email is required`
        },
        notNull : {
          msg : `email is required`
        },
        isEmail : {
          msg : `email not valid`
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : `password is required`
        },
        notNull : {
          msg : `password is required`
        },
        len: {
          args : [8],
          msg : `password minimum length is 8`
        }
      }
    },
    role: {
      type : DataTypes.STRING,
      defaultValue : 'member'
    },
    balance: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
  }, {

    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user, options) => {
    let hashedPassword = bcryptjs.hashSync(user.password,salt)
    user.password = hashedPassword;
  });
  return User;
};