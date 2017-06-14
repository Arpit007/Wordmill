/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

module.change_code = 1;

var config = {
    DefineUrl : 'http://api.pearson.com/v2/dictionaries/entries?limit=3&headword=',
    DefineSecondaryUrl : 'http://api.wordnik.com:80/v4/word.json/${Word}/definitions?limit=5'
    +'&includeRelated=false&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
    ExtrasUrl : 'http://api.wordnik.com/v4/word.json/${Word}/relatedWords?useCanonical=false&limitPerRelationshipType=10'
    + '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
};

global.appName = 'Wordmill';

module.exports = config;