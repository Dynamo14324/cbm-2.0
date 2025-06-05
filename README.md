# CBM Dashboard Enhancement Project (v2.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) <!-- Assuming MIT License -->
[![Status](https://img.shields.io/badge/Status-Analysis%20Complete-green.svg)](https://github.com/Dynamo14324/cbm-2.0)
[![GitHub Stars](https://img.shields.io/github/stars/dynamo14324/cbm-2.0?style=social)](https://github.com/Dynamo14324/cbm-2.0/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/dynamo14324/cbm-2.0?style=social)](https://github.com/Dynamo14324/cbm-2.0/network/members)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

## Overview

This repository contains the analysis, findings, recommendations, and prototype code for the enhancement of a Condition-Based Monitoring (CBM) dashboard system used for monitoring vessel equipment. The project aimed to identify issues in the existing dashboard, particularly concerning data connections and analytical capabilities, and propose and prototype solutions for a significantly improved system (v2.0).

The analysis covers data structure, data connection problems, and limitations in the original dashboard. Based on these findings, an enhanced dashboard prototype (`improved_dashboard.html`, `enhanced_dashboard.css`, `enhanced_dashboard.js`) was developed, addressing key issues and incorporating improved data handling, visualization, and user experience.

## Key Documents & Code

This repository includes the following key components:

*   **Analysis Reports:**
    *   [`cbm_data_structure_analysis.md`](./cbm_data_structure_analysis.md): Detailed analysis of the underlying CBM data structure and hierarchy.
    *   [`data_connection_issues_detailed.md`](./data_connection_issues_detailed.md): In-depth breakdown of the eight critical data connection and processing issues found in the original dashboard.
    *   [`enhanced_cbm_analysis_report.md`](./enhanced_cbm_analysis_report.md): A comprehensive report summarizing the current system, identified issues, data structure analysis, and the proposed enhancement strategy.
    *   [`cbm_dashboard_findings_and_recommendations.md`](./cbm_dashboard_findings_and_recommendations.md): Executive summary of findings and actionable recommendations for further development and implementation.
*   **Enhanced Dashboard Prototype:**
    *   [`improved_dashboard.html`](./improved_dashboard.html): The HTML structure for the enhanced dashboard prototype.
    *   [`enhanced_dashboard.css`](./enhanced_dashboard.css): CSS styles for the enhanced dashboard prototype.
    *   [`enhanced_dashboard.js`](./enhanced_dashboard.js): JavaScript code implementing the frontend logic, data processing improvements, and enhanced visualizations for the prototype.

## Project Goals & Enhancements Implemented (Prototype)

The primary goal was to overcome the limitations of the original CBM dashboard. Key enhancements prototyped include:

*   **Improved Data Handling:** Robust parsing of vessel names, dates/times (including Excel formats), and comprehensive extraction of over 100 parameters.
*   **Enhanced Data Structure:** Implementation of a proper equipment hierarchy (Vessel > System > Equipment > Component) and relationships.
*   **Performance Optimization:** Concepts for improved data processing efficiency (though full backend optimization is outside the scope of this frontend prototype).
*   **Advanced Visualization:** Multiple chart types, multi-parameter display, and basic statistical analysis capabilities demonstrated in the JS code.
*   **Improved UX:** Tree-based navigation reflecting the equipment hierarchy, dynamic filtering, and a more responsive design.

## Getting Started (Prototype Viewing)

To view the enhanced dashboard prototype:

1.  Clone this repository:
    ```bash
    git clone https://github.com/Dynamo14324/cbm-2.0.git
    cd cbm-2.0
    ```
2.  Open the `improved_dashboard.html` file directly in a modern web browser.

**Note:** The prototype (`improved_dashboard.html`, `.css`, `.js`) is designed to demonstrate frontend capabilities and improved logic. It likely relies on sample data embedded within the JavaScript or requires local data files (not included in this repo) to be fully functional. The JavaScript file (`enhanced_dashboard.js`) contains the core logic for data processing and visualization enhancements.

## Recommendations Summary

Based on the analysis, key recommendations include:

*   Standardizing data collection and implementing automated validation.
*   Establishing a centralized database instead of relying on Excel files.
*   Integrating predictive maintenance algorithms and threshold-based alerting.
*   Further optimizing for mobile and implementing user roles.
*   Enhancing comparative and historical trend analysis.
*   Continuing phased deployment, user training, and feedback collection.

## Contributing

Contributions to further develop this CBM dashboard based on the analysis and prototype are welcome. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is likely intended to be licensed under the MIT License. A `LICENSE` file should be added to formalize this.

