# Detailed Analysis of CBM Dashboard Data Connection Issues

## Overview

After thorough examination of the CBM dashboard files, Excel data sources, and code structure, we have identified several critical data connection issues that are preventing the dashboard from functioning properly. This document provides a detailed analysis of each issue along with specific recommendations for resolution.

## 1. Vessel Name Extraction Issues

### Problem Description
The dashboard attempts to extract vessel names directly from filenames rather than from a dedicated field within the data:

```javascript
// Extract vessel name from filename (remove extension)
const vesselName = file.name.replace(/\.[^/.]+$/, "");
```

This approach causes several problems:
- Filenames contain "CBM" which is not part of the vessel name (e.g., "CD ULSAN CBM.xls")
- Vessel names may contain spaces that are inconsistently handled
- The extraction doesn't account for potential special characters or formatting in filenames
- There's no validation to ensure extracted names match expected vessel naming conventions

### Impact
- Inconsistent vessel identification across the dashboard
- Filtering by vessel may not work correctly
- Data from the same vessel with slightly different filename formats may be treated as separate vessels
- No standardization of vessel naming conventions

### Specific Examples
- "CD ULSAN CBM.xls" becomes "CD ULSAN CBM" instead of just "CD ULSAN"
- "H GAETA CBM.xls" becomes "H GAETA CBM" instead of just "H GAETA"

## 2. Date and Time Parsing Challenges

### Problem Description
The dashboard attempts to handle various date formats but has significant limitations:

```javascript
// Create proper timestamp from DATE and TIME columns
let timestamp;
if (row.DATE !== undefined && row.TIME !== undefined) {
    timestamp = this.formatTimestamp(row.DATE, row.TIME);
} else if (row.TIMESTAMP !== undefined) {
    timestamp = this.formatTimestamp(row.TIMESTAMP);
} else {
    timestamp = new Date().toISOString();
}
```

Issues include:
- Excel stores dates as numeric values (days since 1900-01-01)
- The Power Query code in pasted_content.txt shows complex date/time transformations that aren't properly handled in the dashboard
- The dashboard code doesn't account for different regional date formats
- Fallback to current date when parsing fails leads to incorrect timestamps
- No timezone handling or standardization

### Impact
- Incorrect time series data visualization
- Chronological sorting issues
- Inaccurate "days since reading" calculations
- Time-based filtering may not work correctly
- Trend analysis becomes unreliable due to timestamp inconsistencies

### Specific Examples
- In the Power Query, there's a complex transformation:
```
#"Split Column by Positions" = Table.SplitColumn(Table.TransformColumnTypes(#"Changed Type", {{"TIME", type text}}, "en-IN"), "TIME", Splitter.SplitTextByPositions({0, 10}), {"TIME.1", "TIME.2"})
```
- This transformation isn't properly handled in the dashboard code

## 3. Limited Parameter Extraction

### Problem Description
The dashboard only extracts a small subset of the available parameters:

```javascript
// Create a clean data object with all relevant fields
const cleanRow = {
    VESSEL: vesselName,
    EQUIPMENT_CODE: equipmentCode,
    MP_NUMBER: equipmentCode,
    COMP_NAME: component,
    TIMESTAMP: timestamp,
    DATE: row.DATE,
    TIME: row.TIME,
    'Vel, Rms (RMS)': parseFloat(row['Vel, Rms (RMS)']) || 0,
    'Disp, Rms (RMS)': parseFloat(row['Disp, Rms (RMS)']) || 0,
    'Acc, Rms (RMS)': parseFloat(row['Acc, Rms (RMS)']) || 0,
    RPM1: parseFloat(row.RPM1) || 0,
    ALT_1: parseFloat(row.ALT_1) || 0
};
```

Our analysis of the Excel files revealed:
- Over 100 columns of measurement data are available
- Critical bearing-specific measurements are ignored
- Shaft condition parameters are not extracted
- Specialized measurements for different equipment types are not utilized

### Impact
- Limited analytical capabilities in the dashboard
- Inability to perform comprehensive equipment health assessment
- Missing early warning indicators for specific failure modes
- Reduced diagnostic capabilities for maintenance planning
- Inability to correlate different measurement types

### Specific Examples
- Bearing-specific measurements like BPFO, BPFI, BSF, and FTF are available in the data but not used
- Shaft condition parameters like unbalance, misalignment, and looseness are ignored
- Equipment-specific measurements for different component types are not utilized

## 4. Equipment Code and Component Handling Issues

### Problem Description
The dashboard uses `MP_NUMBER` as the equipment code without properly establishing relationships:

