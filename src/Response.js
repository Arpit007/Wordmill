/**
 * Created by Home Laptop on 15-Jun-17.
 */
'use strict';

var _ = require('lodash');
var SSML = require('ssml-builder');

var customSlots = require('./speech/customSlots');
var speech = require('./speech/speech');
var genericSpeech = require('./speech/genericSpeech');

var Response ={
    ReplyDefine : function (res, word) {
        if (word.Definitions.length === 0) {
            res.say(speech.PrintNoDefine(word)).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        }
        else {
            var Index = word[customSlots.baseSlots[0] + "Ptr"] || 0;
            res.PersistentSay(speech.PrintDefine(word, Index)).shouldEndSession(false);
            res.card({
                type: "Simple",
                title: _.capitalize(word.RootWord),
                content: word.Definitions[Index].Meaning
            });
        }
    },
    
    ReplyExample : function (res, word) {
        var rootIndex = word[customSlots.baseSlots[0] + "Ptr"] || 0;
        if (word.Definitions.length + 1 < rootIndex ||  word.Definitions[rootIndex].Example.length === 0) {
            res.say(speech.PrintNoneExtra("example")).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        }
        else {
            var speak = new SSML();
            speak.say('It\'s example is');
            speak.paragraph(word.Definitions[rootIndex].Example[0]);
            
            res.PersistentSay(speak.ssml()).shouldEndSession(false);
            res.card({
                type: "Simple",
                title: _.capitalize(word.RootWord) + '\n Example',
                content:word.Definitions[rootIndex].Example[0]
            });
        }
    },
    
    ReplyExtra : function (res, word, Extra) {
        var Extras = word[Extra];
        if (Extras.length === 0){
            res.say(speech.PrintNoneExtra(Extra.substr(0,Extra.length - 1))).shouldEndSession(false);
        }
        else if (Extras.length === 1){
            res.PersistentSay(speech.PrintSingleExtra(word, Extra.substr(0,Extra.length - 1), Extras[0])).shouldEndSession(false);
        }
        else if (Extras.length === 2){
            res.PersistentSay(speech.PrintMultiExtras(word, Extra, Extras)).shouldEndSession(false);
        }
        else {
            res.PersistentSay(speech.PrintMultiExtrasWithLimit(word, Extra, Extras, 2)).shouldEndSession(false);
        }
        res.card({
            type: "Simple",
            title: _.capitalize(word.RootWord) + '\n' + Extra.substr(0,Extra.length - 1),
            content:Extras.slice(0, Extras.length - 1).join(', ')
        });
    },
    
    PrintMultiExamples : function (res, Word) {
        var Index = Word[customSlots.baseSlots[0] + "Ptr"] || 0;
    
        if (Word.Definitions[Index].Example.length === 0) {
            return res.say(speech.PrintNoneExtra("examples")).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        }
        
        res.card({
            type: "Simple",
            title: _.capitalize(Word.RootWord) + '\n Examples',
            content:Word.Definitions[Index].Example.join('\n')
        });
    
        var speak = new SSML();
        
        if (Word.Definitions[Index].Example.length === 1)
            speak.say('It\'s example is');
        else
            speak.say('It\'s examples are');
    
        for (var i in Word.Definitions[Index].Example){
            speak.paragraph(Word.Definitions[Index].Example[i]);
            speak.pauseByStrength('medium');
        }
        
        res.PersistentSay(speak.ssml()).shouldEndSession(false);
    },
    
    PrintMultiExtras : function (res, word, Operation) {
        var Extras = word[Operation];
        if (Extras.length === 0){
            return res.say(speech.PrintNoneExtra(Extra)).shouldEndSession(false);
        }
    
        res.card({
            type: "Simple",
            title: _.capitalize(word.RootWord) + '\n' + Operation,
            content:word[Operation].join('\n')
        });
        
        return res.PersistentSay(speech.PrintMultiExtras(word, Operation, word[Operation])).shouldEndSession(false);
    },
    
    PrintMultiDefinitions : function (res, Word) {
        if (Word.Definitions.length === 0) {
            return res.say(speech.PrintNoDefine(Word)).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        }
        
        var speak = new SSML();
        speak.say('Definitions of ' + Word.RootWord +' are');
        for (var i in Word.Definitions){
            if (Word.Definitions[i].Meaning) {
                speak.paragraph(Word.Definitions[ i ].Meaning);
                speak.pauseByStrength('medium');
            }
        }
        return res.PersistentSay(speak.ssml()).shouldEndSession(false);
    }
};

module.exports = Response;