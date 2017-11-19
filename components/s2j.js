var tmParser = require('tm-parser');

module.exports = function(sExpression) {
	return tmParser.parse(sExpression)[0];
};