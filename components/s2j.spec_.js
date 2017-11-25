var chai = require('chai'),
	expect = chai.expect,
	s2j = require('./s2j');

describe('S-Expression to JSON convertor: ', function() {
	it('should parse empty string', function() {
		expect(undefined).to.equal(JSON.stringify(s2j('')));
	});
	var sExpression = '(a (b (c)))';
	it('should parse ' + sExpression, function() {
		expect(JSON.stringify(["a", ["b", ["c"]]])).to.equal(JSON.stringify(s2j(sExpression)));
	});
	// More  tests are not required since they have already been created for TMParser
});
