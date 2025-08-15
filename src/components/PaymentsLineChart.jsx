import React, { useState, useEffect } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";

/* eslint-disable no-undef */
/* global ReactDOM */

const PaymentsLineChart = ({
  data,
  width = "100%",
  height = 400,
  title,
  showLogo = true,
  className = "",
  sourceText = "The payments association industry research",
  sourceUrl = null,
  notesDescription = null,
  fieldLabels = {},
}) => {
  // Add back responsive state
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [currentPage, setCurrentPage] = useState(0);

  // Responsive event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Device breakpoints
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;


  const colours = {
    primary: "#00dfb8",
    secondary: "#00573B",
    tertiary: "#00C29D",
    quaternary: "#007152",
    quinary: "#00A783",
    background: "#ffffff",
    border: "#e2e8f0",
    foreground: "#0f172a",
    mutedForeground: "#64748b",
    grid: "#f1f5f9",
  };

  // Mobile pagination for large datasets
  const getItemsPerPage = () => {
    if (isMobile) return data.length <= 3 ? data.length : 3;
    if (isTablet) return data.length <= 4 ? data.length : 4;
    return data.length;
  };

  const getVisibleData = () => {
    const itemsPerPage = getItemsPerPage();
    if (itemsPerPage >= data.length) return data;
    const startIndex = currentPage * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.ceil(data.length / getItemsPerPage());

  const getLineConfigs = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const dataKeys = Object.keys(sampleData).filter(key => 
      key !== 'name' && typeof sampleData[key] === 'number'
    );
    
    // Limit lines on mobile
    const maxLines = isMobile ? 2 : isTablet ? 3 : 5;
    const colors = [colours.primary, colours.secondary, colours.tertiary, colours.quaternary, colours.quinary];
    
    return dataKeys.slice(0, maxLines).map((key, index) => ({
      key,
      name: fieldLabels[key] || (isMobile ? 
        key.charAt(0).toUpperCase() + key.slice(1) : // Short names on mobile
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1') // Full names on desktop
      ),
      color: colors[index % colors.length],
      strokeWidth: isMobile ? 2 : 3, // Thinner lines on mobile
    }));
  };

  const lineConfigs = getLineConfigs();
  const visibleData = getVisibleData();
  const totalPages = getTotalPages();


  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return React.createElement('div', {
        style: {
          backgroundColor: colours.background,
          border: `1px solid ${colours.border}`,
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif"
        }
      }, [
        React.createElement('p', {
          key: 'label',
          style: { 
            margin: "0 0 8px 0",
            fontWeight: "600",
            color: colours.foreground,
            borderBottom: `1px solid ${colours.border}`,
            paddingBottom: "4px"
          }
        }, label),
        ...payload.map((entry, index) => 
          React.createElement('div', {
            key: index,
            style: { 
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px"
            }
          }, [
            React.createElement('div', {
              key: 'color',
              style: {
                width: "12px",
                height: "3px",
                backgroundColor: entry.color,
                borderRadius: "2px",
                flexShrink: 0
              }
            }),
            React.createElement('span', {
              key: 'text',
              style: { 
                fontSize: "13px",
                color: colours.mutedForeground,
                flex: 1
              }
            }, `${entry.name}: ${entry.value.toLocaleString()}`)
          ])
        )
      ]);
    }
    return null;
  };

  return React.createElement('div', {
    style: {
      backgroundColor: colours.background,
      border: `1px solid ${colours.border}`,
      borderRadius: isMobile ? "8px" : "12px", // Smaller radius on mobile
      fontFamily: "Arial, sans-serif",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box"
    },
    className: className
  }, [
    // Header with responsive padding
    React.createElement('div', {
      key: 'header',
      style: {
        padding: isMobile ? "16px" : "24px", // Less padding on mobile
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center", // Stack on mobile
        justifyContent: "space-between",
        backgroundColor: "#f9fffe",
        borderBottom: `1px solid ${colours.border}`,
        flexDirection: isMobile ? "column" : "row", // Stack elements on mobile
        gap: isMobile ? "12px" : "16px"
      }
    }, [
      React.createElement('div', { 
        key: 'title-section',
        style: { flex: 1, minWidth: 0 }
      }, [
        title && React.createElement('h3', {
          key: 'title',
          style: {
            margin: "0 0 2px 0",
            fontSize: isMobile ? "16px" : "18px", // Smaller on mobile
            fontWeight: "600",
            color: colours.foreground,
            lineHeight: "1.25"
          }
        }, title),
        React.createElement('p', {
          key: 'subtitle',
          style: {
            margin: "0",
            fontSize: isMobile ? "12px" : "14px", // Smaller on mobile
            color: colours.mutedForeground,
          }
        }, lineConfigs.length === 1 ? 
          (isMobile ? "Trend analysis" : "Trend analysis over time") : 
          (isMobile ? "Multi-metric trends" : "Multi-metric trend analysis")
        )
      ]),
      showLogo && React.createElement('img', {
        key: 'logo',
        src: "https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg",
        alt: "The Payments Association",
        style: {
          height: isMobile ? "30px" : "40px", // Smaller logo on mobile
          width: "auto",
          maxWidth: "100%",
          flexShrink: 0
        }
      })
    ]),

    // Chart area with responsive settings
    React.createElement('div', {
      key: 'chart',
      style: {
        padding: isMobile ? "16px" : "24px", // Less padding on mobile
        backgroundColor: "#f9fffe"
      }
    }, React.createElement(ResponsiveContainer, {
      width: width,
      height: height
    }, React.createElement(RechartsLineChart, {
      data: visibleData, // Use paginated data
      margin: { 
        top: isMobile ? 20 : 30, 
        right: isMobile ? 0 : 10, 
        left: isMobile ? 0 : 0, 
        bottom: 5 
      }
    }, [
      React.createElement(CartesianGrid, {
        key: 'grid',
        strokeDasharray: "3 3",
        stroke: colours.grid,
        vertical: false,
        strokeWidth: 1
      }),
      React.createElement(XAxis, {
        key: 'xaxis',
        dataKey: "name",
        tick: {
          fill: colours.mutedForeground,
          fontSize: isMobile ? 10 : 12, // Smaller text on mobile
          fontFamily: "Arial, sans-serif"
        },
        axisLine: { stroke: colours.border, strokeWidth: 1 },
        tickLine: false,
        tickMargin: 8,
        interval: 0,
        angle: isMobile ? -45 : 0, // Angle labels on mobile
        textAnchor: isMobile ? "end" : "middle",
        height: isMobile ? 60 : 30 // More space for angled labels
      }),
      React.createElement(YAxis, {
        key: 'yaxis',
        tick: {
          fill: colours.mutedForeground,
          fontSize: isMobile ? 10 : 12, // Smaller text on mobile
          fontFamily: "Arial, sans-serif"
        },
        axisLine: false,
        tickLine: false,
        tickMargin: 8,
        tickFormatter: (value) => {
          if (isMobile) {
            // More aggressive abbreviation on mobile
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          }
          return value.toLocaleString();
        }
      }),
      React.createElement(Tooltip, {
        key: 'tooltip',
        content: React.createElement(CustomTooltip)
      }),
      React.createElement(Legend, {
        key: 'legend',
        wrapperStyle: {
          paddingTop: isMobile ? "12px" : "20px",
          fontSize: isMobile ? "11px" : "13px", // Smaller on mobile
          color: colours.mutedForeground,
          fontFamily: "Arial, sans-serif"
        },
        iconType: "line",
        layout: isMobile && lineConfigs.length > 2 ? "vertical" : "horizontal" // Stack legend on mobile
      }),
      ...lineConfigs.map((config) => 
        React.createElement(Line, {
          key: config.key,
          type: "monotone",
          dataKey: config.key,
          stroke: config.color,
          strokeWidth: config.strokeWidth,
          name: config.name,
          dot: lineConfigs.length > 2 && isMobile ? false : { // Hide dots if too many lines on mobile
            r: isMobile ? 3 : 4, 
            fill: config.color, 
            stroke: config.color, 
            strokeWidth: 2 
          },
          activeDot: { 
            r: isMobile ? 4 : 5, 
            fill: config.color, 
            stroke: colours.background, 
            strokeWidth: 2 
          }
        })
      )
    ]))),

    // Add pagination controls for mobile
    totalPages > 1 && React.createElement('div', {
      key: 'pagination',
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 0 8px 0',
        borderTop: `1px solid ${colours.border}`,
        marginTop: '16px',
        backgroundColor: "#f9fffe"
      }
    }, [
      React.createElement('button', {
        key: 'prev',
        onClick: () => setCurrentPage(Math.max(0, currentPage - 1)),
        disabled: currentPage === 0,
        style: {
          padding: '6px 12px',
          fontSize: '12px',
          border: 'none',
          borderRadius: '4px',
          fontFamily: "Arial, sans-serif",
          backgroundColor: currentPage === 0 ? colours.mutedForeground : colours.primary,
          color: 'white',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
        }
      }, 'Previous'),
      React.createElement('span', {
        key: 'counter',
        style: {
          fontSize: '12px',
          color: colours.mutedForeground,
          fontFamily: "Arial, sans-serif"
        }
      }, `${currentPage + 1} of ${totalPages}`),
      React.createElement('button', {
        key: 'next',
        onClick: () => setCurrentPage(Math.min(totalPages - 1, currentPage + 1)),
        disabled: currentPage === totalPages - 1,
        style: {
          padding: '6px 12px',
          fontSize: '12px',
          border: 'none',
          borderRadius: '4px',
          fontFamily: "Arial, sans-serif",
          backgroundColor: currentPage === totalPages - 1 ? colours.mutedForeground : colours.primary,
          color: 'white',
          cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
        }
      }, 'Next')
    ]),

    // Footer with responsive layout
    React.createElement('div', {
      key: 'footer',
      style: {
        padding: isMobile ? "0 16px 16px 16px" : "0 24px 20px 24px",
        borderTop: `1px solid ${colours.border}`,
        paddingTop: isMobile ? "12px" : "16px",
        backgroundColor: colours.background,
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // Stack on mobile
        gap: isMobile ? '8px' : '16px',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between'
      }
    }, [
      sourceUrl ? React.createElement('a', {
        key: 'source',
        href: sourceUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          fontSize: isMobile ? "10px" : "12px", // Smaller on mobile
          color: colours.mutedForeground,
          textDecoration: "underline"
        }
      }, `Source: ${sourceText}`) : React.createElement('span', {
        key: 'source',
        style: {
          fontSize: isMobile ? "10px" : "12px", // Smaller on mobile
          color: colours.mutedForeground,
        }
      }, `Source: ${sourceText}`),
      React.createElement('span', {
        key: 'chart-info',
        style: {
          fontSize: isMobile ? "10px" : "12px", // Smaller on mobile
          color: colours.mutedForeground,
        }
      }, `Chart: Payments Intelligence (${lineConfigs.length} line${lineConfigs.length !== 1 ? 's' : ''})`)
    ]))
  ]);
};

