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
            console.log('Yu');
            res.say(genericSpeech.PrintPardon()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
            return;
        }
    }
    
    if (_.isEmpty(Cursor)) {
        Cursor = customSlots.customSlots[ 2 ];
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
            res.say(genericSpeech.PrintPardon()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
            return;
        }
    }
    
    var DefineReply = function () {
        if (Cursor === customSlots.customSlots[ 0 ]) {
            if (word[ customSlots.baseSlots[ 0 ] + "Ptr" ])
                word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = (word[ customSlots.baseSlots[ 0 ] + "Ptr" ] + 1) % word.Definitions.length;
            else word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = 1;
            
            return Response.ReplyDefine(res, word);
    
        } else if (Cursor === customSlots.customSlots[ 1 ]) {
            if (word[ customSlots.baseSlots[ 0 ] + "Ptr" ])
                word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = (word[ customSlots.baseSlots[ 0 ] + "Ptr" ] - 1) % word.Definitions.length;
            else word[ customSlots.baseSlots[ 0 ] + "Ptr" ] = word.Definitions.length - 1;
    
            return Response.ReplyDefine(res, word);
    
        }
        else if (Cursor === customSlots.customSlots[ 2 ]) {
            return res.PersistentSay(speech.PrintMultiDefinitions(word)).shouldEndSession(false);
        }
    };
    
    if (_.isEmpty(Word) && _.isEmpty(word.RootWord)) {
        res.say(genericSpeech.PrintPardon()).reprompt(genericSpeech.PrintPrompt()).shouldEndSession(false);
        return true;
    } else {
    
        if (_.isEmpty(word.RootWord))
            word.RootWord = Word;
        
        //Define
        if (Operation === customSlots.baseSlots[ 0 ]) {
            if (word.LoadedDefinition && (word.Definitions.length > 0 ||  word.LoadedSecondary)) {
                DefineReply();
                if (req.hasSession())
                    req.getSession().set('Word',word);
            }
            else {
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                        DefineReply();
                        if (req.hasSession())
                            req.getSession().set('Word',word);
                    });
            }
        }
        //Example
        else if (Operation === customSlots.baseSlots[ 1 ]) {
            
            //Relaxing the Build
            Cursor = customSlots.customSlots[ 2 ];
            
            if (word.LoadedDefinition && (word.Definitions.length > 0 ||  word.LoadedSecondary)) {
                return Response.PrintMultiExamples(res, word);
            }
            else {
                return fetchWord.Define(word)
                    .then(function (response) {
                        word = response;
                        Response.PrintMultiExamples(res, word);
                        if (req.hasSession())
                            req.getSession().set('Word', word);
                    });
            }
        }
        //Extras
        else {
            
            //Relaxing the Build
            Cursor = customSlots.customSlots[ 2 ];
            
            if (word.RootWord === Word && word.LoadedSecondary) {
                    return res.PersistentSay(speech.PrintMultiExtras(Operation, word[ Operation ])).shouldEndSession(false);
            }
            else {
                return fetchWord.Extras(word)
                    .then(function (response) {
                        word = response;
                        res.PersistentSay(speech.PrintMultiExtras(Operation, word[ Operation ])).shouldEndSession(false);
                        if (req.hasSession())
                            req.getSession().set('Word', word);
                    });
            }
        }
    }
};


module.exports = cursorOperation;