//����� ������ ������� mongod �� ����������� �����.

var mongoose = require('mongoose');
//testeroDB - ��� �� (��� ��� ����������� ��, ���� ���) 
var connectionToDB = mongoose.connect('mongodb://localhost/testeroDB')
var userSchema = new mongoose.Schema( {
	email: {type: String },
	password: {type: String},
	permission: {type: String, default: "none"}
});
var modelOfUser = connectionToDB.model("user", userSchema);




//callback(err, data)
module.exports.findRegisteredUserByEmail = function (userEmail, callback){
        var query = modelOfUser.where({email: userEmail});
        query.findOne(function (err, someUser){
                callback(err, someUser);
        })
};

//callback (err) - ���������� ���������� � ��������� ������
module.exports.addNewUser = function addNewUser(userEmail, userPass, callback) {
	try
	{
	var newUser = new modelOfUser ( {
		email: userEmail,
		password: userPass
	});
	newUser.save(function (err, newUser){
		if (!err)
		{
			console.log("New user: ", userEmail);
		}
		callback(err);
	});
	}
	catch (err)
	{
		if (err)
		{
		console.log("Saving error: ", userEmail);
		}
	}
}

module.exports.connection = mongoose.connection;