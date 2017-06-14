/**
 * Created by Home Laptop on 11-Jun-17.
 */
'use strict';

module.change_code = 1;

var request = require('request-promise');
var Set = require('collections/set');
var _ = require('lodash');

var config = require('./config');
var wordBase = require('./wordBase');


var ParseWord = function (BaseWord, response) {
    if (response.statusCode === 200) {
        var results = response.body.results;
        
        BaseWord.LoadedDefinition = true;
        
        for (var i = 0; i < results.length; i++) {
            var meaning = results[ i ];
            
            if (meaning.headword !== BaseWord.RootWord)
                continue;
            
            var DefinitionWord = wordBase.BaseDefinition();
            
            DefinitionWord.PartOfSpeech = meaning.part_of_speech;
            if (DefinitionWord.PartOfSpeech && DefinitionWord.PartOfSpeech.length > 0) {
                switch (DefinitionWord.PartOfSpeech[ 0 ]) {
                    case 'a':
                    case 'e':
                    case 'i':
                    case 'o':
                    case 'u':
                        DefinitionWord.PartOfSpeech = 'an ' + DefinitionWord.PartOfSpeech;
                        break;
                    default:
                        DefinitionWord.PartOfSpeech = 'a ' + DefinitionWord.PartOfSpeech;
                }
            }
            
            if (meaning.senses && meaning.senses.length > 0) {
                var sense = meaning.senses[ 0 ];
                
                if (!sense.definition || sense.definition.length < 1)
                    continue;
                
                if (typeof sense.definition === 'string')
                    DefinitionWord.Meaning = sense.definition;
                else DefinitionWord.Meaning = sense.definition[ 0 ];
                
                var trans_ex = sense.translations;
                if (trans_ex && trans_ex.length>0)
                {
                    trans_ex = trans_ex[0].example;
                    trans_ex.forEach(function (ex) {
                        if (ex.text)
                            DefinitionWord.Example.push(ex.text);
                    });
                }
                
                var example = sense.collocation_examples;
                if (example && example.length > 0) {
                    example = example[ 0 ];
                    DefinitionWord.Example.push(example.example.text);
                }
                
                example = sense.examples;
                if (!example && sense.gramatical_examples && sense.gramatical_examples.length > 0)
                    example = sense.gramatical_examples[ 0 ].examples;
                
                if (example) {
                    example.forEach(function (ex) {
                        DefinitionWord.Example.push(ex.text);
                    });
                }
                
                BaseWord.Definitions.push(DefinitionWord);
            }
        }
        return BaseWord;
    }
    else throw Error("Wrong Response");
};

var Define = function (Word) {
    if (typeof Word === 'string') {
        var word = new wordBase.BaseWord();
        word.RootWord = Word.trim().toLowerCase();
        Word = word;
    }
    
    var options = {
        method : 'GET',
        uri : config.DefineUrl + Word.RootWord,
        resolveWithFullResponse : true,
        json : true
    };
    
    return request(options)
        .then(function (response) {
            return ParseWord(Word, response);
        })
        .then(function (Word) {
            if (Word.Definitions && Word.Definitions.length <= 0)
                return DefineSecondary(Word);
            else return Word;
        })
        .catch(function (e) {
            console.log(e);
            return Word;
        });
};

var ParseExtras = function (data, Word) {
    Word.Synonyms = null;
    
    for (var x = 0; x < data.length; x++) {
        var sub = data[ x ];
        
        if (sub.relationshipType === 'equivalent' || sub.relationshipType === 'synonym') {
            if (Word.Synonyms)
                Word.Synonyms.addEach(sub.words);
            else Word.Synonyms = new Set(sub.words);
        }
        if (sub.relationshipType === 'antonym') {
            Word.Antonyms = sub.words;
        }
        if (sub.relationshipType === 'hypernym') {
            Word.Hypernyms = sub.words;
        }
        if (sub.relationshipType === 'variant') {
            Word.Variants = sub.words;
        }
        if (sub.relationshipType === 'rhyme') {
            Word.Rhymes = sub.words;
        }
    }
    
    if (Word.Synonyms)
        Word.Synonyms = Word.Synonyms.toArray();
    
    Word.LoadedExtras = true;
    return Word;
};

var Extras = function (Word) {
    if (typeof Word === 'string') {
        var word = new wordBase.BaseWord();
        word.RootWord = Word.trim().toLowerCase();
        Word = word;
    }
    
    var Url = _.template(config.ExtrasUrl)({ Word : Word.RootWord });
    
    var options = {
        method : 'GET',
        uri : Url,
        resolveWithFullResponse : true,
        json : true
    };
    
    return request(options)
        .then(function (data) {
            if (data.statusCode === 200)
                return ParseExtras(data.body, Word);
            else throw Error("Wrong Response");
        })
        .catch(function (e) {
            console.log(e);
            return Word;
        });
};

var ParseSecondary = function(BaseWord, data)
{
    for (var x = 0; x < data.length; x++) {
        var sub = data[ x ];
        
        if (sub.word !== BaseWord.RootWord)
            continue;
        
        var Define = new wordBase.BaseDefinition();
        Define.Example.concat(sub.exampleUses);
        
        Define.PartOfSpeech = sub.partOfSpeech;
        if (Define.PartOfSpeech && Define.PartOfSpeech.length > 0) {
            switch (Define.PartOfSpeech[ 0 ]) {
                case 'a':
                case 'e':
                case 'i':
                case 'o':
                case 'u':
                    Define.PartOfSpeech = 'an ' + Define.PartOfSpeech;
                    break;
                default:
                    Define.PartOfSpeech = 'a ' + Define.PartOfSpeech;
            }
        }
        
        Define.Meaning = sub.text;
        BaseWord.Definitions.push(Define);
    }
    BaseWord.LoadedSecondary = true;
    return BaseWord;
};

var DefineSecondary = function (Word) {
    if (typeof Word === 'string') {
        var word = new wordBase.BaseWord();
        word.RootWord = Word.trim().toLowerCase();
        Word = word;
    }
    
    var Url = _.template(config.DefineSecondaryUrl)({ Word : Word.RootWord });
    
    var options = {
        method : 'GET',
        uri : Url,
        resolveWithFullResponse : true,
        json : true
    };
    
    return request(options)
        .then(function (data) {
            if (data.statusCode === 200)
                return ParseSecondary(Word, data.body);
            else throw Error("Wrong Response");
        })
        .catch(function (e) {
            console.log(e);
            return Word;
        });
};

module.exports = {
    Define : Define,
    DefineSecondary : DefineSecondary,
    Extras : Extras
};