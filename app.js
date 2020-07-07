var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	app = express();
//APP CONFIG

// Connect to the DB
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/application_manager", {
	useNewUrlParser : true
});
app.set("view engine", "ejs");
//To serve static css styles
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//Lets the use of HTTP verbs PUT or DELETE
app.use(methodOverride("_method"));

//Define the schema for the students in DB
var studentSchema = new mongoose.Schema({
	name                        : { type: String, required: true },
	email                       : { type: String, required: true },
	age                         : { type: Number, required: true },
	phoneNumber                 : { type: String, required: true },
	preferredWayOfCommunication : {
		type           : String,
		possibleValues : [ "Email", "Phone" ],
		required       : true
	},
	englishLevel                : {
		type           : String,
		possibleValues : [ "A", "B", "C" ],
		required       : true
	},
	avaiableToStart             : {
		type     : Date,
		required : true
	},
	technicalSkills             : String,
	personalPresentation        : String
	// studyFromHome               : Boolean
});
// Model CONFIG
var Student = mongoose.model("Student", studentSchema);

//ROUTES

//INDEX ROUTE
app.get("/", function (req, res) {
	res.redirect("/students");
});

app.get("/students", function (req, res) {
	//Retrieve all the students ofom the DB
	Student.find({}, function (err, students) {
		//If thete is error
		if (err) {
			console.log("Error!");
		} else {
			//Passthe data from the DB under the name students
			res.render("index", { students: students });
		}
	});
});

//NEW ROUTE
app.get("/students/new", function (req, res) {
	res.render("new");
});

//CREATE ROUTE
app.post("/students", function (req, res) {
	//Create student
	Student.create(req.body.student, function (err, newStudent) {
		if (err) {
			console.log(err);
		} else {
			//Redirect to the index
			res.redirect("/students");
		}
	});
});

//SHOW ROUTE
app.get("/students/:id", function (req, res) {
	Student.findById(req.params.id, function (err, foundStudent) {
		if (err) {
			console.log(err);
		} else {
			//Render the show.ejs and pass the "foundStudent" data with name "student"
			res.render("show", { student: foundStudent });
		}
	});
});

//EDIT ROUTE
app.get("/students/:id/edit", function (req, res) {
	//Find the requested student by ID from the DB
	Student.findById(req.params.id, function (err, foundStudent) {
		if (err) {
			console.log(err);
		} else {
			//Render the edit.ejs and pass the "foundStudent" data with name "student"
			res.render("edit", { student: foundStudent });
		}
	});
});

//UPDATE ROUTE
app.put("/students/:id", function (req, res) {
	//Find the requested student by ID from the DB, take the new data and run the callBack function
	Student.findByIdAndUpdate(req.params.id, req.body.student, function (
		err,
		updatedStudent
	) {
		if (err) {
			console.log(err);
		} else {
			//If successfuly updated redirect to the show page of the updated student
			res.redirect("/students/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/students/:id", function (req, res) {
	//Delete student
	Student.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err);
		} else {
			//Redirect to the index
			res.redirect("/students");
		}
	});
});

app.listen(3000, function () {
	console.log("SERVER IS RUNNING...");
});
