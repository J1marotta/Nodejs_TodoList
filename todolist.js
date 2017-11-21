//set up middleware, to handle routes and requests
var express = require('express');
// handle the cookies so each user can have different todo lists
var session = require('cookie-session');
// Body parser is used for managing settings
var bodyParser = require('body-parser');


/* module which allows for turning baz.stuff : things into
 baz:  {
 stuff : things
}*/
var urlencodedParser = bodyParser.urlencoded({ extended: false});

// enable express
var app = express();

//using session
app.use(session({secret: 'topsecretpass'}))


/* if there is no todo list in the session, we create and empty one in the form of an array before we continue */
app.use(function(req,res,next) {
  if (typeof(req.session.todolist) == 'undefined') {
		req.session.todolist = [];
	}
	next();
})


/*    ~~~~~  routes  ~~~~~   */
 //   Todo - list of all the tasks
app.get('/todo', function(req,res ) {
	// render our partial called todo.ejs
  res.render('todo.ejs', {todolist: req.session.todolist});

});

//todo/add post method for adding to the lists
app.post('/todo/add/',urlencodedParser, function(req,res) {
	if (req.body.newtodo != ''){
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
});


/* we also need to delete an item from the list */
app.get('/todo/delete/:id', function(req, res) {
	if (req.params.id != '') {
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
})


/* redirect from 404s  */
.use(function(req, res, next) {
	res.redirect('/todo');
})
.listen(8080);
