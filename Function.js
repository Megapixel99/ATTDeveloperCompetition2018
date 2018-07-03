//This script is intended for use with Google Search Engine through the Tampermonkey Browser Addon
//To install and use this script download Tampermonkey, create a new script, and copy/paste this code into the new script
//Written for the ATT App Developer Competition 2018
//Written by Seth C. Wheeler

// ==UserScript==
// @name     Function
// @version  0
// @run-at 	 document-end
// @require  https://code.jquery.com/jquery-2.1.4.min.js
// @include	 https://www.google.com/search*
// @include	 http://www.google.com/search*
// ==/UserScript==

var $ = window.jQuery;
var UserSearchTerm;
var commonWords = ["for", "the", "a", "of", "this", "these", "those", "get", "how", "to"];
var searchedterms = [];
var userIP;

$.ajax({
    url: "https://api.ipify.org/?format=json", // Getting user Ip Address
    dataType: 'json',
    async: false,
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
    url: "https://attappdevcomp2018.herokuapp.com/savedata?searchedterms=" + searchedterms + "&userIP=" + userIP + "", //sending searched terms and user IP adress to Router.js
    type: "POST",
    dataType:"json"
});
