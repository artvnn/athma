var fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	ncp = require('ncp').ncp,
	Promise = require('node-promise').Promise;

function transpile(inputs, result) {
	try {
		mkdirp.sync(inputs.build);
		var buildSourceDir = path.join(inputs.build, '00_source');
		mkdirp.sync(buildSourceDir);
		ncp(inputs.source, buildSourceDir, function(err) {
			if(err) result.reject(err); else {
				mkdirp.sync(inputs.target);
				result.resolve();
			}
		});
	} catch (err) {
		result.reject(err);
	}
}

module.exports = function(inputs) {
	var result = new Promise();
	if(!inputs) {
		result.reject('No inputs given');
	} else if(!inputs.source) {
		result.reject('No source folder is specified');
	} else if(!fs.existsSync(path.normalize(inputs.source))) {
		result.reject('Source folder does not exist');
	} else if(!inputs.target) {
		result.reject('No target folder is specified');
	} else if(!inputs.components) {
		result.reject('No components are specified');
	} else {
		transpile(inputs, result);
	}
	return result;
};