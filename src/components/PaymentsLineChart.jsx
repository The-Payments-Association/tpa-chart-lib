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

  // Enhanced field name formatting
  const formatFieldName = (fieldKey) => {
    // Check for custom override first
    if (fieldLabels[fieldKey]) {
      return fieldLabels[fieldKey];
    }

    // Auto-format field names
    const formatters = {
      // Common payment fields
      volume: isMobile ? 'Volume' : 'Transaction Volume',
      value: isMobile ? 'Value (£m)' : 'Transaction Value (£m)',
      count: isMobile ? 'Count' : 'Transaction Count',
      users: isMobile ? 'Users' : 'Active Users',
      revenue: isMobile ? 'Revenue' : 'Revenue (£m)',
      
      // Financial fields
      sales: isMobile ? 'Sales' : 'Sales Revenue',
      profit: isMobile ? 'Profit' : 'Net Profit',
      margin: isMobile ? 'Margin' : 'Profit Margin',
      costs: isMobile ? 'Costs' : 'Total Costs',
      
      // Web/Analytics fields
      visitors: isMobile ? 'Visitors' : 'Unique Visitors',
      conversions: isMobile ? 'Conversions' : 'Conversion Rate',
      pageviews: isMobile ? 'Views' : 'Page Views',
      sessions: isMobile ? 'Sessions' : 'User Sessions',
      bounceRate: isMobile ? 'Bounce %' : 'Bounce Rate (%)',
      
      // Business metrics
      customers: isMobile ? 'Customers' : 'Total Customers',
      orders: isMobile ? 'Orders' : 'Order Count',
      avgOrder: isMobile ? 'Avg Order' : 'Average Order Value',
      retention: isMobile ? 'Retention' : 'Customer Retention (%)',
      
      // Performance metrics
      response: isMobile ? 'Response' : 'Response Time (ms)',
      uptime: isMobile ? 'Uptime' : 'Uptime (%)',
      errors: isMobile ? 'Errors' : 'Error Count',
      
      // Generic fallbacks
      amount: isMobile ? 'Amount' : 'Total Amount',
      total: isMobile ? 'Total' : 'Total Value',
      average: isMobile ? 'Average' : 'Average Value',
      percentage: isMobile ? 'Percentage' : 'Percentage (%)',
    };

    // Use predefined formatter if available
    if (formatters[fieldKey]) {
      return formatters[fieldKey];
    }

    // Auto-format unknown fields
    return fieldKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  // Enhanced value formatting for tooltips
  const formatValue = (value, fieldKey) => {
    const currencyFields = ['value', 'revenue', 'sales', 'profit', 'costs', 'amount', 'total', 'avgOrder'];
    const percentageFields = ['margin', 'bounceRate', 'retention', 'uptime', 'percentage'];
    const timeFields = ['response'];

    if (currencyFields.includes(fieldKey)) {
      if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `£${(value / 1000).toFixed(1)}K`;
      return `£${value.toLocaleString()}`;
    }

    if (percentageFields.includes(fieldKey)) {
      return `${value}%`;
    }

    if (timeFields.includes(fieldKey)) {
      return `${value}ms`;
    }

    // Default number formatting
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
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
    const maxLines = isMobile ? 2 : isTablet ? 3 : 5;
    
    const colors = [colours.primary, colours.secondary, colours.tertiary, colours.quaternary, colours.quinary];
    
    return dataKeys.slice(0, maxLines).map((key, index) => ({
      key,
      name: formatFieldName(key),
      color: colors[index % colors.length],
      strokeWidth: isMobile ? 2 : 3
    }));
  };

  const lineConfigs = getLineConfigs();
  const visibleData = getVisibleData();
  const totalPages = getTotalPages();

  // Custom dot component
  const CustomDot = ({ cx, cy, fill }) => {
    if (isMobile && lineConfigs.length > 2) return null;
    return React.createElement('circle', {
      cx: cx,
      cy: cy,
      r: isMobile ? 3 : 4,
      fill: fill,
      stroke: fill,
      strokeWidth: 2,
      style: { filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }
    });
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
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          fontSize: isMobile ? "12px" : "14px",
          minWidth: isMobile ? "140px" : "180px",
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
              key: 'label',
              style: {
                fontSize: isMobile ? "11px" : "13px",
                color: colours.mutedForeground,
                flex: 1
              }
            }, `${entry.name}:`),
            React.createElement('span', {
              key: 'value',
              style: {
                fontWeight: "600",
                color: colours.foreground,
                fontSize: isMobile ? "11px" : "13px"
              }
            }, formatValue(entry.value, entry.dataKey))
          ])
        )
      ]);
    }
    return null;
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
  const CloseIcon = ({ size = 20, color = colours.mutedForeground }) => 
    React.createElement('svg', {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('path', { key: 'path1', d: "M18 6L6 18" }),
      React.createElement('path', { key: 'path2', d: "M6 6l12 12" })
    ]);

  // Notes modal
  const NotesModal = () => {
    if (!showNotesModal || !notesDescription) return null;

    return React.createElement('div', {
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          setShowNotesModal(false);
        }
      },
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
      }
    }, React.createElement('div', {
      onClick: (e) => e.stopPropagation(),
      style: {
        backgroundColor: colours.background,
        borderRadius: '12px',
        border: `1px solid ${colours.border}`,
        maxWidth: isMobile ? '100%' : '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        fontFamily: "Arial, sans-serif"
      }
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
        }, React.createElement(CloseIcon))
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
          fontFamily: "Arial, sans-serif",
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
            lineConfigs.length === 1 
              ? (isMobile ? "Trend analysis" : "Trend analysis over time")
              : (isMobile ? "Multi-metric trends" : "Multi-metric trend analysis"),
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
            flexShrink: 0,
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
        }, React.createElement(RechartsLineChart, {
          data: visibleData,
          margin: {
            top: isMobile ? 20 : 30,
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
            iconType: "line",
            layout: isMobile && lineConfigs.length > 2 ? "vertical" : "horizontal"
          }),
          ...lineConfigs.map((config) =>
            React.createElement(Line, {
              key: config.key,
              type: "monotone",
              dataKey: config.key,
              stroke: config.color,
              strokeWidth: config.strokeWidth,
              name: config.name,
              dot: React.createElement(CustomDot),
              connectNulls: false,
              activeDot: {
                r: isMobile ? 4 : 5,
                fill: config.color,
                stroke: colours.background,
                strokeWidth: 2,
                style: { filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }
              }
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
              border: 'none',
              borderRadius: '4px',
              fontFamily: "Arial, sans-serif",
              backgroundColor: currentPage === 0 ? colours.muted : colours.primary,
              color: currentPage === 0 ? colours.mutedForeground : 'white',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
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
              backgroundColor: currentPage === totalPages - 1 ? colours.muted : colours.primary,
              color: currentPage === totalPages - 1 ? colours.mutedForeground : 'white',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
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
          }, `Chart: Payments Intelligence (${lineConfigs.length} line${lineConfigs.length !== 1 ? 's' : ''})`)
        ]),
        // Notes icon
        notesDescription && React.createElement('div', {
          key: 'notes-section',
          onClick: () => setShowNotesModal(true),
          title: "View chart notes",
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          },
          onMouseOver: (e) => {
            e.currentTarget.style.backgroundColor = colours.muted;
          },
          onMouseOut: (e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
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

// Sample data
const samplePaymentsData = [
  { name: "Q1 2024", volume: 145000, value: 32060 },
  { name: "Q2 2024", volume: 162000, value: 42150 },
  { name: "Q3 2024", volume: 158000, value: 43320 },
  { name: "Q4 2024", volume: 171000, value: 46840 }
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