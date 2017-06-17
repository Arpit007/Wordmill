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
    
    if (!word.Valid || ( word.RootWord && !_.isEmpty(Word) && word.RootWord !== Word))
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
    
    if (_.isEmpty(Word) && _.isEmpty(word.RootWord)) {
        res.say(genericSpeech.Pardon).reprompt(genericSpeech.Prompt).shouldEndSession(false);
        return true;
    } else {
        
        if (_.isEmpty(word.RootWord))
            word.RootWord = Word;
        //Define
        if (Operation === customSlots.baseSlots[ 0 ]) {
            if (word.LoadedDefinition && (word.Definitions.length > 0 ||  word.LoadedSecondary)) {
                return Response.ReplyDefine(res, word);
            }
            else {
                return fetchWord.Define(word)
                    .then(function (load) {
                        word = load;
                        Response.ReplyDefine(res, word);
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    });
            }
        }
        //Example
        else if (Operation === customSlots.baseSlots[ 1 ]) {
            if (word.LoadedDefinition && (word.Definitions.length > 0 ||  word.LoadedSecondary)) {
                return Response.ReplyExample(res, word);
            }
            else {
                return fetchWord.Define(word)
                    .then(function (load) {
                        word = load;
                        Response.ReplyExample(res, word);
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    });
            }
        }
        //Extras
        else {
            if (word.LoadedSecondary) {
                return Response.ReplyExtra(res, word, Operation);
            }
            else {
                return fetchWord.Extras(word)
                    .then(function (load) {
                        word = load;
                        Response.ReplyExtra(res, word, Operation);
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    });
            }
        }
    }
};

module.exports = baseOperation;