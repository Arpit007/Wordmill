/**
 * Created by Home Laptop on 15-Jun-17.
 */
'use strict';

var customSlots = require('./speech/customSlots');
var speech = require('./speech/speech');
var genericSpeech = require('./speech/genericSpeech');

var Response ={
    ReplyDefine : function (res, word) {
        if (word.Definitions.length === 0) {
            res.say(speech.PrintNoDefine(word)).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Index = word[customSlots.baseSlots[0] + "Ptr"] || 0;
            var Result = speech.PrintDefine(word, Index);
            res.say(Result).send();
        }
    },
    
    ReplyExample : function (res, word) {
        var rootIndex = word[customSlots.baseSlots[0] + "Ptr"] || 0;
        if (word.Definitions.length + 1 < rootIndex ||  word.Definitions[rootIndex].Example.length === 0) {
            res.say(speech.NoneExtra("example")).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Result = word.Definitions[rootIndex].Example[0];
            res.say(Result).send();
        }
    },
    
    ReplyExtra : function (res, word, Extra) {
        var Extras = word[Extra];
        if (Extras.length === 0){
            res.say(speech.PrintNoneExtra(Extra.substr(0,Extra.length - 1))).shouldEndSession(false);
        }
        else if (Extras.length === 1){
            res.say(speech.PrintSingleExtra(Extra.substr(0,Extra.length - 1), Extras[0])).shouldEndSession(false);
        }
        else if (Extras.length === 2){
            res.say(speech.PrintMultiExtras(Extra, Extras)).shouldEndSession(false);
        }
        else {
            res.say(speech.PrintMultiExtrasWithLimit(Extra, Extras, 2)).shouldEndSession(false);
        }
    }
};

module.exports = Response;