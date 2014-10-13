
var listApp = angular.module('listApp');

listApp.service('lookups', function () {

    var lookups =
    {
        RowType: {
            Firewall: 'Firewall',
            Build: 'Build'
        },

        BuildStatusType: {
            Pending: 'Pending',
            Running: 'Running',
            Completed: 'Completed',
            Failed: 'Failed'
        },

        FirewallStatusType: {
            Pending: 'Pending',
            Running: 'Running',
            Accepted: 'Accepted',
            Rejected: 'Rejected',
        },

        BoxStatusType: {
            Pending: 'Pending',
            Running: 'Running',
            Completed: 'Completed',
            Failed: 'Failed',
            Cancelled: 'Cancelled'
        }
    }

    return lookups;
});