

var listApp = angular.module('listApp');

listApp.directive('largeProgressBar', ['$timeout', 'lookups', function ($timeout, lookups) {

    var directiveDefinition = {

        restrict: 'EA',

        scope:
        {
            row: '=',
            percentage: '='
        },

        templateUrl: '/../views/large-progress-bar-template.html',

        link: function ($scope, element, attrs) { //DOM manipulation

            $timeout(function () {
                var innerElem = $("#templateID", element);
                var statusValue = innerElem.attr("status");
                var percentageValue = parseInt(innerElem.attr("percentage"));

                // get attribute and set value
                innerElem.progressbar({ value: percentageValue });
            });
        }
    };

    return directiveDefinition;

} ]);