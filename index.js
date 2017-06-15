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

var app = new Alexa.app(appName);
var wordBase = require('./src/wordBase');
var word = new wordBase.BaseWord();

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});


app.intent('define', intents.Define,
    function (req, res) {
        var Word = req.slot('ROOTWORD').trim().toLowerCase();
        
        var Reply = function () {
          if(word.Definitions.length === 0){
              res.say(speech.NoDefine).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
          }
          else {
              var Result = speech.PrintDefine(word, 0);
              res.say(Result).send();
          }
        };
        
        if (_.isEmpty(Word)) {
            res.say(genericSpeech.Pardon).reprompt(genericSpeech.RePrompt).shouldEndSession(false);
            return true;
        } else {
            if (word.RootWord === Word && word.LoadedDefinition &&
                (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))){
                return Reply();
            }
            else {
                word = new wordBase.BaseWord();
                word.RootWord=Word;
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                    })
                    .then(Reply);
            }
        }
    }
);

module.exports = app;
