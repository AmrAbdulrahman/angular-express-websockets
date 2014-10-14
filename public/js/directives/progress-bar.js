

var listApp = angular.module('listApp');

listApp.directive('progressBar', ['$timeout', 'lookups', function ($timeout, lookups) {




    function getStatusClass(status) {

        if (status == lookups.BoxStatusType.Pending || status == lookups.BoxStatusType.Cancelled) // same same
            return "PendingProgressBar";
        if (status == lookups.BoxStatusType.Completed)
            return "CompletedProgressBar";
        if (status == lookups.BoxStatusType.Failed)
            return "FailedProgressBar";
    }

    var directiveDefinition = {

        restrict: 'EA',

        scope:
        {
            row: '=',
            status: '=',
            percentage: '='
        },

        templateUrl: '/../views/progress-bar-template.html',

        link: function ($scope, element, attrs) { //DOM manipulation

            $scope.initialized = false;

            var innerElem = $("#templateID", element);

            $scope.$watch(function () { return $(innerElem).attr('status') }, function (newValue) {
                if ($scope.initialized) {
                    $scope.updateMe();
                }
            });

            $scope.$watch(function () { return $(innerElem).attr('percentage') }, function (newValue) {
                if ($scope.initialized) {
                    $scope.updateMe();
                }
            });


            $scope.updateMe = function () {
                innerElem.removeClass("PendingProgressBar");
                innerElem.removeClass("CompletedProgressBar");
                innerElem.removeClass("FailedProgressBar");

                var statusValue = innerElem.attr("status");
                var percentageValue = parseInt(innerElem.attr("percentage"));

                // get attribute and set value
                innerElem.progressbar({ value: percentageValue });

                // handle 'done', 'failed' and 'pending' cases
                if (statusValue != lookups.BoxStatusType.Running) {

                    // unfortunately, jq-ui defines the progressbar style by inline 'width'
                    // remove jq-ui element style, because it overrides css styling
                    innerElem.children(".ui-progressbar-value").removeAttr("style");
                }

                // get the status and bind corresponding css class
                var status = statusValue;
                var statusCssClass = getStatusClass(status);
                innerElem.addClass(statusCssClass);
            }

            var timer = $timeout(function () {
                var statusValue = innerElem.attr("status");
                var percentageValue = parseInt(innerElem.attr("percentage"));

                // get attribute and set value
                innerElem.progressbar({ value: percentageValue });


                // handle 'done', 'failed' and 'pending' cases
                if (statusValue != lookups.BoxStatusType.Running) {
                    // unfortunately, jq-ui defines the progressbar style by inline 'width'
                    // remove jq-ui element style, because it overrides css styling
                    innerElem.children(".ui-progressbar-value").removeAttr("style");
                }

                // get the status and bind corresponding css class
                var status = statusValue;
                var statusCssClass = getStatusClass(status);
                innerElem.addClass(statusCssClass);

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

}



]);