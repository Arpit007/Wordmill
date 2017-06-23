/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var SSML = require('ssml-builder');

var Speech = {
    Help : 'Ask me a word\'s meaning, its examples, synonyms, hypernyms, antonyms, variants & rhyming words.'
    + ' To know the word\'s other meanings, ask me for the next meaning.'
    + ' To get all information about a particular detail, ask me the same.',
    GoodBye : 'Good-bye.',
    More : 'Ask me any dictionary tasks, or say goodbye',
    
    PrintWelcome : function () {
        return new SSML().say('Welcome to ' + appName).pauseByStrength('strong').say('your smart dictionary.')
            .paragraph('Ask me any word\'s meaning, synonym, etc.').ssml();
    },
    PrintPardon : function () {
        return new SSML().say('Sorry').pauseByStrength('strong').say('please try again').ssml();
    },
    PrintPrompt : function () {
        return new SSML().paragraph('Ask me any word\'s meaning, synonym, hypernym, antonym, variants, rhyming words etc.').ssml();
    },
    PrintHelp : function () {
        return new SSML().paragraph(this.Help).ssml();
    }
};

module.exports = Speech;