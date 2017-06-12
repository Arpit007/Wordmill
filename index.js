/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var config = require('./src/config');


var _ = require('lodash');
var Alexa = require('alexa-app');
var fetchWord = require('./src/fetchWord');
var speech = require('./src/speech');
var genericSpeech = require('./src/genericSpeech');
var intents = require('./src/intents');

var app = new Alexa.app(appName);

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});

app.intent('define', intents.Define,
    function (req, res) {
        var Word = req.slot('ROOTWORD');
        if (_.isEmpty(Word)) {
            res.say(genericSpeech.Pardon).reprompt(genericSpeech.RePrompt).shouldEndSession(false);
            return true;
        } else {
            fetchWord.Define(Word)
                .then(function (Words) {
                    var Result = speech.PrintDefine(Words[0]);
                    console.log(Result);
                    res.say(Result).send();
                })
                .catch(function (e) {
                    res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
                });
            return false;
        }
    }
);

module.exports = app;
/*

 fetchWord.Define('red')
 .then(function (Words) {
 return fetchWord.Extras(Words[ 0 ]);
 })
 .then(function (WordData) {
 console.log(require('./src/genericSpeech').PrintWelcome());
 console.log(speech.PrintNoDefine(WordData));
 console.log(speech.PrintDefine(WordData));
 console.log(speech.PrintDefineWithType(WordData));
 console.log(speech.PrintSingleExtra(speech.Synonyms, WordData.Synonyms[ 0 ]));
 console.log(speech.PrintMultiExtras(speech.Synonyms, WordData.Synonyms));
 console.log(speech.PrintMultiExtrasWithLimit(speech.Synonyms, WordData.Synonyms, 3));
 });*/
