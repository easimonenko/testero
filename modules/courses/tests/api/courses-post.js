"use strict"

const cookieParser = require('cookie-parser')
const supertest = require('supertest')

const coursesDB = require('../../db/courses')
const rolesDB = require('../../db/roles')
const usersDB = require('../../../users/db')

describe('POST /courses/courses', function () {
  let agent
  let app

  before(function() {
    return require('../../../../settings').getSettings()
      .then(settings => {
        coursesDB.setup(settings)
        rolesDB.setup(settings)
        usersDB.setup(settings)

        app = require('../../../../app')(settings)
        app.use(cookieParser())
        
        agent = supertest.agent(app)
    })
  })

  describe('Добавление курсов (POST /courses/courses).', function() {
    let user1 = {
      email: 'user1@testero',
      password: 'user1',
      passwordDuplicate: 'user1'
    }
    let userId1

    before(function() {
      return coursesDB.clear()
        .then(() => {
          return usersDB.registerUser(user1)
        })
        .then(data => {
          userId1 = data.id
        })
    });

    var course1 = {title: 'Course1', 'i-am-author': true};

    context('Попытка добавить курс не авторизованным пользователем.', function() {
      it('Возвращается неуспех.', function(done) {
        agent
          .post('/courses/courses/')
          .send(course1)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            res.body.status.should.equal(false, res.body.msg);
            res.body.should.not.have.property('course');

            done();
          });
      });
    });


    context('Попытка добавить курс не преподавателем.', function() {
      before(function(done) {
        agent
          .post('/users/users/' + userId1 + '/auth')
          .send(user1)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              throw err;
            }

            res.body.status.should.equal(true, res.body.msg);

            done();
          });
      });

      it('Возвращается неуспех.', function(done) {
        agent
          .post('/courses/courses/')
          .send(course1)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            res.body.status.should.equal(false, res.body.msg);
            res.body.should.not.have.property('course');

            done();
          });
      });
    });

    context('Добавление курса преподавателем', function() {
      before(function() {
        return rolesDB.assignRole(userId1, 'teacher')
      });

      it('Возвращается успех.', function(done) {
        agent
          .post('/courses/courses/')
          .send(course1)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            res.body.status.should.equal(true, res.body.msg);
            res.body.should.have.property('course');
            res.body.course.should.have.property('title');
            res.body.course.title.should.equal('Course1');
            res.body.course.should.have.property('authors');
            res.body.course.authors.should.have.lengthOf(1);
            res.body.course.authors[0].should.equal(user1.email);

            done();
          });
      });
    });

    var course2 = {title: 'Course2', 'i-am-author': false};

    context('Добавление ещё одного курса преподавателем', function() {
      it('Возвращается успех.', function(done) {
        agent
          .post('/courses/courses/')
          .send(course2)
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            res.body.status.should.equal(true, res.body.msg);
            res.body.should.have.property('course');
            res.body.course.should.have.property('title');
            res.body.course.title.should.equal('Course2');
            res.body.course.should.not.have.property('authors');

            done();
          });
      });
    });
  })

  after(function() {
    return coursesDB.clear()
      .then(() => {
        return usersDB.clearUsers()
      })
    })
})
