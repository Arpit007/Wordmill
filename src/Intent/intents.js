/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var BaseOperation = {
    'slots': {
        "ROOTWORD" : "SEARCH_TERMS",
        "OPERATION" : "CUSTOM_OPERATIONS"
    },
    
    'utterances': [
        '{|State|Give|Give me|Tell|Tell me|Say|Say me} {|what} {|are|is} {|the|its} {-|OPERATION}',
        '{|State|Give|Give me|Tell|Tell me|Say|Say me|what is} {|the} {-|ROOTWORD} {-|OPERATION}',
        '{|State|Give|Give me|Tell|Tell me|Say|Say me} {|what} {|is|are} {|the} {-|OPERATION} {|of} {|the} {|word} {-|ROOTWORD} {|is}',
        '{Describe|Explain} {|to me|me} {|the} {|meaning} {|of} {|the} {|word} {-|ROOTWORD}',
        '{Describe|Explain} {|to me|me} its meaning',
        '{|Tell|Tell me|Say|Say me} {|something|anything} {about|regarding} {|the} {|word} {-|ROOTWORD}'
    ]
};

var CursorOperation = {
    'slots': {
        "CDIRECTION" : "CURSOR_DIRECTION",
        "ROOTWORD" : "SEARCH_TERMS",
        "OPERATION" : "CUSTOM_OPERATIONS"
    },
    
    'utterances': [
        //'{-|CDIRECTION} {|of} {|the} {|-|OPERATION} {|of} {|the} {|word} {|-|ROOTWORD}'
        '{-|CDIRECTION} {|of} {|the} {-|OPERATION} {|of} {|the} {|word} {-|ROOTWORD}'
    ]
};

module.exports.BaseOperation = BaseOperation;
module.exports.CursorOperation = CursorOperation;