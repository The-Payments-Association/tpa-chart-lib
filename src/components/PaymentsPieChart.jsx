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
  const [chartKey, setChartKey] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Debounce utility function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Responsive event listener with breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const previousBreakpoint = windowWidth < 768 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop';
      const currentBreakpoint = newWidth < 768 ? 'mobile' : newWidth < 1024 ? 'tablet' : 'desktop';
      
      setWindowWidth(newWidth);
      
      // Force complete re-render when breakpoint changes
      if (previousBreakpoint !== currentBreakpoint) {
        setChartKey(prev => prev + 1);
      }
    };

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [windowWidth]);

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

  // Mobile optimised data - show only top items, group others
  const getMobileOptimisedData = () => {
    const pieData = getPieData();
    if (pieData.length <= 5) return pieData;

    const sortedData = [...pieData].sort((a, b) => b.value - a.value);
    const topItems = sortedData.slice(0, 4);
    const otherItems = sortedData.slice(4);
    
    if (otherItems.length > 0) {
      const otherTotal = otherItems.reduce((sum, item) => sum + item.value, 0);
      topItems.push({
        name: "Other",
        value: otherTotal,
        color: colours.mutedForeground
      });
    }
    
    return topItems;
  };

  // Get responsive configuration - MOBILE DOUBLED, DESKTOP REVERTED
  const getResponsiveConfig = () => {
    const baseData = getPieData();
    const totalValue = baseData.reduce((sum, item) => sum + item.value, 0);

    if (isMobile) {
      return {
        width: "100%",
        height: 700, // DOUBLED - was 350
        margin: { top: 40, right: 60, bottom: 40, left: 60 }, // DOUBLED
        outerRadius: 170, // DOUBLED - was 85
        innerRadius: 0,
        showLabels: false,
        showLegend: true,
        legendLayout: "horizontal",
        data: getMobileOptimisedData(),
        paddingAngle: 2,
        totalValue
      };
    } else if (isTablet) {
      return {
        width: width,
        height: Math.max(height, 600), // REVERTED - back to original
        margin: { top: 30, right: 60, bottom: 30, left: 60 }, // REVERTED
        outerRadius: 170, // REVERTED - back to original
        innerRadius: showInnerRadius ? 40 : 0, // REVERTED
        showLabels: showLabels,
        showLegend: showLegend && !showLabels,
        legendLayout: "horizontal",
        data: baseData,
        paddingAngle: 1,
        totalValue
      };
    } else {
      return {
        width: width,
        height: Math.max(height, 450), // REVERTED - back to original
        margin: { top: 40, right: 100, bottom: 40, left: 100 }, // REVERTED
        outerRadius: 150, // REVERTED - back to original
        innerRadius: showInnerRadius ? 80 : 0, // REVERTED
        showLabels: showLabels,
        showLegend: showLegend && !showLabels,
        legendLayout: "horizontal",
        data: baseData,
        paddingAngle: 1,
        totalValue
      };
    }
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

  // Desktop custom label - MOBILE DOUBLED, DESKTOP REVERTED
  const renderDesktopCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }) => {
    // Only show label if percentage is above threshold
    if (percent < 0.03) return null;

    const RADIAN = Math.PI / 180;
    const labelDistance = isMobile ? 70 : isTablet ? 45 : 55; // Mobile doubled, others reverted
    const radius = outerRadius + labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Calculate line points
    const lineStart = {
      x: cx + outerRadius * Math.cos(-midAngle * RADIAN),
      y: cy + outerRadius * Math.sin(-midAngle * RADIAN)
    };
    
    const lineMiddle = {
      x: cx + (outerRadius + (isMobile ? 40 : 20)) * Math.cos(-midAngle * RADIAN), // Mobile doubled, others reverted
      y: cy + (outerRadius + (isMobile ? 40 : 20)) * Math.sin(-midAngle * RADIAN)
    };

    const formatValue = (val) => {
      if (isMobile || isTablet) {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toString();
      }
      return val.toLocaleString();
    };

    const textAnchor = x > cx ? 'start' : 'end';
    const labelX = textAnchor === 'start' ? x + (isMobile ? 10 : 5) : x - (isMobile ? 10 : 5); // Mobile doubled, others reverted
    const maxNameLength = isMobile ? 10 : isTablet ? 12 : 15;
    const displayName = name.length > maxNameLength ? `${name.substring(0, maxNameLength)}...` : name;

    return React.createElement('g', { key: `label-${index}` }, [
      // Connecting line
      React.createElement('polyline', {
        key: 'line',
        points: `${lineStart.x},${lineStart.y} ${lineMiddle.x},${lineMiddle.y} ${x},${y}`,
        stroke: colours.mutedForeground,
        strokeWidth: isMobile ? 2 : 1, // Mobile doubled, others reverted
        fill: "none",
        opacity: 0.8
      }),
      
      // Category name with text shadow for better readability
      React.createElement('text', {
        key: 'name',
        x: labelX,
    y: y - (isMobile ? 10 : isTablet ? 15 : 10), // Increased spacing from value
        textAnchor: textAnchor,
        fill: colours.foreground,
        fontSize: isMobile ? "22" : isTablet ? "25" : "14", // Mobile doubled, others reverted
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
    y: y + (isMobile ? 10 : isTablet ? 15 : 10), // Increased spacing from category name
        textAnchor: textAnchor,
        fill: colours.mutedForeground,
        fontSize: isMobile ? "20" : isTablet ? "23" : "12", // Mobile doubled, others reverted
        fontWeight: "500",
        fontFamily: "Arial, sans-serif",
        style: {
          filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
        }
      }, `${formatValue(value)} (${(percent * 100).toFixed(1)}%)`)
    ]);
  };

  // Mobile tooltip component - DOUBLED SIZES
  const MobileTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const config = getResponsiveConfig();
      const percentage = ((data.value / config.totalValue) * 100).toFixed(1);
      
      return React.createElement('div', {
        style: {
          backgroundColor: colours.background,
          border: `1px solid ${colours.border}`,
          borderRadius: "16px", // DOUBLED
          padding: "24px", // DOUBLED
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontSize: "24px", // DOUBLED
          minWidth: "320px", // DOUBLED
          fontFamily: "Arial, sans-serif"
        }
      }, [
        React.createElement('div', {
          key: 'label',
          style: {
            fontWeight: "600",
            marginBottom: "12px", // DOUBLED
            color: colours.foreground,
            fontSize: "26px" // DOUBLED
          }
        }, data.name),
        React.createElement('div', {
          key: 'content',
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px" // DOUBLED
          }
        }, [
          React.createElement('div', {
            key: 'color',
            style: {
              width: "20px", // DOUBLED
              height: "20px",
              backgroundColor: data.color,
              borderRadius: "4px", // DOUBLED
              flexShrink: 0
            }
          }),
          React.createElement('span', {
            key: 'text',
            style: {
              fontSize: "22px", // DOUBLED
              color: colours.mutedForeground
            }
          }, `${data.value.toLocaleString()} (${percentage}%)`)
        ])
      ]);
    }
    return null;
  };

  // Desktop/Tablet tooltip component - REVERTED SIZES
  const DesktopTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return React.createElement('div', {
        style: {
          backgroundColor: colours.background,
          border: `1px solid ${colours.border}`,
          borderRadius: "10px", // REVERTED
          padding: isTablet ? "14px" : "16px", // REVERTED
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontSize: isTablet ? "14px" : "15px", // REVERTED
          minWidth: isTablet ? "160px" : "180px", // REVERTED
          fontFamily: "Arial, sans-serif"
        }
      }, [
        React.createElement('p', {
          key: 'label',
          style: {
            margin: "0 0 8px 0", // REVERTED
            fontWeight: "600",
            color: colours.foreground,
            fontSize: isTablet ? "15px" : "16px" // REVERTED
          }
        }, data.name),
        React.createElement('div', {
          key: 'content',
          style: {
            display: "flex",
            alignItems: "center",
            gap: "8px" // REVERTED
          }
        }, [
          React.createElement('div', {
            key: 'color',
            style: {
              width: "12px", // REVERTED
              height: "12px",
              backgroundColor: data.color,
              borderRadius: "3px", // REVERTED
              flexShrink: 0
            }
          }),
          React.createElement('span', {
            key: 'text',
            style: {
              fontSize: isTablet ? "13px" : "14px", // REVERTED
              color: colours.mutedForeground,
              display: "flex",
              alignItems: "center"
            }
          }, [
            "Value: ",
            React.createElement('span', {
              key: 'value',
              style: {
                fontWeight: "600",
                color: colours.foreground,
                marginLeft: "6px" // REVERTED
              }
            }, data.value.toLocaleString())
          ])
        ])
      ]);
    }
    return null;
  };

  // Responsive chart renderer
  const renderResponsiveChart = () => {
    const config = getResponsiveConfig();
    
    return React.createElement(ResponsiveContainer, {
      width: config.width,
      height: config.height
    }, React.createElement(RechartsPieChart, {
      margin: config.margin
    }, [
      React.createElement(Pie, {
        key: 'pie',
        data: config.data,
        cx: "50%",
        cy: "50%",
        labelLine: false,
        label: config.showLabels ? renderDesktopCustomLabel : false,
        outerRadius: config.outerRadius,
        innerRadius: config.innerRadius,
        fill: "#8884d8",
        dataKey: "value",
        paddingAngle: config.paddingAngle,
        onMouseEnter: (_, index) => setHoveredIndex(index),
        onMouseLeave: () => setHoveredIndex(null)
      }, config.data.map((entry, index) =>
        React.createElement(Cell, {
          key: `cell-${index}`,
          fill: entry.color,
          stroke: hoveredIndex === index ? colours.foreground : 'none',
          strokeWidth: hoveredIndex === index ? (isMobile ? 6 : 3) : 0, // Mobile doubled, others reverted
          style: {
            filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }
        })
      )),
      React.createElement(Tooltip, {
        key: 'tooltip',
        content: isMobile ? React.createElement(MobileTooltip) : React.createElement(DesktopTooltip)
      }),
      config.showLegend && React.createElement(Legend, {
        key: 'legend',
        wrapperStyle: {
          paddingTop: isMobile ? "30px" : isTablet ? "20px" : "25px", // Mobile doubled, others reverted
          fontSize: isMobile ? "22px" : isTablet ? "12px" : "14px", // Mobile doubled, others reverted
          color: colours.mutedForeground,
          fontFamily: "Arial, sans-serif"
        },
        iconType: isMobile ? "circle" : "rect",
        layout: config.legendLayout
      })
    ]));
  };

  // Notes modal - MOBILE DOUBLED, DESKTOP REVERTED
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
        padding: isMobile ? '32px' : '32px' // Mobile doubled, desktop reverted
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          setShowNotesModal(false);
        }
      }
    }, React.createElement('div', {
      style: {
        backgroundColor: colours.background,
        borderRadius: isMobile ? '24px' : '12px', // Mobile doubled, desktop reverted
        border: `1px solid ${colours.border}`,
        maxWidth: isMobile ? '100%' : '500px', // Mobile same, desktop reverted
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
          padding: isMobile ? '32px' : '24px', // Mobile doubled, desktop reverted
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
            fontSize: isMobile ? '32px' : '18px', // Mobile doubled, desktop reverted
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
            padding: isMobile ? '8px' : '4px', // Mobile doubled, desktop reverted
            cursor: 'pointer',
            borderRadius: isMobile ? '8px' : '4px', // Mobile doubled, desktop reverted
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
        }, React.createElement(CloseIcon, { size: isMobile ? 40 : 20 })) // Mobile doubled, desktop reverted
      ]),
      // Modal content
      React.createElement('div', {
        key: 'content',
        style: {
          padding: isMobile ? '32px' : '24px' // Mobile doubled, desktop reverted
        }
      }, React.createElement('p', {
        style: {
          margin: 0,
          fontSize: isMobile ? '28px' : '16px', // Mobile doubled, desktop reverted
          lineHeight: '1.6',
          color: colours.foreground,
          whiteSpace: 'pre-wrap'
        }
      }, notesDescription)),
      // Modal footer
      React.createElement('div', {
        key: 'footer',
        style: {
          padding: isMobile ? '24px 32px 32px' : '16px 24px 24px', // Mobile doubled, desktop reverted
          borderTop: `1px solid ${colours.border}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }, React.createElement('button', {
        onClick: () => setShowNotesModal(false),
        style: {
          padding: isMobile ? '16px 32px' : '8px 16px', // Mobile doubled, desktop reverted
          fontSize: isMobile ? '28px' : '14px', // Mobile doubled, desktop reverted
          backgroundColor: colours.primary,
          color: 'white',
          border: 'none',
          borderRadius: isMobile ? '12px' : '6px', // Mobile doubled, desktop reverted
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
      key: `chart-container-${chartKey}`, // Force re-render on breakpoint change
      style: {
        backgroundColor: colours.card,
        border: `1px solid ${colours.border}`,
        borderRadius: isMobile ? "24px" : "12px", // Mobile doubled, desktop reverted
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box"
      },
      className: className
    }, [
      // Header - MOBILE DOUBLED, DESKTOP REVERTED
      React.createElement('div', {
        key: 'header',
        style: {
          padding: isMobile ? "32px 32px 0 32px" : isTablet ? "20px 20px 0 20px" : "24px 24px 0 24px", // Mobile doubled, others reverted
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
              margin: isMobile ? "0 0 4px 0" : "0 0 2px 0", // Mobile doubled, desktop reverted
              fontSize: isMobile ? "32px" : isTablet ? "17px" : "18px", // Mobile doubled, others reverted
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
              fontSize: isMobile ? "24px" : isTablet ? "13px" : "14px", // Mobile doubled, others reverted
              color: colours.mutedForeground,
              fontWeight: "400"
            }
          }, isMobile ? "Payment distribution" : "Payment transaction distribution")
        ]),
        showLogo && React.createElement('div', {
          key: 'logo-section',
          style: {
            marginLeft: isMobile ? "16px" : "16px", // Mobile doubled, desktop same
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
            height: isMobile ? "60px" : isTablet ? "35px" : "40px", // Mobile doubled, others reverted
            width: "auto",
            maxWidth: "100%"
          }
        })))
      ]),

      // Chart section - MOBILE DOUBLED, DESKTOP REVERTED
      React.createElement('div', {
        key: 'chart',
        style: {
          padding: isMobile ? "40px" : isTablet ? "24px" : "32px", // Mobile doubled, others reverted
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }
      }, renderResponsiveChart()),

      // Footer - MOBILE DOUBLED, DESKTOP REVERTED
      React.createElement('div', {
        key: 'footer',
        style: {
          padding: isMobile ? "0 32px 32px 32px" : isTablet ? "0 20px 18px 20px" : "0 24px 20px 24px", // Mobile doubled, others reverted
          borderTop: `1px solid ${colours.border}`,
          paddingTop: isMobile ? "24px" : isTablet ? "14px" : "16px", // Mobile doubled, others reverted
          backgroundColor: colours.card,
          boxSizing: "border-box"
        }
      }, React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '16px', // Mobile doubled, desktop same
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between'
        }
      }, [
        React.createElement('div', {
          key: 'source-section',
          style: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '8px' : '16px', // Mobile doubled, desktop same
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
              fontSize: isMobile ? "20px" : isTablet ? "11px" : "12px", // Mobile doubled, others reverted
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
              fontSize: isMobile ? "20px" : isTablet ? "11px" : "12px", // Mobile doubled, others reverted
              color: colours.mutedForeground,
              fontWeight: "400",}
         }, `Source: ${sourceText}`),
         React.createElement('span', {
           key: 'chart-info',
           style: {
             margin: "0",
             fontSize: isMobile ? "20px" : isTablet ? "11px" : "12px", // Mobile doubled, others reverted
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
           gap: isMobile ? '12px' : '6px', // Mobile doubled, desktop reverted
           cursor: 'pointer',
           padding: isMobile ? '8px' : '4px', // Mobile doubled, desktop reverted
           borderRadius: isMobile ? '8px' : '4px' // Mobile doubled, desktop reverted
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
           size: isMobile ? 28 : 16 // Mobile doubled, desktop reverted
         }),
         React.createElement('span', {
           key: 'text',
           style: {
             margin: "0",
             fontSize: isMobile ? "18px" : isTablet ? "10px" : "11px", // Mobile doubled, others reverted
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