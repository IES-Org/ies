import N3 from 'n3';
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

class OntologyProcessor {
    constructor() {
        this.store = new N3.Store();
        this.parser = new N3.Parser({ format: 'Turtle' });
        this.prefixes = {};
        this.classes = new Map();
        this.properties = new Map();
        this.metadata = new Map();
    }

    async processFile(turtleContent) {
        try {
            console.log('Starting to parse Turtle content...');

            // Parse the turtle content
            const quads = await new Promise((resolve, reject) => {
                let results = [];
                this.parser.parse(turtleContent, (error, quad, prefixes) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (quad) {
                        results.push(quad);
                    } else {
                        this.prefixes = prefixes;
                        resolve(results);
                    }
                });
            });

            console.log(`Parsed ${quads.length} quads`);

            this.store.addQuads(quads);

            // Extract ontology metadata
            this.extractMetadata();

            // Process classes
            this.extractClasses();

            // Process properties
            this.extractProperties();

            return this.generateHTML();
        } catch (error) {
            console.error('Error in processFile:', error);
            throw error;
        }
    }

    extractMetadata() {
        console.log('Extracting metadata...');
        const ontologyQuads = this.store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#Ontology'));

        if (ontologyQuads.length > 0) {
            const ontologyNode = ontologyQuads[0].subject;

            // Get basic metadata
            const metadata = {
                title: this.getValue(ontologyNode, 'http://purl.org/dc/terms/title'),
                description: this.getValue(ontologyNode, 'http://purl.org/dc/terms/description'),
                version: this.getValue(ontologyNode, 'http://www.w3.org/2002/07/owl#versionInfo'),
                created: this.getValue(ontologyNode, 'http://purl.org/dc/terms/created'),
                modified: this.getValue(ontologyNode, 'http://purl.org/dc/terms/modified'),
                publisher: this.getValue(ontologyNode, 'http://purl.org/dc/terms/publisher')
            };

            this.metadata = metadata;
            console.log('Metadata extracted:', metadata);
        }
    }

    extractClasses() {
        console.log('Extracting classes...');
        const classQuads = this.store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2000/01/rdf-schema#Class'));

        classQuads.forEach(quad => {
            const classUri = quad.subject.value;
            const classInfo = {
                uri: classUri,
                label: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#label'),
                comment: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#comment'),
                subClassOf: this.getValues(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#subClassOf')
            };
            this.classes.set(classUri, classInfo);
        });
        console.log(`Extracted ${this.classes.size} classes`);
    }

    extractProperties() {
        console.log('Extracting properties...');
        const propertyQuads = this.store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'));

        propertyQuads.forEach(quad => {
            const propUri = quad.subject.value;
            const propInfo = {
                uri: propUri,
                label: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#label'),
                comment: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#comment'),
                domain: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#domain'),
                range: this.getValue(quad.subject, 'http://www.w3.org/2000/01/rdf-schema#range')
            };
            this.properties.set(propUri, propInfo);
        });
        console.log(`Extracted ${this.properties.size} properties`);
    }

    getValue(subject, predicate) {
        const values = this.store.getQuads(subject, namedNode(predicate), null);
        return values.length > 0 ? values[0].object.value : '';
    }

    getValues(subject, predicate) {
        return this.store.getQuads(subject, namedNode(predicate), null)
            .map(quad => quad.object.value);
    }

    generateHTML() {
        console.log('Generating HTML...');
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.metadata.title || 'Ontology Documentation'}</title>
    <link rel="stylesheet" href="../../../assets/css/styles.css">
    <link rel="stylesheet" href="../../../assets/css/ontology.css">
</head>
<body>
    <header class="header">
        <h1>${this.metadata.title || 'Ontology Documentation'}</h1>
        <p>${this.metadata.description || ''}</p>
    </header>

    <nav class="nav">
        <ul class="nav-list">
            <li><a href="#metadata">Metadata</a></li>
            <li><a href="#classes">Classes</a></li>
            <li><a href="#properties">Properties</a></li>
        </ul>
    </nav>

    <main class="container">
        <section id="metadata" class="section">
            <h2>Metadata</h2>
            <dl>
                <dt>Version</dt>
                <dd>${this.metadata.version || 'N/A'}</dd>
                <dt>Created</dt>
                <dd>${this.metadata.created || 'N/A'}</dd>
                <dt>Modified</dt>
                <dd>${this.metadata.modified || 'N/A'}</dd>
                <dt>Publisher</dt>
                <dd>${this.metadata.publisher || 'N/A'}</dd>
            </dl>
        </section>

        <section id="classes" class="section">
            <h2>Classes</h2>
            ${Array.from(this.classes.values()).map(cls => `
                <div class="class-item">
                    <h3 id="${cls.uri}">${cls.label}</h3>
                    <p>${cls.comment}</p>
                    ${cls.subClassOf.length ? `
                        <p><strong>Subclass of:</strong> ${cls.subClassOf.join(', ')}</p>
                    ` : ''}
                </div>
            `).join('')}
        </section>

        <section id="properties" class="section">
            <h2>Properties</h2>
            ${Array.from(this.properties.values()).map(prop => `
                <div class="property-item">
                    <h3 id="${prop.uri}">${prop.label}</h3>
                    <p>${prop.comment}</p>
                    <p><strong>Domain:</strong> ${prop.domain}</p>
                    <p><strong>Range:</strong> ${prop.range}</p>
                </div>
            `).join('')}
        </section>
    </main>
</body>
</html>`;
    }
}

export default OntologyProcessor;