"use strict"

const cookieParser = require('cookie-parser')
const supertest = require('supertest')

const usersDB = require('../../db')

let agent
let app

describe('POST /users/users', function () {
  before('Connect to database', function() {
    return require('../../../../settings').getSettings()
      .then(settings => {
        usersDB.setup(settings)

        app = require('../../../../app')(settings)
        app.use(cookieParser())
        
        agent = supertest.agent(app)
    })
  })

  describe('Регистрация нового пользователя', function() {
    context('Пользователей ещё нет', function() {
      it('Возвращается успех, пользователь зарегистрирован администратором', function (done) {
        var data = {
          email: "admin1@testero",
          password: "admin1",
          passwordDuplicate: "admin1",
          agreementAccepted: true
        };
        agent
          .post('/users/users')
          .send(data)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            
            res.body.status.should.equal(true, res.body.msg);
            res.body.user.isAdministrator.should.equal(true, res.body.msg);
            
            done();
          });
      });
    });
    
    context('Попытка зарегистрировать ещё одного такого же пользователя', function () {
      it('Возвращается отказ', function (done) {
        var admin1 = {
          email: "admin1@testero",
          password: "admin1",
          passwordDuplicate: "admin1",
          agreementAccepted: true
        };
        agent
          .post('/users/users')
          .send(admin1)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            
            res.body.status.should.equal(false, res.body.msg);
                
            done();
          });
      });
    });

    context('Регистрация ещё одного пользователя', function() {
      it('Возвращается успех и объект простого пользователя', function () {
        let data = {
          email: "user1@testero",
          password: "user1",
          passwordDuplicate: "user1",
          isAdministrator: false,
          agreementAccepted: true
        }

        return agent
          .post('/users/users')
          .send(data)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(res => {
            res.body.should.have.property('status');
            res.body.status.should.equal(true, res.body.msg);
            res.body.should.have.property('level');
            res.body.level.should.equal("success");
            res.body.should.have.property('user');
            res.body.user.should.have.property('email');
            res.body.user.isAdministrator.should.equal(false, res.body.msg);
            res.body.user.should.have.property('showEmail');
            res.body.user.should.have.property('created_at');
            res.body.user.should.have.property('updated_at');
          });
      });
    });
    
    context('Попытка добавления пользователя с не указанным email', function() {
      it('Возвращается отказ', function(done) {
        var data = {
          //email: "user2@testero",
          password: "user2",
          passwordDuplicate: "user2",
          agreementAccepted: true
        };
        agent
          .post('/users/users')
          .send(data)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            
            res.body.status.should.equal(false, res.body.msg);
            
            done();
          });
      });
    })
  })

  after(function() {
    return usersDB.clearUsers()
  })
})
