angular.module("app.gameList", [])
.controller("gameListCtrl", function () {

})

.directive("gameList", function (){
	return {
    restrict: "E",
    scope: true,
    controller: "gameListctrl",
    // two bars in each graph
    templateUrl: "directives/gameList/gameList.tpl.html",
    link: function (scope, element, attrs) {

    }
   };
})