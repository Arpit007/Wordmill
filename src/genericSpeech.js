/**
 * Created by Home Laptop on 12-Jun-17.
 */
var _ = require('lodash');

var Speech = {
    Welcome : 'Welcome to ${appName}, how can I help you today',
    Pardon : 'I couldn\'t get it, please say that again',
    
    PrintWelcome : function () {
        return _.template(this.Welcome)({appName:appName});
    }
};

module.exports = Speech;