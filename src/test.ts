import { mapRepository } from ".";


async function main() {
    try {
        const newMapper = await mapRepository('.',{
            maxDepth: 4,
            ignorePatterns: ['node_modules','.git',],
        });
        console.log(newMapper)
    } catch (error) {
        console.error('Error:', error);
    }
}


main();