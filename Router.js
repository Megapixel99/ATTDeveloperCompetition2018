//This script is written to be used in conjunction with MongoDB and Function.js and is called by Server.js
//Written for the ATT App Developer Competition
//Written by Seth C. Wheeler
const express = require("./node_modules/express");
const router = express.Router();
const mongoose = require('./node_modules/mongoose');
mongoose.connect('mongodb://Admin:Admin1@ds018568.mlab.com:18568/attdevcomp2018'); // Connecting to the database
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error")); // If connection failed
  db.once("open", function(callback) {
      console.log("Connection succeeded."); // If connection succeeded
  });
var Termschema = mongoose.Schema({ // Creating a model for the data to be inputed into the database
  Term: String,
  ip: String,
  use: Number
});
var Term = mongoose.model('Terms', Termschema); // Creating\accsesing the database

router.post('/', function(req, res){
   var searchedterms = req.query.searchedterms.split(","); // Switching passed in search terms to an Array
   var userIP = req.query.userIP; // Saving the Client's IP Adress
   searchedterms.forEach(function (term) { // Looping through all the terms in the Array searchedterms
     Term.findOne({Term: term}, function(err, TermItem) { // Locating a term
       if (err) { // If error
        res.send("MongoDB Error: " + err);
        return false;
       }
       if (!TermItem) { // If term isn't found create term and add to the database
        console.log("Term not found for user " + userIP + ", creating Term: " + term + "");
        var myData = new Term({ Term: term, ip: userIP, use : 1 });
        myData.save()
          .then(item => {
            res.send("saved to database: " + term + ", for user " + userIP + "");
          })
          .catch(err => {
            res.send("unable to save to database: " + term + ", for user " + userIP + "");
          });
        }
        else{ // If term is found increment 1 to the use of the Term in the database
          var conditions = {Term: term};
          var update = {$inc : { use: 1 }};
          Term.findOneAndUpdate(conditions, update, function (err)
          {
            res.send("updated: " + term + ", for user " + userIP + "");
              if (err) // If error
              {
                res.send(err);
              }
          });
        }
     });
   });
 });
router.get('/', function(req, res){
    res.json("Please go to https://attappdevcomp2018.herokuapp.com/result to see the results"); // Sending the message in JSON format
});
router.get('/result', function(req, res){
  if (req.query.ipAddress == undefined)
  {
    res.json("No IP Address found in url parameters, please add ?ipAddress=(the IP Address) after /result"); // Sending the message in JSON format
    return;
  } else {
    var ipAddress = req.query.ipAddress; // Obtaining IP Address
  }
  var highestTerms = [];
  var use = [];
  var highestUse = 0;
  Term.find({}, { _id : 0, __v : 0}, function (err, data) { // Finding all the Terms and storing them in data
    data.forEach(function (entry){ // Looping through all the data
      use.push(entry.use); // Storing all the use(s) of the terms in data to the Array use
    });
    use.sort(sortNumber); // Using the sorting method to sort the numbers stored in use from highest to lowest
    use.forEach(function (usenum){ // Looping through the use Array
      data.forEach(function (entryterm){ // Looping through all the data
        if (entryterm.use == usenum && highestTerms.indexOf("" + entryterm.Term + ", " + entryterm.use + "") == -1 && entryterm.ip == ipAddress){ // Checking if the term is already in the Array highestTerms, the IP Adress matches the IP Adress of the one passed in the URL, and comparing entryterm.use to usenum to ensure the terms are ordered from greatest to least
          highestTerms.push("" + entryterm.Term + ", " + entryterm.use + "");} // Adding the term(s) and the use(s) to the Array highestTerms
      });
    });
    res.json(highestTerms); // Sending highestTerms in JSON format
  });
});
function sortNumber(a,b) {
    return b - a;
}
module.exports = router;
