# Html-webpack-cdn-plugin

> cdn in webpack

## Useage

### Dependencies
> cdn-loader
> **You NEAD Install `cdn-loader` and `html-webpack-plugin`**

### Install

1. Run `npm i -D html-webpack-cdn-plugin` in your project folder
2. Add `var HtmlWebpackCdnPlugin = require('html-webpack-cdn-plugin')` to  `webpack.config.js` file
3. Add `new HtmlWebpackCdnPlugin(config)` to  `webpack.config.js` file (`plugins`)
4. Also you need  [cdn-loader](https://github.com/jso0/cdn-loader) and [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)

### Support

css and js files [https://cdnjs.com](https://cdnjs.com)

## Config

### Example

``` javascript
// webpack.config.js

var config = {
    host: "https://cdnjs.cloudflare.com/ajax/libs",
	cdn: {
		js: "https://cdnjs.cloudflare.com/ajax/libs",
		css: "https://cdnjs.cloudflare.com/ajax/libs"
	}
}
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [
        new HtmlWebpackCdnPlugin(config),
        new HtmlWebpackPlugin()
  ]
};

```

``` javascript
// index.js
require("cdn?jQuery@3.1.0")
require("cdn?normalize@4.2.0")
// .......more code

```

Then 

``` html

<!DOCTYPE html>
<html>
    <head>
        <title>app</title>
        <link rel="stylesheet" href="http://cdn.bootcss.com/normalize/4.2.0/normalize.min.css">
    </head>
    <body>
        <div class="app"></div>
        <!-- more code -->
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="index_bundle.js"></script>
</html>

```
