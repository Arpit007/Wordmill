/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var Alexa = require('alexa-app');

var config = require('./src/config');
var genericSpeech = require('./src/speech/genericSpeech');
var intents = require('./src/Intent/intents');

var app = new Alexa.app(global.appName);

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});

app.intent('baseOperation', intents.BaseOperation, require('./src/Intent/baseOperation'));
app.intent('cursorOperation', intents.CursorOperation, require('./src/Intent/cursorOperation'));
app.intent('AMAZON.HelpIntent', function (req, res) {
    return res.say(genericSpeech.Help).shouldEndSession(false);
});
app.intent('AMAZON.NextIntent', function (req, res) {
    req.CDIRECTION = "Next";
    return require('./src/Intent/cursorOperation')(req, res);
});
app.intent('AMAZON.PreviousIntent', function (req, res) {
    req.CDIRECTION = "Previous";
    return require('./src/Intent/cursorOperation')(req, res);
});
/*app.intent('AMAZON.RepeatIntent', function (req, res) {
    req.CDIRECTION = "Previous";
    return require('./src/Intent/cursorOperation')(req, res);
});*/

app.sessionEnded(function (request, response) {
    if (request.hasSession())
        request.getSession().clear('Word');
});

module.exports = app;
