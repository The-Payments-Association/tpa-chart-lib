import React, { useState, useEffect } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../chart_styles.css"; // Import global styles


/* eslint-disable no-undef */
/* global ReactDOM */

const PaymentsBarChart = ({
  data,
  width = "100%",
  height = 400,
  title,
  showLogo = true,
  className = "",
  sourceText = "The payments association industry research",
  sourceUrl = null,
  notesDescription = null,
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [currentPage, setCurrentPage] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentPage(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowNotesModal(false);
      }
    };

    if (showNotesModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showNotesModal]);

  // Device breakpoints
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Colour palette
  const colours = {
    primary: "#00dfb8",
    secondary: "#00573B",
    tertiary: "#00C29D",
    quaternary: "#007152",
    quinary: "#00A783",
    
    background: "#ffffff",
    card: "#fdfffe",
    cardTint: "#f9fffe",
    border: "#e2e8f0",
    input: "#ffffff",
    
    foreground: "#0f172a",
    muted: "#f8fafc",
    mutedForeground: "#64748b",
    
    grid: "#f1f5f9",
    axis: "#cbd5e1",
  };

  // Info icon SVG
  const InfoIcon = ({ size = 16, color = colours.mutedForeground }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: 'pointer' }}
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="m12 8h.01"/>
    </svg>
  );

  // Close icon SVG
  const CloseIcon = ({ size = 24, color = colours.mutedForeground }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: 'pointer' }}
    >
      <path d="M18 6L6 18"/>
      <path d="M6 6l12 12"/>
    </svg>
  );

  // Notes Modal Component
  const NotesModal = () => {
    if (!showNotesModal || !notesDescription) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: isMobile ? '16px' : '32px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowNotesModal(false);
          }
        }}
      >
        <div
          style={{
            backgroundColor: colours.background,
            borderRadius: '12px',
            border: `1px solid ${colours.border}`,
            maxWidth: isMobile ? '100%' : '500px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: isMobile ? '16px' : '24px',
              borderBottom: `1px solid ${colours.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: colours.foreground,
              }}
            >
              Chart Notes
            </h3>
            <button
              onClick={() => setShowNotesModal(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colours.muted;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div
            style={{
              padding: isMobile ? '16px' : '24px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? '14px' : '16px',
                lineHeight: '1.6',
                color: colours.foreground,
                whiteSpace: 'pre-wrap',
              }}
            >
              {notesDescription}
            </p>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: isMobile ? '12px 16px 16px' : '16px 24px 24px',
              borderTop: `1px solid ${colours.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={() => setShowNotesModal(false)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: colours.primary,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontWeight: '500',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colours.secondary;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = colours.primary;
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Calculate items per page based on device
  const getItemsPerPage = () => {
    if (isMobile) {
      if (data.length <= 3) return data.length;
      return 3;
    }
    if (isTablet) {
      if (data.length <= 4) return data.length;
      return 4;
    }
    return data.length;
  };

  // Get visible data based on pagination
  const getVisibleData = () => {
    const itemsPerPage = getItemsPerPage();
    if (itemsPerPage >= data.length) return data;
    
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const itemsPerPage = getItemsPerPage();
    return Math.ceil(data.length / itemsPerPage);
  };

  // Dynamic bar configuration based on data keys
  const getBarConfigs = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const dataKeys = Object.keys(sampleData).filter(key => key !== 'name' && typeof sampleData[key] === 'number');
    
    const maxBars = isMobile ? 2 : isTablet ? 3 : 5;
    
    const barConfigs = [
      { key: 'volume', name: isMobile ? 'Volume' : 'Transaction volume', color: colours.primary },
      { key: 'value', name: isMobile ? 'Value (£m)' : 'Transaction value (£m)', color: colours.secondary },
      { key: 'count', name: isMobile ? 'Count' : 'Transaction count', color: colours.tertiary },
      { key: 'users', name: isMobile ? 'Users' : 'Active users', color: colours.quaternary },
      { key: 'revenue', name: isMobile ? 'Revenue' : 'Revenue (£m)', color: colours.quinary },
    ];

    return barConfigs.filter(config => dataKeys.includes(config.key)).slice(0, maxBars);
  };

  // Custom label component for bar values
  const CustomBarLabel = ({ x, y, width, height, value }) => {
    if (isMobile && width < 30) return null;
    
    const labelY = y - 5;
    const labelX = x + width / 2;
    
    const formatValue = (val) => {
      if (isMobile) {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toString();
      }
      return val.toLocaleString();
    };
    
    return (
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fill={colours.foreground}
        fontSize={isMobile ? "9" : "11"}
        fontWeight="500"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {formatValue(value)}
      </text>
    );
  };

  // Pagination controls
  const PaginationControls = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 0 8px 0',
        borderTop: `1px solid ${colours.border}`,
        marginTop: '16px'
      }}>
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: currentPage === 0 ? colours.muted : colours.primary,
            color: currentPage === 0 ? colours.mutedForeground : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
          }}
        >
          Previous
        </button>
        
        <span style={{
          fontSize: '12px',
          color: colours.mutedForeground,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif'
        }}>
          {currentPage + 1} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: currentPage === totalPages - 1 ? colours.muted : colours.primary,
            color: currentPage === totalPages - 1 ? colours.mutedForeground : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
          }}
        >
          Next
        </button>
      </div>
    );
  };

  const Logo = () => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <img
        src="https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg"
        alt="The Payments Association"
        style={{
          height: isMobile ? "30px" : "40px",
          width: "auto",
          maxWidth: "100%"
        }}
      />
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: colours.background,
            border: `1px solid ${colours.border}`,
            borderRadius: "8px",
            padding: isMobile ? "8px" : "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            fontSize: isMobile ? "12px" : "14px",
            minWidth: isMobile ? "120px" : "150px",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        >
          <p style={{ 
            margin: "0 0 6px 0",
            fontWeight: "500",
            color: colours.foreground
          }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} style={{ 
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "3px"
            }}>
              <div style={{
                width: "10px",
                height: "10px",
                backgroundColor: entry.color,
                borderRadius: "2px",
                flexShrink: 0
              }}></div>
              <span style={{ 
                fontSize: isMobile ? "11px" : "13px",
                color: colours.mutedForeground,
                display: "flex",
                alignItems: "center"
              }}>
                {entry.name}: 
                <span style={{ 
                  fontWeight: "500",
                  color: colours.foreground,
                  marginLeft: "4px"
                }}>
                  {entry.value.toLocaleString()}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Footer content component
  const FooterContent = () => {
    const textStyle = {
      margin: "0",
      fontSize: isMobile ? "10px" : "12px",
      color: colours.mutedForeground,
      fontWeight: "400"
    };

    const SourceText = () => {
      if (sourceUrl) {
        return (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...textStyle,
              textDecoration: "underline",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.color = colours.primary;
            }}
            onMouseOut={(e) => {
              e.target.style.color = colours.mutedForeground;
            }}
          >
            Source: {sourceText}
          </a>
        );
      }

      return (
        <span style={textStyle}>
          Source: {sourceText}
        </span>
      );
    };

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '8px' : '16px',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4px' : '16px',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}>
          <SourceText />
          <span style={{
            ...textStyle,
            color: colours.mutedForeground,
          }}>
            Chart: Payments Intelligence
          </span>
        </div>
        
        {/* Notes Icon */}
        {notesDescription && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => setShowNotesModal(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colours.muted;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="View chart notes"
          >
            <InfoIcon size={isMobile ? 14 : 16} />
            <span style={{
              ...textStyle,
              fontSize: isMobile ? "9px" : "11px",
              color: colours.mutedForeground,
            }}>
              Notes
            </span>
          </div>
        )}
      </div>
    );
  };

  const barConfigs = getBarConfigs();
  const visibleData = getVisibleData();
  const totalPages = getTotalPages();

  return (
    <>
      <div
        style={{
          backgroundColor: colours.card,
          border: `1px solid ${colours.border}`,
          borderRadius: "12px",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box"
        }}
        className={className}
      >
        {/* Header */}
        <div
          style={{
            padding: isMobile ? "16px 16px 0 16px" : "24px 24px 0 24px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: colours.cardTint,
            boxSizing: "border-box"
          }}
        >
          <div style={{ 
            flex: 1,
            minWidth: 0
          }}>
            {title && (
              <h3
                style={{
                  margin: "0 0 2px 0",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: colours.foreground,
                  lineHeight: "1.25",
                  letterSpacing: "-0.025em"
                }}
              >
                {title}
              </h3>
            )}
            <p
              style={{
                margin: "0",
                fontSize: isMobile ? "12px" : "14px",
                color: colours.mutedForeground,
                fontWeight: "400"
              }}
            >
              {isMobile ? "Payment analysis" : "Payment transaction analysis"}
              {totalPages > 1 && (
                <span style={{ marginLeft: "8px", fontSize: isMobile ? "10px" : "12px" }}>
                  ({currentPage + 1}/{totalPages})
                </span>
              )}
            </p>
          </div>

          {showLogo && (
            <div style={{ 
              marginLeft: isMobile ? "8px" : "16px",
              flexShrink: 0
            }}>
              <Logo />
            </div>
          )}
        </div>

        {/* Chart section */}
        <div style={{ 
          padding: isMobile ? "16px" : "24px",
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }}>
          <ResponsiveContainer width={width} height={height}>
            <RechartsBarChart
              data={visibleData}
              margin={{ 
                top: isMobile ? 30 : 40, 
                right: isMobile ? 0 : 0, 
                left: isMobile ? 0 : 0, 
                bottom: 5 
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colours.grid}
                vertical={false}
                strokeWidth={1}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: colours.mutedForeground,
                  fontSize: isMobile ? 10 : 12,
                  fontFamily: "ui-sans-serif, system-ui, sans-serif"
                }}
                axisLine={{ stroke: colours.border, strokeWidth: 1 }}
                tickLine={false}
                tickMargin={8}
                interval={0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />

              <YAxis
                tick={{
                  fill: colours.mutedForeground,
                  fontSize: isMobile ? 10 : 12,
                  fontFamily: "ui-sans-serif, system-ui, sans-serif"
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (isMobile) {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toString();
                  }
                  return value.toLocaleString();
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  paddingTop: isMobile ? "12px" : "20px",
                  fontSize: isMobile ? "11px" : "13px",
                  color: colours.mutedForeground,
                  fontFamily: "ui-sans-serif, system-ui, sans-serif"
                }}
                iconType="rect"
                layout={isMobile && barConfigs.length > 2 ? "vertical" : "horizontal"}
              />

              {barConfigs.map((barConfig, index) => (
                <Bar
                  key={barConfig.key}
                  dataKey={barConfig.key}
                  fill={barConfig.color}
                  name={barConfig.name}
                  radius={[4, 4, 0, 0]}
                  strokeWidth={0}
                  label={<CustomBarLabel />}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>

          <PaginationControls />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: isMobile ? "0 16px 16px 16px" : "0 24px 20px 24px",
            borderTop: `1px solid ${colours.border}`,
            paddingTop: isMobile ? "12px" : "16px",
            backgroundColor: colours.card,
            boxSizing: "border-box"
          }}
        >
          <FooterContent />
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal />
    </>
  );
};

