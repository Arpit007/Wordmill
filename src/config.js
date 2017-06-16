/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var config = {
    DefineUrl : 'http://api.pearson.com/v2/dictionaries/entries?limit=3&apikey=twA7jNHGlzG8vjULAVQvLSoYpcahxZx2&headword=',
    
    DefineSecondaryUrl : 'http://api.wordnik.com:80/v4/word.json/${Word}/definitions?limit=5'
    +'&includeRelated=false&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
    
    ExtrasUrl : 'http://api.wordnik.com/v4/word.json/${Word}/relatedWords?useCanonical=false&limitPerRelationshipType=10'
    + '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
};
//dcb5aeccb2a3438a7c00605c22f04e16a618f8c7512af537c
global.appName = process.env.appName || 'Wordmill';

module.exports = config;