const fs = require('fs');
const rmdir = require('rmdir');
const ncp = require('ncp');

module.exports = {
	rmdir: folder => {
		return new Promise((resolve, reject) => {
			if(fs.existsSync(folder)) {
				rmdir(folder, e => {
					e ? reject(e) : resolve();
				});
			} else {
				resolve();
			}
		});
	},
	clone: o => {
		return JSON.parse(JSON.stringify(o));
	},
	deepCopy: (source, target) => {
		return new Promise( (resolve, reject) => {
			ncp(source, target, e => {
				e ? reject(e) : resolve();
			});
		});
	}
}
