# TPA Chart Library

A modern React chart library for The Payments Association, providing production-ready, responsive Bar, Line, and Pie chart components for payment analytics. Built for easy integration, mobile-first design, and UK Finance branding.

---

## 🚀 Features

- **Chart Types:** Bar, Line, and Pie charts for payment data visualization.
- **Responsive Design:** Mobile-first layouts, adaptive legends, and pagination for large datasets.
- **Branding:** Styled for TPA/UK Finance with green-themed CSS ([src/chart_styles.css](src/chart_styles.css)).
- **Interactivity:** Tooltips, hover effects, modal notes, and accessibility features.
- **Zero Dependencies:** Only requires React (and ReactDOM) to be loaded globally.
- **Production Builds:** Minified UMD bundles for each chart type in [dist/](dist/).

---

## 🏗️ Project Structure

```
tpa-chart-lib/
├── build-scripts/
│   └── build-all.js
├── dist/
│   ├── bar-payments-charts.min.js
│   ├── line-payments-charts.min.js
│   └── pie-payments-charts.min.js
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── chart_styles.css
│   ├── components/
│   │   ├── PaymentsBarChart.jsx
│   │   ├── PaymentsLineChart.jsx
│   │   └── PaymentsPieChart.jsx
│   └── ...
├── rollup.config.bar.mjs
├── rollup.config.line.mjs
├── rollup.config.pie.mjs
├── rollup.config.base.mjs
├── test-minified.html
├── package.json
└── README.md
```

---

## 📦 Installation & Development

1. **Install dependencies:**
   ```sh
   yarn install
   ```

2. **Run development preview:**
   ```sh
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view and test chart components in the demo app ([src/App.js](src/App.js)).

---

## 🛠️ Building Charts

Build all chart bundles for production:
```sh
yarn build:all
```
This runs [build-scripts/build-all.js](build-scripts/build-all.js) and outputs minified JS files to [dist/](dist/).

Build individual chart types:
```sh
yarn build:bar    # Bar chart bundle
yarn build:line   # Line chart bundle
yarn build:pie    # Pie chart bundle
```

---

## 📊 Usage

Include the minified chart bundle and React in your HTML:

```html
<!-- Example: Pie Chart -->
<div id="my-pie-chart"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="./dist/pie-payments-charts.min.js"></script>
<script>
  PaymentsCharts.renderPieChart('my-pie-chart', {
    data: [
      { name: "Card payments", volume: 145000 },
      { name: "Bank transfers", volume: 89000 },
      { name: "Digital wallets", volume: 67000 },
      { name: "Direct debit", volume: 34000 },
      { name: "Cash", volume: 12000 },
      { name: "Cheques", volume: 3000 }
    ],
    title: "Payment Method Distribution",
    notesDescription: "Market share analysis of payment methods."
  });
</script>
```

For Bar and Line charts, use `PaymentsCharts.renderBarChart` and `PaymentsCharts.renderLineChart` similarly.

---

## 🧩 Chart Component Props

- `data`: Array of objects for chart rows/slices.
- `title`: Chart title.
- `notesDescription`: Optional notes shown in modal.
- `sourceText`: Data source label.
- `showInnerRadius`: (Pie) Enables donut style.
- `stacked`: (Bar) Enables stacked bars.
- `showLabels`: (Pie) Shows slice labels.

See [src/components/PaymentsBarChart.jsx](src/components/PaymentsBarChart.jsx), [src/components/PaymentsLineChart.jsx](src/components/PaymentsLineChart.jsx), and [src/components/PaymentsPieChart.jsx](src/components/PaymentsPieChart.jsx) for full prop details.

---

## 🎨 Styling

- All charts use [src/chart_styles.css](src/chart_styles.css) for green-themed, responsive, and dark mode styles.
- Customize further by overriding CSS classes in your app.

---

## 🧪 Testing

- Use [test-minified.html](test-minified.html) to test minified bundles in a standalone HTML page.
- Unit tests are set up with Jest and React Testing Library (see [src/setupTests.js](src/setupTests.js)).

---

## 📁 Example Data

Example datasets are defined in [src/App.js](src/App.js) for preview and testing:
- Quarterly and monthly payment volumes/values
- Payment method distributions

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💬 Support

For issues or feature requests, please open an issue on