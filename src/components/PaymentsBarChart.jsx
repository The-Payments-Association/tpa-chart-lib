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
import "../chart_styles.css";

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
  // Colours
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

  // Get bar configurations based on data
  const getBarConfigs = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const dataKeys = Object.keys(sampleData).filter(key => 
      key !== 'name' && typeof sampleData[key] === 'number'
    );
    
    const barConfigs = [
      { key: 'volume', name: 'Transaction volume', color: colours.primary },
      { key: 'value', name: 'Transaction value (£m)', color: colours.secondary },
      { key: 'count', name: 'Transaction count', color: colours.tertiary },
      { key: 'users', name: 'Active users', color: colours.quaternary },
      { key: 'revenue', name: 'Revenue (£m)', color: colours.quinary },
    ];

    return barConfigs.filter(config => dataKeys.includes(config.key)).slice(0, 3);
  };

  const barConfigs = getBarConfigs();

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
            margin: "0 0 6px 0",
            fontWeight: "500",
            color: colours.foreground
          }
        }, label),
        ...payload.map((entry, index) => 
          React.createElement('div', {
            key: index,
            style: { 
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "3px"
            }
          }, [
            React.createElement('div', {
              key: 'color',
              style: {
                width: "10px",
                height: "10px",
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
      borderRadius: "12px",
      fontFamily: "Arial, sans-serif",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box"
    },
    className: className
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      style: {
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9fffe",
        borderBottom: `1px solid ${colours.border}`
      }
    }, [
      React.createElement('div', { key: 'title-section' }, [
        title && React.createElement('h3', {
          key: 'title',
          style: {
            margin: "0 0 4px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: colours.foreground,
          }
        }, title),
        React.createElement('p', {
          key: 'subtitle',
          style: {
            margin: "0",
            fontSize: "14px",
            color: colours.mutedForeground,
          }
        }, "Payment transaction analysis")
      ]),
      showLogo && React.createElement('img', {
        key: 'logo',
        src: "https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg",
        alt: "The Payments Association",
        style: {
          height: "40px",
          width: "auto",
          maxWidth: "100%"
        }
      })
    ]),

    // Chart area with actual Recharts
    React.createElement('div', {
      key: 'chart',
      style: {
        padding: "24px",
        backgroundColor: "#f9fffe"
      }
    }, React.createElement(ResponsiveContainer, {
      width: width,
      height: height
    }, React.createElement(RechartsBarChart, {
      data: data,
      margin: { top: 40, right: 0, left: 0, bottom: 5 }
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
          fontSize: 12,
          fontFamily: "Arial, sans-serif"
        },
        axisLine: { stroke: colours.border, strokeWidth: 1 },
        tickLine: false,
        tickMargin: 8
      }),
      React.createElement(YAxis, {
        key: 'yaxis',
        tick: {
          fill: colours.mutedForeground,
          fontSize: 12,
          fontFamily: "Arial, sans-serif"
        },
        axisLine: false,
        tickLine: false,
        tickMargin: 8,
        tickFormatter: (value) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
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
          paddingTop: "20px",
          fontSize: "13px",
          color: colours.mutedForeground,
          fontFamily: "Arial, sans-serif"
        },
        iconType: "rect"
      }),
      ...barConfigs.map((barConfig) => 
        React.createElement(Bar, {
          key: barConfig.key,
          dataKey: barConfig.key,
          fill: barConfig.color,
          name: barConfig.name,
          radius: [4, 4, 0, 0],
          strokeWidth: 0
        })
      )
    ]))),

    // Footer
    React.createElement('div', {
      key: 'footer',
      style: {
        padding: "16px 24px",
        borderTop: `1px solid ${colours.border}`,
        backgroundColor: colours.background,
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, [
      sourceUrl ? React.createElement('a', {
        key: 'source',
        href: sourceUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          fontSize: "12px",
          color: colours.mutedForeground,
          textDecoration: "underline"
        }
      }, `Source: ${sourceText}`) : React.createElement('span', {
        key: 'source',
        style: {
          fontSize: "12px",
          color: colours.mutedForeground,
        }
      }, `Source: ${sourceText}`),
      React.createElement('span', {
        key: 'chart-info',
        style: {
          fontSize: "12px",
          color: colours.mutedForeground,
        }
      }, "Chart: Payments Intelligence")
    ]))
  ]);
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

// CRITICAL: Global setup for UMD
if (typeof window !== 'undefined') {
  console.log('Setting up PaymentsCharts global...');
  
  // Force create as object, not function
  window.PaymentsCharts = {};
  
  // Add the render methods
  window.PaymentsCharts.renderBarChart = function (containerId, options = {}) {
    console.log('renderBarChart called with:', containerId, options);
    
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

  // Set the main render method
  window.PaymentsCharts.render = window.PaymentsCharts.renderBarChart;
  
  console.log('PaymentsCharts setup complete. Available methods:', Object.keys(window.PaymentsCharts));
}

// Auto-render functionality
if (typeof document !== 'undefined') {
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

        if (window.PaymentsCharts && window.PaymentsCharts.renderBarChart) {
          window.PaymentsCharts.renderBarChart(container.id, {
            data: chartData ? JSON.parse(chartData) : undefined,
            title: chartTitle,
            showLogo: showLogo,
            sourceText: sourceText,
            sourceUrl: sourceUrl,
            notesDescription: notesDescription,
          });
        }
      } catch (error) {
        console.error('Error in auto-render for container:', container.id, error);
      }
    });
  });
}

export default PaymentsBarChart;