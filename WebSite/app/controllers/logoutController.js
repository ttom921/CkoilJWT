App.controller('logoutController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    console.log('logoutController start');
    authService.logOut();
}]);