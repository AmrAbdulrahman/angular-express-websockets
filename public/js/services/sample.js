var listApp = angular.module('listApp');

listApp.service('sample', ['utils', function (utils) {
    var rowFactory =
    {
        getRow: function (id, type, title, owner, status, metricsStatus, buildStatus, unitTestStatus, functionalTestStatus) {
            var row =
            {
                Id: id,
                Type: type,
                Title: title,
                Owner: owner,
                TimeStarted: new Date(),
                Status: status,
                Metrics: {
                    Status: metricsStatus, // Status is one of [Pending, Running, Completed, Failed]
                    Percentage: utils.randomInt(),
                    Test: utils.randomInt(),
                    Maintability: utils.randomInt(),
                    Security: utils.randomInt(),
                    Workmanship: utils.randomInt()
                },
                Build: {
                    Status: buildStatus,
                    Percentage: utils.randomInt(),
                    Datetime: new Date()
                },
                UnitTest: {
                    Status: unitTestStatus,
                    Percentage: utils.randomInt(),
                    SuccessCount: utils.randomInt(),
                    FailureCount: utils.randomInt(),
                    TestsPassed: utils.randomInt(),
                    CodeCovered: utils.randomInt()
                },
                FunctionalTest: {
                    Status: functionalTestStatus,
                    Percentage: utils.randomInt(),
                    SuccessCount: utils.randomInt(),
                    FailureCount: utils.randomInt(),
                    TestsPassed: utils.randomInt(),
                    CodeCovered: utils.randomInt()
                }
            }
            return row;
        }
    };

    var rowsArray =
    [
        rowFactory.getRow(1, 'Build', 'Tenrox-R1_1235', '', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
        rowFactory.getRow(2, 'Build', 'Tenrox-R1_1236', '', 'Running', 'Completed', 'Running', 'Pending', 'Pending'),
        rowFactory.getRow(3, 'Build', 'Tenrox-R1_1237', '', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed'),
        rowFactory.getRow(4, 'Build', 'Tenrox-R1_1238', '', 'Failed', 'Completed', 'Failed', 'Cancelled', 'Cancelled'),
        rowFactory.getRow(5, 'Firewall', '432462', 'amr', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'),
        rowFactory.getRow(6, 'Firewall', '432463', 'no2a','Running', 'Completed', 'Running', 'Running', 'Pending'),
        rowFactory.getRow(7, 'Firewall', '432464', 'samy','Accepted', 'Completed', 'Completed', 'Completed', 'Completed'),
        rowFactory.getRow(8, 'Firewall', '432465','jtuck', 'Rejected', 'Completed', 'Failed', 'Cancelled', 'Cancelled')
    ]; // end of rows array

    return { list: rowsArray, factory: rowFactory };
} ]);