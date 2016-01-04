angular.module("app.Authentication", [])

.factory("authentication", function ($q) {

  var refreshUser = function () {
    return $q.when({ id: 1, nickname: _.uniqueId("user-") });
  };

  return {
    refreshUser: refreshUser
  };
})
