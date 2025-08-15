import React, { useState, useEffect } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* eslint-disable no-undef */
/* global ReactDOM */

const PaymentsPieChart = ({
  data,
  width = "100%",
  height = 400,
  title,
  showLogo = true,
  className = "",
  sourceText = "The payments association industry research",
  sourceUrl = null,
  notesDescription = null,
  showInnerRadius = false,
  showLabels = true,
  showLegend = true,
}) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Responsive event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modal keyboard handling
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowNotesModal(false);
      }
    };

    if (showNotesModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showNotesModal]);

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
    card: "#fdfffe",
    cardTint: "#f9fffe",
    border: "#e2e8f0",
    foreground: "#0f172a",
    muted: "#f8fafc",
    mutedForeground: "#64748b",
    grid: "#f1f5f9",
  };

  // Pie chart colour palette - only green variations
  const pieColours = [
    colours.primary,      // #00dfb8 - bright teal
    colours.secondary,    // #00573B - dark green
    colours.tertiary,     // #00C29D - medium teal
    colours.quaternary,   // #007152 - forest green
    colours.quinary,      // #00A783 - sea green
    "#10d9c4",           // slightly lighter teal
    "#004d3d",           // darker forest green
    "#00b894",           // mint green
    "#006b5a",           // deep green
    "#00f5d4",           // very light teal
    "#003d32",           // very dark green
    "#009688",           // material teal
  ];

  // Prepare pie data - convert the first data key to pie format
  const getPieData = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const numericKeys = Object.keys(sampleData).filter(key => 
      key !== 'name' && typeof sampleData[key] === 'number'
    );
    
    if (numericKeys.length === 0) return [];
    
    const dataKey = numericKeys[0];
    
    return data.map((item, index) => ({
      name: item.name,
      value: item[dataKey],
      color: pieColours[index % pieColours.length],
    }));
  };

  // Info icon component
  const InfoIcon = ({ size = 16, color = colours.mutedForeground }) => 
    React.createElement('svg', {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { cursor: 'pointer' }
    }, [
      React.createElement('circle', { key: 'circle', cx: "12", cy: "12", r: "10" }),
      React.createElement('path', { key: 'path1', d: "M12 16v-4" }),
      React.createElement('path', { key: 'path2', d: "m12 8h.01" })
    ]);

  // Close icon component
  const CloseIcon = ({ size = 24, color = colours.mutedForeground }) => 
    React.createElement('svg', {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { cursor: 'pointer' }
    }, [
      React.createElement('path', { key: 'path1', d: "M18 6L6 18" }),
      React.createElement('path', { key: 'path2', d: "M6 6l12 12" })
    ]);

  // Custom label with connecting lines
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }) => {
    if (!showLabels) return null;
    
    // Only show label if percentage is above threshold
    if (percent < 0.03) return null; // Don't show labels for slices less than 3%

    const RADIAN = Math.PI / 180;
    const labelDistance = isMobile ? 25 : 35;
    const radius = outerRadius + labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Calculate line points
    const lineStart = {
      x: cx + outerRadius * Math.cos(-midAngle * RADIAN),
      y: cy + outerRadius * Math.sin(-midAngle * RADIAN)
    };
    
    const lineMiddle = {
      x: cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN)
    };

    const formatValue = (val) => {
      if (isMobile) {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toString();
      }
      return val.toLocaleString();
    };

    const textAnchor = x > cx ? 'start' : 'end';
    const labelX = textAnchor === 'start' ? x + 3 : x - 3;
    const maxNameLength = isMobile ? 8 : 12;
    const displayName = name.length > maxNameLength ? `${name.substring(0, maxNameLength)}...` : name;

    return React.createElement('g', { key: `label-${index}` }, [
      // Connecting line
      React.createElement('polyline', {
        key: 'line',
        points: `${lineStart.x},${lineStart.y} ${lineMiddle.x},${lineMiddle.y} ${x},${y}`,
        stroke: colours.mutedForeground,
        strokeWidth: 0.5,
        fill: "none",
        opacity: 0.7
      }),
      
      // Category name with text shadow for better readability
      React.createElement('text', {
        key: 'name',
        x: labelX,
        y: y - (isMobile ? 6 : 4),
        textAnchor: textAnchor,
        fill: colours.foreground,
        fontSize: isMobile ? "9" : "12",
        fontWeight: "600",
        fontFamily: "Arial, sans-serif",
        style: {
          filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
        }
      }, displayName),
      
      // Value and percentage
      React.createElement('text', {
        key: 'value',
        x: labelX,
        y: y + (isMobile ? 4 : 6),
        textAnchor: textAnchor,
        fill: colours.mutedForeground,
        fontSize: isMobile ? "8" : "11",
        fontWeight: "400",
        fontFamily: "Arial, sans-serif",
        style: {
          filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
        }
      }, `${formatValue(value)} (${(percent * 100).toFixed(1)}%)`)
    ]);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return React.createElement('div', {
        style: {
          backgroundColor: colours.background,
          border: `1px solid ${colours.border}`,
          borderRadius: "8px",
          padding: isMobile ? "8px" : "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontSize: isMobile ? "12px" : "14px",
          minWidth: isMobile ? "120px" : "150px",
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
        }, data.name),
        React.createElement('div', {
          key: 'content',
          style: {
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }
        }, [
          React.createElement('div', {
            key: 'color',
            style: {
              width: "10px",
              height: "10px",
              backgroundColor: data.color,
              borderRadius: "2px",
              flexShrink: 0
            }
          }),
          React.createElement('span', {
            key: 'text',
            style: {
              fontSize: isMobile ? "11px" : "13px",
              color: colours.mutedForeground,
              display: "flex",
              alignItems: "center"
            }
          }, [
            "Value: ",
            React.createElement('span', {
              key: 'value',
              style: {
                fontWeight: "500",
                color: colours.foreground,
                marginLeft: "4px"
              }
            }, data.value.toLocaleString())
          ])
        ])
      ]);
    }
    return null;
  };

  // Notes modal
  const NotesModal = () => {
    if (!showNotesModal || !notesDescription) return null;

    return React.createElement('div', {
      style: {
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
        padding: isMobile ? '16px' : '32px'
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          setShowNotesModal(false);
        }
      }
    }, React.createElement('div', {
      style: {
        backgroundColor: colours.background,
        borderRadius: '12px',
        border: `1px solid ${colours.border}`,
        maxWidth: isMobile ? '100%' : '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        fontFamily: 'Arial, sans-serif'
      },
      onClick: (e) => e.stopPropagation()
    }, [
      // Modal header
      React.createElement('div', {
        key: 'header',
        style: {
          padding: isMobile ? '16px' : '24px',
          borderBottom: `1px solid ${colours.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }, [
        React.createElement('h3', {
          key: 'title',
          style: {
            margin: 0,
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            color: colours.foreground
          }
        }, 'Chart Notes'),
        React.createElement('button', {
          key: 'close-btn',
          onClick: () => setShowNotesModal(false),
          style: {
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          onMouseOver: (e) => {
            e.target.style.backgroundColor = colours.muted;
          },
          onMouseOut: (e) => {
            e.target.style.backgroundColor = 'transparent';
          }
        }, React.createElement(CloseIcon, { size: 20 }))
      ]),
      // Modal content
      React.createElement('div', {
        key: 'content',
        style: {
          padding: isMobile ? '16px' : '24px'
        }
      }, React.createElement('p', {
        style: {
          margin: 0,
          fontSize: isMobile ? '14px' : '16px',
          lineHeight: '1.6',
          color: colours.foreground,
          whiteSpace: 'pre-wrap'
        }
      }, notesDescription)),
      // Modal footer
      React.createElement('div', {
        key: 'footer',
        style: {
          padding: isMobile ? '12px 16px 16px' : '16px 24px 24px',
          borderTop: `1px solid ${colours.border}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }, React.createElement('button', {
        onClick: () => setShowNotesModal(false),
        style: {
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: colours.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontWeight: '500'
        },
        onMouseOver: (e) => {
          e.target.style.backgroundColor = colours.secondary;
        },
        onMouseOut: (e) => {
          e.target.style.backgroundColor = colours.primary;
        }
      }, 'Close'))
    ]));
  };

  const pieData = getPieData();
  const innerRadius = showInnerRadius ? (isMobile ? 40 : 60) : 0;
  const outerRadius = isMobile ? 80 : 120;

  return React.createElement(React.Fragment, null, [
    React.createElement('div', {
      key: 'chart-container',
      style: {
        backgroundColor: colours.card,
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
          padding: isMobile ? "16px 16px 0 16px" : "24px 24px 0 24px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }
      }, [
        React.createElement('div', {
          key: 'title-section',
          style: {
            flex: 1,
            minWidth: 0
          }
        }, [
          title && React.createElement('h3', {
            key: 'title',
            style: {
              margin: "0 0 2px 0",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: colours.foreground,
              lineHeight: "1.25",
              letterSpacing: "-0.025em"
            }
          }, title),
          React.createElement('p', {
            key: 'subtitle',
            style: {
              margin: "0",
              fontSize: isMobile ? "12px" : "14px",
              color: colours.mutedForeground,
              fontWeight: "400"
            }
          }, isMobile ? "Payment distribution" : "Payment transaction distribution")
        ]),
        showLogo && React.createElement('div', {
          key: 'logo-section',
          style: {
            marginLeft: isMobile ? "8px" : "16px",
            flexShrink: 0
          }
        }, React.createElement('div', {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }, React.createElement('img', {
          src: "https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg",
          alt: "The Payments Association",
          style: {
            height: isMobile ? "30px" : "40px",
            width: "auto",
            maxWidth: "100%"
          }
        })))
      ]),

      // Chart section
      React.createElement('div', {
        key: 'chart',
        style: {
          padding: isMobile ? "16px" : "24px",
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }
      }, React.createElement(ResponsiveContainer, {
        width: width,
        height: height
      }, React.createElement(RechartsPieChart, {
        margin: {
          top: isMobile ? 20 : 30,
          right: isMobile ? 60 : 80,
          bottom: isMobile ? 20 : 30,
          left: isMobile ? 60 : 80
        }
      }, [
        React.createElement(Pie, {
          key: 'pie',
          data: pieData,
          cx: "50%",
          cy: "50%",
          labelLine: false,
          label: renderCustomLabel,
          outerRadius: outerRadius,
          innerRadius: innerRadius,
          fill: "#8884d8",
          dataKey: "value",
          paddingAngle: 1,
          onMouseEnter: (_, index) => setHoveredIndex(index),
          onMouseLeave: () => setHoveredIndex(null)
        }, pieData.map((entry, index) =>
          React.createElement(Cell, {
            key: `cell-${index}`,
            fill: entry.color,
            stroke: hoveredIndex === index ? colours.foreground : 'none',
            strokeWidth: hoveredIndex === index ? 2 : 0,
            style: {
              filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }
          })
        )),
        React.createElement(Tooltip, {
          key: 'tooltip',
          content: React.createElement(CustomTooltip)
        }),
        showLegend && !showLabels && React.createElement(Legend, {
          key: 'legend',
          wrapperStyle: {
            paddingTop: isMobile ? "12px" : "20px",
            fontSize: isMobile ? "11px" : "13px",
            color: colours.mutedForeground,
            fontFamily: "Arial, sans-serif"
          },
          iconType: "rect",
          layout: "horizontal"
        })
      ]))),

      // Footer
      React.createElement('div', {
        key: 'footer',
        style: {
          padding: isMobile ? "0 16px 16px 16px" : "0 24px 20px 24px",
          borderTop: `1px solid ${colours.border}`,
          paddingTop: isMobile ? "12px" : "16px",
          backgroundColor: colours.card,
          boxSizing: "border-box"
        }
      }, React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '16px',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between'
        }
      }, [
        React.createElement('div', {
          key: 'source-section',
          style: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '4px' : '16px',
            alignItems: isMobile ? 'flex-start' : 'center'
          }
        }, [
          sourceUrl ? React.createElement('a', {
            key: 'source',
            href: sourceUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            style: {
              margin: "0",
              fontSize: isMobile ? "10px" : "12px",
              color: colours.mutedForeground,
              fontWeight: "400",
              textDecoration: "underline",
              cursor: "pointer"
            },
            onMouseOver: (e) => {
              e.target.style.color = colours.primary;
            },
            onMouseOut: (e) => {
              e.target.style.color = colours.mutedForeground;
            }
          }, `Source: ${sourceText}`) : React.createElement('span', {
            key: 'source',
            style: {
              margin: "0",
              fontSize: isMobile ? "10px" : "12px",
              color: colours.mutedForeground,
              fontWeight: "400"
            }
          }, `Source: ${sourceText}`),
          React.createElement('span', {
            key: 'chart-info',
            style: {
              margin: "0",
              fontSize: isMobile ? "10px" : "12px",
              color: colours.mutedForeground,
              fontWeight: "400"
            }
          }, "Chart: Payments Intelligence")
        ]),
        // Notes icon
        notesDescription && React.createElement('div', {
          key: 'notes-section',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
          },
          onClick: () => setShowNotesModal(true),
          onMouseOver: (e) => {
            e.currentTarget.style.backgroundColor = colours.muted;
          },
          onMouseOut: (e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          },
          title: "View chart notes"
        }, [
          React.createElement(InfoIcon, {
            key: 'icon',
            size: isMobile ? 14 : 16
          }),
          React.createElement('span', {
            key: 'text',
            style: {
              margin: "0",
              fontSize: isMobile ? "9px" : "11px",
              color: colours.mutedForeground,
              fontWeight: "400"
            }
          }, "Notes")
        ])
      ]))
    ]),
    React.createElement(NotesModal, { key: 'modal' })
  ]);
};

