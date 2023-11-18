import { spawn, execFile } from 'child_process';

import Runner from './Runner.js';
import * as fs from 'fs';

export default class CppRunner extends Runner {
    constructor() {
        super();
    }

    run(filePath, testCases, ext, callback) {
        this.compile(filePath, testCases, callback);
    }

    // Compile a C++ file
    compile(filePath, testCases, callback) {
        let compileArgs = [filePath];
        console.log('compileCommand:', `g++ ${compileArgs}`);
        let compiler = spawn('g++', compileArgs);
        // Check for compilation errors
        compiler.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            callback(1, String(data));
        });
        compiler.on('close', (output) => {
            console.log(`Compilation completed with status: ${output}`);
            this.execute(testCases, callback);
        });
    }

    // Execute the compiled file
    execute(testCases, callback) {
        // Execute each test case
        let args = ['<', 'in.txt'];
        for (let i = 0; i < testCases.length; i++) {
            // Write test case to in.txt file
            fs.writeFileSync('in.txt', testCases[i].input);
            execFile('./a.out', args, { shell: true }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Runtime error on test case ${i + 1}: ${String(error)}`);
                    callback(3, String(error));
                }
                if (stderr) {
                    console.log(`Runtime error on test case ${i + 1}: ${String(stderr)}`);
                    callback(3, String(stderr));
                }
                if (stdout) {
                    let output = String(stdout);
                    output = output.slice(0, output.length - 1);
                    console.log(`Output on test case ${i + 1}: ${output}`);
                    if (output !== testCases[i].output) {
                        console.log(`Wrong Answer on test case ${i + 1}`);
                        const callbackMessage =
                            'Wrong Answer on test case ' +
                            (i + 1) +
                            `\nExpected: ${testCases[i].output}\nGot: ${String(
                                stdout,
                            )}`;
                        // Return a callback and stop further execution of test cases
                        callback(2, callbackMessage);
                    }
                }
            });
        }
        // If all test cases pass, return a callback
        callback(0, 'Accepted');
    }
}
