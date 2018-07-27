var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var mongodb_connection_string = 'receptApp';
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL;
}

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs(mongodb_connection_string, ['recept']);
var ObjectId = mongojs.ObjectId;

var app = express();



// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
  db.recept.find().sort({name: 1}, function(err, docs) {
    res.render('index', {
      title:'En titel från servern',
      recept: docs
    });
  });
});

app.get("/healthz", function(req, res) {
    res.sendStatus(200);
});

/*
app.post('/recept/add', function(req, res) {
  var newUser = {
    name: req.body.name,
    email: req.body.email
  }
  db.users.insert(newUser, function(err, result) {
    if (err) {
      log(err)
    }
    res.redirect('/');
  })
});
*/

app.post('/recept/new/:name', function(req, res) {
  var newRecipe = {
    name: req.params.name,
    ingredients: [],
    description: "Describe it!"
  }
  db.recept.insert(newRecipe, function(err, result) {
    if (err) {
      log(err)
    }
    res.redirect('/');
  })
});

app.put('/recept/update/description/', function(req, res) {
  console.log(req.body.id);
  db.recept.update(
    { _id: ObjectId(req.body.id) },
    { $set : { description: req.body.description } }
  );
  res.redirect('/');
});

/* OLD
app.put('/recept/update/description/:id', function(req, res) {
  console.log(req.params.id);
  db.recept.update(
    { _id: ObjectId(req.params.id) },
    { $set : { description: "hello there, I have changed" } }
  );
  res.redirect('/');
});
*/

/* OLD
app.put('/recept/update/ingredients/:id', function(req, res) {
  console.log(req.params.id);
  db.recept.update(
    { _id: ObjectId(req.params.id) },
    { $set : { ingredients: ["ett","två"] } }
  );
  console.log("test?");
  res.redirect('/');
});
*/
app.put('/recept/update/ingredients/', function(req, res) {
  console.log(req.body.id);
  db.recept.update(
    { _id: ObjectId(req.body.id) },
    //{ $push : { ingredients: { $each: JSON.parse(req.body.ingredients) } } }
    { $push : { ingredients: req.body.ingredients } }
  );
  res.redirect('/');
});

app.put('/recept/remove/ingredients/', function(req, res) {
  console.log(req.body.id);
  db.recept.update(
    { _id: ObjectId(req.body.id) },
    //{ $push : { ingredients: { $each: JSON.parse(req.body.ingredients) } } }
    { $pull : { ingredients: req.body.ingredients } }
  );
  res.redirect('/');
});


app.delete('/recept/delete/:id', function(req, res) {
  console.log(req.params.id);
  db.recept.remove({
    _id: ObjectId(req.params.id)
  });
  res.sendStatus(200);
  // res.redirect('/');
});

app.listen(server_port, server_ip_address, function() {
  console.log(`server started on ${server_ip_address},port ${server_port}...`);
})
