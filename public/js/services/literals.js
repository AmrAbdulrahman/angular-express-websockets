var listApp = angular.module('listApp');

listApp.service('literals', function () {
    var literals = {
        ChangelistBuild: 'Changelist / Build',
        Owner: 'Owner',
        TimeStarted: 'Time Started',
        State: 'State',
        Metrics: 'Metrics',
        Build: 'Build',
        UnitTest: 'Unit Test',
        FunctionalTest: 'Functional Test',
        Test: 'Test',
        Maintability: 'Maintability',
        Security: 'Security',
        Workmanship: 'Workmanship',
        Debug: 'Debug',
        Release: 'Release',
        TestsPassed: 'Tests Passed',
        CodeCovered: 'Code Covered',
        Result: 'Result:',
        ChangeAccepted: 'Change Accepted',
        AutoMerged: 'Auto-Merged',
        MergedBuild: 'Merged Build',
        ChangeRejected: 'Change Rejected',
        MetricsReduction: 'Metrics Reduction',
        FindIssues: 'Find Issues',
        Complete: 'Complete',
        Deploy: 'Deploy',
        To: 'to:',
        Production: 'Production',
        Development: 'Development',
        Failed: 'Failed',
        LogFile: 'Log File',
        Running: 'Running',
        Pending: 'Pending',
        Cancelled: 'Cancelled',
        EntryHasAlreadyFailed: '(Entry has already failed)'

    };

    return literals;
});