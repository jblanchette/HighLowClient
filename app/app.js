angular.module("app", [
	"ui.router",
	"app.Home",
	"app.gameList"
])

.run(function () {
	console.log("I ran?");
})

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
    	$urlRouterProvider.otherwise("/");

    	$stateProvider.state("home", {
    		url: "/",
    		template: "I worked! <b>woo hoo</b>",
    		controller: "HomeCtrl"
    	});
    }
  ]
);