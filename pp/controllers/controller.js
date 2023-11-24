const bcryptjs = require('bcryptjs')
const session = require('express-session')
const {User,Profile,Transaction,Category} = require('../models')
const now = require('../helpers/now')
const time = require('../helpers/time')
const {Op} = require('sequelize')
const formatRupiah = require("../helpers/convertrp")


class Controller{
    //edit
    static async listProfile(req,res){
        try {
            let {msg} = req.query
            let data = await User.findAll({
                include : Profile
            })
            console.log(data);
            res.render('listProfile',{data, msg})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async deleteProfile(req,res){
        try {
            let {id} = req.params
            let data = await User.findOne({
                where : {
                    id : id
                }
            })
            await User.destroy({
                where: {
                  id: id
                }
            });
            await Profile.destroy({
                where: {
                  UserId: id
                }
            });
            await Transaction.destroy({
                where: {
                  UserId: id
                }
            });
            res.redirect(`/listProfile?msg=user ${data.email} removed`)

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    //end of edit

    static async loginForm(req,res){
        try {
            let data = await User.findAll({
                include : Profile
            })
            console.log(data[0].Profile.name);
            if(req.session.login){
                res.redirect('/home')
            } else {
                res.render('loginForm')
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async loginProcess(req,res){
        try {
            const {email,password} = req.body
            let data = await User.findOne({
                where : {
                    email : email
                }
            })  
            if (!data) {
                res.redirect(`/login?err=email invalid`)
            } else {
                let user = bcryptjs.compareSync(password, data.password)
                if (user) {
                    req.session.login = data.id
                    req.session.role = data.role
                    res.redirect('/home')
                } else{
                    res.redirect('/login?err=password invalid')
                }
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async registerForm(req,res){
        try {
            let {msg} = req.query
            if (!msg) {
                msg = []
            } else {
                msg = msg.split(',')
            }
            if(req.session.login){
                res.redirect('/home')
            } else {
                res.render('registerForm', {msg})
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async registerProcess(req,res){
        const {email,password,name,phone,goals} = req.body
        try {
                
                await User.create({email,password})
                const data = await User.findOne({
                    where : {
                        email : email
                    }
                })
                const UserId = data.id

                await Profile.create({name,phone,goals,UserId})

                req.session.login = data.id
                req.session.register = 1
                res.redirect('/addBudget')
        } catch (error) {
            await User.destroy({
                where: {
                  email: email
                }
              });
            if(error.name == `SequelizeValidationError`){
                let msg = await error.errors.map(el =>{
                    return el.message
                })
                res.redirect(`/register?msg=${msg}`)
            }else {
                console.log(error);
                res.send(error)
            }
        }
    }
    static async addBudgetForm(req,res){
        try {
            if (req.session.register == 1) {
                res.render('addBudget')
            } else {
                res.redirect('/home')
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async addBudgetProcess(req,res){
        try {
            let {balance} = req.body
            await User.update({balance : balance},{
                where : {
                    id : req.session.login
                }
            })
            req.session.register = 0
            res.redirect('/home')
        } catch (error) {
            res.send(error)
        }
    }
    static async home(req,res){
        try {
            let dataTransaction = await User.findOne({
                where : {
                    id : req.session.login
                },
            })
            let cekAdmin = req.session.role
            let dataCategory = await Category.findAll({
                include : {
                    model : Transaction,
                    as : 'Category_Id',
                    where : {
                        UserId : req.session.login
                    }
                }
            })
            // console.log(dataCategory[0].dataValues.Category_Id);
            let expense = await Transaction.expense(req.session.login)
            let income = await Transaction.sum("nominal", { where: { [Op.and] :[{type: 'income'},{UserId : req.session.login}] } });
            res.render("home", {
                dataTransaction,
                dataCategory,
                expense,
                income,
                time,
                formatRupiah,
                cekAdmin
              });
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async addTransactionForm(req,res){
        try {
            let times = now(new Date())
            console.log(times);
            res.render('addTransaction',{times})
        } catch (error) {
            res.send(error)
        }
    }
    static async addTransactionProcess(req,res){
        try {
            let {nominal,description,type,date,CategoryId} = req.body

            let data = await User.findOne({
                where : {
                    id : req.session.login
                }
            })
            let UserId = data.id
            await Transaction.create({nominal,description,type,date,CategoryId,UserId})
            if (type == 'income') {
                await User.increment({balance : nominal}, {where :{id : req.session.login}})
            } else {
                await User.increment({balance : -nominal}, {where :{id : req.session.login}})
            }
            res.redirect('/home')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async randerAnalysis(req, res) {
        try {
          const dataAnalysis = await Transaction.findAll({
            where: {
              UserId: req.session.login,
              
            },
            include: {
              model: Category,
            },
          });
        //   const dataLabel= [dataAnalysis.Categories.name]
        //   console.log(dataAnalysis.dataValues.Categories, ">> ana");
          res.render("analysis", { dataAnalysis });
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
      static async randerCategory(req, res) {
        try {
          const dataCategory = await Category.findAll();
    
          res.render("category", { dataCategory });
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
      static async randerCategoryById(req, res) {
        try {
            const { description } = req.query
            const { id } = req.params;
    
            let search = {
                include: {
                  model: Category,
                  where: {
                    id: id,
                  },
                },
              }
              if (description) {
                if (!search.where) {
                    search.where = {};
                }
            
                search.where.description = { [Op.iLike]: `%${description}%` };
            }
    
            const data = await Category.findOne({
                where: {
                    id: id
                }
            })
        
            const dataCategoryId = await Transaction.findAll(search);
    
            res.render("categoryid", { dataCategoryId, formatRupiah, id, data});
          } catch (error) {
            console.log(error);
            res.send(error);
          }
      }
      static async randerAccount(req, res) {
        try {
          const dataAccount = await User.findOne({
            where: {
              id: 1,
            },
            include: Profile,
          });
    
          console.log(dataAccount);
          res.render("account", { dataAccount });
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
    
    static async logout(req,res){
        try {
            req.session.destroy((err) =>{
                if (err) {
                    res.send(err)
                } else {
                    res.redirect('/login')
                }
            })
        } catch (error) {
            res.send(error)
        }
    }
    
    
}
module.exports = Controller