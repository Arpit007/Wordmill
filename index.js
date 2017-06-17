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

var app = new Alexa.app(global.appName);

app.launch(function (req, res) {
    res.say(genericSpeech.PrintWelcome()).reprompt(genericSpeech.Prompt).shouldEndSession(false);
});

app.intent('baseOperation', intents.BaseOperation, function (req, res) {
    return Persistence(req, res, require('./src/Intent/baseOperation'));
});
//app.intent('baseOperation', intents.BaseOperation, require('./src/Intent/baseOperation'));
app.intent('cursorOperation', intents.CursorOperation, function (req, res) {
    return Persistence(req, res, require('./src/Intent/cursorOperation'));
});//, require('./src/Intent/cursorOperation'));
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
app.intent('AMAZON.RepeatIntent', function (req, res) {
    if (req.hasSession()){
        var Reply = req.getSession().get('Message');
        if (_.isEmpty(Reply))
            return res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
        else return res.say(Reply).shouldEndSession(false).send();
    }
    else return res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
});

function Persistence(req, res, callback) {
    res.PersistentSay = function (Message) {
      if(req.hasSession())
          req.getSession().set('Message', Message);
      return res.say(Message);
    };
    return callback(req, res);
}

app.sessionEnded(function (request, response) {
    if (request.hasSession()) {
        request.getSession().clear();
    }
});

module.exports = app;