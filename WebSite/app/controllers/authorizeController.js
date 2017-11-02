App.controller('authorizeController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.data = "";
    dataService.GetAuthorizeData().then(function (data) {
        $scope.data = data;
    });
}]);