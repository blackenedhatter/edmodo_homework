'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.login = function() {
      $location.path('/login');
    };
    $scope.register = function() {
      $location.path('/register');
    };

  }])
  .controller('BodyCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.session = { username: '', usertype: '', name: '' };

    $scope.isTeacher = function() {
      if( $scope.session.usertype == 'Teacher' ) {
        return true;
      }
      return false;
    };

    $scope.isStudent = function() {
      if( $scope.session.usertype == 'Student' ) {
        return true;
      }
      return false;
    };

    $scope.logout = function() {
      $scope.session = { username: '', usertype: '', name: '' };
      $http.post( 'http://168.144.134.38:8000/homework/logout/' );
      $location.path('/home/');
    };

  }])
  .controller('RegCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.newuser = {name: '', username: '', usertype: '', password: ''};

    $scope.register = function() {
      if( $scope.newuser.username == '' ||
          $scope.newuser.name == '' ||
          $scope.newuser.password=='' ) {
          alert("You must include a name, username, and password");
          return;
      }

      // register
      $http.post(
        'http://168.144.134.38:8000/homework/register/',
        $scope.newuser
      ).then( function success( response ) {
          console.log("success");

          $location.path('/login');
        }, function error( response ) {
          console.log("error");
          console.log(response);
      });

    };

  }])
  .controller('LoginCtrl', ['$scope','$http','$location','$cookies',function($scope,$http,$location,$cookies) {
    $scope.creds = { username: '', password: '' };

    $scope.login = function() {
      // Check login
      $http.post(
        'http://168.144.134.38:8000/homework/login/',
        $scope.creds
      ).then( function success( response ) {
          $scope.$parent.session = response.data;
          console.log($scope.$parent.session);

          $location.path('/main');
        }, function error( response ) {
          $scope.creds = { username: '', password: '' };
          alert( "Could not log in. Please check your username or password and try again." );
      });
    };

  }])
  .controller('MainCtrl', ['$scope','$http','$cookies','$location',function($scope,$http,$cookies,$location) {
    $scope.user = {};

    $scope.isTeacher = function() {
      if( $scope.user == {} ) {
        return false;
      }
      if( $scope.user.usertype == 'Teacher' ) {
        return true;
      }
      return false;
    };

    $scope.isStudent = function() {
      if( $scope.user == {} ) {
        return false;
      }
      if( $scope.user.usertype == 'Student' ) {
        return true;
      }
      return false;
    };

    $scope.getUser = function() {
      $scope.user = $scope.$parent.session;

      if($scope.user.username == '') {
        $location.path('/home');
      }
    };

    $scope.getUser();
  }])

  .controller('CreateHomeworkCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.homework = { title: '', question: '', duedate: '' };

    $scope.createHomework = function() {
      if( $scope.homework.title == '' ) {
        alert('Homework must have a title');
        return;
      }
      if( $scope.homework.question == '' ) {
        alert('Homework must have a question');
        return;
      }
      if( $scope.homework.duedate == '' ) {
        alert('Homework must have a due date');
        return;
      }

      $http.post(
        'http://168.144.134.38:8000/homework/homework/',
        $scope.homework
      ).then( function success( response ) {
          console.log("success");
          $location.path('/main');
        }, function error( response ) {
          console.log("error");
          console.log(response);
      });
    };

  }])
  .controller('AssignHomeworkCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.homework = [];
    $scope.students = [];
    $scope.selectedStudents = {};
    $scope.selectedHomework = '';

    $scope.getHomework = function() {
      // homework will get session based on cookie
      $http.get(
        'http://168.144.134.38:8000/homework/homework'
      ).then( function success( response ) {
          $scope.homework = response.data;
        }, function error( response ) {
          console.log("error getting homework");
          $scope.homework = [];
      });
    };

    $scope.getStudents = function() {
      // assuming all students
      $http.get(
        'http://168.144.134.38:8000/homework/students/'
      ).then( function success( response ) {
          $scope.students = response.data;
        }, function error( response ) {
          console.log("error getting students");
          $scope.students = [];
      });

    };

    $scope.selectStudent = function(student) {
      if( $scope.selectedStudents.hasOwnProperty( student ) ) {
        delete $scope.selectedStudents[student];
      } else {
        $scope.selectedStudents[student] = true;
      }
    };

    $scope.selectHomework = function(homework) {
      $scope.selectedHomework = homework;
    };

    $scope.homeworkSelected = function(id) {
      return( $scope.selectedHomework == id )
    };
    $scope.studentSelected = function(id) {
      return $scope.selectedStudents.hasOwnProperty(id);
    };

    $scope.saveAssignments = function() {
      if( $scope.selectedHomework == '' ) {
        alert( "You must select the homework to assign" );
        return;
      }
      if( $scope.selectedStudents.length == 0 ) {
        alert( "You must select the at least one student" );
        return;
      }

      $http.post(
        'http://168.144.134.38:8000/homework/assign/',
        {
          homework: $scope.selectedHomework,
          students: $scope.selectedStudents
        }
      ).then( function success( response ) {
          console.log("success");
          $location.path('/main');
        }, function error( response ) {
          console.log("error");
          console.log(response);
      });
    };

    $scope.getHomework();
    $scope.getStudents();
  }])
  .controller('ListHomeworkCtrl', ['$scope','$location','$http',function($scope,$location,$http) {
    $scope.homework = [];

    $scope.getHomework = function() {
      $scope.homework = [
        { id: 1, duedate: '2016-03-22', title: 'Homework Title', question: 'Homework Question' },
        { id: 2, duedate: '2016-03-23', title: 'Homework Title 2', question: 'Homework Question 2' },
      ];

      // assuming all homework
      $http.get(
        'http://168.144.134.38:8000/homework/homework/'
      ).then( function success( response ) {
          $scope.homework = response.data;
        }, function error( response ) {
          console.log("error getting homework");
          $scope.homework = [];
      });
    };

    $scope.showHomework = function(id) {
      $location.path('/showhomework/'+id);
    };

    $scope.getHomework();

  }])
  .controller('ShowHomeworkCtrl', ['$scope','$location','$http','$routeParams',function($scope,$location,$http,$routeParams) {
    $scope.homework = [];
    $scope.homeworkId = '';
    $scope.getHomework = function(id) {
      $scope.homeworkId = id;

      // assuming all answers for id
      $http.get(
        'http://168.144.134.38:8000/homework/answers/'+id
      ).then( function success( response ) {
          $scope.homework = response.data;
        }, function error( response ) {
          console.log("error getting answers");
          $scope.homework = [];
      });
    };
    $scope.showAllHomework = function(username) {
      $location.path('/showanswers/'+$scope.homeworkId+"/"+username);
    };

    $scope.getHomework($routeParams.homeworkid);
  }])
  .controller('ShowAnswersCtrl', ['$scope','$http','$routeParams',function($scope,$http,$routeParams) {
    $scope.homework = {};

    $scope.showAnswers = function(homeworkId,userName) {
      console.log("show answers ctrl");
      // assuming all answers for id
      $http.get(
        'http://168.144.134.38:8000/homework/answers/'+homeworkId+'/'+userName
      ).then( function success( response ) {
          $scope.homework = response.data[0].homeworkId;
          $scope.homework.answers = response.data;
          $scope.homework.userid = response.data[0].userid;

          $scope.homework.answers.forEach(function(answer) {
            answer.sub_date = answer.submitted_date.split('.')[0];
          });

          console.log($scope.homework)
        }, function error( response ) {
          console.log("error getting answers");
          $scope.homework = [];
      });
    };

    $scope.showAnswers($routeParams.homeworkid,$routeParams.username);
  }])
  .controller('MyHomeworkCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.homework = [];

    $scope.getHomework = function() {
      // gets user from cookie
      $http.get(
        'http://168.144.134.38:8000/homework/assign/'+$scope.$parent.session.username
      ).then( function success( response ) {
          console.log("success");
          $scope.homework = response.data;
        }, function error( response ) {
          console.log("error");
          console.log(response);
      });

    };

    $scope.submitHomework = function(id) {
      $location.path('/submit/'+id);
    };

    $scope.getHomework();
  }])
  .controller('SubmitCtrl', ['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams) {
    $scope.homework = {};
    $scope.getHomework = function(id) {
      $http.get(
        'http://168.144.134.38:8000/homework/homework/'+id
      ).then( function success( response ) {
          $scope.homework = response.data;
        }, function error( response ) {
          console.log(response);
      });
    };

    $scope.submitHomework = function() {
      console.log("submit homework" );
      console.log($scope.homework);

      $http.post(
        'http://168.144.134.38:8000/homework/answers/'+$scope.homework.id+"/"+$scope.$parent.session.username,
        $scope.homework
      ).then( function success( response ) {
          console.log("success");
          $location.path('/main');
        }, function error( response ) {
          console.log("error");
          console.log(response);
      });

    };

    $scope.getHomework($routeParams.homeworkid);
  }]);


