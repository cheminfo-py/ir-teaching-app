var splice = require('./spliceString.js');
var assert = require('assert');

var exampleString = 'abcdefg';

var output = splice(exampleString, 1, 2, 'ZZZ');
//'aZZZdefg'

if (assert.equal(output, 'aZZZdefg')) {
	return 0;
} else {
	return 1;
}
