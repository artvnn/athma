var chai = require('chai'),
	expect = chai.expect,
	transpiler = require('./transpiler'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	rmdir = require('rmdir'),
	assert = chai.assert,
	fs = require('fs'),
	clone = function (obj) {
		return JSON.parse(JSON.stringify(obj));
	}

describe('Athma Transpiler:', function () {
	var testDir = path.normalize(path.join(__dirname, './test')),
		sourceDir = path.join(testDir, 'source'),
		buildDir = path.join(testDir, 'build'),
		targetDir = path.join(testDir, 'target'),
		optionsOriginal = {
			source: sourceDir,
			target: targetDir,
			components: [],
			build: buildDir
		};
	before(function () {
		mkdirp.sync(sourceDir);
		fs.writeFileSync(path.join(sourceDir, 'main.tm'), '/* main.tm */');
	});
	function promiseResolvedOk(result) {
		assert(true);
	}
	function promiseResolvedError(result) {
		throw 'Unexpected result: ' + result;
	}
	it('should throw error when no options are given', function () {
		return transpiler().then(promiseResolvedError, function (err) {
			expect(err).to.equal('No inputs given');
		});
	});
	it('should throw error when no source folder is specified', function () {
		var options = clone(optionsOriginal);
		delete options.source;
		return transpiler(options).then(promiseResolvedError, function (err) {
			expect(err).to.equal('No source folder is specified');
		});
	});
	it('should throw error when source folder does not exist', function () {
		var options = clone(optionsOriginal);
		options.source = 'blah';
		return transpiler(options).then(promiseResolvedError, function (err) {
			expect(err).to.equal('Source folder does not exist');
		});
	});
	it('should not throw error when source folder exists', function () {
		var options = clone(optionsOriginal);
		return transpiler(options).then(promiseResolvedOk, function (err) {
			expect(err).to.not.equal('Source folder does not exist');
		});
	});
	it('should throw error when no target folder is specified', function () {
		var options = clone(optionsOriginal);
		delete options.target;
		return transpiler(options).then(promiseResolvedError, function (err) {
			expect(err).to.equal('No target folder is specified');
		});
	});
	it('should throw error when no components are specified', function () {
		var options = clone(optionsOriginal);
		delete options.components;
		return transpiler(options).then(promiseResolvedError, function (err) {
			expect(err).to.equal('No components are specified');
		});
	});
	it('should create target folder', function () {
		var options = clone(optionsOriginal);
		return transpiler(options).then(function () {
			var targetFolderExists = fs.existsSync(targetDir);
			expect(targetFolderExists).to.equal(true);
		});
	});
	it('should create build folder', function () {
		var options = clone(optionsOriginal);
		return transpiler(options).then(function () {
			var buildFolderExists = fs.existsSync(buildDir);
			expect(buildFolderExists).to.equal(true);
		});
	});
	// it('should copy all source files into the build folder, in a sub-folder called "00_source"', function () {
	// 	var options = clone(optionsOriginal);
	// 	return transpiler(options).then(function () {
	// 		var buildSourceFolder = path.join(buildDir, '00_source'),
	// 			sourceFile = path.join(buildSourceFolder, 'main.tm'),
	// 			sourceFileExists = fs.existsSync(sourceFile);
	// 		console.log(sourceFile, fs.existsSync(sourceFile));
	// 		expect(sourceFileExists).to.equal(true);
	// 	});
	// });
	after(function () {
		rmdir(testDir);
	});
});