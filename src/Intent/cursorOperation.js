/**
 * Created by Home Laptop on 16-Jun-17.
 */
'use strict';

var _ = require('lodash');

var fetchWord = require('../fetchWord');
var genericSpeech = require('../speech/genericSpeech');
var customSlots = require('../speech/customSlots');
var Response = require('../Response');
var wordBase = require('../wordBase');
var speech = require('../speech/speech');

var cursorOperation = function (req, res) {
    var word;
    
    if (req.hasSession())
        word = req.getSession().get('Word') || new wordBase.BaseWord();
    else word = new wordBase.BaseWord();
    
    if (!word.Valid)
        word = new wordBase.BaseWord();
    
    var Word = req.slot('ROOTWORD');
    var Operation = req.slot('OPERATION');
    var Cursor = req.slot('CDIRECTION') || req.CDIRECTION;
    
    if (Operation)
        Operation = Operation.trim().toLowerCase();
    
    if (Word)
        Word = Word.trim().toLowerCase();
    
    if (Cursor)
        Cursor = Cursor.trim().toLowerCase();
    
    if (!word.Valid || (word.RootWord && !_.isEmpty(Word) && word.RootWord !== Word))
        word = new wordBase.BaseWord();
    
    if (_.isEmpty(Operation)) {
        Operation = customSlots.baseSlots[ 0 ];
    }
    else {
        var tempOp = null;
        for (var op in customSlots.baseSlots) {
            if (customSlots[ customSlots.baseSlots[ op ] ].indexOf(Operation) !== -1) {
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
    
    if (_.isEmpty(Cursor)) {
        Cursor = customSlots.customSlots[ 0 ];
    }
    else {
        var tempCursor = null;
        for (var cursor in customSlots.customSlots) {
            if (customSlots[ customSlots.customSlots[ cursor ] ].indexOf(Cursor) !== -1) {
                tempCursor = customSlots.customSlots[ cursor ];
                break;
            }
        }
        if (tempCursor) {
            Cursor = tempCursor;
        }
        else {
            res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
            return;
        }
    }
    
    var DefineReply = function () {
        if (Cursor === customSlots.customSlots[ 0 ]) {
            if (word[ customSlots.baseSlots[ 0 ] + "Ptr" ])
                word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = (word[ customSlots.baseSlots[ 0 ] + "Ptr" ] - 1) % word.Definitions.length;
            else word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = word.Definitions.length - 1;
            
            if (req.hasSession())
                req.getSession().set('Word', word);
            
            return res.say(speech.PrintMultiDefinitions(word)).shouldEndSession(false);
        } else if (Cursor === customSlots.customSlots[ 1 ]) {
            if (word[ customSlots.baseSlots[ 0 ] + "Ptr" ])
                word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = (word[ customSlots.baseSlots[ 0 ] + "Ptr" ] + 1) % word.Definitions.length;
            else word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = 1;
            
            if (req.hasSession())
                req.getSession().set('Word', word);
            
            return res.say(speech.PrintMultiDefinitions(word)).shouldEndSession(false);
        }
        else if (Cursor === customSlots.customSlots[ 2 ]) {
            return res.say(speech.PrintMultiDefinitions(word)).shouldEndSession(false);
        }
    };
    
    if (_.isEmpty(Word) && _.isEmpty(word.RootWord)) {
        res.say(genericSpeech.Pardon).reprompt(genericSpeech.Prompt).shouldEndSession(false);
        return true;
    } else {
        //Define
        if (Operation === customSlots.baseSlots[ 0 ]) {
            if (word.RootWord === Word && word.LoadedDefinition &&
                (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                return DefineReply();
            }
            else {
                if (!_.isEmpty(Word))
                    word.RootWord = Word;
                
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                    })
                    .then(function () {
                        return DefineReply();
                    });
            }
        }
        //Example
        else if (Operation === customSlots.baseSlots[ 1 ]) {
            if (word.RootWord === Word && word.LoadedDefinition &&
                (word.Definitions.length > 0 || (word.Definitions.length === 0 && word.LoadedSecondary))) {
                if (Cursor === customSlots.customSlots[ 2 ])
                    return res.say(speech.PrintMultiExamples(word, 0)).shouldEndSession(false);
            }
            else {
                if (Cursor !== customSlots.customSlots[ 2 ]) {
                    res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
                    return;
                }
                if (!_.isEmpty(Word))
                    word.RootWord = Word;
                
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                        if (req.hasSession())
                            req.getSession().set('Word', word);
                        return res.say(speech.PrintMultiExamples(word, 0)).shouldEndSession(false);
                    });
            }
        }
        //Extras
        else {
            if (word.RootWord === Word && word.LoadedSecondary) {
                if (Cursor === customSlots.customSlots[ 2 ])
                    return res.say(speech.PrintMultiExtras(Operation, word[ Operation ])).shouldEndSession(false);
            }
            else {
                if (Cursor !== customSlots.customSlots[ 2 ]) {
                    res.say(genericSpeech.Apologize).reprompt(genericSpeech.Prompt).shouldEndSession(false).send();
                    return;
                }
                
                if (!_.isEmpty(Word))
                    word.RootWord = Word;
                
                return fetchWord.Extras(word)
                    .then(function (response) {
                        word = response;
                        if (req.hasSession())
                            req.getSession().set('Word', word);
                        return res.say(speech.PrintMultiExtras(Operation, word[ Operation ])).shouldEndSession(false);
                    });
            }
        }
    }
};

fetchWord.Define('young');

module.exports = cursorOperation;