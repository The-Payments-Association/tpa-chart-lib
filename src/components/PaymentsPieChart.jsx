import React, { useState, useEffect, useMemo } from "react";
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

// Design system tokens following 2025 best practices
const designTokens = {
  // Consistent breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },

  // Typography scale using rem units
  typography: {
    scale: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    weight: {
      normal: "400",
      medium: "500",
      semibold: "600",
    },
  },

  // Consistent spacing scale
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    "4xl": "2.5rem", // 40px
  },

// Colour palette
colours: {
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
  
  // Extended segment palette - always green/teal variations
  segments: [
    "#00dfb8", // primary - bright teal
    "#00573B", // secondary - dark green
    "#00C29D", // tertiary - medium teal
    "#007152", // quaternary - forest green
    "#00A783", // quinary - sea green
    "#10d9c4", // lighter teal
    "#004d3d", // darker forest green
    "#00b894", // mint green
    "#006b5a", // deep green
    "#00f5d4", // very light teal
    "#003d32", // very dark green
    "#009688", // material teal
    "#20e3c8", // bright light teal
    "#00453a", // darker emerald
    "#00d4aa", // medium bright teal
    "#005947", // dark emerald
    "#00b896", // sea foam
    "#003529", // very dark forest
    "#00e6c7", // pale teal
    "#004840", // deep emerald
    "#00c6a4", // soft teal
    "#002e26", // darkest green
    "#00f0d8", // lightest teal
    "#00524a", // emerald shadow
    "#00af91", // sage green
    "#002a23", // forest shadow
    "#00e8d0", // mint cream
    "#005c52", // deep sage
    "#009d82", // muted teal
    "#00241e", // deepest shadow
  ]
},

  // Responsive sizing scale
  sizing: {
    chart: {
      mobile: { outer: 100, inner: 0, height: 400 },
      tablet: { outer: 120, inner: 40, height: 400 },
      desktop: { outer: 150, inner: 80, height: 450 },
    },
    margin: {
      mobile: { top: 24, right: 24, bottom: 24, left: 24 },
      tablet: { top: 20, right: 40, bottom: 20, left: 40 },
      desktop: { top: 32, right: 64, bottom: 32, left: 64 },
    },
  },
};

