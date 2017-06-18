/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var _ = require('lodash');

var Speech = {
    Welcome : 'Welcome to ${appName}, your smart dictionary.',
    Pardon : 'I couldn\'t get it, please try again',
    Apologize : 'Sorry, please try again.',
    Prompt : 'Ask me any word\'s meaning, synonym, antonym, variants, rhyming words etc.',
    Help : 'Ask me a word\'s meaning, its examples, synonyms, hypernyms, antonyms, variants & rhyming words.'
    + ' To know the word\'s other meanings, ask me for the next meaning.'
    + ' To get all information about a particular detail, ask me the same.',
    
    PrintWelcome : function () {
        return _.template(this.Welcome)({ appName : appName });
    }
};

module.exports = Speech;