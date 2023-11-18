import CppRunner from './CppRunner.js';

function createRunner(ext) {
    let runner;
    switch (ext) {
        case 'cpp':
            runner = new CppRunner();
            break;
        default:
            runner = null;
            break;
    }
    return runner;
}

function runCode(testCases, filePath, ext, callback) {
    let runner = createRunner(ext);
    if (runner) {
        runner.run(filePath, testCases, ext, (status, message) => {
            console.log(status, message);
            if (status === 0) {
                callback('Accepted', message);
            } else {
                callback('Rejected', message);
            }
        });
    } else {
        callback('Error', `Invalid file format`);
    }
}

export { runCode };