"use strict"

const config = require('config')
const cookieParser = require('cookie-parser')
const mongodb = require('mongodb')
const supertest = require('supertest')

const usersDB = require('../../db')

let agent
let app

describe('DELETE /users/users', function() {
  before('Connect to database', function() {
    return require('../../../../settings').getSettings()
      .then(settings => {
        usersDB.setup(settings)

        app = require('../../../../app')(settings)
        app.use(cookieParser())

        agent = supertest.agent(app)

        return usersDB.clearUsers()
      })
  })

  let admin1 = {
    email: "admin1@testero",
    password: "admin1",
    passwordDuplicate: "admin1",
    isAdministrator: true
  }

  let user1 = {
    email: "user1@testero",
    password: "user1",
    passwordDuplicate: "user1"
  }
  
  
  context('Попытка очистки не авторизованным пользователем', function() {
    before(function() {
      return usersDB.clearUsers()
        .then(function() {
          return usersDB.registerUser(admin1)
            .then(user => {
              admin1.id = user.id;
            })
            .then(() => {
              return usersDB.registerUser(user1)
            })
            .then(user => {
              user1.id = user.id;
            })
        })
    })

    it('Возвращается отказ', function(done) {
      agent
        .delete('/users/users')
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
  
  context('Попытка очистки не администратором', function() {
    before(function(done) {
      agent
        .post('/users/users/' + user1.id + '/auth')
        .send(user1)
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          res.body.status.should.equal(true, res.body.msg);

          done();
        });
    });
    
    it('Возвращается отказ. Количество пользователей не изменилось.', function(done) {
      agent
        .delete('/users/users')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          
          res.body.status.should.equal(false, res.body.msg);
          
          agent
            .get('/users/users')
            .set('X-Requested-With', 'XMLHttpRequest')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                throw err;
              }

              res.body.status.should.equal(true, res.body.msg);
              res.body.users.should.be.an.instanceOf(Array).and.have.lengthOf(2);

              done();
            });
        });
    });
  });
  
  context('Зарегистрировано несколько пользователей', function() {
    before(function() {
      return agent
        .delete('/users/users/' + user1.id + '/auth')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal(true, res.body.msg);
          
          return agent
            .post('/users/users/' + admin1.id + '/auth')
            .set('X-Requested-With', 'XMLHttpRequest')
            .send(admin1)
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              res.body.status.should.equal(true, res.body.msg);
            });
        });
    });
    
    it('Deleting all users by an administrator', function() {
      return agent
        .delete('/users/users')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal(true, res.body.msg);
          
          return agent
            .get('/users/users')
            .set('X-Requested-With', 'XMLHttpRequest')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then(res => {
              res.body.status.should.equal(true, res.body.msg);
              res.body.users.should.be.an.instanceOf(Array).and.have.lengthOf(0);
            });
        });
    });
  })

  after(function() {
    return usersDB.clearUsers()
  });
})
