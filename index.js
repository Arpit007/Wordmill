/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');

var config = require('./src/config');
var fetchWord = require('./src/fetchWord');
var speech = require('./src/speech');
var genericSpeech = require('./src/genericSpeech');
var intents = require('./src/intents');
var customSlots = require('./src/customSlots');
var Response = require('./src/Response');

var app = new Alexa.app(appName);
var wordBase = require('./src/wordBase');
var word = new wordBase.BaseWord();

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});


app.intent('baseOperation', intents.BaseOperation,
    function (req, res) {
        var Word = req.slot('ROOTWORD').trim().toLowerCase();
        var Operation = req.slot('CUSTOM_OPERATIONS').trim().toLowerCase();
        
        if (_.isEmpty(Operation)) {
            Operation = customSlots.Slots[ 0 ];
        }
        else {
            var tempOp = null;
            for (var op in customSlots.Slots) {
                if (customSlots.Slots[ op ].indexOf(Operation) !== -1) {
                    tempOp = customSlots.Slots[ op ];
                    break;
                }
            }
            if (tempOp) {
                Operation = tempOp;
            }
            else {
                res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
                return;
            }
        }
        
        if (_.isEmpty(Word)) {
            res.say(genericSpeech.Pardon).reprompt(genericSpeech.Prompt).shouldEndSession(false);
            return true;
        } else {
            //Define
            if (Operation === customSlots.Slots[ 0 ]) {
                if (word.RootWord === Word && word.LoadedDefinition &&
                    (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                    return Response.ReplyDefine(res, word);
                }
                else {
                    word = new wordBase.BaseWord();
                    word.RootWord = Word;
                    return fetchWord.Define(word)
                        .then(function (response) {
                            word = response;
                        })
                        .then(function () {
                            return Response.ReplyDefine(res, word);
                        });
                }
            }
            //Example
            else if (Operation === customSlots.Slots[ 1 ]) {
                if (word.RootWord === Word && word.LoadedDefinition &&
                    (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                    return Response.ReplyExample(res, word);
                }
                else {
                    word = new wordBase.BaseWord();
                    word.RootWord = Word;
                    return fetchWord.Define(word)
                        .then(function (response) {
                            word = response;
                        })
                        .then(function () {
                            return Response.ReplyExample(res, word);
                        });
                }
            }
            else {
            
            }
        }
    }
);


module.exports = app;
