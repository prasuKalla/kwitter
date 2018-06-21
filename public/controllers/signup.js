var app = angular.module('kwitter',['ngRoute']);

app.controller('signupCtrl', function($scope, $http){
    
    $scope.submitSignup = function($scope, $http){
        var newUser = {
            username: $scope.username,
            password: $scope.password
        };
    
    $http.post('/users', newUser).then(function(){
        alert('success');
     });
    }
});