# IES Ontologies Documentation Repository

This repository hosts the documentation for Information Exchange Standard (IES) ontologies, serving them via GitHub Pages.

## Repository Structure

```
ies-pub/
├── .git/                    # Git repository files
├── .github/                 # GitHub-specific configuration
│   ├── settings.yml
│   └── workflows/           # GitHub Actions workflows
│       └── update-docs.yml  # Automated documentation update workflow
├── docs/                    # GitHub Pages content (deployed as website)
│   ├── assets/              # Shared resources
│   │   ├── css/             # Stylesheet files
│   │   ├── js/              # JavaScript files
│   │   ├── img/             # Images and icons
│   │   └── fonts/           # Web fonts (if needed)
│   ├── iescommon/           # IES Common ontology documentation
│   │   ├── index.html       # Landing page for IES Common
│   │   ├── v4.x/            # Version 4.x documentation
│   │   │   └── ontology.ttl # Ontology file
│   │   │   └── ontology.html# Generated HTML documentation
│   │   └── v5.x/            # Version 5.0 documentation
│   ├── iesbuild/            # IES Build ontology documentation
│   ├── iesnsd/              # IES N ational Security & Defence ontology documentation
│   ├── iespeople/           # IES People ontology documentation
│   ├── iessystems/          # IES Systems ontology documentation
│   └── index.html           # Main landing page
├── scripts/                 # Documentation generation scripts
│   ├── build-docs.js        # Generates HTML from ontology files
│   ├── ontology-processor.js# Processes ontology files
│   ├── package.json         # Node.js dependencies
│   ├── node_modules         # Installed Node.js packages (git-ignored)
│   └── README.md            # This README doc
├── .gitignore               # Git ignore rules
├── LICENSE                  # Repository licence
└── README.md                # This file
```

## Web Styling and Assets

The documentation site uses modern CSS for styling:

- **Main Stylesheet**: `docs/assets/css/styles.css` contains the base styles for the entire site
- **Ontology-specific Stylesheet**: `docs/assets/css/ontology.css` styles specific to ontology documentation
- **Fonts**: Uses Google Fonts (Inter for text, JetBrains Mono for code)
- **JavaScript**: Minimal JS for interactive features like the "back to top" button
- **Responsive Design**: Adapts to different screen sizes and devices

### Style Customization

To modify the appearance:

1. Edit `docs/assets/css/styles.css` for global changes
2. Edit `docs/assets/css/ontology.css` for ontology documentation-specific styling
3. Regenerate HTML files if CSS path or imported fonts change

## Content Synchronization

Content is automatically copied from source repositories to this documentation repository using GitHub Actions.

### How Content Sync Works

1. Source repositories trigger an event when documentation changes (as a new release)
2. GitHub Actions workflow (`update-docs.yml`) receives the event
3. The workflow:
   - Checks out both repositories
   - Copies updated content to the right location in this repo
   - Commits and pushes changes
   - GitHub Pages automatically rebuilds (if enabled in settings)

### Workflow Configuration

The `update-docs.yml` workflow uses an organization-level PAT (`IES_ONTOLOGIES_PAT`) for authentication.

Source repositories must have a similar workflow that triggers the documentation update:

```yaml
name: Trigger Docs Update
on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'  # path where docs live in source repos
jobs:
  trigger-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger documentation repository workflow
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.IES_ONTOLOGIES_PAT }}
          repository: your-org/ies-pub  # this docs repository
          event-type: update-docs
          client-payload: '{"repo": "${{ github.repository }}", "ref": "${{ github.sha }}", "path": "docs"}'
```

## Ontology Documentation Generator

The repository includes scripts to generate HTML documentation from ontology TTL files.

### How to Use `build-docs.js`

1. Ensure prerequisites are installed:
   ```bash
   cd scripts
   npm install
   ```

2. Run the script with the directory containing an `ontology.ttl` file:
   ```bash
   node scripts/build-docs.js docs/iescommon/v4.3
   ```

3. This generates `ontology.html` in the same directory

### Files and Their Roles

- **build-docs.js**: Entry point script that processes a directory
- **ontology-processor.js**: Parses TTL files and generates HTML
- **package.json**: Lists dependencies (primarily 'n3' for RDF processing)

### Troubleshooting the Documentation Generator

- If you encounter parsing errors, check the Turtle syntax
- Make sure prefix declarations have no spaces between prefix names and colons
- If the HTML doesn't include updated styles, regenerate the HTML files

## GitHub Pages Configuration

### Activating GitHub Pages

1. Go to the repository's Settings
2. Click on "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Select the branch (usually `main` or `master`)
5. Select `/docs` as the directory
6. Click "Save"

### Deactivating GitHub Pages

1. Go to the repository's Settings
2. Click on "Pages" in the left sidebar
3. Under "Source", change the selection to "None"
4. Click "Save"

### Custom Domain Configuration

To use `informationexchangestandard.org`:

1. Go to the repository's Settings > Pages
2. Under "Custom domain", enter `informationexchangestandard.org`
3. Click "Save"
4. Check "Enforce HTTPS" when available (after DNS propagation)

**DNS Configuration Required:**
1. Add a CNAME record with your domain registrar:
   - Type: CNAME
   - Host: www or @ (depending on whether you want www.informationexchangestandard.org or informationexchangestandard.org)
   - Value: `your-org.github.io`
   - TTL: 3600 (or as recommended)

2. Or, for apex domain (no www):
   - Type: A
   - Host: @
   - Value: 185.199.108.153
           185.199.109.153
           185.199.110.153
           185.199.111.153
   - TTL: 3600

3. Add a `CNAME` file to the `/docs` directory containing:
   ```
   informationexchangestandard.org
   ```

## Additional Information

### Caching and Updates

- GitHub Pages has CDN caching, changes might take a few minutes to appear
- Force refresh browsers with Ctrl+F5 or Cmd+Shift+R to see updates

### Security Considerations

- Do not store sensitive information in this repository
- Be careful with the organization PAT's permissions

### Future Improvements

- Consider adding search functionality
- Add versioning comparison tools
- Implement ontology visualization features

### Support

If you encounter any issues, please open an issue in this repository.