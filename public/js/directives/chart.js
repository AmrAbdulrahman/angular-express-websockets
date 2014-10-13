

var listApp = angular.module('listApp');

listApp.directive('chart', ['$timeout', function ($timeout) {

    var directiveDefinition = {

        restrict: 'EA',

        scope:
        {
            successcount: '=successcount',
            failurecount: '=failurecount'
        },

        templateUrl: '/../views/chart-template.html',

        link: function ($scope, element, attrs) { //DOM manipulation

            $scope.initialized = false;
            var innerElem = $("#templateID", element);

            $scope.$watch(function () { return $(innerElem).attr('successCount') }, function (newValue) {
                if ($scope.initialized) {
                    $scope.updateMe();
                }
            });

            $scope.$watch(function () { return $(innerElem).attr('failureCount') }, function (newValue) {
                if ($scope.initialized) {
                    $scope.updateMe();
                }
            });

            $scope.updateMe = function () {
                var successCount = parseInt(innerElem.attr("successCount"));
                var failureCount = parseInt(innerElem.attr("failureCount"));

                $scope.chartId.segments[0].value = failureCount;
                $scope.chartId.segments[1].value = successCount;
                $scope.chartId.update();
            }

            $timeout(function () {
                var successCount = parseInt(innerElem.attr("successCount"));
                var failureCount = parseInt(innerElem.attr("failureCount"));
            

                var pieData = [
				    {
				        value: failureCount,
				        color: "#ED7D31",
				        highlight: "#ED7D31",
				        label: "Failed"
				    },
				    {
				        value: successCount,
				        color: "#70AD47",
				        highlight: "#70AD47",
				        label: "Success"
				    }
                ];

                var ctx = innerElem[0].getContext("2d");
                var chartId_ = new Chart(ctx).Pie(pieData);

                $scope.chartId = chartId_;
                $scope.initialized = true;
            });
        }
    };

    return directiveDefinition;

}

]);