// Enhanced CBM Dashboard JavaScript
// This script addresses the data connection issues identified in the analysis

class EnhancedCBMDashboard {
    constructor() {
        this.state = {
            vessels: new Set(),
            equipmentCodes: new Set(),
            components: new Set(),
            systems: new Set(),
            equipmentTypes: new Set(),
            data: [],
            filteredData: [],
            equipmentHierarchy: {}, // Vessel > System > Equipment > Component
            parameters: {
                vibration: [],
                bearing: [],
                shaft: [],
                other: []
            },
            charts: {},
            lastUpdate: new Date().toISOString()
        };
        
        this.init();
    }
    
    // Initialize the dashboard
    async init() {
        this.setupEventListeners();
        this.setupCharts();
        await this.loadData();
        this.updateDashboard();
    }
    
    // Set up event listeners for UI interactions
    setupEventListeners() {
        // Vessel selection
        document.getElementById('vessel-filter').addEventListener('change', () => this.updateFilters());
        
        // Year and month selection
        document.getElementById('year-filter').addEventListener('change', () => this.updateFilters());
        document.getElementById('month-filter').addEventListener('change', () => this.updateFilters());
        
        // Equipment hierarchy navigation
        document.getElementById('system-filter').addEventListener('change', () => this.updateEquipmentFilters());
        document.getElementById('equipment-type-filter').addEventListener('change', () => this.updateEquipmentFilters());
        document.getElementById('equipment-filter').addEventListener('change', () => this.updateComponentFilters());
        document.getElementById('component-filter').addEventListener('change', () => this.updateAnalysis());
        
        // Parameter selection
        document.getElementById('parameter-category').addEventListener('change', () => this.updateParameterOptions());
        document.getElementById('parameter-select').addEventListener('change', () => this.updateAnalysis());
        
        // Chart type selection
        document.getElementById('chart-type').addEventListener('change', () => this.updateChartType());
        
        // File upload
        document.getElementById('file-upload').addEventListener('change', (event) => this.handleFileUpload(event));
        
        // Dashboard refresh
        document.getElementById('refresh-dashboard').addEventListener('click', () => this.updateDashboard());
    }
    
    // Set up chart containers
    setupCharts() {
        // Overview charts
        this.state.charts.vesselStatus = new Chart(
            document.getElementById('vessel-status-chart').getContext('2d'),
            this.createChartConfig('bar', 'Vessel Status')
        );
        
        this.state.charts.equipmentTrend = new Chart(
            document.getElementById('equipment-trend-chart').getContext('2d'),
            this.createChartConfig('line', 'Equipment Trend')
        );
        
        // Equipment analysis charts
        this.state.charts.equipmentAnalysis = new Chart(
            document.getElementById('equipment-analysis-chart').getContext('2d'),
            this.createChartConfig('line', 'Equipment Analysis')
        );
        
        this.state.charts.parameterDistribution = new Chart(
            document.getElementById('parameter-distribution-chart').getContext('2d'),
            this.createChartConfig('bar', 'Parameter Distribution')
        );
    }
    
