const { exec } = require('child_process');
const { fs } = require('fs');

const out = fs.createWriteStream('out.txt');
const err = fs.createWriteStream('error.txt');

function executeCppCode(fileName) {
    const command = `g++ ${fileName} && ./a.out`;
    console.log("Command for C++:", command);
    // Set standard streams to file
    process.stdout.write = out.write.bind(out);
    process.stderr.write = err.write.bind(err);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout:\n${stdout}`);
    });
}

function executeCode(fileName, lang) {
    console.log("Execute code found");
    switch (lang) {
        case 'cpp':
            executeCppCode(fileName);
            break;
        default:
            break;
    }
}

function writeToFile(body) {
    const lang = body.langkey;
    const code = body.source_code;
    const fileName = `solution.${lang}`;
    fs.writeFile(fileName, code, err => {
        if (err) {
            console.log(err);
        }
    });

    executeCode(fileName, lang);
}

// module.exports = { executeCode };