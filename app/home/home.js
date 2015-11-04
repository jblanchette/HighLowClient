angular.module("app.Home", [])
.controller("HomeCtrl", function ($state, $scope) { 
	$scope.gameListHandler = function (e, data) {
    console.log("Home got game list update: ", data);
  };

  $scope.$on("$destroy", function () {

  });
});