// Sample data for pie chart
const samplePaymentsPieData = [
  { name: "Card payments", volume: 145000 },
  { name: "Bank transfers", volume: 89000 },
  { name: "Digital wallets", volume: 67000 },
  { name: "Direct debit", volume: 34000 },
  { name: "Cash", volume: 12000 },
  { name: "Cheques", volume: 3000 }
];

// CRITICAL: Global setup for UMD
if (typeof window !== 'undefined') {
  console.log('Setting up PaymentsCharts Pie global...');
  
  // Ensure the global namespace exists
  window.PaymentsCharts = window.PaymentsCharts || {};
  
  // Add the pie chart render method
  window.PaymentsCharts.renderPieChart = function (containerId, options = {}) {
    console.log('renderPieChart called with:', containerId, options);
    
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

      const data = options.data || samplePaymentsPieData;

      // Try modern React 18+ createRoot first, fallback to legacy render
      if (ReactDOM.createRoot) {
        console.log('Using React 18+ createRoot for Pie Chart');
        const root = ReactDOM.createRoot(container);
        root.render(
          React.createElement(PaymentsPieChart, {
            data: data,
            width: options.width,
            height: options.height,
            title: options.title,
            showLogo: options.showLogo,
            className: options.className,
            sourceText: options.sourceText,
            sourceUrl: options.sourceUrl,
            notesDescription: options.notesDescription,
            showInnerRadius: options.showInnerRadius,
            showLabels: options.showLabels,
            showLegend: options.showLegend,
          })
        );
      } else if (ReactDOM.render) {
        console.log('Using legacy ReactDOM.render for Pie Chart');
        ReactDOM.render(
          React.createElement(PaymentsPieChart, {
            data: data,
            width: options.width,
            height: options.height,
            title: options.title,
            showLogo: options.showLogo,
            className: options.className,
            sourceText: options.sourceText,
            sourceUrl: options.sourceUrl,
            notesDescription: options.notesDescription,
            showInnerRadius: options.showInnerRadius,
            showLabels: options.showLabels,
            showLegend: options.showLegend,
          }),
          container
        );
      } else {
        throw new Error('No suitable React render method found');
      }

      console.log('Pie chart rendered successfully');
    } catch (error) {
      console.error('Error rendering pie chart:', error);
      container.innerHTML = `
        <div style="
          color: #ef4444; 
          background: #fef2f2; 
          padding: 20px; 
          border-radius: 8px; 
          border: 1px solid #fecaca;
          font-family: ui-sans-serif, system-ui, sans-serif;
        ">
          <h4 style="margin: 0 0 8px 0; font-size: 16px;">Pie Chart Loading Error</h4>
          <p style="margin: 0; font-size: 14px;">${error.message}</p>
        </div>
      `;
    }
  };

  // Set this as the main render method if no other chart has claimed it
  if (!window.PaymentsCharts.render) {
    window.PaymentsCharts.render = window.PaymentsCharts.renderPieChart;
  }
  
  console.log('PaymentsCharts Pie setup complete. Available methods:', Object.keys(window.PaymentsCharts));
}

