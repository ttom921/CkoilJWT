App.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', function ($scope, $location, authService, ngAuthSettings) {
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };
    $scope.message = "";
    $scope.login = function () {
        //console.log('userName=' + $scope.loginData.userName + ' password=' + $scope.loginData.password);
        authService.login($scope.loginData).then(function (response) {
            $location.path('/home');
        }, function (error) {
            $scope.message = error.data.error_description;
        });
    };
}]);


//App.controller('loginController', ['$scope', 'accountService', '$location', function ($scope, accountService, $location) {
//    //FETCH DATA FROM SERVICES
//    $scope.account = {
//        username: '',
//        password:''
//    }
//    $scope.message = "";
//    $scope.login = function () {
//        accountService.login($scope.account).then(function (data) {
//            $location.path('/home');
//        }, function (error) {
//            $scope.message = error.error_description;
//        });
//    };
//}]);