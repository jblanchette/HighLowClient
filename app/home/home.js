angular.module("app.Home", [])
.controller("HomeCtrl", function ($state) { 
	console.log("Home ran?", $state.current);
});