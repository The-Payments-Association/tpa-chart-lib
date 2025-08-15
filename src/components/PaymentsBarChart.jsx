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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Responsive event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentPage(0);
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

  // Dynamic bar configuration based on data keys
  const getBarConfigs = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const dataKeys = Object.keys(sampleData).filter(key => 
      key !== 'name' && typeof sampleData[key] === 'number'
    );
    
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

  const barConfigs = getBarConfigs();
  const visibleData = getVisibleData();
  const totalPages = getTotalPages();

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

  // Custom bar label component
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
    
    return React.createElement('text', {
      x: labelX,
      y: labelY,
      textAnchor: "middle",
      fill: colours.foreground,
      fontSize: isMobile ? "9" : "11",
      fontWeight: "500",
      fontFamily: "Arial, sans-serif"
    }, formatValue(value));
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
                fontSize: isMobile ? "11px" : "13px",
                color: colours.mutedForeground,
                display: "flex",
                alignItems: "center"
              }
            }, [
              `${entry.name}: `,
              React.createElement('span', {
                key: 'value',
                style: {
                  fontWeight: "500",
                  color: colours.foreground,
                  marginLeft: "4px"
                }
              }, entry.value.toLocaleString())
            ])
          ])
        )
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
          }, [
            isMobile ? "Payment analysis" : "Payment transaction analysis",
            totalPages > 1 && React.createElement('span', {
              key: 'page-info',
              style: { 
                marginLeft: "8px", 
                fontSize: isMobile ? "10px" : "12px" 
              }
            }, `(${currentPage + 1}/${totalPages})`)
          ])
        ]),
        showLogo && React.createElement('div', {
          key: 'logo-section',
          style: {
            marginLeft: isMobile ? "8px" : "16px",
            flexShrink: 0
          }
        }, React.createElement('img', {
          src: "https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg",
          alt: "The Payments Association",
          style: {
            height: isMobile ? "30px" : "40px",
            width: "auto",
            maxWidth: "100%"
          }
        }))
      ]),

      // Chart section
      React.createElement('div', {
        key: 'chart',
        style: {
          padding: isMobile ? "16px" : "24px",
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }
      }, [
        React.createElement(ResponsiveContainer, {
          key: 'chart-container',
          width: width,
          height: height
        }, React.createElement(RechartsBarChart, {
          data: visibleData,
          margin: {
            top: isMobile ? 30 : 40,
            right: isMobile ? 10 : 30,
            left: isMobile ? 10 : 20,
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
              fontSize: isMobile ? 10 : 12,
              fontFamily: "Arial, sans-serif"
            },
            axisLine: { stroke: colours.border, strokeWidth: 1 },
            tickLine: false,
            tickMargin: 8,
            interval: 0,
            angle: isMobile ? -45 : 0,
            textAnchor: isMobile ? "end" : "middle",
            height: isMobile ? 60 : 30
          }),
          React.createElement(YAxis, {
            key: 'yaxis',
            tick: {
              fill: colours.mutedForeground,
              fontSize: isMobile ? 10 : 12,
              fontFamily: "Arial, sans-serif"
            },
            axisLine: false,
            tickLine: false,
            tickMargin: 8,
            tickFormatter: (value) => {
              if (isMobile) {
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
              fontSize: isMobile ? "11px" : "13px",
              color: colours.mutedForeground,
              fontFamily: "Arial, sans-serif"
            },
            iconType: "rect",
            layout: isMobile && barConfigs.length > 2 ? "vertical" : "horizontal"
          }),
          ...barConfigs.map((barConfig) =>
            React.createElement(Bar, {
              key: barConfig.key,
              dataKey: barConfig.key,
              fill: barConfig.color,
              name: barConfig.name,
              radius: [4, 4, 0, 0],
              strokeWidth: 0,
              label: React.createElement(CustomBarLabel)
            })
          )
        ])),

        // Pagination controls
        totalPages > 1 && React.createElement('div', {
          key: 'pagination',
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 0 8px 0',
            borderTop: `1px solid ${colours.border}`,
            marginTop: '16px'
          }
        }, [
          React.createElement('button', {
            key: 'prev',
            onClick: () => setCurrentPage(Math.max(0, currentPage - 1)),
            disabled: currentPage === 0,
            style: {
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: currentPage === 0 ? colours.muted : colours.primary,
              color: currentPage === 0 ? colours.mutedForeground : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Arial, sans-serif'
            }
          }, 'Previous'),
          React.createElement('span', {
            key: 'counter',
            style: {
              fontSize: '12px',
              color: colours.mutedForeground,
              fontFamily: 'Arial, sans-serif'
            }
          }, `${currentPage + 1} of ${totalPages}`),
          React.createElement('button', {
            key: 'next',
            onClick: () => setCurrentPage(Math.min(totalPages - 1, currentPage + 1)),
            disabled: currentPage === totalPages - 1,
            style: {
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: currentPage === totalPages - 1 ? colours.muted : colours.primary,
              color: currentPage === totalPages - 1 ? colours.mutedForeground : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'Arial, sans-serif'
            }
          }, 'Next')
        ])
      ]),

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
              color: colours.mutedForeground
            }
          }, `Source: ${sourceText}`),
          React.createElement('span', {
            key: 'chart-info',
            style: {
              margin: "0",
              fontSize: isMobile ? "10px" : "12px",
              color: colours.mutedForeground
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
              color: colours.mutedForeground
            }
          }, "Notes")
        ])
      ]))
    ]),
    React.createElement(NotesModal, { key: 'modal' })
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
  console.log('Setting up PaymentsCharts Bar global...');
  
  // Ensure the global namespace exists
  window.PaymentsCharts = window.PaymentsCharts || {};
  
  // Add the bar chart render method
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
        console.log('Using React 18+ createRoot for Bar Chart');
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
        console.log('Using legacy ReactDOM.render for Bar Chart');
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
          <h4 style="margin: 0 0 8px 0; font-size: 16px;">Bar Chart Loading Error</h4>
          <p style="margin: 0; font-size: 14px;">${error.message}</p>
        </div>
      `;
    }
  };

  // Set this as the main render method if no other chart has claimed it
  if (!window.PaymentsCharts.render) {
    window.PaymentsCharts.render = window.PaymentsCharts.renderBarChart;
  }
  
  console.log('PaymentsCharts Bar setup complete. Available methods:', Object.keys(window.PaymentsCharts));
}

// Auto-render functionality for bar charts
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM loaded, looking for auto-render bar charts');
    const chartContainers = document.querySelectorAll("[data-payments-bar-chart]");
    
    if (chartContainers.length === 0) {
      console.log('No auto-render bar chart containers found');
      return;
    }

    console.log(`Found ${chartContainers.length} bar chart containers for auto-render`);
    
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
        console.error('Error in auto-render for bar chart container:', container.id, error);
      }
    });
  });
}

export default PaymentsBarChart;