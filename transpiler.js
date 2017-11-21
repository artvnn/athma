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
				inputs.components.forEach(function (component, idx){
					mkdirp.sync(path.join(inputs.build, (idx < 10 ? '0' : '') + (idx+1) + '_' + component))
				});
				mkdirp.sync(path.join(inputs.build, ((inputs.components.length+1) < 10 ? '0' : '') + (inputs.components.length+1) + '_target'));
				mkdirp.sync(inputs.target);

				/* TODO: Tech Debt
				 * Note: If result is resolved immediately, often the files are not accessible, hence a delay is necessary here.
				 * May be its a problem of ncp, this needs to be fixed.
				 * This delay causes some of the tests to show a warning that they are running for too long! */
				setTimeout(function() {
					result.resolve();
				}, 10);
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