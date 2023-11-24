'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Category)
    }
    static async expense(login){
      try {
        
        return await this.sum("nominal", { where: { [Op.and] :[{type: 'expense'},{UserId : login}] } });
      } catch (error) {
        console.log(error);
      }
    }
  }
  Transaction.init({
    nominal: DataTypes.INTEGER,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    CategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};