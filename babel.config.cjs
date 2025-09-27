// babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-env", { 
      targets: { 
        node: "current",
        browsers: ">0.25%, not dead" 
      },
      modules: "auto" 
    }],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime"
  ]
};