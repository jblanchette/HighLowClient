angular.module("app.gameList", [])
.controller("gameListCtrl", function () {
	console.log("Game list ctrl ran");
})

.directive("gameList", function (){
	return {
    restrict: "E",
    scope: true,
    controller: "gameListCtrl",
    // two bars in each graph
    templateUrl: "app/directives/gameList/gameList.tpl.html",
    link: function (scope, element, attrs) {
    	console.log("I linked!?");
    }
   };
})