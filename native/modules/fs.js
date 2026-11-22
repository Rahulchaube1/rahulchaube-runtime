export const readText = path => RC.readText(path);
export const writeText = (path, text) => RC.writeText(path, text);
export const readJSON = path => JSON.parse(readText(path));
export const writeJSON = (path, value) => writeText(path, JSON.stringify(value, null, 2) + "\n");
