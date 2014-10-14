(function () {

    var listApp = angular.module('listApp', ['ngAnimate']);

    listApp.controller('listController', ['$scope', '$rootScope', '$animate', '$timeout', 'literals', 'sample', 'lookups', 'socketio', 'websockets', function ($scope, $rootScope, $animate, $timeout, literals, sample, lookups, socketio, websockets) {

        // services
        $scope.rows = [];// sample.list;
        $scope.rowFactory = sample.factory;
        $scope.literals = literals;
        $scope.lookups = lookups;

        // lookups
        $scope.RowType = lookups.RowType;
        $scope.BuildStatusType = lookups.BuildStatusType;
        $scope.FirewallStatusType = lookups.FirewallStatusType;
        $scope.BoxStatusType = lookups.BoxStatusType;

        /*****************************************************************************************
        WebSockets logic 
        *****************************************************************************************/
        // i had to use "web sockets" as i had some problems during deploying my app
        // on "heroku.com", they don't support socket.io
        // however, i've implemented my socket.io event listeners and tested them locally.
        // code of both "web sockets" and "socket.io" are left for interview purposes

        angular.element(document).ready(function () {
            $scope.Log('server is configured to send a new entry every 20 seconds', $scope.LogColor.Yellow);
            $scope.Log('server is configured to update random entry every 3 seconds', $scope.LogColor.Orange);
        });


        $scope.ws = websockets.connect();
        $scope.ws.on('init', function (data) {
            $scope.Log('(websockets) init, list size: ' + data.list.length);
            $scope.InitRows(data.list);
            $scope.$apply();
        });

        $scope.ws.on('new:row', function (data) {
            $scope.Log('(websockets) new:row, Id: ' + data.row.Id, $scope.LogColor.Yellow);
            $scope.AddRow(data.row);
            $scope.$apply();
        });

        $scope.ws.on('update:row', function (data) {
            $scope.Log('(websockets) update:row, Id: ' + data.row.Id + ' ' + data.msg, $scope.LogColor.Orange);
            $scope.UpdateRow(data.row);
            $scope.$apply();
        });


        /*****************************************************************************************
        Socket.io logic 
        *****************************************************************************************/
        socket = socketio.connect();

        socket.on('init', function (data) {
            $scope.Log('(sockets.io) init');
            $scope.InitRows(data.list);
            $scope.$apply();
        });

        socket.on('new:row', function (data) {
            $scope.Log('(sockets.io) new:row, Id: ' + data.row.Id);
            $scope.AddRow(data.row);
            $scope.$apply();
        });

        socket.on('update:row', function (data) {

            $scope.Log('(sockets.io) update:row: ' + data.row.Id);
            $scope.UpdateRow(data.row);
            $scope.$apply();
        });

        /*****************************************************************************************
        Data manipulation 
        *****************************************************************************************/
        $scope.InitRows = function (rows) {
            for (var i = 0; i < rows.length; i++) {
                $scope.rows.push(rows[i]);
            }
        }

        $scope.AddRow = function (row) {
            // insert at top
            $scope.rows.splice(0, 0, row);

            // push it down
            if ($scope.currentActiveRow != -1)
                $scope.currentActiveRow++;
        }

        $scope.UpdateRow = function (row) {
            var rowIndex = $scope.GetRowIndexById(row.Id);

            if (rowIndex == -1) {
                $scope.Log('Oops! updating row that is not even exist!');
                return;
            }

            var dest = $scope.rows[rowIndex];

            for (key in row) {
                if (row.hasOwnProperty(key) && dest.hasOwnProperty(key))
                    dest[key] = row[key];
            }
        }

        $scope.GetRowIndexById = function (rowId) {
            for (var rowIndex = 0; rowIndex < $scope.rows.length; rowIndex++) {
                if ($scope.rows[rowIndex].Id == rowId)
                    return rowIndex;
            }
            return -1;
        }


        /*****************************************************************************************
        Logging
        *****************************************************************************************/
        $scope.LogColor = { Yellow: 'yellow', Orange: 'orange' };
        $scope.logs = [];
        $scope.Log = function (message, color) {
            console.log(color);

            if (color == undefined) {
                console.log('undef');
                color = 'white';
            }

            console.log(color);

            $scope.logs.splice(0, 0, { counter: $scope.logs.length + 1, time: new Date(), message: message, color: color });
        }

        /*****************************************************************************************
        Color CSS classes
        *****************************************************************************************/
        $scope.IsPending = function (row) {
            if (row.Type == $scope.RowType.Build)
                return row.Status == $scope.BuildStatusType.Pending;
            else // Firewall
                return row.Status == $scope.FirewallStatusType.Pending;
        }

        $scope.IsRunning = function (row) {
            if (row.Type == $scope.RowType.Build)
                return row.Status == $scope.BuildStatusType.Running;
            else
                return row.Status == $scope.FirewallStatusType.Running;
        }

        $scope.IsCompleted = function (row) {
            if (row.Type == $scope.RowType.Build)
                return row.Status == $scope.BuildStatusType.Completed;
            else
                return row.Status == $scope.FirewallStatusType.Accepted;
        }

        $scope.IsFailed = function (row) {
            if (row.Type == $scope.RowType.Build)
                return row.Status == $scope.BuildStatusType.Failed;
            else
                return row.Status == $scope.FirewallStatusType.Rejected;
        }

        /*****************************************************************************************
        Row icon CSS classes
        *****************************************************************************************/
        // Firewall
        $scope.IsPendingFirewall = function (row) {
            return row.Type == $scope.RowType.Firewall && row.Status == $scope.FirewallStatusType.Pending;
        }

        $scope.IsRunningFirewall = function (row) {
            return row.Type == $scope.RowType.Firewall && row.Status == $scope.FirewallStatusType.Running;
        }

        $scope.IsCompletedFirewall = function (row) {
            return row.Type == $scope.RowType.Firewall && row.Status == $scope.FirewallStatusType.Accepted;
        }

        $scope.IsFailedFirewall = function (row) {
            return row.Type == $scope.RowType.Firewall && row.Status == $scope.FirewallStatusType.Rejected;
        }

        // Build
        $scope.IsPendingBuild = function (row) {
            return row.Type == $scope.RowType.Build && row.Status == $scope.BuildStatusType.Pending;
        }

        $scope.IsRunningBuild = function (row) {
            return row.Type == $scope.RowType.Build && row.Status == $scope.BuildStatusType.Running;
        }

        $scope.IsCompletedBuild = function (row) {
            return row.Type == $scope.RowType.Build && row.Status == $scope.BuildStatusType.Completed;
        }

        $scope.IsFailedBuild = function (row) {
            return row.Type == $scope.RowType.Build && row.Status == $scope.BuildStatusType.Failed;
        }

        // Progressbar CSS classes
        $scope.IsPendingProgressBar = function (box) {
            return box.Status == $scope.BoxStatusType.Pending;
        }

        $scope.IsCompletedProgressBar = function (box) {
            return box.Status == $scope.BoxStatusType.Completed;
        }

        $scope.IsFailedProgressBar = function (box, caller) {
            return box.Status == $scope.BoxStatusType.Failed;
        }

        // activate current tab to show/hide header progressbars
        $scope.currentActiveRow = -1;
        $scope.Activate = function (index) {
            // close row, by clicking on it, not by openning another row
            if (index == $scope.currentActiveRow) {
                $scope.currentActiveRow = -1;
                $scope.rows[index].active = false;
                return;
            }

            $scope.currentActiveRow = index;

            for (var i = 0; i < $scope.rows.length; i++)
                if (i == index)
                    $scope.rows[i].active = true;
                else
                    $scope.rows[i].active = false;
        }

        $scope.ShowPopup = function (index) {
            $('#PopupViewTemplate').html("Popup with row index: " + index);
            $('#PopupViewTemplate').bPopup();
        }


        ///////////////////////////////// testing ////////////////////////////////////////



        // for testing purposes only
        $scope.PullNewRow = function () {
            console.log('client: um pulling...');
            socket.emit('pull:row', {});
        }

        // add client side row
        $scope.AddNewRow = function () {
            var randomIndex = parseInt(Math.random() * 100) % $scope.rows.length;
            var newRow = $scope.rowFactory.getRow(0, '', '', '', '', '', '', '', '');
            $scope.copy(newRow, $scope.rows[randomIndex]);
            $scope.rows.splice(0, 0, newRow);

            if ($scope.currentActiveRow != -1)
                $scope.currentActiveRow++;
        }

        // change build row status
        $scope.ChangeRowStatus_Build = function () {

            var index = parseInt($scope.indexToBeChanged_Build);

            if (isNaN(index) || index < 0 || index >= $scope.rows.length)
                return;


            if ($scope.newBuildStatus == undefined)
                return;

            if ($scope.rows[index].Type != $scope.RowType.Build)
                return;

            $scope.rows[index].Status = $scope.newBuildStatus;
        }

        // change firewall row type 
        $scope.ChangeRowStatus_Firewall = function () {

            var index = parseInt($scope.indexToBeChanged_Firewall);

            if (isNaN(index) || index < 0 || index >= $scope.rows.length)
                return;

            if ($scope.newFirewallStatus == undefined)
                return;

            if ($scope.rows[index].Type != $scope.RowType.Firewall)
                return;

            $scope.rows[index].Status = $scope.newFirewallStatus;
        }

        $scope.TestProgressbar = function () {
            $scope.rows[1].Build.Percentage += 10;
        }

        $scope.TestChart = function () {
            $scope.rows[2].UnitTest.SuccessCount += 10;
        }


    } ]); // end of controller


})();                                                          // wrapper