
var utils = require("./utils.js");

module.exports = {
	
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
                    SuccessCount: utils.randomInt()+ 10,
                    FailureCount: utils.randomInt()+ 10,
                    TestsPassed: utils.randomInt(),
                    CodeCovered: utils.randomInt()
                },
                FunctionalTest: {
                    Status: functionalTestStatus,
                    Percentage: utils.randomInt(),
                    SuccessCount: utils.randomInt() + 10,
                    FailureCount: utils.randomInt() + 10,
                    TestsPassed: utils.randomInt(),
                    CodeCovered: utils.randomInt()
                }
            }
            return row;
        }
	
};
