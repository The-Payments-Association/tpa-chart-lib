import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from "recharts";

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
  fieldLabels = {}, // Custom field labels override
}) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    axis: "#cbd5e1",
  };

  const baseFont =
    "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif";

  // Enhanced field name formatting
  const formatFieldName = (fieldKey) => {
    // Check for custom override first
    if (fieldLabels[fieldKey]) {
      return fieldLabels[fieldKey];
    }

    // Auto-format field names
    const formatters = {
      // Common payment fields
      volume: isMobile ? "Volume" : "Transaction Volume",
      value: isMobile ? "Value (£m)" : "Transaction Value (£m)",
      count: isMobile ? "Count" : "Transaction Count",
      users: isMobile ? "Users" : "Active Users",
      revenue: isMobile ? "Revenue" : "Revenue (£m)",

      // Financial fields
      sales: isMobile ? "Sales" : "Sales Revenue",
      profit: isMobile ? "Profit" : "Net Profit",
      margin: isMobile ? "Margin" : "Profit Margin",
      costs: isMobile ? "Costs" : "Total Costs",

      // Web/Analytics fields
      visitors: isMobile ? "Visitors" : "Unique Visitors",
      conversions: isMobile ? "Conversions" : "Conversion Rate",
      pageviews: isMobile ? "Views" : "Page Views",
      sessions: isMobile ? "Sessions" : "User Sessions",
      bounceRate: isMobile ? "Bounce %" : "Bounce Rate (%)",

      // Business metrics
      customers: isMobile ? "Customers" : "Total Customers",
      orders: isMobile ? "Orders" : "Order Count",
      avgOrder: isMobile ? "Avg Order" : "Average Order Value",
      retention: isMobile ? "Retention" : "Customer Retention (%)",

      // Performance metrics
      response: isMobile ? "Response" : "Response Time (ms)",
      uptime: isMobile ? "Uptime" : "Uptime (%)",
      errors: isMobile ? "Errors" : "Error Count",

      // Generic fallbacks
      amount: isMobile ? "Amount" : "Total Amount",
      total: isMobile ? "Total" : "Total Value",
      average: isMobile ? "Average" : "Average Value",
      percentage: isMobile ? "Percentage" : "Percentage (%)",
    };

    // Use predefined formatter if available
    if (formatters[fieldKey]) {
      return formatters[fieldKey];
    }

    // Auto-format unknown fields
    return fieldKey
      .replace(/([A-Z])/g, " $1") // Split camelCase
      .replace(/[_-]/g, " ") // Replace underscores and dashes with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  };

  // Enhanced value formatting for tooltips
  const formatValue = (value, fieldKey) => {
    // Custom formatting based on field type
    const currencyFields = [
      "value",
      "revenue",
      "sales",
      "profit",
      "costs",
      "amount",
      "total",
      "avgOrder",
    ];
    const percentageFields = [
      "margin",
      "bounceRate",
      "retention",
      "uptime",
      "percentage",
    ];
    const timeFields = ["response"];

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
    const dataKeys = Object.keys(sampleData).filter(
      (key) => key !== "name" && typeof sampleData[key] === "number"
    );
    const maxLines = isMobile ? 2 : isTablet ? 3 : 5;

    // Color assignment - cycles through available colors
    const colors = [
      colours.primary,
      colours.secondary,
      colours.tertiary,
      colours.quaternary,
      colours.quinary,
    ];

    return dataKeys.slice(0, maxLines).map((key, index) => ({
      key,
      name: formatFieldName(key),
      color: colors[index % colors.length],
      strokeWidth: isMobile ? 2 : 3,
    }));
  };

  const CustomDot = ({ cx, cy, fill }) => {
    if (isMobile && getLineConfigs().length > 2) return null;
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={isMobile ? 3 : 4}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
        style={{ filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))" }}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: colours.background,
            border: `1px solid ${colours.border}`,
            borderRadius: "8px",
            padding: isMobile ? "8px" : "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            fontSize: isMobile ? "12px" : "14px",
            minWidth: isMobile ? "140px" : "180px",
            fontFamily: baseFont,
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: "600",
              color: colours.foreground,
              borderBottom: `1px solid ${colours.border}`,
              paddingBottom: "4px",
            }}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "3px",
                  backgroundColor: entry.color,
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              ></div>
              <span
                style={{
                  fontSize: isMobile ? "11px" : "13px",
                  color: colours.mutedForeground,
                  flex: 1,
                }}
              >
                {entry.name}:
              </span>
              <span
                style={{
                  fontWeight: "600",
                  color: colours.foreground,
                  fontSize: isMobile ? "11px" : "13px",
                }}
              >
                {formatValue(entry.value, entry.dataKey)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const lineConfigs = getLineConfigs();
  const visibleData = getVisibleData();
  const totalPages = getTotalPages();

  const containerStyle = {
    backgroundColor: colours.card,
    border: `1px solid ${colours.border}`,
    borderRadius: "12px",
    fontFamily: baseFont,
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
  };

  const headerStyle = {
    padding: isMobile ? "16px 16px 0 16px" : "24px 24px 0 24px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: colours.cardTint,
    boxSizing: "border-box",
  };

  const chartSectionStyle = {
    padding: isMobile ? "16px" : "24px",
    backgroundColor: colours.cardTint,
    boxSizing: "border-box",
  };

  const footerStyle = {
    padding: isMobile ? "0 16px 16px 16px" : "0 24px 20px 24px",
    borderTop: `1px solid ${colours.border}`,
    paddingTop: isMobile ? "12px" : "16px",
    backgroundColor: colours.card,
    boxSizing: "border-box",
  };

  return (
    <>
      <div style={containerStyle} className={className}>
        <div style={headerStyle}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <h3
                style={{
                  margin: "0 0 2px 0",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: colours.foreground,
                  lineHeight: "1.25",
                  letterSpacing: "-0.025em",
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
                fontWeight: "400",
              }}
            >
              {lineConfigs.length === 1
                ? isMobile
                  ? "Trend analysis"
                  : "Trend analysis over time"
                : isMobile
                ? "Multi-metric trends"
                : "Multi-metric trend analysis"}
              {totalPages > 1 && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: isMobile ? "10px" : "12px",
                  }}
                >
                  ({currentPage + 1}/{totalPages})
                </span>
              )}
            </p>
          </div>
          {showLogo && (
            <div
              style={{
                marginLeft: isMobile ? "8px" : "16px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg"
                alt="The Payments Association"
                style={{
                  height: isMobile ? "30px" : "40px",
                  width: "auto",
                  maxWidth: "100%",
                }}
              />
            </div>
          )}
        </div>

        <div style={chartSectionStyle}>
          <ResponsiveContainer width={width} height={height}>
            <RechartsLineChart
              data={visibleData}
              margin={{
                top: isMobile ? 20 : 30,
                right: isMobile ? 0 : 0,
                left: isMobile ? 0 : 0,
                bottom: 5,
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
                  fontFamily: baseFont,
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
                  fontFamily: baseFont,
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (isMobile) {
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(1)}M`;
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
                  fontFamily: baseFont,
                }}
                iconType="line"
                layout={
                  isMobile && lineConfigs.length > 2 ? "vertical" : "horizontal"
                }
              />
              {lineConfigs.map((config) => (
                <Line
                  key={config.key}
                  type="monotone"
                  dataKey={config.key}
                  stroke={config.color}
                  strokeWidth={config.strokeWidth}
                  name={config.name}
                  dot={<CustomDot />}
                  connectNulls={false}
                  activeDot={{
                    r: isMobile ? 4 : 5,
                    fill: config.color,
                    stroke: colours.background,
                    strokeWidth: 2,
                    style: {
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))",
                    },
                  }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                padding: "16px 0 8px 0",
                borderTop: `1px solid ${colours.border}`,
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: baseFont,
                  backgroundColor:
                    currentPage === 0 ? colours.muted : colours.primary,
                  color: currentPage === 0 ? colours.mutedForeground : "white",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <span
                style={{
                  fontSize: "12px",
                  color: colours.mutedForeground,
                  fontFamily: baseFont,
                }}
              >
                {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: baseFont,
                  backgroundColor:
                    currentPage === totalPages - 1
                      ? colours.muted
                      : colours.primary,
                  color:
                    currentPage === totalPages - 1
                      ? colours.mutedForeground
                      : "white",
                  cursor:
                    currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "16px",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "4px" : "16px",
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    margin: "0",
                    fontSize: isMobile ? "10px" : "12px",
                    color: colours.mutedForeground,
                    fontWeight: "400",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.color = colours.primary)}
                  onMouseOut={(e) =>
                    (e.target.style.color = colours.mutedForeground)
                  }
                >
                  Source: {sourceText}
                </a>
              ) : (
                <span
                  style={{
                    margin: "0",
                    fontSize: isMobile ? "10px" : "12px",
                    color: colours.mutedForeground,
                    fontWeight: "400",
                  }}
                >
                  Source: {sourceText}
                </span>
              )}
              <span
                style={{
                  margin: "0",
                  fontSize: isMobile ? "10px" : "12px",
                  color: colours.mutedForeground,
                  fontWeight: "400",
                }}
              >
                Chart: Payments Intelligence ({lineConfigs.length} line
                {lineConfigs.length !== 1 ? "s" : ""})
              </span>
            </div>
            {notesDescription && (
              <div
                onClick={() => setShowNotesModal(true)}
                title="View chart notes"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = colours.muted)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <svg
                  width={isMobile ? 14 : 16}
                  height={isMobile ? 14 : 16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colours.mutedForeground}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ cursor: "pointer" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="m12 8h.01" />
                </svg>
                <span
                  style={{
                    margin: "0",
                    fontSize: isMobile ? "9px" : "11px",
                    color: colours.mutedForeground,
                    fontWeight: "400",
                  }}
                >
                  Notes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNotesModal && notesDescription && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setShowNotesModal(false)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: isMobile ? "16px" : "32px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colours.background,
              borderRadius: "12px",
              border: `1px solid ${colours.border}`,
              maxWidth: isMobile ? "100%" : "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              fontFamily: baseFont,
            }}
          >
            <div
              style={{
                padding: isMobile ? "16px" : "24px",
                borderBottom: `1px solid ${colours.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: colours.foreground,
                }}
              >
                Chart Notes
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = colours.muted)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colours.mutedForeground}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: "1.6",
                  color: colours.foreground,
                  whiteSpace: "pre-wrap",
                }}
              >
                {notesDescription}
              </p>
            </div>
            <div
              style={{
                padding: isMobile ? "12px 16px 16px" : "16px 24px 24px",
                borderTop: `1px solid ${colours.border}`,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowNotesModal(false)}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  backgroundColor: colours.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: baseFont,
                  fontWeight: "500",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = colours.secondary)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = colours.primary)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sample data
const samplePaymentsData = [
  { name: "Q1 2024", volume: 145000, value: 32060 },
  { name: "Q2 2024", volume: 162000, value: 42150 },
  { name: "Q3 2024", volume: 158000, value: 43320 },
  { name: "Q4 2024", volume: 171000, value: 46840 },
];

// Global chart library
window.PaymentsCharts = window.PaymentsCharts || {};

window.PaymentsCharts.render = function (containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  const root = createRoot(container);
  const data = options.data || samplePaymentsData;
  root.render(
    <PaymentsLineChart
      data={data}
      width={options.width}
      height={options.height}
      title={options.title}
      showLogo={options.showLogo}
      className={options.className}
      sourceText={options.sourceText}
      sourceUrl={options.sourceUrl}
      notesDescription={options.notesDescription}
      fieldLabels={options.fieldLabels || {}}
    />
  );
};

export default PaymentsLineChart;
