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
            res.PersistentSay(speech.PrintNoDefine(word)).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Index = word[customSlots.baseSlots[0] + "Ptr"] || 0;
            var Result = speech.PrintDefine(word, Index);
            res.PersistentSay(Result).send();
        }
    },
    
    ReplyExample : function (res, word) {
        var rootIndex = word[customSlots.baseSlots[0] + "Ptr"] || 0;
        if (word.Definitions.length + 1 < rootIndex ||  word.Definitions[rootIndex].Example.length === 0) {
            res.PersistentSay(speech.NoneExtra("example")).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Result = word.Definitions[rootIndex].Example[0];
            res.PersistentSay(Result).send();
        }
    },
    
    ReplyExtra : function (res, word, Extra) {
        var Extras = word[Extra];
        if (Extras.length === 0){
            res.PersistentSay(speech.PrintNoneExtra(Extra.substr(0,Extra.length - 1))).shouldEndSession(false);
        }
        else if (Extras.length === 1){
            res.PersistentSay(speech.PrintSingleExtra(Extra.substr(0,Extra.length - 1), Extras[0])).shouldEndSession(false);
        }
        else if (Extras.length === 2){
            res.PersistentSay(speech.PrintMultiExtras(Extra, Extras)).shouldEndSession(false);
        }
        else {
            res.PersistentSay(speech.PrintMultiExtrasWithLimit(Extra, Extras, 2)).shouldEndSession(false);
        }
    },
    
    PrintMultiExamples : function (Word) {
        var Index = Word[customSlots.baseSlots[0] + "Ptr"] || 0;
        return Word.Definitions[Index].Example.join(', ');
    },
};

module.exports = Response;