// Sample data
const samplePaymentsData = [
  { name: "Q1 2024", volume: 145000, value: 32060 },
  { name: "Q2 2024", volume: 162000, value: 42150 },
  { name: "Q3 2024", volume: 158000, value: 43320 },
  { name: "Q4 2024", volume: 171000, value: 46840 },
];

// CRITICAL: Global setup for UMD
if (typeof window !== 'undefined') {
  console.log('Setting up PaymentsCharts Line global...');
  
  // Ensure the global namespace exists (don't overwrite if bar chart already set it up)
  window.PaymentsCharts = window.PaymentsCharts || {};
  
  // Add the line chart render method
  window.PaymentsCharts.renderLineChart = function (containerId, options = {}) {
    console.log('renderLineChart called with:', containerId, options);
    
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
        console.log('Using React 18+ createRoot for Line Chart');
        const root = ReactDOM.createRoot(container);
        root.render(
          React.createElement(PaymentsLineChart, {
            data: data,
            width: options.width,
            height: options.height,
            title: options.title,
            showLogo: options.showLogo,
            className: options.className,
            sourceText: options.sourceText,
            sourceUrl: options.sourceUrl,
            notesDescription: options.notesDescription,
            fieldLabels: options.fieldLabels || {},
          })
        );
      } else if (ReactDOM.render) {
        console.log('Using legacy ReactDOM.render for Line Chart');
        ReactDOM.render(
          React.createElement(PaymentsLineChart, {
            data: data,
            width: options.width,
            height: options.height,
            title: options.title,
            showLogo: options.showLogo,
            className: options.className,
            sourceText: options.sourceText,
            sourceUrl: options.sourceUrl,
            notesDescription: options.notesDescription,
            fieldLabels: options.fieldLabels || {},
          }),
          container
        );
      } else {
        throw new Error('No suitable React render method found');
      }

      console.log('Line chart rendered successfully');
    } catch (error) {
      console.error('Error rendering line chart:', error);
      container.innerHTML = `
        <div style="
          color: #ef4444; 
          background: #fef2f2; 
          padding: 20px; 
          border-radius: 8px; 
          border: 1px solid #fecaca;
          font-family: ui-sans-serif, system-ui, sans-serif;
        ">
          <h4 style="margin: 0 0 8px 0; font-size: 16px;">Line Chart Loading Error</h4>
          <p style="margin: 0; font-size: 14px;">${error.message}</p>
        </div>
      `;
    }
  };

  // If this is the only chart loaded, also set the main render method
  // (Bar chart will override this if both are loaded)
  if (!window.PaymentsCharts.render) {
    window.PaymentsCharts.render = window.PaymentsCharts.renderLineChart;
  }
  
  console.log('PaymentsCharts Line setup complete. Available methods:', Object.keys(window.PaymentsCharts));
}

