/**
 * Created by Home Laptop on 11-Jun-17.
 */
var config = require('./src/config');
var word = require('./src/word');
var speech = require('./src/speech');

word.Define('young')
    .then(function (Words) {
        return word.Extras(Words[ 0 ]);
    })
    .then(function (WordData) {
        console.log(require('./src/genericSpeech').PrintWelcome());
        console.log(speech.PrintNoDefine(WordData));
        console.log(speech.PrintDefine(WordData));
        console.log(speech.PrintDefineWithType(WordData));
        console.log(speech.PrintSingleExtra(speech.Synonyms, WordData.Synonyms[ 0 ]));
        console.log(speech.PrintMultiExtras(speech.Synonyms, WordData.Synonyms));
        console.log(speech.PrintMultiExtrasWithLimit(speech.Synonyms, WordData.Synonyms, 3));
    });