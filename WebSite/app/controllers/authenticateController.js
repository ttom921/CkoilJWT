App.controller('authenticateController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.data = "";
    dataService.GetAuthenticateData().then(function (data) {
        $scope.data = data;
    });
}]);