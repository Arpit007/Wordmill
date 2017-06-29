/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');
var SSML = require('ssml-builder');

process.on('uncaughtException', function (err) {
    console.error('Uncaught Error: ' + err.stack);
});

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
    console.log('Session At: ' + new Date());
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
});

app.intent('baseOperation', intents.BaseOperation, function (req, res) {
    var operation = req.slot('OPERATION');
    
    if(req.slot('ROOTWORD') && ['goodbye', 'good-bye', 'good bye'].indexOf(req.slot('ROOTWORD').toLowerCase()) !== -1
        && (!operation || _.isEmpty(operation.trim())))
        return res.say(genericSpeech.GoodBye).shouldEndSession(true);
    
    if (!_.isEmpty(operation) && operation.substr(operation.length-1,1) === 's')
        return Persistence(req, res, cursorOperation);
    else
        return Persistence(req, res, baseOperation);
});

app.intent('cursorOperation', intents.CursorOperation, function (req, res) {
    var operation = req.slot('OPERATION');
    
    if((req.slot('ROOTWORD') && ['goodbye', 'good-bye', 'good bye'].indexOf(req.slot('ROOTWORD').toLowerCase()) !== -1
        && (!operation || _.isEmpty(operation.trim())))||(['goodbye', 'good-bye', 'good bye'].indexOf(req.slot('CDIRECTION').toLowerCase()) !== -1))
        return res.say(genericSpeech.GoodBye).shouldEndSession(true);
    
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
      if (Message instanceof SSML)
          Message = Message.pauseByStrength('strong').paragraph(genericSpeech.More).ssml();
      else Message = Message + genericSpeech.More;
      
        if(req.hasSession())
            req.getSession().set('Message', Message);
      
      return res.say(Message).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
    };
    return callback(req, res);
}

app.sessionEnded(function (request, response) {
    if (request.hasSession()) {
        request.getSession().clear();
    }
    return response.say(genericSpeech.GoodBye).shouldEndSession(true);
});

module.exports = app;