var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var engine = require( 'ejs-locals' );

var app = express();

// model setup
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  todoSchema = new mongoose.Schema({
    title: String,
    created_at: Date
  });
  Todo = mongoose.model('Todo', todoSchema);
});
mongoose.connect('mongodb://localhost/todo');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index', { title : 'Todos' });
})

app.post('/todos', function (req, res) {
  var object = req.body;
  var date = new Date();
  var todo = new Todo({
    title: object.title,
    created_at: date,
  });
  todo.save(function (err, the_todo) {
    if (err){ res.send(400, err); }
    else {
      console.dir(the_todo);
      res.send(201, the_todo);
    }
  });
});

app.put('/todos/:id', function (req, res) {
  var object = req.body;
  var date = new Date();
  var todo = new Todo({
    title: object.title,
    created_at: date,
  });
  var id = req.params.id;
  var query = { _id: id}; 

  //todo.update(query, todo, {}, 
});
app.get('/todos', function (req, res) {
  Todo.find(function(err, the_todos) {
    if (err) return console.error(err);
    res.render('data', { title : "Todo list", todos : the_todos });
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
