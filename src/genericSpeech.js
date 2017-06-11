/**
 * Created by Home Laptop on 12-Jun-17.
 */
var _ = require('lodash');

var Speech = {
    Welcome : 'Welcome to ${appName}, how can I help you today',
    
    PrintWelcome : function () {
        return _.template(this.Welcome)({appName:appName});
    }
};

module.exports = Speech;