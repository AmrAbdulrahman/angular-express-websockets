

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

            $scope.initialized = false;

            var timer = $timeout(function () {
                var innerElem = $("#templateID", element);
                var statusValue = innerElem.attr("status");
                var percentageValue = parseInt(innerElem.attr("percentage"));

                // get attribute and set value
                innerElem.progressbar({ value: percentageValue });

                $scope.initialized = true;
            });


            $scope.$on("$destroy", function (event) {
                if ($scope.initialized) {
                    $timeout.cancel(timer);
                    $("#templateID", element).progressbar("destroy");
                }
            });
        }
    };

    return directiveDefinition;

} ]);