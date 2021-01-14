"use strict"

const should = require('should')

const coursesDB = require('../../db/courses')

describe('courses::db::courses', function() {
  const course1 = {
    title: 'First course'
  }
  let courseId1

  const subject1 = {
    title: 'First subject'
  }
  let subjectId1
  
  before(function() {
    require('../../../../settings').getSettings()
      .then(settings => {
        coursesDB.setup(settings)
        return coursesDB.clear()
      })
  })

  context('There is no course', function() {
    it('Getting list of courses', function() {
      return coursesDB.findAll()
        .then(courses => {
          courses.should.be.an.instanceOf(Array).and.have.lengthOf(0)
        })
    })

    it('Adding of course', function() {
      return coursesDB.add(course1)
        .then(course => {
          should(course).not.be.null()
          course.should.have.property('id')
          courseId1 = course.id
        })
    })
  })

  context('There is no subjects', function() {
    it('Adding subject to course', function() {
      return coursesDB.addSubject(courseId1, subject1)
        .then(subject => {
          should(subject).not.be.null()
          subject.should.have.property('id')
          subjectId1 = subject.id
        })
    })
  })
  
  after(function() {
    return coursesDB.clear()
  })
})
