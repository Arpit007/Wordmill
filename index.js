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

var baseOperation = require('./src/Intent/baseOperation');
var cursorOperation = require('./src/Intent/cursorOperation');

var app = new Alexa.app(global.appName);

app.launch(function (req, res) {
    if (req.hasSession()) {
        req.getSession().clear();
    }
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
});

app.intent('baseOperation', intents.BaseOperation, function (req, res) {
    var operation = req.slot('OPERATION');
    if (!_.isEmpty(operation) && operation.substr(operation.length-1,1) === 's')
        return Persistence(req, res, cursorOperation);
    else
        return Persistence(req, res, baseOperation);
});

app.intent('cursorOperation', intents.CursorOperation, function (req, res) {
    return Persistence(req, res, cursorOperation);
});

app.intent('AMAZON.HelpIntent', function (req, res) {
    return res.say(genericSpeech.PrintHelp()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
});

app.intent('AMAZON.StopIntent', function (req, res) {
    return res.say(genericSpeech.GoodBye).shouldEndSession(true);
});

app.intent('AMAZON.CancelIntent', function (req, res) {
    return res.say(genericSpeech.GoodBye).shouldEndSession(true);
});

app.intent('AMAZON.NextIntent', function (req, res) {
    req.CDIRECTION = "Next";
    return Persistence(req, res, cursorOperation);
});

app.intent('AMAZON.PreviousIntent', function (req, res) {
    req.CDIRECTION = "Previous";
    return Persistence(req, res, cursorOperation);
});

app.intent('AMAZON.RepeatIntent', function (req, res) {
    if (req.hasSession()){
        var Reply = req.getSession().get('Message');
        if (_.isEmpty(Reply))
            return res.say(genericSpeech.PrintPardon()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        else return res.say(Reply).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
    }
    else return res.say(genericSpeech.PrintPardon()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
});

function Persistence(req, res, callback) {
    res.PersistentSay = function (Message) {
      if(req.hasSession())
          req.getSession().set('Message', Message);
      return res.say(Message).reprompt(genericSpeech.PrintPrompt()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
    };
    return callback(req, res);
}

app.sessionEnded(function (request, response) {
    if (request.hasSession()) {
        request.getSession().clear();
    }
});

module.exports = app;