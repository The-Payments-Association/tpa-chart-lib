import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../chart_styles.css";

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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

  // Device breakpoint
  const isMobile = windowWidth < 768;

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

  // Pie chart colour palette
  const pieColours = [
    colours.primary,
    colours.secondary,
    colours.tertiary,
    colours.quaternary,
    colours.quinary,
    "#10d9c4",
    "#004d3d",
    "#00b894",
    "#006b5a",
    "#00f5d4",
    "#003d32",
    "#009688",
  ];

  // For better TypeScript-like type safety
  const RADIAN = Math.PI / 180;

  // Icon components
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

  // Prepare pie data
  const getPieData = () => {
    if (!data || data.length === 0) return [];
    
    const sampleData = data[0];
    const numericKeys = Object.keys(sampleData).filter(key => 
      key !== 'name' && typeof sampleData[key] === 'number'
    );
    
    if (numericKeys.length === 0) return [];
    
    const dataKey = numericKeys[0];
    
    // Calculate total for percentage calculations
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);
    
    return data.map((item, index) => ({
      name: item.name,
      value: item[dataKey],
      percentage: ((item[dataKey] / total) * 100).toFixed(1),
      color: pieColours[index % pieColours.length],
    }));
  };

// Mobile customised label renderer - clean and simple
const renderMobileCustomisedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  // Position labels closer to the center of each segment
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Don't show label if segment is too small
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="10"
      fontWeight="600"
      style={{
        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))',
        pointerEvents: 'none'
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  // Desktop label renderer - external labels with lines
  const renderDesktopLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, index }) => {
    if (!showLabels || percent < 0.03) return null;

    const labelDistance = 35;
    const radius = outerRadius + labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const lineStart = {
      x: cx + outerRadius * Math.cos(-midAngle * RADIAN),
      y: cy + outerRadius * Math.sin(-midAngle * RADIAN)
    };
    
    const lineMiddle = {
      x: cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN)
    };

    const textAnchor = x > cx ? 'start' : 'end';
    const labelX = textAnchor === 'start' ? x + 3 : x - 3;
    const maxNameLength = 12;
    const displayName = name.length > maxNameLength ? `${name.substring(0, maxNameLength)}...` : name;

    return (
      <g key={`label-${index}`}>
        <polyline
          points={`${lineStart.x},${lineStart.y} ${lineMiddle.x},${lineMiddle.y} ${x},${y}`}
          stroke={colours.mutedForeground}
          strokeWidth={0.5}
          fill="none"
          opacity={0.7}
        />
        <text
          x={labelX}
          y={y - 4}
          textAnchor={textAnchor}
          fill={colours.foreground}
          fontSize="12"
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{
            filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
          }}
        >
          {displayName}
        </text>
        <text
          x={labelX}
          y={y + 6}
          textAnchor={textAnchor}
          fill={colours.mutedForeground}
          fontSize="11"
          fontWeight="400"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{
            filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
          }}
        >
          {value.toLocaleString()} ({(percent * 100).toFixed(1)}%)
        </text>
      </g>
    );
  };

  // Logo component
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = payload[0].payload.percentage;
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
            {data.name}
          </p>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <div style={{
              width: "10px",
              height: "10px",
              backgroundColor: data.payload.color,
              borderRadius: "2px",
              flexShrink: 0
            }}></div>
            <span style={{ 
              fontSize: isMobile ? "11px" : "13px",
              color: colours.mutedForeground,
              display: "flex",
              alignItems: "center"
            }}>
              Value: 
              <span style={{ 
                fontWeight: "500",
                color: colours.foreground,
                marginLeft: "4px"
              }}>
                {data.value.toLocaleString()} ({percentage}%)
              </span>
            </span>
          </div>
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

  // Mobile Chart Component - simplified like the example
  const MobileChart = ({ pieData }) => {
    const outerRadius = 80;
    const innerRadius = showInnerRadius ? 30 : 0;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderMobileCustomisedLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={1}
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={entry.color}
                stroke={hoveredIndex === index ? colours.foreground : 'none'}
                strokeWidth={hoveredIndex === index ? 2 : 0}
                style={{
                  filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "12px",
                fontSize: "11px",
                color: colours.mutedForeground,
                fontFamily: "ui-sans-serif, system-ui, sans-serif"
              }}
              iconType="rect"
              layout="horizontal"
              formatter={(value) => {
                // Truncate legend items on mobile
                return value.length > 15 ? `${value.substring(0, 15)}...` : value;
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  // Desktop Chart Component
  const DesktopChart = ({ pieData }) => {
    const innerRadius = showInnerRadius ? 60 : 0;
    const outerRadius = 120;

    return (
      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart 
          margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
        >
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderDesktopLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={1}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={hoveredIndex === index ? colours.foreground : 'none'}
                strokeWidth={hoveredIndex === index ? 2 : 0}
                style={{
                  filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "13px",
                color: colours.mutedForeground,
                fontFamily: "ui-sans-serif, system-ui, sans-serif"
              }}
              iconType="rect"
              layout="horizontal"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  const pieData = getPieData();

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
              {isMobile ? "Payment distribution" : "Payment transaction distribution"}
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

        {/* Chart section - conditionally render mobile or desktop */}
        <div style={{ 
          padding: isMobile ? "16px" : "24px",
          backgroundColor: colours.cardTint,
          boxSizing: "border-box"
        }}>
          {isMobile ? (
            <MobileChart pieData={pieData} />
          ) : (
            <DesktopChart pieData={pieData} />
          )}
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

      <NotesModal />
    </>
  );
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

// Global chart library
window.PaymentsCharts = {
  render: function (containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    const root = createRoot(container);
    const data = options.data || samplePaymentsPieData;

    root.render(
      <PaymentsPieChart
        data={data}
        width={options.width}
        height={options.height}
        title={options.title}
        showLogo={options.showLogo}
        className={options.className}
        sourceText={options.sourceText}
        sourceUrl={options.sourceUrl}
        notesDescription={options.notesDescription}
        showInnerRadius={options.showInnerRadius}
        showLabels={options.showLabels}
        showLegend={options.showLegend}
      />
    );
  },
};

// Auto-render functionality
document.addEventListener("DOMContentLoaded", function () {
  const chartContainers = document.querySelectorAll("[data-payments-pie-chart]");
  chartContainers.forEach((container) => {
    const chartData = container.getAttribute("data-chart-data");
    const chartTitle = container.getAttribute("data-chart-title");
    const showLogo = container.getAttribute("data-show-logo") !== "false";
    const sourceText = container.getAttribute("data-source-text");
    const sourceUrl = container.getAttribute("data-source-url");
    const notesDescription = container.getAttribute("data-notes-description");
    const showInnerRadius = container.getAttribute("data-show-inner-radius") === "true";
    const showLabels = container.getAttribute("data-show-labels") !== "false";
    const showLegend = container.getAttribute("data-show-legend") !== "false";

    window.PaymentsCharts.render(container.id, {
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
  });
});

export default PaymentsPieChart;