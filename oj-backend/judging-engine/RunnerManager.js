import { logger } from '../index.js';
import CppRunner from './CppRunner.js';

function createRunner(ext) {
    let runner;
    switch (ext) {
        case 'cpp':
            runner = new CppRunner();
            break;
        default:
            logger.log('info', 'No Runner defined for chosen programming language');
            throw new Error('No Runner defined for chosen programming language');
    }
    return runner;
}

async function runCode(testCases, filePath, ext) {
    logger.log('info', 'Preparing Code Runner');
    try {
        let runner = createRunner(ext);
        const result = await runner.run(filePath, testCases);
        return result;
    } catch (error) {
        logger.log('info', `Error in runCode: ${error.message}`);
        throw new Error(error.message);
    }
}

export { runCode };