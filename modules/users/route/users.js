var express = require('express');
var router = express.Router();
var db = require('../db');
var conf = require('../../../config');

router.get('/users/:id', function(req, res) {
  if (!req.params.id) {
    res.json({
      status: false,
      level: "danger",
      msg: "Не задан идентификатор пользователя."
    });
    return;
  }

  if (!req.session.login) {
    findUserById(req.params.id, false, res);
    return;
  }

  db.findUserByEmail(req.session.email, function(err, user) {
    if (err || !user || !user.isAdministrator) {
      findUserById(req.params.id, false, res);
    } else {
      findUserById(req.params.id, true, res);
    }
  });
});

function findUserById(id, admin, res) {
  db.findUserByIdWithoutPassword(id, admin, function(err, user) {
    if (err) {
      var msg = 'Ошибка базы данных' 
        + (conf.mode !== 'production' ? ': ' + err.message : '.');
      res.json({
        status: false,
        level: "danger",
        msg: msg
      });
      return;
    }
    
    if (!user) {
      res.json({
        status: false,
        level: "info",
        msg: "Пользователь не найден."
      });
      return;
    }
    
    user.id = user._id;
    delete user._id;
    
    res.json({
      status: true,
      level: "success",
      msg: "Пользователь найден.",
      user: user
    });
  });
}


router.get('/users/', function(req, res, next) {
  if (!req.session.login) {
    findAllUsers(false, res);
    return;
  }
  
  db.findUserByEmail(req.session.email, function(err, user) {
    if (err || !user || !user.isAdministrator) {
      findAllUsers(false, res);
    } else {
      findAllUsers(true, res);
    }
  });
});

function findAllUsers(admin, res) {
  db.findAllUsersWithoutPassword(admin, function(err, users) {
    if (err) {
      var msg = 'Ошибка базы данных' 
        + (conf.mode !== 'production' ? ': ' + err.message : '.');
      res.json({
        status: false,
        level: "danger",
        msg: msg
      });
      return;
    }
    
    res.json({
      status: true,
      level: "success",
      msg: "Список всех пользователей получен.",
      users: users
    });
  });
}
  
router.post('/findUserByEmail', function(req, res, next) {
  if(!req.body.email) {
    res.json({
      status: false,
      level: "danger",
      msg: "Укажите email!"
    })
    return;
  }
  if(!req.session.login) {
    findUserByEmail(req.body.email, false, res);
    return;
  }
  db.findUserByEmail(req.session.email, function(err, user) {
    if(err || !user || !user.isAdministrator) {
      findUserByEmail(req.body.email, false, res);
      return;
    } else {
      findUserByEmail(req.body.email, true, res);
      return;
    }
  })
});

function findUserByEmail(email, admin, res) {
  db.findUserByEmailWithoutPassword(email, admin, function(err, user) {
    if (err) {
      var msg = 'Ошибка базы данных' 
        + (conf.mode !== 'production' ? ': ' + err.message : '.');
      res.json({
        status: false,
        level: "danger",
        msg: msg
      });
      return;
    }
    
    if (!user) {
      res.json({
        status: false,
        level: "info",
        msg: "Пользователь не найден."
      });
      return;
    }
    
    res.json({
      status: true,
      level: "success",
      msg: "Пользователь найден.",
      user: user
    });
  });
}


module.exports = router;
