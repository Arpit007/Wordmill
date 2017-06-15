/**
 * Created by Home Laptop on 15-Jun-17.
 */
'use strict';

var customSlots = require('./customSlots');
var speech = require('./speech');
var genericSpeech = require('./genericSpeech');

var Response ={
    ReplyDefine : function (res, word) {
        if (word.Definitions.length === 0) {
            res.say(speech.NoDefine).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Index = word[customSlots.Slots[0] + "Ptr"] || 0;
            var Result = speech.PrintDefine(word, Index);
            res.say(Result).send();
        }
    },
    
    ReplyExample : function (res, word) {
        var rootIndex = word[customSlots.Slots[0] + "Ptr"] || 0;
        var exIndex = word[customSlots.Slots[1] + "Ptr"] || 0;
        if (word.Definitions.length + 1 < rootIndex ||  word.Definitions[rootIndex].Example.length + 1 < exIndex) {
            res.say(speech.NoneExtra("example")).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        }
        else {
            var Result = word.Definitions[rootIndex].Example[exIndex];
            res.say(Result).send();
        }
    }
};

module.exports = Response;