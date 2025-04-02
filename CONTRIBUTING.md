# Contribution Guidelines  

**Repository:** `Information Exchange Standard (IES)`  
**Description:** `Guidelines for issue reporting, documentation suggestions, and the IES controlled contribution model.`  
<!-- SPDX-License-Identifier: OGL-UK-3.0 -->  

Thank you for your interest in this repository.  
The Information Exchange Standard (IES) is developed and maintained as a cross-government initiative with contributions from various UK government organisations and technical support from approved suppliers and subject matter specialists.

The Department for Business and Trade (DBT) is the current custodian of this repository and the GitHub organisation, acting on behalf of a broader group of stakeholders.  

IES follows an **open-source governance model**, where all code is **publicly available** under open-source licences, and collaboration is invited from **approved contributors**. While direct code contributions from the general public are not currently accepted, we **welcome feedback, issue reporting, and documentation suggestions**.  

To see a list of contributing organisations and individuals, refer to [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) and the GitHub contributor insights page at [Contributors](https://github.com/IES-Org/ies/graphs/contributors).  

---  

## How You Can Contribute  

Public users and contributors are encouraged to engage in the following ways:  
- **Reporting bugs and issues** – If you find a problem, please open a GitHub issue.  
- **Suggesting documentation improvements** – Propose clarifications or additions to existing documentation.  
- **Providing structured feedback** – Use GitHub Issues to share ideas and enhancement suggestions.  

All input is welcome and will be reviewed by maintainers, but prioritisation is subject to IES goals and delivery timelines.

At this time, IES does not accept **public pull requests (PRs)** or **direct code contributions**. Contributions are limited to **approved government contributors and suppliers** working under formal arrangements.  
For contact details, refer to [MAINTAINERS.md](MAINTAINERS.md).  

---  

## Reporting Issues  
If you encounter a bug, error, or inconsistency, please follow these steps:  
1. Check for an existing issue under [Issues](https://github.com/IES-Org/ies/issues).  
2. Open a new issue if none exists. Use one of the available templates.  
3. Provide a clear and detailed description, including steps to reproduce if applicable.  
4. Use labels (bug, documentation, enhancement, etc.) where appropriate.  

For security-related concerns, do not submit a public issue. Follow our [Responsible Disclosure process](SECURITY.md).  

---  

## Documentation Feedback  

If you find an error, need clarification, or have suggestions for improving documentation:  

1. Open a GitHub issue using the `documentation` label.  
2. Describe the suggestion clearly, referencing specific content where possible.  
3. Structured, specific feedback helps us respond more effectively.  

Documentation updates are prioritised based on user impact and strategic relevance.  

---  

## IES Approach to Open-Source Development  
- **All code is published under open-source licences.**  
- **Development is led by contributors from government and approved suppliers.**  
- **Feedback is welcome and helps shape ongoing development.**  

To see what we’re working on, check the [Project Roadmap](https://github.com/information-exchange-standard/your-repo/projects). If no roadmap is currently visible, it may be under development.  

---  

## Branching Strategy  

This repository follows a **GitFlow-based branching model**:  
- **Main Branch (`main`)**: Stable, production-ready code.  
- **Develop Branch (`develop`)**: Integration of features and fixes before release.  
- **Feature Branches (`feature/*`)**: New functionality, e.g., `feature/new-auth-method`.  
- **Bugfix Branches (`bugfix/*`)**: Minor issue resolutions.  
- **Release Branches (`release/*`)**: Final testing and packaging for a stable release.  
- **Hotfix Branches (`hotfix/*`)**: Critical fixes for `main`, also merged into `develop`.  

More: [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)  

---  

## Pull Request Policy  
To maintain high-quality contributions, IES enforces the following **minimum pull request (PR) requirements** for approved contributors:  
- **All PRs must be reviewed by at least one maintainer** before merging.  
- **PRs should reference a corresponding issue** where applicable.  
- **Code changes must include relevant tests** to ensure stability.  
- **Commit messages should follow best practices**, including referencing issue numbers when relevant.  
- **Documentation updates should accompany PRs that impact functionality.**  
- **PRs should use "squash and merge" as the preferred merge strategy**, ensuring a clean history.  
- **Feature and bugfix branches should be deleted after merge** to keep the repository tidy.  
- **Force pushing to the `main` branch is strictly prohibited** to protect repository integrity.  
- **CI builds must pass before merging** to enforce basic validation checks.  
For further details, see [CONTRIBUTING.md](CONTRIBUTING.md).  

---  

## Contribution Licensing  

By submitting feedback, documentation suggestions, or issue reports, you acknowledge that any resulting contributions will be licensed under the same terms as this repository:  
- Code (if applicable) is licensed under the **MIT License**.  
- Documentation is licensed under the **Open Government Licence v3.0 (OGL v3.0)**.  

All contributions are considered Crown copyright.  

---  

## Repository Maintainers  

For current maintainers and contact information, refer to [MAINTAINERS.md](MAINTAINERS.md).  
Maintainers review issues, guide contributions, and ensure alignment with programme objectives.  

---  

**Maintained as part of the Information Exchange Standard initiative.**  

© Crown Copyright 2025. This work is currently under the custodianship of the Department for Business and Trade (UK), acting on behalf of a cross-government group of stakeholders.  
Licensed under the Open Government Licence v3.0.  

For full licensing terms, see [OGL_LICENSE.md](OGL_LICENSE.md).  
