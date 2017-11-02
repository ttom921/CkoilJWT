App.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
    //FETCH DATA FROM SERVICES
    $scope.data = "";
    dataService.GetAnonymousData().then(function (data) {
        $scope.data = data;
    });
}]);