// Sample data
const samplePaymentsData = [
  { name: "Q1 2024", volume: 145000, value: 32060 },
  { name: "Q2 2024", volume: 162000, value: 42150 },
  { name: "Q3 2024", volume: 158000, value: 43320 },
  { name: "Q4 2024", volume: 171000, value: 46840 },
  { name: "Q1 2025", volume: 189000, value: 51200 },
  { name: "Q2 2025", volume: 203000, value: 56780 }
];

// Ensure the global namespace exists and doesn't conflict
window.PaymentsCharts = window.PaymentsCharts || {};

// Add this specific chart type with improved error handling
window.PaymentsCharts.renderBarChart = function (containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }

  try {
    // Check React availability
    if (typeof React === 'undefined') {
      throw new Error('React is not available. Please load React before the chart library.');
    }
    
    if (typeof ReactDOM === 'undefined') {
      throw new Error('ReactDOM is not available. Please load ReactDOM before the chart library.');
    }

    const data = options.data || samplePaymentsData;

    // Try modern React 18+ createRoot first, fallback to legacy render
    if (ReactDOM.createRoot) {
      console.log('Using React 18+ createRoot');
      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(PaymentsBarChart, {
          data: data,
          width: options.width,
          height: options.height,
          title: options.title,
          showLogo: options.showLogo,
          className: options.className,
          sourceText: options.sourceText,
          sourceUrl: options.sourceUrl,
          notesDescription: options.notesDescription,
        })
      );
    } else if (ReactDOM.render) {
      console.log('Using legacy ReactDOM.render');
      ReactDOM.render(
        React.createElement(PaymentsBarChart, {
          data: data,
          width: options.width,
          height: options.height,
          title: options.title,
          showLogo: options.showLogo,
          className: options.className,
          sourceText: options.sourceText,
          sourceUrl: options.sourceUrl,
          notesDescription: options.notesDescription,
        }),
        container
      );
    } else {
      throw new Error('No suitable React render method found');
    }

    console.log('Bar chart rendered successfully');
  } catch (error) {
    console.error('Error rendering bar chart:', error);
    container.innerHTML = `
      <div style="
        color: #ef4444; 
        background: #fef2f2; 
        padding: 20px; 
        border-radius: 8px; 
        border: 1px solid #fecaca;
        font-family: ui-sans-serif, system-ui, sans-serif;
      ">
        <h4 style="margin: 0 0 8px 0; font-size: 16px;">Chart Loading Error</h4>
        <p style="margin: 0; font-size: 14px;">${error.message}</p>
      </div>
    `;
  }
};

// Keep backward compatibility
window.PaymentsCharts.render = window.PaymentsCharts.renderBarChart;

// Auto-render functionality with better error handling
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM loaded, looking for auto-render charts');
  const chartContainers = document.querySelectorAll("[data-payments-chart]");
  
  if (chartContainers.length === 0) {
    console.log('No auto-render chart containers found');
    return;
  }

  console.log(`Found ${chartContainers.length} chart containers for auto-render`);
  
  chartContainers.forEach((container) => {
    try {
      const chartData = container.getAttribute("data-chart-data");
      const chartTitle = container.getAttribute("data-chart-title");
      const showLogo = container.getAttribute("data-show-logo") !== "false";
      const sourceText = container.getAttribute("data-source-text");
      const sourceUrl = container.getAttribute("data-source-url");
      const notesDescription = container.getAttribute("data-notes-description");

      window.PaymentsCharts.renderBarChart(container.id, {
        data: chartData ? JSON.parse(chartData) : undefined,
        title: chartTitle,
        showLogo: showLogo,
        sourceText: sourceText,
        sourceUrl: sourceUrl,
        notesDescription: notesDescription,
      });
    } catch (error) {
      console.error('Error in auto-render for container:', container.id, error);
    }
  });
});

export default PaymentsBarChart;