# CBM Data Structure Analysis Report

Analysis Date: 2025-04-17 17:38:58

## Overview

Total vessels analyzed: 2
Vessels: CD ULSAN, H GAETA

## Data Structure

The CBM (Condition-Based Monitoring) data follows this hierarchical structure:

1. **Vessel** - The ship being monitored (e.g., CD ULSAN, H GAETA)
2. **Equipment** - Identified by MP_NUMBER (Measurement Point Number)
3. **Component** - Identified by COMP_NAME (Component Name)
4. **Measurements** - Various parameters measured for condition monitoring

## Measurement Parameters

The key measurement parameters include:

1. **Vibration Measurements**
   - Displacement (Disp, Rms)
   - Velocity (Vel, Rms)
   - Acceleration (Acc, Rms)

2. **Bearing Condition Parameters**
   - BPFO (Ball Pass Frequency Outer race)
   - BPFI (Ball Pass Frequency Inner race)
   - BSF (Ball Spin Frequency)
   - FTF (Fundamental Train Frequency)

3. **Shaft Condition Parameters**
   - Unbalance
   - Misalignment
   - Looseness

## Data Connection Issues

Based on the analysis of the data structure and the dashboard code, the following issues were identified:

1. **Vessel Name Extraction**
   - The dashboard extracts vessel names from filenames
   - This leads to inconsistencies as filenames include 'CBM' which is not part of the vessel name

2. **Date and Time Handling**
   - Excel stores dates as numeric values (days since 1900-01-01)
   - The dashboard code may not correctly parse all date formats

3. **Limited Parameter Extraction**
   - The dashboard only extracts a small subset of available parameters
   - Many valuable bearing-specific measurements are ignored

4. **Equipment Hierarchy**
   - No clear parent-child relationships between vessels, equipment, and components
   - This makes navigation and analysis more difficult

## Recommendations

1. Implement proper vessel name extraction
2. Improve date/time parsing with robust handling of Excel formats
3. Extract all relevant measurement parameters
4. Create a proper equipment hierarchy structure
5. Implement data validation and cleaning
6. Optimize data processing for performance
7. Enhance visualization capabilities
