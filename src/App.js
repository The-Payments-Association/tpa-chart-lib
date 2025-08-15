import React, { useState, useEffect } from 'react';
import './App.css';

// Import your chart components (you'll need to create these from your existing JSX)
import PaymentsPieChart from './components/PaymentsPieChart';
import PaymentsLineChart from './components/PaymentsLineChart';
import PaymentsBarChart from './components/PaymentsBarChart';

function App() {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [mobileColumnVisible, setMobileColumnVisible] = useState(true);
  const [devControlsMinimized, setDevControlsMinimized] = useState(false);
  const [activeChartType, setActiveChartType] = useState('all');
const [status] = useState({ type: 'ready', text: 'All Charts Loaded' });

  // Sample data
  const sampleData = {
    singleBar: [
      { name: "Q1 2024", volume: 145000 },
      { name: "Q2 2024", volume: 162000 },
      { name: "Q3 2024", volume: 158000 },
      { name: "Q4 2024", volume: 171000 },
    ],
    twoBar: [
      { name: "Q1 2024", volume: 145000, value: 32060 },
      { name: "Q2 2024", volume: 162000, value: 42150 },
      { name: "Q3 2024", volume: 158000, value: 43320 },
      { name: "Q4 2024", volume: 171000, value: 46840 },
      { name: "Q1 2025", volume: 189000, value: 51200 },
      { name: "Q2 2025", volume: 203000, value: 56780 },
    ],
    threeBar: [
      { name: "Q1 2024", volume: 145000, value: 32060, count: 12500 },
      { name: "Q2 2024", volume: 162000, value: 42150, count: 15300 },
      { name: "Q3 2024", volume: 158000, value: 43320, count: 14800 },
      { name: "Q4 2024", volume: 171000, value: 46840, count: 16200 },
    ],
    paymentMethods: [
      { name: "Card payments", volume: 145000 },
      { name: "Bank transfers", volume: 89000 },
      { name: "Digital wallets", volume: 67000 },
      { name: "Direct debit", volume: 34000 },
      { name: "Cash", volume: 12000 },
      { name: "Cheques", volume: 3000 },
    ],
    monthly: [
      { name: "Jan 2024", volume: 145000, value: 32060 },
      { name: "Feb 2024", volume: 162000, value: 42150 },
      { name: "Mar 2024", volume: 158000, value: 43320 },
      { name: "Apr 2024", volume: 171000, value: 46840 },
      { name: "May 2024", volume: 189000, value: 51200 },
      { name: "Jun 2024", volume: 203000, value: 56780 },
      { name: "Jul 2024", volume: 195000, value: 54300 },
      { name: "Aug 2024", volume: 187000, value: 52100 },
      { name: "Sep 2024", volume: 201000, value: 58200 },
      { name: "Oct 2024", volume: 215000, value: 61800 },
      { name: "Nov 2024", volume: 208000, value: 59400 },
      { name: "Dec 2024", volume: 225000, value: 65000 },
    ],
  };

  // Chart configurations
  const chartConfigs = [
    {
      id: "bar-single",
      data: "singleBar",
      title: "Quarterly Payment Volume",
      type: "bar",
      notes: "Shows quarterly payment volume trends for 2024. Data represents transaction counts in thousands.",
    },
    {
      id: "bar-stacked-two",
      data: "twoBar",
      title: "Payment Volume vs Value",
      type: "bar",
      stacked: true,
      notes: "Compares payment volume (count) against transaction value (£m) across quarters.",
    },
    {
      id: "bar-stacked-three",
      data: "threeBar",
      title: "Payment Metrics Overview",
      type: "bar",
      stacked: true,
      notes: "Comprehensive view of volume, value, and count metrics for quarterly payments analysis.",
    },
    {
      id: "line-single",
      data: "singleBar",
      title: "Payment Volume Trend",
      type: "line",
      notes: "Time series analysis of payment volume growth across quarters.",
    },
    {
      id: "line-multi",
      data: "twoBar",
      title: "Multi-Metric Trends",
      type: "line",
      notes: "Comparative trend analysis showing volume and value metrics over time.",
    },
    {
      id: "line-large",
      data: "monthly",
      title: "Monthly Payment Trends",
      type: "line",
      notes: "Detailed monthly payment trends with mobile pagination for large datasets.",
    },
    {
      id: "pie-standard",
      data: "paymentMethods",
      title: "Payment Method Distribution",
      type: "pie",
      notes: "Market share analysis of different payment methods used in transactions.",
    },
    {
      id: "pie-donut",
      data: "paymentMethods",
      title: "Payment Methods (Donut)",
      type: "pie",
      showInnerRadius: true,
      notes: "Donut chart representation of payment method market share with central space for additional data.",
    },
    {
      id: "pie-payment-methods",
      data: "paymentMethods",
      title: "UK Payment Landscape",
      type: "pie",
      showLabels: true,
      notes: "Comprehensive UK payment landscape showing market distribution with detailed labels.",
    },
  ];

  // Auto-minimize dev controls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!devControlsMinimized) {
        setDevControlsMinimized(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [devControlsMinimized]);

  // Handle auto-refresh
  useEffect(() => {
    let interval;
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        window.location.reload();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  const toggleMobileColumn = () => {
    setMobileColumnVisible(!mobileColumnVisible);
  };

  const toggleDevControls = () => {
    setDevControlsMinimized(!devControlsMinimized);
  };

  const showChartType = (type) => {
    setActiveChartType(type);
  };

  const showConsole = () => {
    console.log("=== 📊 Sample Data ===");
    console.table(sampleData.singleBar);
    console.log("=== ⚙️ Chart Configs ===");
    console.table(chartConfigs);
  };

  const renderChart = (config, isDesktop = true) => {
    const baseProps = {
      data: sampleData[config.data],
      title: config.title,
      sourceText: "UK Finance payment data",
      notesDescription: config.notes,
      height: isDesktop ? 400 : 300,
      showInnerRadius: config.showInnerRadius,
      showLabels: config.showLabels,
      stacked: config.stacked,
    };

    switch (config.type) {
      case "bar":
        return <PaymentsBarChart key={config.id} {...baseProps} />;
      case "line":
        return <PaymentsLineChart key={config.id} {...baseProps} />;
      case "pie":
        return <PaymentsPieChart key={config.id} {...baseProps} />;
      default:
        return <div className="chart-error">Unknown chart type: {config.type}</div>;
    }
  };

  const getVisibleCharts = () => {
    if (activeChartType === 'all') return chartConfigs;
    return chartConfigs.filter(config => config.type === activeChartType);
  };

  return (
    <div className="App">
      {/* Dev Controls */}
      <div className={`dev-controls ${devControlsMinimized ? 'minimized' : ''}`}>
        <div className="dev-controls-header" onClick={toggleDevControls}>
          <h3>
            <span>🛠️</span>
            {!devControlsMinimized && <span>Dev Controls</span>}
          </h3>
          <span className="minimize-icon">
            {devControlsMinimized ? '▶' : '▼'}
          </span>
        </div>

        {!devControlsMinimized && (
          <div className="dev-controls-content">
            <div className="status-section">
              <span className={`status-indicator ${status.type}`}></span>
              <span>{status.text}</span>
            </div>
            <button className="dev-button" onClick={() => window.location.reload()}>
              🔄 Refresh
            </button>
            <button className="dev-button secondary" onClick={toggleAutoRefresh}>
              {autoRefreshEnabled ? 'Disable Auto-refresh' : 'Enable Auto-refresh'}
            </button>
            <button className="dev-button secondary" onClick={showConsole}>
              📋 Console
            </button>
            <button className="dev-button secondary" onClick={toggleMobileColumn}>
              {mobileColumnVisible ? 'Hide Mobile' : 'Show Mobile'}
            </button>
          </div>
        )}
      </div>

      <div className="container">
        <h1>Payments Association Charts - Development Preview</h1>

        <div className={`layout-container ${!mobileColumnVisible ? 'single-column' : ''}`}>
          {/* Desktop Column */}
          <div className="desktop-column">
            <div className="column-header">
              <h2 className="column-title">🖥️ Desktop View</h2>
              <span className="viewport-indicator">1200px+</span>
            </div>

            <div className="chart-type-toggle">
              {['all', 'bar', 'line', 'pie'].map(type => (
                <button
                  key={type}
                  className={`toggle-button ${activeChartType === type ? 'active' : ''}`}
                  onClick={() => showChartType(type)}
                >
                  {type === 'all' ? 'All Charts' : `${type.charAt(0).toUpperCase() + type.slice(1)} Charts`}
                </button>
              ))}
            </div>

            {/* Bar Charts Section */}
            {(activeChartType === 'all' || activeChartType === 'bar') && (
              <div className="chart-section">
                <h3>📊 Bar Charts</h3>
                {getVisibleCharts()
                  .filter(config => config.type === 'bar')
                  .map(config => (
                    <div key={config.id}>
                      <h4>{config.title}</h4>
                      <div className="chart-container">
                        {renderChart(config, true)}
                      </div>
                      <div className="code-sample">
                        {`<PaymentsBarChart
  data={sampleData.${config.data}}
  title="${config.title}"
  sourceText="UK Finance quarterly data"
/>`}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Line Charts Section */}
            {(activeChartType === 'all' || activeChartType === 'line') && (
              <div className="chart-section">
                <h3>📈 Line Charts</h3>
                {getVisibleCharts()
                  .filter(config => config.type === 'line')
                  .map(config => (
                    <div key={config.id}>
                      <h4>{config.title}</h4>
                      <div className="chart-container">
                        {renderChart(config, true)}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Pie Charts Section */}
            {(activeChartType === 'all' || activeChartType === 'pie') && (
              <div className="chart-section">
                <h3>🥧 Pie Charts</h3>
                {getVisibleCharts()
                  .filter(config => config.type === 'pie')
                  .map(config => (
                    <div key={config.id}>
                      <h4>{config.title}</h4>
                      <div className="chart-container">
                        {renderChart(config, true)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Mobile Column */}
          {mobileColumnVisible && (
            <div className="mobile-column">
              <div className="column-header">
                <h2 className="column-title">📱 Mobile View</h2>
                <span className="viewport-indicator">375px</span>
              </div>

              <div className="mobile-simulator">
                {['bar', 'line', 'pie'].map(chartType => (
                  <div key={chartType} className="chart-section">
                    <h3>
                      {chartType === 'bar' ? '📊' : chartType === 'line' ? '📈' : '🥧'} 
                      {' '}
                      {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Charts
                    </h3>
                    {getVisibleCharts()
                      .filter(config => config.type === chartType)
                      .map(config => (
                        <div key={config.id}>
                          <h4>{config.title}</h4>
                          <div className="mobile-chart-container">
                            {renderChart(config, false)}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;