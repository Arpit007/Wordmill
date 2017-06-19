/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var _ = require('lodash');
var SSML = require('ssml-builder');

var Speech = {
    Help : 'Ask me a word\'s meaning, its examples, synonyms, hypernyms, antonyms, variants & rhyming words.'
    + ' To know the word\'s other meanings, ask me for the next meaning.'
    + ' To get all information about a particular detail, ask me the same.',
    
    PrintWelcome : function () {
        return new SSML().say('Welcome to ' + appName).pauseByStrength('strong').say('your smart dictionary.').ssml();
    },
    PrintPardon : function () {
        return new SSML().say('Sorry').pauseByStrength('strong').say('please try again').ssml();
    },
    PrintPrompt : function () {
        return new SSML().paragraph('Ask me any word\'s meaning, synonym, antonym, variants, rhyming words etc.').ssml();
    },
    PrintHelp : function () {
        return new SSML().paragraph(this.Help).ssml();
    }
};

module.exports = Speech;