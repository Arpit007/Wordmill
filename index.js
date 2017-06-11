/**
 * Created by Home Laptop on 11-Jun-17.
 */
var word = require('./src/word');

word.Define('young')
    .then(function (Words) {
        return word.Extras(Words[0]);
    })
    .then(function (WordData) {
        console.log(JSON.stringify(WordData));
        return WordData;
    });