import { promises as fs } from 'fs';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import OntologyProcessor from './ontology-processor.js';

async function processOntologyFile(directoryPath) {
    try {
        // Ensure the directory path is absolute
        const absolutePath = path.resolve(directoryPath);

        // Construct paths
        const inputPath = path.join(absolutePath, 'ontology.ttl');
        const outputPath = path.join(absolutePath, 'ontology.html');

        // Check if ontology.ttl exists
        try {
            await fs.access(inputPath);
        } catch (error) {
            throw new Error(`Could not find ontology.ttl in ${absolutePath}`);
        }

        console.log(`Reading ontology file: ${inputPath}`);

        // Read and process the ontology file
        const content = await fs.readFile(inputPath, 'utf8');
        console.log('File content loaded, creating processor...');

        const processor = new OntologyProcessor();
        console.log('Processing ontology content...');

        try {
            const html = await processor.processFile(content);
            console.log('Generated HTML content');

            // Write the HTML output
            await fs.writeFile(outputPath, html);
            console.log(`Successfully written documentation to: ${outputPath}`);
        } catch (processError) {
            console.error('Error processing ontology:', processError);
            if (processError.message.includes('Unexpected')) {
                console.error('This appears to be a Turtle syntax error.');
                console.error('Problem area:');
                const lines = content.split('\n');
                const lineNumber = parseInt(processError.message.match(/line (\d+)/)?.[1]);
                if (lineNumber) {
                    console.error(`Line ${lineNumber-1}: ${lines[lineNumber-2]}`);
                    console.error(`Line ${lineNumber}: ${lines[lineNumber-1]} <- ERROR`);
                    console.error(`Line ${lineNumber+1}: ${lines[lineNumber]}`);
                }
            }
            throw processError;
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Get directory path from command line argument
const directoryPath = process.argv[2];

if (!directoryPath) {
    console.error('Please provide the directory path containing ontology.ttl');
    console.error('Usage: node build-docs.js <directory-path>');
    process.exit(1);
}

// First, create package.json with type: module if it doesn't exist
const packageJsonPath = './package.json';
if (!existsSync(packageJsonPath)) {
    const packageJson = {
        "type": "module",
        "private": true
    };
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

processOntologyFile(directoryPath);