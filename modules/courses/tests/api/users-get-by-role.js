"use strict"

const cookieParser = require('cookie-parser')
const supertest = require('supertest')

const rolesDB = require('../../db/roles')
const usersDB = require('../../../users/db')

describe('GET /courses/roles/?role=role', function() {
  let agent
  let app

  let admin = {
    email: 'admin@testero',
    password: 'admin',
    passwordDuplicate: 'admin'
  }
  let adminId
  let user1 = {
    email: 'user1@testero',
    password: 'user1',
    passwordDuplicate: 'user1'
  }
  let userId1
  let user2 = {
    email: 'user2@testero',
    showEmail: true,
    password: 'user2',
    passwordDuplicate: 'user2'
  }
  let userId2
  
  before(function() {
    return require('../../../../settings').getSettings()
      .then(settings => {
        rolesDB.setup(settings)
        usersDB.setup(settings)

        app = require('../../../../app')(settings)
        app.use(cookieParser())

        agent = supertest.agent(app)
        
        return rolesDB.clearRoles()
          .then(() => {
              usersDB.clearUsers()
          })
          .then(() => {
            return usersDB.registerUser({
                email: admin.email,
                password: admin.password,
                isAdministrator: true,
                registeredBy: "admin@admin"
              })
              .then(user => {
                adminId = user.id
              })
          })
      })
  })

  context('Не назначено ни одной роли', function() {
    it('Получение списка id пользователей с ролью student: получаем пустой', function() {
      return agent
        .get('/courses/roles/?role=student')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal(true, res.body.msg);
          res.body.users.should.be.an.instanceOf(Array).and.have.lengthOf(0)
        });
    })
  })

  context('Одному пользователю назначена роль student', function() {
    before('Назначаем роль student', function() {
      return rolesDB.assignRole(adminId, 'student')
    })

    it('Получение списка id пользователей с ролью student: получаем один элемент', function() {
      return agent
        .get('/courses/roles/?role=student')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal(true, res.body.msg);
          res.body.users.should.be.an.instanceOf(Array).and.have.lengthOf(1)
        });
    })
  })

  after('Очистка базы данных', function() {
    return rolesDB.clearRoles()
      .then(() => {
        usersDB.clearUsers()
      })
  })
})
