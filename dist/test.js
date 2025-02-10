"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
async function main() {
    try {
        const newMapper = await (0, _1.mapRepository)('.', {
            maxDepth: 4,
            ignorePatterns: ['node_modules', '.git',],
        });
        console.log(newMapper);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
main();
