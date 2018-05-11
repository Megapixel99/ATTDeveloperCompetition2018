//This script is intended for use with Google Search Engine through the GreaseMonkey Browser Addon for the Firefox Web Browser - otherwise part of the function will not work
//because I am not using a https connnection.
//Written for the ATT App Developer Competition
//Written by Seth C. Wheeler

// ==UserScript==
// @name     Function
// @version  1
// @run-at 	 document-end
// @require	 https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include	 https://www.google.com/search*
// @include	 http://www.google.com/search*
// ==/UserScript==

var UserSearchTerm;
var commonWords = ["for", "the", "a", "of", "this", "these", "those", "get", "how"];
var searchedterms = [];
var runTime = 0;
var userIP;

$.ajax({
    url: "https://api.ipify.org/?format=json", // Getting user Ip Address
    async: false,
    dataType: 'json',
    success: function(data) {
      userIP = data.ip; // Saving user Ip Address
    }
});
if (window.location.href.slice(0,29) == "https://www.google.com/search" || window.location.href.slice(0,28) == "http://www.google.com/search") // Checking if the user is on Google
{
  UserSearchTerm = document.getElementById('lst-ib').value; //lst-ib is the id of the Google Search bar
}
UserSearchTerm = UserSearchTerm.split(" "); // Spliting the user input into an array of terms
for (var j = 0; j < UserSearchTerm.length; j++) {
  if (!commonWords.includes(UserSearchTerm[j].toLowerCase())) //Checking against the commonWords array to remove unimportant term
  {
    searchedterms.push([UserSearchTerm[j].toLowerCase()]); // Adding the term(s) to an array of terms stored internally
  }
}
$.ajax({
	url: "http://localhost:3000/?searchedterms=" + searchedterms + "&userIP=" + userIP + "", //sending searched terms and user IP adress to Router.js
  async: false,
  type: "POST",
  dataType:"json"
});
