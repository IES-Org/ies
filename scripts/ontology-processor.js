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
            this.extractMetadata();
            this.extractClasses();
            this.extractProperties();
            return this.generateHTML();
        } catch (error) {
            console.error('Error in processFile:', error);
            throw error;
        }
    }

    createLink(uri) {
        // Check if it's a class or property we know about
        const isClass = this.classes.has(uri);
        const isProperty = this.properties.has(uri);
        
        if (!isClass && !isProperty) {
            return this.formatURI(uri);
        }

        // Get the label if available
        let label = uri;
        if (isClass) {
            label = this.classes.get(uri).label || this.formatURI(uri);
        } else if (isProperty) {
            label = this.properties.get(uri).label || this.formatURI(uri);
        }

        return `<a href="#${encodeURIComponent(uri)}">${label}</a>`;
    }

    formatURI(uri) {
        // Try to use prefix if available
        for (const [prefix, namespace] of Object.entries(this.prefixes)) {
            if (uri.startsWith(namespace)) {
                return `${prefix}:${uri.slice(namespace.length)}`;
            }
        }
        return uri;
    }

    extractMetadata() {
        console.log('Extracting metadata...');
        const ontologyQuads = this.store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 
            namedNode('http://www.w3.org/2002/07/owl#Ontology'));
        
        if (ontologyQuads.length > 0) {
            const ontologyNode = ontologyQuads[0].subject;
            this.metadata = {
                title: this.getValue(ontologyNode, 'http://purl.org/dc/terms/title'),
                description: this.getValue(ontologyNode, 'http://purl.org/dc/terms/description'),
                version: this.getValue(ontologyNode, 'http://www.w3.org/2002/07/owl#versionInfo'),
                created: this.getValue(ontologyNode, 'http://purl.org/dc/terms/created'),
                modified: this.getValue(ontologyNode, 'http://purl.org/dc/terms/modified'),
                publisher: this.getValue(ontologyNode, 'http://purl.org/dc/terms/publisher')
            };
            console.log('Metadata extracted:', this.metadata);
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/ies-pub/assets/css/styles.css">
    <link rel="stylesheet" href="/ies-pub/assets/css/ontology.css">
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
            ${Array.from(this.classes.values()).sort((a, b) => a.label.localeCompare(b.label)).map(cls => `
                <div class="class-item">
                    <h3 id="${encodeURIComponent(cls.uri)}">${cls.label}</h3>
                    <p class="uri">${this.formatURI(cls.uri)}</p>
                    <p>${cls.comment}</p>
                    ${cls.subClassOf.length ? `
                        <p><strong>Subclass of:</strong> ${cls.subClassOf.map(uri => this.createLink(uri)).join(', ')}</p>
                    ` : ''}
                </div>
            `).join('')}
        </section>

        <section id="properties" class="section">
            <h2>Properties</h2>
            ${Array.from(this.properties.values()).sort((a, b) => a.label.localeCompare(b.label)).map(prop => `
                <div class="property-item">
                    <h3 id="${encodeURIComponent(prop.uri)}">${prop.label}</h3>
                    <p class="uri">${this.formatURI(prop.uri)}</p>
                    <p>${prop.comment}</p>
                    ${prop.domain ? `<p><strong>Domain:</strong> ${this.createLink(prop.domain)}</p>` : ''}
                    ${prop.range ? `<p><strong>Range:</strong> ${this.createLink(prop.range)}</p>` : ''}
                </div>
            `).join('')}
        </section>
    </main>

    <script>
        // Highlight the current entity when navigating via hash
        function highlightCurrent() {
            // Remove any existing highlights
            document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
            
            // Add highlight to current target
            if (location.hash) {
                const target = document.querySelector(location.hash);
                if (target) {
                    target.closest('.class-item, .property-item').classList.add('highlighted');
                    target.scrollIntoView();
                }
            }
        }

        window.addEventListener('hashchange', highlightCurrent);
        window.addEventListener('load', highlightCurrent);
    </script>
</body>
</html>`;
    }
}

export default OntologyProcessor;
