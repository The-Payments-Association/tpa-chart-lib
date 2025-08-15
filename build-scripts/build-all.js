const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const components = [
  { name: 'Bar', config: 'rollup.config.bar.mjs' },
  { name: 'Line', config: 'rollup.config.line.mjs' },
  { name: 'Pie', config: 'rollup.config.pie.mjs' }
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

console.log('🎉 All components built successfully!');
console.log('\n📁 Generated files in dist/:');
components.forEach(component => {
  const filename = `${component.name.toLowerCase()}-payments-charts.min.js`;
  console.log(`   • ${filename}`);
});

console.log('\n🚀 Ready for Netlify deployment!');