```javascript
// Extract equipment code and component name
const equipmentCode = row.MP_NUMBER || '';
const component = row.COMP_NAME || '';
```

Issues include:
- The Excel files have both `MP_NUMBER` and `COMP_NUMBER` fields
- The relationship between these fields is not clearly established
- No parent-child relationship is defined between equipment and components
- No equipment type categorization is implemented
- No validation of equipment codes against expected formats

### Impact
- Incorrect equipment filtering and grouping
- Inability to navigate the natural hierarchy of marine equipment
- Difficulty in comparing similar equipment across vessels
- Limited ability to aggregate data at appropriate levels
- No equipment type-specific analysis capabilities

### Specific Examples
- Equipment like "3400021689-01" (Main Cooling S.W. Pump No 1) and its motor "3400021690-01" (E/M - Main Cooling S.W. Pump No 1) are not linked
- No way to view all pumps or all motors across the fleet
- Cannot easily compare the same equipment type across different vessels

## 5. Missing Data Validation

### Problem Description
The code lacks proper validation for the imported data:

```javascript
// Add to sets for filtering
if (equipmentCode) this.state.equipmentCodes.add(equipmentCode);
if (component) this.state.components.add(component);
```

Issues include:
- No validation of data types or value ranges
- Minimal handling of missing or null values (using || 0)
- No error reporting for malformed data
- No data quality indicators
- No handling of outliers or anomalous values

### Impact
- Unreliable dashboard behavior with inconsistent data
- Potential for incorrect calculations or visualizations
- No visibility into data quality issues
- Inability to filter out problematic data points
- No confidence indicators for analysis results

### Specific Examples
- Missing values are replaced with 0, which can skew averages and trends
- No validation that measurement values are within expected ranges for equipment type
- No flagging of potentially erroneous readings

## 6. Inefficient Data Processing

### Problem Description
The data processing approach is inefficient:

```javascript
// Process each file
const processNextFile = (index) => {
    // ...processing logic...
};
```

Issues include:
- Files are processed sequentially rather than in parallel
- All data is kept in memory, causing performance issues with large datasets
- No data caching or persistence between sessions
- No progress indicators for long-running operations
- No chunking of large datasets

### Impact
- Slow dashboard loading times
- Poor performance with large datasets
- Memory consumption issues
- No persistence of processed data between sessions
- Poor user experience during data loading

### Specific Examples
- Loading multiple vessel data files causes significant delays
- No progress indication during file processing
- Dashboard becomes unresponsive with larger datasets

## 7. Limited Data Visualization Capabilities

### Problem Description
The dashboard's visualization capabilities are limited:

```javascript
// Update equipment chart
updateEquipmentChart(data, parameter) {
    // ...chart creation logic...
}
```

Issues include:
- Only basic line charts are used
- No advanced analytics or statistical processing
- Limited comparison capabilities between different parameters
- No predictive or trend analysis
- No threshold-based alerting

### Impact
- Limited insight generation from the data
- Difficulty in identifying patterns or trends
- No early warning capabilities for equipment issues
- Limited ability to compare different measurement types
- No predictive maintenance capabilities

### Specific Examples
- Cannot easily compare vibration measurements with bearing condition parameters
- No trend line or anomaly detection
- No statistical analysis of measurement distributions

## 8. Missing Equipment Hierarchy

### Problem Description
The dashboard lacks a proper equipment hierarchy structure:

```javascript
// Equipment analysis filters
document.getElementById('equipment-vessel').addEventListener('change', () => this.updateEquipmentFilters());
document.getElementById('equipment-code').addEventListener('change', () => this.updateEquipmentFilters());
document.getElementById('equipment-component').addEventListener('change', () => this.updateEquipmentAnalysis());
```

Issues include:
- No clear parent-child relationships between vessels, equipment, and components
- Filtering is simplistic and doesn't reflect the natural hierarchy
- No equipment type categorization
- No ability to view all similar equipment across vessels
- No standardized naming conventions for equipment types

### Impact
- Difficult navigation and analysis
- Inability to perform fleet-wide equipment type analysis
- Limited comparative analysis capabilities
- Inefficient filtering and selection
- Poor user experience for equipment selection

### Specific Examples
- Cannot easily view all pumps across all vessels
- No way to compare the same equipment type across different vessels
- Cannot drill down from vessel to system to equipment to component

## Conclusion

These data connection issues collectively result in a dashboard that doesn't properly connect with the rich data available in the Excel files. Addressing these issues will significantly enhance the dashboard's analytical capabilities and user experience, enabling more effective condition-based monitoring and maintenance planning.

The next section of our analysis will focus on specific solutions and implementation strategies to resolve these issues.
