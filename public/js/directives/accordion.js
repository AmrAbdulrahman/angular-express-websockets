
var listApp = angular.module('listApp');

listApp.directive('accordion', ['$timeout', function ($timeout) {

    var directiveDefinition = {

        restrict: 'EA',

        scope:
        {
            rowsCount: '=',
            currentActiveRowIndex: '='
        },

        link: function ($scope, element, attrs) { //DOM manipulation

            $scope.initialized = false;

            $scope.$watch(function () { return $(element).attr('rowsCount') }, function (newValue) {

                if ($scope.initialized) {

                    var headerSelector = $(element).attr("headerSelector");

                    var currentActiveRowIndex = parseInt($(element).attr("currentActiveRowIndex"));

                    if (currentActiveRowIndex == -1)
                        currentActiveRowIndex = false;

                    $(element).accordion('destroy').accordion({
                        header: headerSelector,
                        collapsible: true,
                        active: currentActiveRowIndex,
                        animate: 150
                    });
                }
            });

            var timer = $timeout(function () {
                var headerSelector = $(element).attr("headerSelector");

                $(element).accordion({
                    header: headerSelector,
                    collapsible: true,
                    active: false,
                    animate: 150
                });

                $scope.initialized = true;
            });

            $scope.$on("$destroy", function (event) {
                if ($scope.initialized) {
                    $timeout.cancel(timer);
                    $(element).accordion('destroy');
                }
            });


        }
    };

    return directiveDefinition;

} ]);