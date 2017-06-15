/**
 * Created by Home Laptop on 14-Jun-17.
 */
'use strict';

function wordBase() {
    return {
        "RootWord": null,
        "Definitions": [],
        "Synonyms" : [],
        "Antonyms": [],
        "Hypernyms": [],
        "Variants": [],
        "Rhymes": [],
        "LoadedDefinition" : false,
        "LoadedSecondary" : false,
        "LoadedExtras": false
    }
}

function definitionBase() {
    return {
        Meaning : null,
        PartOfSpeech : null,
        Example : []
    };
}

module.exports.BaseWord = wordBase;
module.exports.BaseDefinition = definitionBase;