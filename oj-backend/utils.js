import * as fs from 'fs';

function deleteFiles(path) {
    // Delete the source code and the executable file
    fs.unlinkSync(path);
    fs.unlinkSync('a.out');
}

export { deleteFiles };