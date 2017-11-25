const utils = require('./utils');
const assert = require("chai").assert;
const expect = require("chai").expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;

require('./test_setup.js');

describe('Utils:', () => {
	describe('rmdir:', () => {
		const rmdir = utils.rmdir;
		it('should return a promise', () => {
			expect(rmdir('some file').then).to.be.a('function');
		});
		it('should not throw error if the folder does not exits', () => {
			return rmdir('some file').should.be.fulfilled;
		});
		it('should delete the given folder', () => {
			let folder = path.join(__dirname, 'test');
			mkdirp.sync(folder);
			return new Promise((resolve, reject) => {
				rmdir(folder).then(
					() => {
						fs.existsSync(folder) ? reject('Folder exists') : resolve();
					},
					e => {
						reject(e);
					}
				);
			});
		});
	});
	describe('clone:', () => {
		let clone = utils.clone;
		it('should clone the given object', () => {
			let input = { a:1, b:'Manoj', c: { d: 20.123, e: new Date() } };
			let output = clone(input);
			expect(JSON.stringify(input)).to.deep.equal(JSON.stringify(output));
		});
	});
	describe('deepCopy', () => {
		let deepCopy = utils.deepCopy;
		it('should copy the folder tree', () => {
			let sourceFolder = path.join(__dirname, 'test', 'f1');
			mkdirp.sync(path.join(sourceFolder, 'f2', 'f3'));
			let targetFolder = path.join(__dirname, 'test', 'temp');
			return deepCopy(sourceFolder, targetFolder).then(
				() => {
					expect(fs.existsSync(path.join(targetFolder, 'f2', 'f3'))).to.equal(true);
				}
			);
		});
		after(() => {
			rmdir(path.join(__dirname, 'test'));
		});
	});
});
