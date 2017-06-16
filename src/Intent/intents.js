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
        '{-|OPERATION} {-|ROOTWORD}',
        '{|State|Give|Give me|Tell|Tell me|Say|Say me} {|what is} {|the} {-|OPERATION} {|of} {|the} {|word} {-|ROOTWORD} {|is}',
        '{Describe|Explain} {|to me|me} {|the} {|meaning} {|of} {|the} {|word} {-|ROOTWORD}',
        '{|Give|Give me|Tell|Tell me|Say|Say me} {|the} {|word} {-|ROOTWORD} {|is} {|-|OPERATION} {|as}',
        '{|Tell|Tell me|Say|Say me} {|something|anything} about {|the} {|word} {-|ROOTWORD}',
        '{|State|Give|Give me|Tell|Tell me|Say|Say me} {|what are} {|the} {-|OPERATION} {|of} {|the} {|word} {-|ROOTWORD}'
    ]
};

var CursorOperation = {
    'slots': {
        "CDIRECTION" : "CURSOR_DIRECTION",
        "ROOTWORD" : "SEARCH_TERMS",
        "OPERATION" : "CUSTOM_OPERATIONS"
    },
    
    'utterances': [
        '{-|CDIRECTION} {|of} {|the} {|-|OPERATION} {|of} {|the} {|word} {|-|ROOTWORD}'
    ]
};

module.exports.BaseOperation = BaseOperation;
module.exports.CursorOperation = CursorOperation;