var express = require('express');
var router = express.Router();
var db = require('../db');
var conf = require('../../../config');

router.post('/addAdmin', function(req, res, next) {
  console.log(req.body);
  if(req.session.login)
  {
    res.json({
      msg: "Вы уже вошли как "+ req.session.email +"! Зачем вам регистрироваться?",
      status: false
    })
    return;
  }
  var email = req.body.email
  var password = req.body.password
  var passwordDuplicate = req.body.passwordDuplicate;
  db.findUserByEmail(email, function(err, data) {
    if(err)
    {
      res.json({
        msg: "Ошибка БД: " + err.message,
        status: false
      })
      return;
    }
    if(data!=null)
    {
      res.json({
        msg: "Такой пользователь с этой почтой уже есть!",
        status: false
      })
      return;
    }
    if(password!=passwordDuplicate)
    {
      res.json({
        msg: "Пароли не совпадают!",
        status: 0
      })
      return;
    }
    if(email.indexOf('@')<0)
    {
      res.json({
        msg: "Некорректный email!",
        status: 0
      })
    }
    db.addNewUser(email, password, 'admin', function(err) {
      if(err)
      {
        res.json({
          msg: "Ошибка БД: " + err.message,
          status: false
        })
        return;
      }
      req.session.login = true;
      req.session.email = email;
      res.json({
        msg: "Пользователь успешно зарегистрирован!",
        status: true 
      }) 
    })
  })
}); 

router.post('/isAdminExists', function(req, res, next) { 
  db.isAdminExists(function(adminExists){
    if(!adminExists) {
      res.json({
        msg: "Админа ещё нет!",
        status: 0
      })
    }
    else
    {
      res.json({
        msg: "Админ уже есть!",
        status: 1
      })
    }
  })
})

module.exports = router;
