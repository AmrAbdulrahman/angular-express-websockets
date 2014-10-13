

var listApp = angular.module('listApp');

listApp.directive('popup', function () {

    var directiveDefinition = {

        restrict: 'EA',

        templateUrl: '/../views/popup-template.html'
    };

    return directiveDefinition;

});