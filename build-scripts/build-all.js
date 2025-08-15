import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const components = [
  { name: 'Bar', config: 'rollup.config.bar.js' },
  { name: 'Line', config: 'rollup.config.line.js' },
  { name: 'Pie', config: 'rollup.config.pie.js' }
];

console.log('🏗️  Building all Payments Association chart components...\n');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build each component
components.forEach((component, index) => {
  console.log(`📊 Building ${component.name} Chart (${index + 1}/${components.length})...`);
  
  try {
    execSync(`rollup -c ${component.config}`, { stdio: 'inherit' });
    
    const outputFile = `dist/${component.name.toLowerCase()}-payments-charts.min.js`;
    const stats = fs.statSync(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`✅ ${component.name} Chart built successfully! (${fileSizeKB}KB)\n`);
  } catch (error) {
    console.error(`❌ Failed to build ${component.name} Chart:`, error.message);
    process.exit(1);
  }
});

// Generate usage examples
generateUsageExamples();

console.log('🎉 All components built successfully!');
console.log('\n📁 Generated files in dist/:');
components.forEach(component => {
  const filename = `${component.name.toLowerCase()}-payments-charts.min.js`;
  console.log(`   • ${filename}`);
});

console.log('\n📋 Usage examples generated in dist/examples/');
console.log('\n🚀 Ready for Netlify deployment!');

function generateUsageExamples() {
  const examplesDir = 'dist/examples';
  if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
  }

  // Bar Chart Example
  const barExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bar Chart Example</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <h1>Payments Association Bar Chart Example</h1>
    
    <div id="payments-bar-chart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

    <script src="../bar-payments-charts.min.js"></script>
    <script>
        // Sample data
        const quarterlyData = [
            { name: "Q1 2024", volume: 145000, value: 32060 },
            { name: "Q2 2024", volume: 162000, value: 42150 },
            { name: "Q3 2024", volume: 158000, value: 43320 },
            { name: "Q4 2024", volume: 171000, value: 46840 }
        ];

        // Render chart
        window.PaymentsCharts.render('payments-bar-chart', {
            data: quarterlyData,
            title: 'Quarterly Payment Volume and Value',
            sourceText: 'UK Finance quarterly payment data',
            notesDescription: 'This chart shows quarterly payment trends with volume and value metrics.'
        });
    </script>
</body>
</html>`;

  // Line Chart Example
  const lineExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Line Chart Example</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <h1>Payments Association Line Chart Example</h1>
    
    <div id="payments-line-chart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

    <script src="../line-payments-charts.min.js"></script>
    <script>
        // Sample data
        const trendData = [
            { name: "Q1 2024", volume: 145000, value: 32060 },
            { name: "Q2 2024", volume: 162000, value: 42150 },
            { name: "Q3 2024", volume: 158000, value: 43320 },
            { name: "Q4 2024", volume: 171000, value: 46840 },
            { name: "Q1 2025", volume: 189000, value: 51200 }
        ];

        // Render chart
        window.PaymentsCharts.render('payments-line-chart', {
            data: trendData,
            title: 'Payment Trends Over Time',
            sourceText: 'UK Finance quarterly payment data',
            notesDescription: 'Line chart showing payment volume and value trends over time.'
        });
    </script>
</body>
</html>`;

  // Pie Chart Example
  const pieExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pie Chart Example</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <h1>Payments Association Pie Chart Example</h1>
    
    <div id="payments-pie-chart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

    <script src="../pie-payments-charts.min.js"></script>
    <script>
        // Sample data
        const methodData = [
            { name: "Card payments", volume: 145000 },
            { name: "Bank transfers", volume: 89000 },
            { name: "Digital wallets", volume: 67000 },
            { name: "Direct debit", volume: 34000 },
            { name: "Cash", volume: 12000 }
        ];

        // Render chart
        window.PaymentsCharts.render('payments-pie-chart', {
            data: methodData,
            title: 'Payment Method Distribution',
            sourceText: 'UK Finance payment method data',
            showInnerRadius: false,
            notesDescription: 'Distribution of payment methods used across transactions.'
        });
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(examplesDir, 'bar-chart-example.html'), barExample);
  fs.writeFileSync(path.join(examplesDir, 'line-chart-example.html'), lineExample);
  fs.writeFileSync(path.join(examplesDir, 'pie-chart-example.html'), pieExample);
}