// Auto-render functionality for pie charts
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM loaded, looking for auto-render pie charts');
    const chartContainers = document.querySelectorAll("[data-payments-pie-chart]");
    
    if (chartContainers.length === 0) {
      console.log('No auto-render pie chart containers found');
      return;
    }

    console.log(`Found ${chartContainers.length} pie chart containers for auto-render`);
    
    chartContainers.forEach((container) => {
      try {
        const chartData = container.getAttribute("data-chart-data");
        const chartTitle = container.getAttribute("data-chart-title");
        const showLogo = container.getAttribute("data-show-logo") !== "false";
        const sourceText = container.getAttribute("data-source-text");
        const sourceUrl = container.getAttribute("data-source-url");
        const notesDescription = container.getAttribute("data-notes-description");
        const showInnerRadius = container.getAttribute("data-show-inner-radius") === "true";
        const showLabels = container.getAttribute("data-show-labels") !== "false";
        const showLegend = container.getAttribute("data-show-legend") !== "false";

        if (window.PaymentsCharts && window.PaymentsCharts.renderPieChart) {
          window.PaymentsCharts.renderPieChart(container.id, {
            data: chartData ? JSON.parse(chartData) : undefined,
            title: chartTitle,
            showLogo: showLogo,
            sourceText: sourceText,
            sourceUrl: sourceUrl,
            notesDescription: notesDescription,
            showInnerRadius: showInnerRadius,
            showLabels: showLabels,
            showLegend: showLegend,
          });
        }
      } catch (error) {
        console.error('Error in auto-render for pie chart container:', container.id, error);
      }
    });
  });
}

export default PaymentsPieChart;