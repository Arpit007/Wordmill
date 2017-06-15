/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';
var _ = require('lodash');

var Speech = {
    Welcome : 'Welcome to ${appName}, ask me any word\'s meaning, synonyms, etc.',
    Pardon : 'I couldn\'t get it, please try again',
    Apologize : 'Sorry, please try again.',
    Prompt : 'Ask me any word\'s meaning, synonym, antonym, variants, rhyming words etc.',
    
    PrintWelcome : function () {
        return _.template(this.Welcome)({appName : appName});
    }
};

module.exports = Speech;