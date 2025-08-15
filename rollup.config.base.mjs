import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export function createConfig(componentName, inputFile) {
  return {
    input: inputFile,
    output: {
      file: `dist/${componentName.toLowerCase()}-payments-charts.min.js`,
      format: 'umd',  // Changed from 'iife' to 'umd'
      name: 'PaymentsChartsModule', // This won't conflict now
      banner: `/*! Payments Association ${componentName} Charts v1.0.0 | Built ${new Date().toISOString()} */`,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM'
      }
    },
    external: ['react', 'react-dom', 'react-dom/client'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        include: /node_modules/
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { modules: false }],
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }),
      postcss({
        extract: false,
        inject: true,
        minimize: true
      }),
      terser({
        compress: {
          drop_console: false,  // Keep console.log for debugging
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug']
        },
        mangle: {
          reserved: ['PaymentsCharts', 'React', 'ReactDOM']
        },
        format: {
          comments: /^!/
        }
      })
    ]
  };
}