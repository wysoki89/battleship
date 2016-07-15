const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const config = require('./config')
var db;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


var Schema = mongoose.Schema;
var resultSchema = new Schema ({
    nick: String,
    mistakes: Number 
});
var Result = mongoose.model('Result', resultSchema);
module.exports = Result;

mongoose.connect(`mongodb://${config.database.login}:${config.database.password}${config.database.url}${config.database.dbname}`
, (err, database) => {
    if(err){
        return console.log(err)
    }
    db = database;
    app.listen(3000, function(){
        console.log("server is running on port 3000");
    })
    // get all the Results
    Result.find({}, function(err, results) {
        if (err) throw err;

    // object of all the results
    console.log(results);
    });
})


app.post('/addUser', (req,res)=>{
    var newResult = Result({
        nick: req.body.nick,
        mistakes: req.body.mistakes
    })
    console.log(req.body.nick)
 
    // save the user
    newResult.save(function(err) {
    if (err){
        return console.log(err);
    }

    console.log("saved to database");
    res.redirect('/')
    });
})

app.get('/results', function (req, res){
  return Result.find({}, function(err, results) {
        if (!err) {
            return res.send(results);
        } else {
            return console.log(err);
        }
    })
})
