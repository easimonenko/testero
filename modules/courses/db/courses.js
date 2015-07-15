var config = require('../../../config');
var dataStore = require('nedb');

function getConnectionOptions(nameCollection) {
  return  {
    filename: '../db/' +config.db.name + '/'+nameCollection,
    autoload: true,
    inMemoryOnly: false
  };
};

/*
function getIndexOption(field, uniqueOption, sparseOption) {
  var option = {
    fieldName: field
    ,unique: uniqueOption
    ,sparse: sparseOption
  }
  return option;
}*/

var collection = new dataStore(getConnectionOptions("courses"));
//collection.ensureIndex(getIndexOption("email", true, false));

exports.findAllCourses = function (callback) {
  collection.find ({}, function (err, courses) { 
    if(err) {
      console.log("Ошибка получения курсов: ")
      console.log(err)
    }
    callback(err, courses)
  })
};


exports.findCourses = function (filter, callback) {
  collection.find (filter, function (err, courses) { 
    if (err) {
      console.log('Ошибка получения курсов: "' + err + '"');
    }
    callback(err, courses);
  });
};


exports.findCourse = function (filter, callback) {
  collection.findOne (filter, callback);
}


exports.addCourse = function(title, author, callback) {
  var course = { title: title };
  if (author) {
    course.authors = [author];
  }
  course.created_at = new Date();
  course.updated_at = null;
  course.subjects = [ ];
  collection.insert(course, function (err, newCourse) {
    callback(err, newCourse);
  });
};


exports.addSubject = function(courseId, subjectTitle, callback) {
  var subject = { };
  subject.title = subjectTitle;
  var updated_at = new Date();
  collection.update({ _id: courseId }, { $set: {updated_at: updated_at} }, { });
  collection.update({ _id: courseId }, { $push: { subjects: subject } }, {}, callback);
};

exports.updateCourse = function(course, callback) {
  course.updated_at = new Date();
  collection.update({ _id: course._id }, course, { }, callback);
};

module.exports.clearCourses = function(callback) {
  collection.remove({ }, {multi: true}, callback);
};
