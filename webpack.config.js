module.exports = {     
  context: __dirname + "/js/src",     
  entry: "./app.js",     
  output: {         
    path: __dirname,         
    filename: "bundle.js"     
  },
  module: {
    loaders: [
      { test: /\.js/, loader: 'babel-loader', options: { presets: ['es2015']} }
    ]
  }
}
