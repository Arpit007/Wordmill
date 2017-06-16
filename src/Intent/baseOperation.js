/**
 * Created by Home Laptop on 16-Jun-17.
 */

var _ = require('lodash');

var fetchWord = require('../fetchWord');
var genericSpeech = require('../speech/genericSpeech');
var customSlots = require('../speech/customSlots');
var Response = require('../Response');
var wordBase = require('../wordBase');

var baseOperation = function (req, res) {
    var word;
    
    if (req.hasSession())
        word = req.getSession().get('Word') || new wordBase.BaseWord();
    else word = new wordBase.BaseWord();
    
    var Word = req.slot('ROOTWORD');
    var Operation = req.slot('OPERATION');
    
    if(Operation)
        Operation=Operation.trim().toLowerCase();
    
    if(Word)
        Word=Word.trim().toLowerCase();
    
    if (!word.Valid || (word.RootWord && word.RootWord !== Word))
        word = new wordBase.BaseWord();
    
    if (_.isEmpty(Operation)) {
        Operation = customSlots.baseSlots[ 0 ];
    }
    else {
        var tempOp = null;
        for (var op in customSlots.baseSlots) {
            if (customSlots[customSlots.baseSlots[ op ]].indexOf(Operation) !== -1) {
                tempOp = customSlots.baseSlots[ op ];
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
        if (Operation === customSlots.baseSlots[ 0 ]) {
            if (word.RootWord === Word && word.LoadedDefinition &&
                (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                return Response.ReplyDefine(res, word);
            }
            else {
                word.RootWord = Word;
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    })
                    .then(function () {
                        return Response.ReplyDefine(res, word);
                    });
            }
        }
        //Example
        else if (Operation === customSlots.baseSlots[ 1 ]) {
            if (word.RootWord === Word && word.LoadedDefinition &&
                (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                return Response.ReplyExample(res, word);
            }
            else {
                word.RootWord = Word;
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    })
                    .then(function () {
                        return Response.ReplyExample(res, word);
                    });
            }
        }
        //Extras
        else {
            if (word.RootWord === Word && word.LoadedSecondary) {
                return Response.ReplyExtra(res, word, Operation);
            }
            else {
                word.RootWord = Word;
                return fetchWord.Extras(word)
                    .then(function (response) {
                        word = response;
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    })
                    .then(function () {
                        return Response.ReplyExtra(res, word, Operation);
                    });
            }
        }
    }
};

module.exports = baseOperation;