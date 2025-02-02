"use strict"

const config = require('config')
const mongodb = require('mongodb')
const should = require('should')

const subjectsDB = require('../../db/subjects')
const testsDB = require('../../db/tests')

describe('courses::db::tests', function () {
  const subject1 = {
    title: 'First subject'
  }
  let subjectId1

  const test1 = {
    question: 'Question1',
    answer_type: 'number',
    answer: 42
  }
  let testId1

  before(function () {
    /**
     * @type {Configuration}
     */
    const cfg = config
    const mongoHost = cfg.mongodb.host || 'localhost'
    const mongoPort = cfg.mongodb.port || '27017'
    const mongoDBName = cfg.mongodb.name || 'testero-testing'
    const mongoUrl = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDBName

    return mongodb.MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(client => {
        return client.db(mongoDBName)
      })
      .then(db => {
        subjectsDB.setup({mongoDBConnection: db})
        testsDB.setup({mongoDBConnection: db})
        return testsDB.clear()
          .then(() => {
            return subjectsDB.clear()
          })
      })
  })

    context('There is any subject', function () {
        before(function () {
            return subjectsDB.add(subject1)
                .then(data => {
                    subjectId1 = data.id
                })
        })

        it('Getting list of tests', function () {
            return subjectsDB.findById(subjectId1)
                .then(subject => {
                    should(subject).not.be.null()
                    if (subject.tests) {
                        subject.should.be.an.instanceOf(Array).and.have.lengthOf(0)
                    }
                    else {
                        subject.should.have.not.property('tests')
                    }
                })
        })

        it('Adding of test', function () {
            return subjectsDB.addTest(subjectId1, test1)
                .then(test => {
                    should(test).not.be.null()
                    test.should.have.property('id')
                    testId1 = test.id
                })
        })
    })

    after(function () {
        return testsDB.clear()
            .then(() => {
                return subjectsDB.clear()
            })
    })
})
