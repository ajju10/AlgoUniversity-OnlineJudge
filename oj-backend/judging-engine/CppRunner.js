import { spawn, execFile } from 'child_process';
import util from 'util';
const execFileAsync = util.promisify(execFile);

import Runner from './Runner.js';
import * as fs from 'fs';

import { logger } from '../index.js';

export default class CppRunner extends Runner {
    constructor() {
        super();
    }

    async run(filePath, testCases) {
        try {
            // Compile the file
            await this.compile(filePath);
            // Run the file
            const result = await this.execute(testCases);
            return result;
        } catch (error) {
            logger.log('info', `Error: ${error.message}`);
            throw new Error(error.message);
        } finally {
            await this.removeFile(filePath);
        }
    }

    // Compile a C++ file
    async compile(filePath) {
        return new Promise((resolve, reject) => {
            let compileArgs = [filePath];
            let compiler = spawn('g++', compileArgs);

            // Check for compilation errors
            compiler.stderr.on('data', (data) => {
                logger.log('info', `Compiler stderr: ${data}`);
                reject(new Error(data.toString()));
            });

            compiler.on('close', (status) => {
                if (status === 0) {
                    logger.log('info', 'Compilation successful');
                    resolve();
                } else {
                    logger.log('info', `Compilation failed with code ${code}`);
                    reject(new Error(`Compilation failed with code ${code}`));
                }
            });
        });
    }

    async execute(testCases) {
        const args = ['<', 'in.txt'];

        try {
            for (let i = 0; i < testCases.length; i++) {
                fs.writeFileSync('in.txt', testCases[i].input);

                const { stdout, stderr } = await execFileAsync(
                    './a.out',
                    args,
                    { shell: true }
                );

                if (stderr) {
                    logger.log(
                        'info',
                        `Runtime error on test case ${i + 1}: ${stderr}`
                    );
                    throw new Error(stderr);
                }

                const output = String(stdout).trim();
                const expectedOutput = testCases[i].output.trim();

                if (output !== expectedOutput) {
                    logger.log('info', `Wrong Answer on test case ${i + 1}`);
                    throw new Error(
                        `Wrong Answer on test case ${
                            i + 1
                        }\nExpected: ${expectedOutput}\nGot: ${output}`
                    );
                }
            }

            // If all test cases pass, return success message
            return 'Accepted';
        } catch (error) {
            logger.log('info', `Error during execution: ${error.message}`);
            return new Error(error.message);
        }
    }

    async removeFile(filePath) {
        try {
            fs.unlinkSync(filePath);
            fs.unlinkSync('a.out');
            logger.log('info', `File ${filePath} removed successfully`);
        } catch (error) {
            logger.log(
                'info',
                `Error removing file ${filePath}: ${error.message}`
            );
        }
    }
}