    // Create chart configuration
    createChartConfig(type, title) {
        return {
            type: type,
            data: {
                labels: [],
                datasets: [{
                    label: title,
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }
    
    // Load data from files
    async loadData() {
        try {
            // Show loading indicator
            document.getElementById('loading-indicator').style.display = 'block';
            
            // Check for cached data
            const cachedData = localStorage.getItem('cbm_dashboard_data');
            if (cachedData) {
                console.log('Loading data from cache');
                this.state.data = JSON.parse(cachedData);
                this.extractMetadata();
                document.getElementById('loading-indicator').style.display = 'none';
                return;
            }
            
            // If no cached data, load from sample files
            // const files = [
            //     '/home/ubuntu/extracted/CD ULSAN CBM.xls',
            //     '/home/ubuntu/extracted/H GAETA CBM.xls'
            // ];
            
            // Process files in parallel using Promise.all
            // await this.processFiles(files);

            // Simulate loading data directly
            const simulatedUlsanData = await this.simulateFileLoading('CD ULSAN CBM.xls', 'CD ULSAN');
            const simulatedGaetaData = await this.simulateFileLoading('H GAETA CBM.xls', 'H GAETA');
            this.state.data = [...simulatedUlsanData, ...simulatedGaetaData];
            
            // Cache the processed data
            localStorage.setItem('cbm_dashboard_data', JSON.stringify(this.state.data));
            
            // Hide loading indicator
            document.getElementById('loading-indicator').style.display = 'none';
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading-indicator').style.display = 'none';
            document.getElementById('error-message').textContent = `Error loading data: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';
        }
    }
    
    // Process multiple files in parallel
    async processFiles(files) {
        // Create an array of promises for each file
        const filePromises = files.map(file => this.processFile(file));
        
        // Wait for all files to be processed
        await Promise.all(filePromises);
        
        // Extract metadata after all files are processed
        this.extractMetadata();
    }
    
    // Process a single file
    async processFile(filePath) {
        try {
            // In a real implementation, this would use AJAX or fetch to get the file
            // For this prototype, we'll simulate loading the file
            console.log(`Processing file: ${filePath}`);
            
            // Extract vessel name from file path
            const vesselName = this.extractVesselName(filePath);
            
            // Simulate loading data from the file
            // In a real implementation, this would parse the Excel file
            const fileData = await this.simulateFileLoading(filePath, vesselName);
            
            // Add the data to the state
            this.state.data = [...this.state.data, ...fileData];
            
            console.log(`Processed ${fileData.length} rows from ${vesselName}`);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
            throw error;
        }
    }
    
    // Extract vessel name from file path
    extractVesselName(filePath) {
        // Get the base name without path
        const baseName = filePath.split('/').pop();
        
        // Remove extension and 'CBM' text
        return baseName.replace('.xls', '').replace('CBM', '').trim();
    }
    
    // Simulate loading data from a file
    async simulateFileLoading(filePath, vesselName) {
        // In a real implementation, this would parse the Excel file
        // For this prototype, we'll return simulated data
        
        // Determine which vessel we're simulating
        const isUlsan = vesselName.includes('ULSAN');
        
        // Create sample data based on the vessel
        const equipmentCount = isUlsan ? 30 : 29;
        const startDate = new Date('2023-01-22');
        const endDate = new Date('2025-04-04');
        
        // Generate equipment types and systems based on the vessel
        const equipmentTypes = ['Pump', 'Motor', 'Compressor', 'Purifier', 'Blower'];
        const systems = ['Cooling', 'Lubrication', 'Air', 'Fuel', 'Fire'];
        
        // Generate simulated data
        const data = [];
        
        for (let i = 0; i < equipmentCount; i++) {
            const equipmentType = equipmentTypes[i % equipmentTypes.length];
            const system = systems[i % systems.length];
            const equipmentNumber = `34000216${(i + 10).toString().padStart(2, '0')}`;
            
            // Create equipment and component entries
            const equipmentName = `${system} ${equipmentType} ${Math.floor(i/3) + 1}`;
            const componentName = `${equipmentType} Component ${i % 3 + 1}`;
            
            // Generate readings for this equipment
            const readingCount = 10 + Math.floor(Math.random() * 20);
            
            for (let j = 0; j < readingCount; j++) {
                // Calculate a date between start and end dates
                const readingDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
                
                // Generate measurement values
                const vibValue = 0.5 + Math.random() * 2;
                const dispValue = 0.1 + Math.random() * 0.5;
                const accValue = 1 + Math.random() * 3;
                const rpm = 1000 + Math.random() * 2000;
                
                // Generate bearing values
                const bpfoValue = 0.2 + Math.random() * 0.8;
                const bpfiValue = 0.1 + Math.random() * 0.7;
                const bsfValue = 0.3 + Math.random() * 0.6;
                const ftfValue = 0.05 + Math.random() * 0.3;
                
                // Generate shaft values
                const unbalanceValue = 0.2 + Math.random() * 1;
                const misalignmentValue = 0.1 + Math.random() * 0.8;
                const loosenessValue = 0.05 + Math.random() * 0.4;
                
                // Create a data point
                data.push({
                    VESSEL: vesselName,
                    SYSTEM: system,
                    EQUIPMENT_TYPE: equipmentType,
                    MP_NUMBER: `${equipmentNumber}-0${j % 3 + 1}`,
                    COMP_NAME: componentName,
                    COMP_NUMBER: i + 1,
                    TIMESTAMP: readingDate.toISOString(),
                    DATE: readingDate.toISOString().split('T')[0],
                    TIME: readingDate.toISOString().split('T')[1].split('.')[0],
                    'Vel, Rms (RMS)': vibValue,
                    'Disp, Rms (RMS)': dispValue,
                    'Acc, Rms (RMS)': accValue,
                    RPM1: rpm,
                    'Bearing, BPFO (RMS)': bpfoValue,
                    'Bearing, BPFI (RMS)': bpfiValue,
                    'Bearing, BSF (RMS)': bsfValue,
                    'Bearing, FTF (RMS)': ftfValue,
                    'Shaft, 10 Unbalance (RMS)': unbalanceValue,
                    'Shaft, 11 Misalignment (RMS)': misalignmentValue,
                    'Shaft, 12 Looseness, 3rd-10th harm. (RMS)': loosenessValue,
                    'Tune Status': Math.random() > 0.1 ? 'OK' : 'Missing'
                });
            }
        }
        
        return data;
    }
    
    // Extract metadata from the loaded data
    extractMetadata() {
        // Clear existing metadata
        this.state.vessels = new Set();
        this.state.equipmentCodes = new Set();
        this.state.components = new Set();
        this.state.systems = new Set();
        this.state.equipmentTypes = new Set();
        this.state.equipmentHierarchy = {};
        
        // Reset parameters
        this.state.parameters = {
            vibration: [],
            bearing: [],
            shaft: [],
            other: []
        };
        
        // Process each data point
        this.state.data.forEach(row => {
            // Extract vessel
            if (row.VESSEL) this.state.vessels.add(row.VESSEL);
            
            // Extract equipment code
            if (row.MP_NUMBER) this.state.equipmentCodes.add(row.MP_NUMBER);
            
            // Extract component
            if (row.COMP_NAME) this.state.components.add(row.COMP_NAME);
            
            // Extract system
            if (row.SYSTEM) this.state.systems.add(row.SYSTEM);
            
            // Extract equipment type
            if (row.EQUIPMENT_TYPE) this.state.equipmentTypes.add(row.EQUIPMENT_TYPE);
            
            // Build equipment hierarchy
            if (row.VESSEL && row.SYSTEM && row.EQUIPMENT_TYPE && row.MP_NUMBER && row.COMP_NAME) {
                // Initialize vessel if not exists
                if (!this.state.equipmentHierarchy[row.VESSEL]) {
                    this.state.equipmentHierarchy[row.VESSEL] = {};
                }
                
                // Initialize system if not exists
                if (!this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM]) {
                    this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM] = {};
                }
                
                // Initialize equipment type if not exists
                if (!this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM][row.EQUIPMENT_TYPE]) {
                    this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM][row.EQUIPMENT_TYPE] = {};
                }
                
                // Initialize equipment if not exists
                if (!this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM][row.EQUIPMENT_TYPE][row.MP_NUMBER]) {
                    this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM][row.EQUIPMENT_TYPE][row.MP_NUMBER] = new Set();
                }
                
                // Add component
                this.state.equipmentHierarchy[row.VESSEL][row.SYSTEM][row.EQUIPMENT_TYPE][row.MP_NUMBER].add(row.COMP_NAME);
            }
            
            // Extract parameters
            Object.keys(row).forEach(key => {
                // Skip non-parameter fields
                if (['VESSEL', 'SYSTEM', 'EQUIPMENT_TYPE', 'MP_NUMBER', 'COMP_NAME', 'COMP_NUMBER', 'TIMESTAMP', 'DATE', 'TIME', 'Tune Status'].includes(key)) {
                    return;
                }
                
                // Categorize parameter
                if (key.toLowerCase().includes('vel') || key.toLowerCase().includes('disp') || key.toLowerCase().includes('acc') || key.toLowerCase().includes('rms')) {
                    if (!this.state.parameters.vibration.includes(key)) {
                        this.state.parameters.vibration.push(key);
                    }
                } else if (key.toLowerCase().includes('bearing') || key.toLowerCase().includes('bpfo') || key.toLowerCase().includes('bpfi') || key.toLowerCase().includes('bsf') || key.toLowerCase().includes('ftf')) {
                    if (!this.state.parameters.bearing.includes(key)) {
                        this.state.parameters.bearing.push(key);
                    }
                } else if (key.toLowerCase().includes('shaft') || key.toLowerCase().includes('unbalance') || key.toLowerCase().includes('misalignment') || key.toLowerCase().includes('looseness')) {
                    if (!this.state.parameters.shaft.includes(key)) {
                        this.state.parameters.shaft.push(key);
                    }
                } else {
                    if (!this.state.parameters.other.includes(key)) {
                        this.state.parameters.other.push(key);
                    }
                }
            });
        });
        
        // Update filter options
        this.updateFilterOptions();
    }
    
    // Update filter options based on metadata
    updateFilterOptions() {
        // Update vessel filter
        const vesselFilter = document.getElementById('vessel-filter');
        vesselFilter.innerHTML = '<option value="all">All Vessels</option>';
        Array.from(this.state.vessels).sort().forEach(vessel => {
            const option = document.createElement('option');
            option.value = vessel;
            option.textContent = vessel;
            vesselFilter.appendChild(option);
        });
        
        // Update system filter
        const systemFilter = document.getElementById('system-filter');
        systemFilter.innerHTML = '<option value="all">All Systems</option>';
        Array.from(this.state.systems).sort().forEach(system => {
            const option = document.createElement('option');
            option.value = system;
            option.textContent = system;
            systemFilter.appendChild(option);
        });
        
        // Update equipment type filter
        const equipmentTypeFilter = document.getElementById('equipment-type-filter');
        equipmentTypeFilter.innerHTML = '<option value="all">All Equipment Types</option>';
        Array.from(this.state.equipmentTypes).sort().forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            equipmentTypeFilter.appendChild(option);
        });
        
        // Update parameter category filter
        const parameterCategory = document.getElementById('parameter-category');
        parameterCategory.innerHTML = '';
        Object.keys(this.state.parameters).forEach(category => {
            if (this.state.parameters[category].length > 0) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                parameterCategory.appendChild(option);
            }
        });
        
        // Update parameter options based on the first category
        this.updateParameterOptions();
        
        // Update equipment and component filters
        this.updateEquipmentFilters();
    }
    
    // Update parameter options based on selected category
    updateParameterOptions() {
        const category = document.getElementById('parameter-category').value;
        const parameterSelect = document.getElementById('parameter-select');
        
        parameterSelect.innerHTML = '';
        this.state.parameters[category].sort().forEach(parameter => {
            const option = document.createElement('option');
            option.value = parameter;
            option.textContent = parameter;
            parameterSelect.appendChild(option);
        });
        
        // Update analysis with the new parameter
        this.updateAnalysis();
    }
    
    // Update equipment filters based on selected vessel and system
    updateEquipmentFilters() {
        const vessel = document.getElementById('vessel-filter').value;
        const system = document.getElementById('system-filter').value;
        const equipmentType = document.getElementById('equipment-type-filter').value;
        
        // Get equipment codes that match the filters
        const equipmentCodes = new Set();
        
        this.state.data.forEach(row => {
            if ((vessel === 'all' || row.VESSEL === vessel) &&
                (system === 'all' || row.SYSTEM === system) &&
                (equipmentType === 'all' || row.EQUIPMENT_TYPE === equipmentType)) {
                equipmentCodes.add(row.MP_NUMBER);
            }
        });
        
        // Update equipment filter
        const equipmentFilter = document.getElementById('equipment-filter');
        equipmentFilter.innerHTML = '<option value="all">All Equipment</option>';
        Array.from(equipmentCodes).sort().forEach(code => {
            // Find a row with this equipment code to get the name
            const row = this.state.data.find(r => r.MP_NUMBER === code);
            const name = row ? `${row.EQUIPMENT_TYPE} ${code.split('-')[0].slice(-2)}` : code;
            
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            equipmentFilter.appendChild(option);
        });
        
        // Update component filters
        this.updateComponentFilters();
    }
    
    // Update component filters based on selected equipment
    updateComponentFilters() {
        const vessel = document.getElementById('vessel-filter').value;
        const system = document.getElementById('system-filter').value;
        const equipmentType = document.getElementById('equipment-type-filter').value;
        const equipment = document.getElementById('equipment-filter').value;
        
        // Get components that match the filters
        const components = new Set();
        
        this.state.data.forEach(row => {
            if ((vessel === 'all' || row.VESSEL === vessel) &&
                (system === 'all' || row.SYSTEM === system) &&
                (equipmentType === 'all' || row.EQUIPMENT_TYPE === equipmentType) &&
                (equipment === 'all' || row.MP_NUMBER === equipment)) {
                components.add(row.COMP_NAME);
            }
        });
        
        // Update component filter
        const componentFilter = document.getElementById('component-filter');
        componentFilter.innerHTML = '<option value="all">All Components</option>';
        Array.from(components).sort().forEach(component => {
            const option = document.createElement('option');
            option.value = component;
            option.textContent = component;
            componentFilter.appendChild(option);
        });
        
        // Update analysis with the new filters
        this.updateAnalysis();
    }
    
    // Update filters and refresh dashboard
    updateFilters() {
        // Update equipment filters based on the new vessel selection
        this.updateEquipmentFilters();
        
        // Update the dashboard
        this.updateDashboard();
    }
    
    // Update chart type
    updateChartType() {
        const chartType = document.getElementById('chart-type').value;
        
        // Update equipment analysis chart
        this.state.charts.equipmentAnalysis.config.type = chartType;
        this.state.charts.equipmentAnalysis.update();
        
        // Update parameter distribution chart
        this.state.charts.parameterDistribution.config.type = chartType === 'line' ? 'bar' : chartType;
        this.state.charts.parameterDistribution.update();
    }
    
    // Update the dashboard with current filters
    updateDashboard() {
        // Apply filters to get filtered data
        this.applyFilters();
        
        // Update summary metrics
        this.updateSummaryMetrics();
        
        // Update charts
        this.updateCharts();
        
        // Update last update timestamp
        this.state.lastUpdate = new Date().toISOString();
        document.getElementById('last-update').textContent = new Date().toLocaleString();
    }
    
    // Apply filters to get filtered data
    applyFilters() {
        const vessel = document.getElementById('vessel-filter').value;
        const year = document.getElementById('year-filter').value;
        const month = document.getElementById('month-filter').value;
        
        // Filter the data
        this.state.filteredData = this.state.data.filter(row => {
            // Apply vessel filter
            if (vessel !== 'all' && row.VESSEL !== vessel) {
                return false;
            }
            
            // Apply year filter
            if (year !== 'all') {
                const rowYear = new Date(row.TIMESTAMP).getFullYear().toString();
                if (rowYear !== year) {
                    return false;
                }
            }
            
            // Apply month filter
            if (month !== 'all') {
                const rowMonth = (new Date(row.TIMESTAMP).getMonth() + 1).toString().padStart(2, '0');
                if (rowMonth !== month) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Update summary metrics
    updateSummaryMetrics() {
        // Get unique vessels
        const vessels = new Set();
        this.state.filteredData.forEach(row => {
            if (row.VESSEL) vessels.add(row.VESSEL);
        });
        
        // Get unique equipment
        const equipment = new Set();
        this.state.filteredData.forEach(row => {
            if (row.MP_NUMBER) equipment.add(row.MP_NUMBER);
        });
        
        // Get date range
        let firstReading = new Date();
        let lastReading = new Date(0);
        
        this.state.filteredData.forEach(row => {
            const timestamp = new Date(row.TIMESTAMP);
            if (timestamp < firstReading) firstReading = timestamp;
            if (timestamp > lastReading) lastReading = timestamp;
        });
        
        // Calculate days since last reading
        const daysSinceReading = Math.floor((new Date() - lastReading) / (1000 * 60 * 60 * 24));
        
        // Update the UI
        document.getElementById('vessel-count').textContent = vessels.size;
        document.getElementById('equipment-count').textContent = equipment.size;
        document.getElementById('first-reading-date').textContent = firstReading.toLocaleDateString();
        document.getElementById('last-reading-date').textContent = lastReading.toLocaleDateString();
        document.getElementById('days-since-reading').textContent = daysSinceReading;
    }
    
    // Update all charts
    updateCharts() {
        this.updateVesselStatusChart();
        this.updateEquipmentTrendChart();
        this.updateAnalysis();
    }
    
    // Update vessel status chart
    updateVesselStatusChart() {
        // Get vessel status data
        const vesselStatus = {};
        
        this.state.filteredData.forEach(row => {
            if (!row.VESSEL) return;
            
            if (!vesselStatus[row.VESSEL]) {
                vesselStatus[row.VESSEL] = {
                    total: 0,
                    ok: 0
                };
            }
            
            vesselStatus[row.VESSEL].total++;
            if (row['Tune Status'] === 'OK') {
                vesselStatus[row.VESSEL].ok++;
            }
        });
        
        // Calculate percentages
        const labels = [];
        const okData = [];
        const missingData = [];
        
        Object.keys(vesselStatus).sort().forEach(vessel => {
            labels.push(vessel);
            const okPercentage = vesselStatus[vessel].total > 0 ? 
                (vesselStatus[vessel].ok / vesselStatus[vessel].total) * 100 : 0;
            okData.push(okPercentage);
            missingData.push(100 - okPercentage);
        });
        
        // Update the chart
        this.state.charts.vesselStatus.data.labels = labels;
        this.state.charts.vesselStatus.data.datasets = [
            {
                label: 'OK',
                data: okData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Missing',
                data: missingData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ];
        
        this.state.charts.vesselStatus.options.plugins.title.text = 'Vessel Status (% OK vs Missing)';
        this.state.charts.vesselStatus.options.scales.y.title = {
            display: true,
            text: 'Percentage'
        };
        
        this.state.charts.vesselStatus.update();
    }
    
    // Update equipment trend chart
    updateEquipmentTrendChart() {
        // Get equipment trend data by month
        const trendData = {};
        
        this.state.filteredData.forEach(row => {
            if (!row.TIMESTAMP) return;
            
            const date = new Date(row.TIMESTAMP);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!trendData[yearMonth]) {
                trendData[yearMonth] = {
                    total: 0,
                    ok: 0
                };
            }
            
            trendData[yearMonth].total++;
            if (row['Tune Status'] === 'OK') {
                trendData[yearMonth].ok++;
            }
        });
        
        // Sort by date
        const sortedMonths = Object.keys(trendData).sort();
        
        // Prepare chart data
        const labels = sortedMonths.map(ym => {
            const [year, month] = ym.split('-');
            return `${year}-${month}`;
        });
        
        const okData = sortedMonths.map(ym => trendData[ym].ok);
        const missingData = sortedMonths.map(ym => trendData[ym].total - trendData[ym].ok);
        
        // Update the chart
        this.state.charts.equipmentTrend.data.labels = labels;
        this.state.charts.equipmentTrend.data.datasets = [
            {
                label: 'OK Readings',
                data: okData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                type: 'line',
                fill: false
            },
            {
                label: 'Missing Readings',
                data: missingData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                type: 'line',
                fill: false
            }
        ];
        
        this.state.charts.equipmentTrend.options.plugins.title.text = 'Equipment Readings Trend by Month';
        this.state.charts.equipmentTrend.options.scales.y.title = {
            display: true,
            text: 'Reading Count'
        };
        
        this.state.charts.equipmentTrend.update();
    }
    
    // Update equipment analysis
    updateAnalysis() {
        const vessel = document.getElementById('vessel-filter').value;
        const system = document.getElementById('system-filter').value;
        const equipmentType = document.getElementById('equipment-type-filter').value;
        const equipment = document.getElementById('equipment-filter').value;
        const component = document.getElementById('component-filter').value;
        const parameter = document.getElementById('parameter-select').value;
        const chartType = document.getElementById('chart-type').value;
        
        // Filter data for analysis
        const analysisData = this.state.filteredData.filter(row => {
            return (vessel === 'all' || row.VESSEL === vessel) &&
                   (system === 'all' || row.SYSTEM === system) &&
                   (equipmentType === 'all' || row.EQUIPMENT_TYPE === equipmentType) &&
                   (equipment === 'all' || row.MP_NUMBER === equipment) &&
                   (component === 'all' || row.COMP_NAME === component);
        });
        
        // Group by equipment and sort by timestamp
        const groupedData = {};
        
        analysisData.forEach(row => {
            if (!row.MP_NUMBER || !row.TIMESTAMP || row[parameter] === undefined) return;
            
            const key = `${row.VESSEL} - ${row.MP_NUMBER} - ${row.COMP_NAME}`;
            
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            
            groupedData[key].push({
                timestamp: new Date(row.TIMESTAMP),
                value: parseFloat(row[parameter]) || 0
            });
        });
        
        // Sort each group by timestamp
        Object.keys(groupedData).forEach(key => {
            groupedData[key].sort((a, b) => a.timestamp - b.timestamp);
        });
        
        // Prepare chart data
        const datasets = [];
        const colors = [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];
        
        Object.keys(groupedData).sort().forEach((key, index) => {
            const color = colors[index % colors.length];
            
            datasets.push({
                label: key,
                data: groupedData[key].map(item => ({
                    x: item.timestamp,
                    y: item.value
                })),
                backgroundColor: color.replace('1)', '0.5)'),
                borderColor: color,
                borderWidth: 1,
                fill: false,
                tension: 0.1
            });
        });
        
        // Update the chart
        this.state.charts.equipmentAnalysis.config.type = chartType;
        this.state.charts.equipmentAnalysis.data.datasets = datasets;
        this.state.charts.equipmentAnalysis.options.plugins.title.text = `${parameter} Analysis`;
        this.state.charts.equipmentAnalysis.options.scales.x = {
            type: 'time',
            time: {
                unit: 'day'
            },
            title: {
                display: true,
                text: 'Date'
            }
        };
        this.state.charts.equipmentAnalysis.options.scales.y.title = {
            display: true,
            text: parameter
        };
        
        this.state.charts.equipmentAnalysis.update();
        
        // Update parameter distribution chart
        this.updateParameterDistribution(analysisData, parameter);
    }
    
    // Update parameter distribution chart
    updateParameterDistribution(data, parameter) {
        // Calculate statistics
        const values = data.map(row => parseFloat(row[parameter]) || 0).filter(val => !isNaN(val));
        
        if (values.length === 0) {
            // No data available
            this.state.charts.parameterDistribution.data.labels = [];
            this.state.charts.parameterDistribution.data.datasets = [];
            this.state.charts.parameterDistribution.update();
            return;
        }
        
        // Calculate min, max, mean, median
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        // Calculate median
        const sortedValues = [...values].sort((a, b) => a - b);
        const median = sortedValues.length % 2 === 0 ?
            (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2 :
            sortedValues[Math.floor(sortedValues.length / 2)];
        
        // Calculate standard deviation
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // Create histogram
        const binCount = 10;
        const binWidth = (max - min) / binCount;
        const bins = Array(binCount).fill(0);
        
        values.forEach(val => {
            const binIndex = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
            bins[binIndex]++;
        });
        
        // Create bin labels
        const binLabels = Array(binCount).fill(0).map((_, i) => {
            const start = min + i * binWidth;
            const end = min + (i + 1) * binWidth;
            return `${start.toFixed(2)} - ${end.toFixed(2)}`;
        });
        
        // Update the chart
        this.state.charts.parameterDistribution.data.labels = binLabels;
        this.state.charts.parameterDistribution.data.datasets = [
            {
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ];
        
        this.state.charts.parameterDistribution.options.plugins.title.text = `${parameter} Distribution`;
        this.state.charts.parameterDistribution.options.scales.y.title = {
            display: true,
            text: 'Frequency'
        };
        
        this.state.charts.parameterDistribution.update();
        
        // Update statistics display
        document.getElementById('stat-min').textContent = min.toFixed(4);
        document.getElementById('stat-max').textContent = max.toFixed(4);
        document.getElementById('stat-mean').textContent = mean.toFixed(4);
        document.getElementById('stat-median').textContent = median.toFixed(4);
        document.getElementById('stat-stddev').textContent = stdDev.toFixed(4);
        document.getElementById('stat-count').textContent = values.length;
    }
    
    // Handle file upload
    handleFileUpload(event) {
        const files = event.target.files;
        
        if (files.length === 0) {
            return;
        }
        
        // Clear existing data
        this.state.data = [];
        localStorage.removeItem('cbm_dashboard_data');
        
        // Process the uploaded files
        this.processFiles(Array.from(files).map(file => file.name))
            .then(() => {
                // Update the dashboard
                this.updateDashboard();
            })
            .catch(error => {
                console.error('Error processing uploaded files:', error);
                document.getElementById('error-message').textContent = `Error processing uploaded files: ${error.message}`;
                document.getElementById('error-message').style.display = 'block';
            });
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new EnhancedCBMDashboard();
});
