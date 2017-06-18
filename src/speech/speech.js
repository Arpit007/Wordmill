/**
 * Created by Home Laptop on 12-Jun-17.
 */
'use strict';

var _ = require('lodash');

var Speech = {
    NoWord : 'Please specify the word',
    Done : 'Sorry, That\'s all I know',
    
    NoDefine : 'Sorry, I couldn\'t find its meaning.',
    DefineWord : 'The word ${Word} means ${Definition}.',
    DefineWithType : 'As ${Type}, it means ${Definition}.',
    MultiDefine : 'It\'s definitions are ${Definition}',
    
    NoneExtra : 'Sorry, couldn\'t find its ${Extra}.',
    SingleExtra : 'It\'s ${Extra} is ${Word}.',
    MultiExtras : 'Its\'s ${Extra} are ${Words} and ${LastWord}.',
    MultiExtrasWithLimit : "It\'s ${Extra} are ${Words} and ${Count} more.",
    
    Synonyms : 'synonym',
    Antonyms : 'antonym',
    Hypernyms : 'hypernym',
    Opposites : 'opposite word',
    Variants : 'variant',
    Rhyming : 'rhyming word',
    
    PrintNoDefine : function (Word) {
        return _.template(this.NoDefine)({ Word : Word.RootWord });
    },
    
    PrintDefine : function (Word, Index) {
        return _.template(this.DefineWord)({ Word : Word.RootWord, Definition : Word.Definitions[Index].Meaning });
    },
    
    PrintDefineWithType : function (Word, Index) {
        return _.template(this.DefineWithType)({ Type : Word.Definitions[Index].PartOfSpeech, Word : Word.RootWord,
            Definition : Word.Definitions[Index].Meaning });
    },
    
    PrintNoneExtra : function (Extra) {
        return _.template(this.NoneExtra)({ Extra : Extra });
    },
    
    PrintSingleExtra : function (Word, Extra) {
        return _.template(this.SingleExtra)({ Extra : Extra, Word : Word });
    },
    
    PrintMultiExtras : function (Extra, Extras) {
        return _.template(this.MultiExtras)({
            Extra : Extra, Words : Extras.slice(0, Extras.length - 1).join(', '),
            LastWord : Extras[ Extras.length - 1 ]
        });
    },
    
    PrintMultiExtrasWithLimit : function (Extra, Extras, Limit) {
        return _.template(this.MultiExtrasWithLimit)({
            Extra : Extra, Words : Extras.slice(0, Limit).join(', '),
            Count : Extras.length - Limit
        });
    },
    
    
    PrintMultiDefinitions : function (Word) {
      var arr = [];
      for (var i in Word.Definitions){
          if (Word.Definitions[i].Meaning)
            arr.push(Word.Definitions[i].Meaning);
      }
      return _.template(this.MultiDefine)({ Definition : arr.join(', ')});
    }
};


module.exports = Speech;