// Auto-render functionality for line charts
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM loaded, looking for auto-render line charts');
    const chartContainers = document.querySelectorAll("[data-payments-line-chart]");
    
    if (chartContainers.length === 0) {
      console.log('No auto-render line chart containers found');
      return;
    }

    console.log(`Found ${chartContainers.length} line chart containers for auto-render`);
    
    chartContainers.forEach((container) => {
      try {
        const chartData = container.getAttribute("data-chart-data");
        const chartTitle = container.getAttribute("data-chart-title");
        const showLogo = container.getAttribute("data-show-logo") !== "false";
        const sourceText = container.getAttribute("data-source-text");
        const sourceUrl = container.getAttribute("data-source-url");
        const notesDescription = container.getAttribute("data-notes-description");
        const fieldLabels = container.getAttribute("data-field-labels");

        if (window.PaymentsCharts && window.PaymentsCharts.renderLineChart) {
          window.PaymentsCharts.renderLineChart(container.id, {
            data: chartData ? JSON.parse(chartData) : undefined,
            title: chartTitle,
            showLogo: showLogo,
            sourceText: sourceText,
            sourceUrl: sourceUrl,
            notesDescription: notesDescription,
            fieldLabels: fieldLabels ? JSON.parse(fieldLabels) : {},
          });
        }
      } catch (error) {
        console.error('Error in auto-render for line chart container:', container.id, error);
      }
    });
  });
}

export default PaymentsLineChart;