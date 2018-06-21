var app = angular.module('kwitter',['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $locationProvider){
  
    $routeProvider
    .when('/', {
        templateUrl: 'home.html',
        controller: 'homeCtrl',
       
    })
    .when('/signup', {
        templateUrl: 'signup.html',
        controller: 'signupCtrl',
       
    });
});

app.run(function($rootScope, $cookies){
  if($cookies.get('token') && $cookies.get('currentUser')){
      $rootScope.token = $cookies.get('token');
      $rootScope.currentUser = $cookies.get('currentUser');
  }
});

app.controller('homeCtrl', function($rootScope, $scope, $http, $cookies){
   
$scope.submitNewChat = function(){
    $http.post('/chats',
    {newChat: $scope.newChat},
    {headers: {
        'autherization': $rootScope.token
    }}).then(function(){
        getChats();
        $scope.newChat='';
    });
};

  $scope.removeChat = function(deleteThisChat){
    $http.put('/chats/remove',
    {chat: deleteThisChat},
    {headers: {
        'autherization': $rootScope.token
    }}).then(function(){
        getChats();
    });
  }
  
  $scope.signin = function(){
      $http.put('/user/signin', {
          username: $scope.username,
          password: $scope.password
        }).then(function(){
            //console.log(res.data.token);
            $cookies.put('token', res.data.token);
            $cookies.put('currentUser', $scope.username);
            $rootScope.token = res.data.token;
            $rootScope.currentUser = $scope.username;
           
          //  alert('successfully signed in!');
        }, function(err){
            alert('Invalid login credentials');
        });
  }

    $scope.logout = function(){
        $cookies.remove('token');
        $cookies.remove('currentUser');
        $rootScope.token = null;
        $rootScope.currentUser = null;     
    };



  function getChats(){
    $http.get('/chats').then(function(response){
        $scope.chats = response.data;
     });
  }
  
});