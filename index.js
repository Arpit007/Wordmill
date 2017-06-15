/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');

var config = require('./src/config');
var genericSpeech = require('./src/speech/genericSpeech');
var intents = require('./src/Intent/intents');

var app = new Alexa.app(appName);

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});

app.intent('baseOperation', intents.BaseOperation,require('./src/Intent/baseOperation'));

app.sessionEnded(function(request, response) {
    if (request.hasSession())
        request.getSession().clear('Word');
        
});

module.exports = app;