// Responsive utilities hook
const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const breakpoint = useMemo(() => {
    if (windowWidth < designTokens.breakpoints.mobile) return "mobile";
    if (windowWidth < designTokens.breakpoints.tablet) return "tablet";
    return "desktop";
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const debouncedResize = debounce(handleResize, 150);

    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return {
    windowWidth,
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
};

// Utility functions
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

// Responsive configuration generator
const getResponsiveConfig = (breakpoint, props) => {
  const {
    showInnerRadius = false,
    showLabels = true,
    showLegend = true,
  } = props;

  const sizing = designTokens.sizing.chart[breakpoint];
  const margin = designTokens.sizing.margin[breakpoint];

  const baseConfig = {
    width: "100%",
    height: sizing.height,
    margin,
    outerRadius: sizing.outer,
    innerRadius: showInnerRadius ? sizing.inner : 0,
    paddingAngle: 0,
  };

  // Responsive behaviour configuration
  switch (breakpoint) {
    case "mobile":
      return {
        ...baseConfig,
        showLabels: false, // Always hide labels on mobile for cleaner look
        showLegend: true,
        legendLayout: "horizontal",
        maxItems: 5, // Group smaller items into "Other"
      };
    case "tablet":
      return {
        ...baseConfig,
        showLabels,
        showLegend: showLegend && !showLabels,
        legendLayout: "horizontal",
        maxItems: null,
      };
    default: // desktop
      return {
        ...baseConfig,
        showLabels,
        showLegend: showLegend && !showLabels,
        legendLayout: "horizontal",
        maxItems: null,
      };
  }
};

// Style generators using design tokens
const createStyles = (breakpoint) => {
  const { typography, spacing, colours } = designTokens;

  return {
    container: {
      backgroundColor: colours.card,
      border: `1px solid ${colours.border}`,
      borderRadius: spacing.xl,
      fontFamily: "Arial, sans-serif",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
    },

    header: {
      padding: `${spacing["3xl"]} ${spacing["3xl"]} 0 ${spacing["3xl"]}`,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      backgroundColor: colours.cardTint,
      boxSizing: "border-box",
    },

    title: {
      margin: `0 0 ${spacing.xs} 0`,
      fontSize:
        breakpoint === "mobile" ? typography.scale["2xl"] : typography.scale.lg,
      fontWeight: typography.weight.semibold,
      color: colours.foreground,
      lineHeight: "1.25",
      letterSpacing: "-0.025em",
    },

    subtitle: {
      margin: "0",
      fontSize:
        breakpoint === "mobile" ? typography.scale.lg : typography.scale.sm,
      color: colours.mutedForeground,
      fontWeight: typography.weight.normal,
    },

    chartSection: {
      padding: spacing["3xl"],
      backgroundColor: colours.cardTint,
      boxSizing: "border-box",
    },

    footer: {
      padding: `0 ${spacing["3xl"]} ${spacing["3xl"]} ${spacing["3xl"]}`,
      borderTop: `1px solid ${colours.border}`,
      paddingTop: spacing["2xl"],
      backgroundColor: colours.card,
      boxSizing: "border-box",
    },

    // Typography utilities
    text: {
      xs: { fontSize: typography.scale.xs },
      sm: { fontSize: typography.scale.sm },
      base: { fontSize: typography.scale.base },
      lg: { fontSize: typography.scale.lg },
    },
  };
};

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
  const { breakpoint, isMobile } = useResponsive();
  const [chartKey, setChartKey] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Force re-render on breakpoint change for smooth transitions
  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [breakpoint]);

  // Modal keyboard handling
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowNotesModal(false);
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

const pieColours = designTokens.colours.segments;


  // Add this CSS injection at the top of your component file
  const injectLabelStyles = () => {
    if (
      typeof document !== "undefined" &&
      !document.getElementById("pie-chart-label-styles")
    ) {
      const style = document.createElement("style");
      style.id = "pie-chart-label-styles";
      style.textContent = `
      .pie-label-group {
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
      }
      .pie-label-group.faded {
        opacity: 0.3;
      }
      .pie-label-group.highlighted {
        opacity: 1;
      }
      .pie-label-line {
        transition: stroke-opacity 0.3s ease-in-out;
      }
      .pie-label-text {
        transition: fill-opacity 0.3s ease-in-out;
      }
    `;
      document.head.appendChild(style);
    }
  };

  // Call this at the start of your component
  useEffect(() => {
    injectLabelStyles();
  }, []);

  // Data processing with mobile optimisation
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sampleData = data[0];
    const numericKeys = Object.keys(sampleData).filter(
      (key) => key !== "name" && typeof sampleData[key] === "number"
    );

    if (numericKeys.length === 0) return [];

    const dataKey = numericKeys[0];
    let pieData = data.map((item, index) => ({
      name: item.name,
      value: item[dataKey],
      color: pieColours[index % pieColours.length],
    }));

    const config = getResponsiveConfig(breakpoint, {
      showInnerRadius,
      showLabels,
      showLegend,
    });

    // Mobile optimisation: group smaller items
    if (config.maxItems && pieData.length > config.maxItems) {
      const sortedData = [...pieData].sort((a, b) => b.value - a.value);
      const topItems = sortedData.slice(0, config.maxItems - 1);
      const otherItems = sortedData.slice(config.maxItems - 1);

      if (otherItems.length > 0) {
        const otherTotal = otherItems.reduce(
          (sum, item) => sum + item.value,
          0
        );
        topItems.push({
          name: "Other",
          value: otherTotal,
          color: designTokens.colours.mutedForeground,
        });
      }

      pieData = topItems;
    }

    return pieData;
  }, [data, breakpoint, showInnerRadius, showLabels, showLegend]);

  const totalValue = useMemo(
    () => processedData.reduce((sum, item) => sum + item.value, 0),
    [processedData]
  );

  const config = getResponsiveConfig(breakpoint, {
    showInnerRadius,
    showLabels,
    showLegend,
  });
  const styles = createStyles(breakpoint);

  // Custom label renderer with CSS-based transitions (much more reliable)
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    name,
    index,
  }) => {
    if (percent < 0.03) return null; // Hide small labels

    const RADIAN = Math.PI / 180;
    const labelDistance = breakpoint === "mobile" ? 50 : 35;
    const radius = outerRadius + labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const lineStart = {
      x: cx + outerRadius * Math.cos(-midAngle * RADIAN),
      y: cy + outerRadius * Math.sin(-midAngle * RADIAN),
    };

    const formatValue = (val) => {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    };

    const textAnchor = x > cx ? "start" : "end";
    const labelX = textAnchor === "start" ? x + 8 : x - 8;
    const maxNameLength = breakpoint === "mobile" ? 12 : 15;
    const displayName =
      name.length > maxNameLength
        ? `${name.substring(0, maxNameLength)}...`
        : name;

    // Calculate CSS class based on hover state
    const isTooltipActive = hoveredIndex !== null;
    const isCurrentSegmentHovered = hoveredIndex === index;

    let labelClass = "pie-label-group";
    if (isTooltipActive) {
      labelClass += isCurrentSegmentHovered ? " highlighted" : " faded";
    }

    return React.createElement(
      "g",
      {
        key: `label-${index}`,
        className: labelClass,
      },
      [
        React.createElement("polyline", {
          key: "line",
          points: `${lineStart.x},${lineStart.y} ${x},${y}`,
          stroke: designTokens.colours.mutedForeground,
          strokeWidth: 1,
          fill: "none",
          strokeOpacity: 0.8,
          className: "pie-label-line",
        }),
        React.createElement(
          "text",
          {
            key: "name",
            x: labelX,
            y: y - 8,
            textAnchor: textAnchor,
            fill: designTokens.colours.foreground,
            fontSize: designTokens.typography.scale.sm,
            fontWeight: designTokens.typography.weight.semibold,
            fontFamily: "Arial, sans-serif",
            className: "pie-label-text",
          },
          displayName
        ),
        React.createElement(
          "text",
          {
            key: "value",
            x: labelX,
            y: y + 8,
            textAnchor: textAnchor,
            fill: designTokens.colours.mutedForeground,
            fontSize: designTokens.typography.scale.xs,
            fontWeight: designTokens.typography.weight.medium,
            fontFamily: "Arial, sans-serif",
            className: "pie-label-text",
          },
          `${formatValue(value)} (${(percent * 100).toFixed(1)}%)`
        ),
      ]
    );
  };

  // Responsive tooltip component
  // Responsive tooltip component - petite on mobile, standard on desktop
const ResponsiveTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const percentage = ((data.value / totalValue) * 100).toFixed(1);

  return React.createElement(
    "div",
    {
      style: {
        backgroundColor: designTokens.colours.background,
        border: `1px solid ${designTokens.colours.border}`,
        borderRadius: isMobile ? designTokens.spacing.md : designTokens.spacing.lg,
        padding: isMobile ? designTokens.spacing.md : designTokens.spacing.xl,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        fontSize: isMobile ? designTokens.typography.scale.xs : designTokens.typography.scale.sm,
        minWidth: isMobile ? "140px" : "180px", // Much narrower on mobile
        maxWidth: isMobile ? "160px" : "220px", // Controlled max width
        fontFamily: "Arial, sans-serif",
      },
    },
    [
      React.createElement(
        "div",
        {
          key: "label",
          style: {
            fontWeight: designTokens.typography.weight.semibold,
            marginBottom: isMobile ? designTokens.spacing.xs : designTokens.spacing.sm,
            color: designTokens.colours.foreground,
            fontSize: isMobile ? designTokens.typography.scale.sm : designTokens.typography.scale.base,
            lineHeight: "1.3", // Tighter line height for mobile
            wordBreak: "break-word", // Handle long text gracefully
          },
        },
        data.name
      ),
      React.createElement(
        "div",
        {
          key: "content",
          style: {
            display: "flex",
            alignItems: "center",
            gap: isMobile ? designTokens.spacing.xs : designTokens.spacing.sm,
          },
        },
        [
          React.createElement("div", {
            key: "color",
            style: {
              width: isMobile ? "8px" : "12px", // Smaller colour indicator on mobile
              height: isMobile ? "8px" : "12px",
              backgroundColor: data.color,
              borderRadius: "2px",
              flexShrink: 0,
            },
          }),
          React.createElement(
            "span",
            {
              key: "text",
              style: {
                fontSize: isMobile ? designTokens.typography.scale.xs : designTokens.typography.scale.sm,
                color: designTokens.colours.mutedForeground,
                lineHeight: "1.3",
              },
            },
            `${data.value.toLocaleString()} (${percentage}%)`
          ),
        ]
      ),
    ]
  );
};

  // Icon components
  const InfoIcon = ({ size = 16 }) =>
    React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: designTokens.colours.mutedForeground,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { cursor: "pointer" },
      },
      [
        React.createElement("circle", {
          key: "circle",
          cx: "12",
          cy: "12",
          r: "10",
        }),
        React.createElement("path", { key: "path1", d: "M12 16v-4" }),
        React.createElement("path", { key: "path2", d: "m12 8h.01" }),
      ]
    );

  const CloseIcon = ({ size = 24 }) =>
    React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: designTokens.colours.mutedForeground,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { cursor: "pointer" },
      },
      [
        React.createElement("path", { key: "path1", d: "M18 6L6 18" }),
        React.createElement("path", { key: "path2", d: "M6 6l12 12" }),
      ]
    );

  // Modal component
  const NotesModal = () => {
    if (!showNotesModal || !notesDescription) return null;

    return React.createElement(
      "div",
      {
        style: {
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
          padding: designTokens.spacing["3xl"],
        },
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowNotesModal(false);
        },
      },
      React.createElement(
        "div",
        {
          style: {
            backgroundColor: designTokens.colours.background,
            borderRadius: designTokens.spacing.xl,
            border: `1px solid ${designTokens.colours.border}`,
            maxWidth: isMobile ? "100%" : "500px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            fontFamily: "Arial, sans-serif",
          },
          onClick: (e) => e.stopPropagation(),
        },
        [
          React.createElement(
            "div",
            {
              key: "header",
              style: {
                padding: designTokens.spacing["3xl"],
                borderBottom: `1px solid ${designTokens.colours.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            },
            [
              React.createElement(
                "h3",
                {
                  key: "title",
                  style: {
                    margin: 0,
                    fontSize: designTokens.typography.scale.lg,
                    fontWeight: designTokens.typography.weight.semibold,
                    color: designTokens.colours.foreground,
                  },
                },
                "Chart Notes"
              ),
              React.createElement(
                "button",
                {
                  key: "close-btn",
                  onClick: () => setShowNotesModal(false),
                  style: {
                    background: "none",
                    border: "none",
                    padding: designTokens.spacing.sm,
                    cursor: "pointer",
                    borderRadius: designTokens.spacing.sm,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                React.createElement(CloseIcon, { size: 20 })
              ),
            ]
          ),
          React.createElement(
            "div",
            {
              key: "content",
              style: { padding: designTokens.spacing["3xl"] },
            },
            React.createElement(
              "p",
              {
                style: {
                  margin: 0,
                  fontSize: designTokens.typography.scale.base,
                  lineHeight: "1.6",
                  color: designTokens.colours.foreground,
                  whiteSpace: "pre-wrap",
                },
              },
              notesDescription
            )
          ),
        ]
      )
    );
  };

  return React.createElement(React.Fragment, null, [
    React.createElement(
      "div",
      {
        key: `chart-container-${chartKey}`,
        style: styles.container,
        className: className,
      },
      [
        // Header
        React.createElement(
          "div",
          {
            key: "header",
            style: styles.header,
          },
          [
            React.createElement(
              "div",
              {
                key: "title-section",
                style: { flex: 1, minWidth: 0 },
              },
              [
                title &&
                  React.createElement(
                    "h3",
                    {
                      key: "title",
                      style: styles.title,
                    },
                    title
                  ),
                React.createElement(
                  "p",
                  {
                    key: "subtitle",
                    style: styles.subtitle,
                  },
                  isMobile
                    ? "Payment distribution"
                    : "Payment transaction distribution"
                ),
              ]
            ),
            showLogo &&
              React.createElement(
                "div",
                {
                  key: "logo-section",
                  style: { marginLeft: designTokens.spacing.xl, flexShrink: 0 },
                },
                React.createElement("img", {
                  src: "https://res.cloudinary.com/dmlmugaye/image/upload/v1754492437/PA_Logo_Black_xlb4mj.svg",
                  alt: "The Payments Association",
                  style: {
                    height: isMobile ? "48px" : "40px",
                    width: "auto",
                    maxWidth: "100%",
                  },
                })
              ),
          ]
        ),

        // Chart section
        React.createElement(
          "div",
          {
            key: "chart",
            style: styles.chartSection,
          },
          React.createElement(
            ResponsiveContainer,
            {
              width: config.width,
              height: config.height,
            },
            React.createElement(
              RechartsPieChart,
              {
                margin: config.margin,
              },
              [
                React.createElement(
                  Pie,
                  {
                    key: "pie",
                    data: processedData,
                    cx: "50%",
                    cy: "50%",
                    labelLine: false,
                    label: config.showLabels ? renderCustomLabel : false,
                    outerRadius: config.outerRadius,
                    innerRadius: config.innerRadius,
                    fill: "#8884d8",
                    dataKey: "value",
                    paddingAngle: config.paddingAngle,
                    onMouseEnter: (_, index) => setHoveredIndex(index),
                    onMouseLeave: () => setHoveredIndex(null),
                  },
                  processedData.map((entry, index) =>
                    React.createElement(Cell, {
                      key: `cell-${index}`,
                      fill: entry.color,
                    stroke: hoveredIndex === index ? designTokens.colours.mutedForeground : "#ffffff",

                      strokeWidth: hoveredIndex === index ? 2 : 1,
                      style: {
                        filter:
                          hoveredIndex === index ? "brightness(1.1)" : "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      },
                    })
                  )
                ),
                React.createElement(Tooltip, {
                  key: "tooltip",
                  content: React.createElement(ResponsiveTooltip),
                }),
                config.showLegend &&
                  React.createElement(Legend, {
                    key: "legend",
                    wrapperStyle: {
                      paddingTop: designTokens.spacing["2xl"],
                      fontSize: designTokens.typography.scale.sm,
                      color: designTokens.colours.mutedForeground,
                      fontFamily: "Arial, sans-serif",
                    },
                    iconType: "rect",
                    layout: config.legendLayout,
                  }),
              ]
            )
          )
        ),

        // Footer
        React.createElement(
          "div",
          {
            key: "footer",
            style: styles.footer,
          },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: designTokens.spacing.xl,
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
              },
            },
            [
              React.createElement(
                "div",
                {
                  key: "source-section",
                  style: {
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: designTokens.spacing.md,
                    alignItems: isMobile ? "flex-start" : "center",
                  },
                },
                [
                  sourceUrl
                    ? React.createElement(
                        "a",
                        {
                          key: "source",
                          href: sourceUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            margin: "0",
                            fontSize: designTokens.typography.scale.xs,
                            color: designTokens.colours.mutedForeground,
                            fontWeight: designTokens.typography.weight.normal,
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        },
                        `Source: ${sourceText}`
                      )
                    : React.createElement(
                        "span",
                        {
                          key: "source",
                          style: {
                            margin: "0",
                            fontSize: designTokens.typography.scale.xs,
                            color: designTokens.colours.mutedForeground,
                            fontWeight: designTokens.typography.weight.normal,
                          },
                        },
                        `Source: ${sourceText}`
                      ),
                  React.createElement(
                    "span",
                    {
                      key: "chart-info",
                      style: {
                        margin: "0",
                        fontSize: designTokens.typography.scale.xs,
                        color: designTokens.colours.mutedForeground,
                        fontWeight: designTokens.typography.weight.normal,
                      },
                    },
                    "Chart: Payments Intelligence"
                  ),
                ]
              ),
              notesDescription &&
                React.createElement(
                  "div",
                  {
                    key: "notes-section",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: designTokens.spacing.sm,
                      cursor: "pointer",
                      padding: designTokens.spacing.sm,
                      borderRadius: designTokens.spacing.sm,
                    },
                    onClick: () => setShowNotesModal(true),
                    title: "View chart notes",
                  },
                  [
                    React.createElement(InfoIcon, { key: "icon", size: 16 }),
                    React.createElement(
                      "span",
                      {
                        key: "text",
                        style: {
                          margin: "0",
                          fontSize: designTokens.typography.scale.xs,
                          color: designTokens.colours.mutedForeground,
                          fontWeight: designTokens.typography.weight.normal,
                        },
                      },
                      "Notes"
                    ),
                  ]
                ),
            ]
          )
        ),
      ]
    ),
    React.createElement(NotesModal, { key: "modal" }),
  ]);
};

// Sample data for pie chart
const samplePaymentsPieData = [
  { name: "Card payments", volume: 145000 },
  { name: "Bank transfers", volume: 89000 },
  { name: "Digital wallets", volume: 67000 },
  { name: "Direct debit", volume: 34000 },
  { name: "Cash", volume: 12000 },
  { name: "Cheques", volume: 3000 },
];

// Global setup for UMD (unchanged for compatibility)
if (typeof window !== "undefined") {
  console.log("Setting up PaymentsCharts Pie global...");

  window.PaymentsCharts = window.PaymentsCharts || {};

  window.PaymentsCharts.renderPieChart = function (containerId, options = {}) {
    console.log("renderPieChart called with:", containerId, options);

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    try {
      if (typeof React === "undefined") {
        throw new Error(
          "React is not available. Please load React before the chart library."
        );
      }

      if (typeof ReactDOM === "undefined") {
        throw new Error(
          "ReactDOM is not available. Please load ReactDOM before the chart library."
        );
      }

      const data = options.data || samplePaymentsPieData;

      if (ReactDOM.createRoot) {
        console.log("Using React 18+ createRoot for Pie Chart");
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
        console.log("Using legacy ReactDOM.render for Pie Chart");
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
        throw new Error("No suitable React render method found");
      }

      console.log("Pie chart rendered successfully");
    } catch (error) {
      console.error("Error rendering pie chart:", error);
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

  if (!window.PaymentsCharts.render) {
    window.PaymentsCharts.render = window.PaymentsCharts.renderPieChart;
  }

  console.log(
    "PaymentsCharts Pie setup complete. Available methods:",
    Object.keys(window.PaymentsCharts)
  );
}

// Auto-render functionality (unchanged for compatibility)
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, looking for auto-render pie charts");

    const container = document.getElementById("payments-chart-pie");
    if (!container) {
      console.log("No auto-render pie chart container found");
      return;
    }

    try {
      const chartData = container.getAttribute("data-chart-data");
      const options = {
        data: chartData ? JSON.parse(chartData) : undefined,
        title: container.getAttribute("data-chart-title"),
        showLogo: container.getAttribute("data-show-logo") !== "false",
        sourceText: container.getAttribute("data-source-text"),
        sourceUrl: container.getAttribute("data-source-url"),
        notesDescription: container.getAttribute("data-notes-description"),
        showInnerRadius: container.getAttribute("data-show-inner-radius") === "true",
        showLabels: container.getAttribute("data-show-labels") !== "false",
        showLegend: container.getAttribute("data-show-legend") !== "false",
      };

      if (window.PaymentsCharts && window.PaymentsCharts.renderPieChart) {
        window.PaymentsCharts.renderPieChart(container.id, options);
      }
    } catch (error) {
      console.error(
        "Error in auto-render for pie chart container:",
        container.id,
        error
      );
    }
  });
}


export default PaymentsPieChart;
