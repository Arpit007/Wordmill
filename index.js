/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');

var config = require('./src/config');
var fetchWord = require('./src/fetchWord');
var genericSpeech = require('./src/genericSpeech');
var intents = require('./src/intents');
var customSlots = require('./src/customSlots');
var Response = require('./src/Response');
var wordBase = require('./src/wordBase');

var app = new Alexa.app(appName);
var word = new wordBase.BaseWord();

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});


app.intent('baseOperation', intents.BaseOperation,
    function (req, res) {
        var Word = req.slot('ROOTWORD');
        var Operation = req.slot('OPERATION');
        
        if(Operation)
            Operation=Operation.trim().toLowerCase();
        
        if(Word)
            Word=Word.trim().toLowerCase();
        
        if (_.isEmpty(Operation)) {
            Operation = customSlots.Slots[ 0 ];
        }
        else {
            var tempOp = null;
            for (var op in customSlots.Slots) {
                if (customSlots[customSlots.Slots[ op ]].indexOf(Operation) !== -1) {
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
                console.log('Persistent');
                if (word.RootWord === Word && word.LoadedDefinition &&
                    (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                    return Response.ReplyDefine(res, word);
                }
                else {
                    console.log('Fetch');
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
                    console.log('Persistent');
                    return Response.ReplyExample(res, word);
                }
                else {
                    console.log('Fetch');
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
            //Extras
            else {
                if (word.RootWord === Word && word.LoadedSecondary) {
                    console.log('Persistent');
                    return Response.ReplyExtra(res, word, Operation);
                }
                else {
                    console.log('Fetch');
                    word = new wordBase.BaseWord();
                    word.RootWord = Word;
                    return fetchWord.Extras(word)
                        .then(function (response) {
                            word = response;
                        })
                        .then(function () {
                            return Response.ReplyExtra(res, word, Operation);
                        });
                }
            }
        }
    }
);


module.exports = app;
