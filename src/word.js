/**
 * Created by Home Laptop on 11-Jun-17.
 */

var request = require('request-promise');
var Set = require('collections/set');
var _ = require('lodash');

var DefineUrl = 'http://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=';
var ExtrasUrl = 'http://api.wordnik.com/v4/word.json/${Word}/relatedWords?useCanonical=false&limitPerRelationshipType=10'
    + '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

var ParseWord = function (response) {
    if (response.statusCode === 200) {
        var results = response.body.results;
        var Data = [];
        
        for (var i = 0; i < results.length; i++) {
            var meaning = results[ i ];
            var Word = {};
            
            Word.Word = meaning.headword;
            Word.Type = meaning.part_of_speech;
            if (Word.Type && Word.Type.length>0)
            {
                switch (Word.Type[0])
                {
                    case 'a':
                    case 'e': case 'i':
                    case 'o': case 'u':
                        Word.Type='an ' + Word.Type;
                        break;
                    default:
                        Word.Type='a ' + Word.Type;
                }
            }
            
            if (meaning.senses && meaning.senses.length > 0) {
                var sense = meaning.senses[ 0 ];
                
                if (!sense.definition || sense.definition.length < 1)
                    continue;
                
                Word.Definition = sense.definition[ 0 ];
                Word.Synonyms = new Set;
                Word.Antonyms = [];
                Word.Hypernyms = [];
                Word.Variants = [];
                Word.Rhyme = [];
                
                var example = sense.collocation_examples;
                if (example && example.length > 0) {
                    example = example[ 0 ];
                    Word.Collocation_Example = example.example.text;
                }
                
                example = sense.examples;
                if (!example && sense.gramatical_examples && sense.gramatical_examples.length > 0)
                    example = sense.gramatical_examples[ 0 ].examples;
                
                if (example)
                    Word.Example = example[ 0 ].text;
                
                Data.push(Word);
            }
        }
        return Data;
    }
    else throw Error("Wrong Response");
};

var Filter = function (RootWord, data) {
    RootWord = RootWord.trim().toLowerCase();
    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (data[ i ].Word === RootWord)
            result.push(data[ i ]);
    }
    return result;
};

var Define = function (Word) {
    var options = {
        method : 'GET',
        uri : DefineUrl + Word,
        resolveWithFullResponse : true,
        json : true
    };
    
    return request(options)
        .then(ParseWord)
        .then(function (data) {
            return Filter(Word, data);
        }).catch(function (e) {
            console.log(e);
        });
};

var ParseExtras = function (data, Word) {
    for (var x = 0; x < data.length; x++) {
        var sub = data[ x ];
        if (sub.relationshipType === 'equivalent' || sub.relationshipType === 'synonym') {
            Word.Synonyms.addEach(sub.words);
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
            Word.Rhyme = sub.words;
        }
    }
    return Word;
};

var Extras = function (Word) {
    var Url = _.template(ExtrasUrl)({ Word : Word.Word });
    
    var options = {
        method : 'GET',
        uri : Url,
        resolveWithFullResponse : true,
        json : true
    };
    
    return request(options)
        .then(function (data) {
            return ParseExtras(data.body, Word);
        })
        .then(function (Word) {
            Word.Synonyms = Word.Synonyms.toArray();
            return Word;
        })
        .catch(function (e) {
            console.log(e);
        });
};

module.exports = {
    Define : Define,
    Extras : Extras
};