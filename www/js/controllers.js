'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

  /**
   * Home Controllers
   * For main index screen.
   * partial - home.html
   */
  controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.login = function() {
      $location.path('/login');
    };
    $scope.register = function() {
      $location.path('/register');
    };

  }])

  /**
   * Body Controllers
   * Parent controller to contain user and session data once logged in.
   * partial - NONE, from index.html
   */
  .controller('BodyCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.session = { username: '', usertype: '', name: '' };

    // Returns true of logged in user has usertype of Teacher
    $scope.isTeacher = function() {
      if( $scope.session.usertype == 'Teacher' ) {
        return true;
      }
      return false;
    };

    // Returns true of logged in user has usertype of Student
    $scope.isStudent = function() {
      if( $scope.session.usertype == 'Student' ) {
        return true;
      }
      return false;
    };
    
    
    // Calls logout view, clears session data. Set path to home index
    $scope.logout = function() {
      $scope.session = { username: '', usertype: '', name: '' };
      $http.post( 'http://168.144.134.38:8000/homework/logout/' );
      $location.path('/home/');
    };

  }])
  
  
  /**
   * Registration Controllers
   * For registration page.
   * partial - register.html
   */
  .controller('RegCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.newuser = {name: '', username: '', usertype: '', password: ''};

    // Check Registration for required fields
    // Call register view
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
  
  
  /**
   * Login Controllers
   * For Login page.
   * partial - login.html
   */
  .controller('LoginCtrl', ['$scope','$http','$location','$cookies',function($scope,$http,$location,$cookies) {
    $scope.creds = { username: '', password: '' };

    // Call login view
    // If successful, set session in parent (BodyCtrl) controller
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
  
  
  /**
   * Main Controllers
   * For main page once logged in.
   * partial - main.html
   */
  .controller('MainCtrl', ['$scope','$http','$cookies','$location',function($scope,$http,$cookies,$location) {
    $scope.user = {};

    // Return true if user has usertype of Teacher
    $scope.isTeacher = function() {
      if( $scope.user == {} ) {
        return false;
      }
      if( $scope.user.usertype == 'Teacher' ) {
        return true;
      }
      return false;
    };

    // Returns true if user has usertype of Student
    $scope.isStudent = function() {
      if( $scope.user == {} ) {
        return false;
      }
      if( $scope.user.usertype == 'Student' ) {
        return true;
      }
      return false;
    };

    // Sets user data from parent session data.
    // If no username in session, redirect to index
    $scope.getUser = function() {
      $scope.user = $scope.$parent.session;

      if($scope.user.username == '') {
        $location.path('/home');
      }
    };

    $scope.getUser();
  }])

  /**
   * Create Homework Controllers
   * For create homework screen.
   * partial - createhomework.html
   */
  .controller('CreateHomeworkCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.homework = { title: '', question: '', duedate: '' };

    // Validate create homework fields
    // Call homework view to create new Homework
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
  
  /**
   * Assign Homework Controllers
   * For homework assignment screen.
   * partial - assignhomework.html
   */
  .controller('AssignHomeworkCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.homework = [];
    $scope.students = [];
    $scope.selectedStudents = {};
    $scope.selectedHomework = '';

    // Get all homework from homework view
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

    // Get all students from Students view
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

    // Select student for assignment
    // Or unselect student if already selected
    $scope.selectStudent = function(student) {
      if( $scope.selectedStudents.hasOwnProperty( student ) ) {
        delete $scope.selectedStudents[student];
      } else {
        $scope.selectedStudents[student] = true;
      }
    };

    // Set selected homwork
    $scope.selectHomework = function(homework) {
      $scope.selectedHomework = homework;
    };

    // returns true if this homework is selected
    $scope.homeworkSelected = function(id) {
      return( $scope.selectedHomework == id )
    };
    
    // returns true if this student is amongst those selected
    $scope.studentSelected = function(id) {
      return $scope.selectedStudents.hasOwnProperty(id);
    };

    // Validate assignment data
    // Call assign view to create new assignment
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
  
  
  /**
   * List Homework Controllers
   * For homework list screen.
   * partial - listhomework.html
   */
  .controller('ListHomeworkCtrl', ['$scope','$location','$http',function($scope,$location,$http) {
    $scope.homework = [];

    // Get all homework
    $scope.getHomework = function() {
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

    // redirect to showhomework for single homework
    $scope.showHomework = function(id) {
      $location.path('/showhomework/'+id);
    };

    $scope.getHomework();

  }])
  
  
  /**
   * Show Homework Controllers
   * For list of answers for a given Homework
   * partial - showhomework.html
   */
  .controller('ShowHomeworkCtrl', ['$scope','$location','$http','$routeParams',function($scope,$location,$http,$routeParams) {
    $scope.homework = [];
    $scope.homeworkId = '';
    
    // Get most recent answer per student for a given homework
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
    
    // If clicked, redirect to show all answers for a given homework by a given user
    $scope.showAllHomework = function(username) {
      $location.path('/showanswers/'+$scope.homeworkId+"/"+username);
    };

    $scope.getHomework($routeParams.homeworkid);
  }])
  
  
  /**
   * Show Answers Controllers
   * Shows all answers to a given homework by a given user
   * partial - showanswers.html
   */
  .controller('ShowAnswersCtrl', ['$scope','$http','$routeParams',function($scope,$http,$routeParams) {
    $scope.homework = {};

    // Show all answers to a given homework by a given user
    // Calls answers view with homeworkid and username
    $scope.showAnswers = function(homeworkId,userName) {
      console.log("show answers ctrl");
      // assuming all answers for id
      $http.get(
        'http://168.144.134.38:8000/homework/answers/'+homeworkId+'/'+userName
      ).then( function success( response ) {
          $scope.homework = response.data[0].homeworkId;
          $scope.homework.answers = response.data;
          $scope.homework.userid = response.data[0].userid;

          // fix date to only show date/time without microseconds
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
  
  
  /**
   * My Homework Controllers
   * List of Homework assigned to User
   * partial - myhomework.html
   */
  .controller('MyHomeworkCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
    $scope.homework = [];

    // Get all assignments for user
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

    // redirect to submit page for given homework
    $scope.submitHomework = function(id) {
      $location.path('/submit/'+id);
    };

    $scope.getHomework();
  }])
  
  
  /**
   * Submit Controllers
   * Submit Answers to Homework for User
   * partial - submit.html
   */
  .controller('SubmitCtrl', ['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams) {
    $scope.homework = {};
    
    // Get homework by homework id
    // calls homework view
    $scope.getHomework = function(id) {
      $http.get(
        'http://168.144.134.38:8000/homework/homework/'+id
      ).then( function success( response ) {
          $scope.homework = response.data;
        }, function error( response ) {
          console.log(response);
      });
    };

    // creates answer to homework for user
    // calls answers view
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


