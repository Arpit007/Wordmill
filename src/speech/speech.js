/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

module.change_code = 1;

var _ = require('lodash');
var SSML = require('ssml-builder');

var Speech = {
    NoWord : 'Please specify the word',
    
    Synonyms : 'synonym',
    Antonyms : 'antonym',
    Hypernyms : 'hypernym',
    Opposites : 'opposite word',
    Variants : 'variant',
    Rhyming : 'rhyming word',
    
    PrintNoDefine : function (Word) {
        return new SSML().say('Sorry,').pauseByStrength('strong').say('I couldn\'t find its meaning').ssml();
    },
    
    PrintDefine : function (Word, Index) {
        return new SSML().say('The word').emphasis('strong', Word.RootWord).say('means').pauseByStrength('strong')
            .prosody({rate:'90%'},Word.Definitions[Index].Meaning).ssml();
    },
    
    PrintDefineWithType : function (Word, Index) {
        return new SSML().say('As').emphasis('strong',Word.Definitions[Index].PartOfSpeech).say('the word')
            .emphasis('strong', Word.RootWord).say('means').pauseByStrength('strong')
            .prosody({rate:'90%'},Word.Definitions[Index].Meaning).ssml();
    },
    
    PrintNoneExtra : function (Extra) {
        return new SSML().say('Sorry,').pauseByStrength('strong').say('I couldn\'t find its ' + Extra).ssml();
    },
    
    PrintSingleExtra : function (Word, Extras, Extra) {
        return new SSML().say(Extras + ' of ' + Word.RootWord + ' is').emphasis('strong', Extra).ssml();
    },
    
    PrintMultiExtras : function (Word, Extra, Extras) {
        var Words = Extras.slice(0, Extras.length - 1).join(', ');
        var LastWord = Extras[ Extras.length - 1 ];
        return new SSML().say(Extra + ' of ' + Word.RootWord + ' are').prosody({rate:'85%'},Words).say('and')
            .prosody({rate:'85%'},LastWord).ssml();
    },
    
    PrintMultiExtrasWithLimit : function (Word, Extra, Extras, Limit) {
        var Words = Extras.slice(0, Limit).join(', ');
        var Count = Extras.length - Limit;
        return new SSML().say(Extra + ' of ' + Word.RootWord + ' are').prosody({rate:'85%'},Words).say('and')
            .emphasis('strong', Count).say('more').ssml();
    }
};


module.exports = Speech;