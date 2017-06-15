/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

module.change_code=1;

var Define = {
    'slots': {
        "ROOTWORD" : "SEARCH_TERMS"
    },
    'utterances': [
        'Define {-|ROOTWORD}',
        '{-|ROOTWORD} define',
        'Define the word {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} word {-|ROOTWORD} is defined as',
        '{|Tell|Tell me|Say|Say me} {|the} Definition of {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} Definition of {-|ROOTWORD} is',
        '{|Tell|Tell me|Say|Say me} {|the} Definition of {|the} word {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} {-|ROOTWORD} means',
        '{|Tell|Tell me|Say|Say me} {|the} {-|ROOTWORD} meaning',
        '{|Tell|Tell me|Say|Say me} {|the} Meaning of {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} What is the meaning of {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} What is {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} Definition of {-|ROOTWORD}',
        'Explain {|the} {|word} {-|ROOTWORD}',
        'Explain the meaning of {|the} {|word} {-|ROOTWORD}',
        'Explanation of {|the} {|word} {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} {-|ROOTWORD} explanation',
        '{|Tell|Tell me|Say|Say me} Something about {|the} {|word} {-|ROOTWORD}',
        'Characterise {|the} {|word} {-|ROOTWORD}',
        'Characterize {|the} {|word} {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} What are the characteristics of {|the} {|word} {-|ROOTWORD}',
        'Describe {|the} {|word} {-|ROOTWORD}',
        'Describe the meaning of {|the} {|word} {-|ROOTWORD}',
        'Tell about {|the} {|word} {-|ROOTWORD}',
        'State {|the} {|word} {-|ROOTWORD}',
        '{|Tell|Tell me|Say|Say me} {|the} significance of {-|ROOTWORD}'
    ]
};


module.exports.Define = Define;