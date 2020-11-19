import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((resolve, reject) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return reject(err);
			}

			// Add files to the test suite
			files.forEach(file => mocha.addFile(path.resolve(testsRoot, file)));

			try {
				// Run the mocha test
				mocha.run((failures: number) => {
					if (failures > 0) {
						reject(new Error(`${failures} tests failed.`));
					} else {
						resolve();
					}
				});
			} catch (err) {
				console.error('[ERROR] ', err);
				reject(err);
			}
		});
	});
}
