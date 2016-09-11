var loaderUtils = require("loader-utils")

var is_debug = true
var log = console.log

var defaultOpt = {
	host: "https://cdnjs.cloudflare.com/ajax/libs",
	cdn: { // like this `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js`
		js: "https://cdnjs.cloudflare.com/ajax/libs",
		css: "https://cdnjs.cloudflare.com/ajax/libs"
	},
	alias: {
		key: "jquery",
		value: ""
	},
	filter: []
}
var currentOpts = {}
function HtmlWebpackCdnPlugin(options) {
	this.is_active = options ? true : false
	if (typeof options == 'string') {
		currentOpts = extend({}, defaultOpt, {
			host: options,
			cdn: {
				js: options,
				css: options
			}
		})
	} else {
		if (options.length) {
			currentOpts = extend({}, defaultOpt, {
				filter: options
			})
		} else {
			currentOpts = extend({}, defaultOpt, options)
		}
	}
}

HtmlWebpackCdnPlugin.prototype.apply = function(compiler) {

  compiler.plugin("compilation", function(compilation) {
  	var link_map = {}
	compilation.plugin('optimize-tree', function (chunks, modules, callback) {
		modules.forEach(function(module) {
			if (module.build && module.rawRequest && /^cdn\?/.test(module.rawRequest) && typeof module.loaders == 'object') {
				if (module.chunks) {
					var link_cfg_str = module._source.source().split("\n").shift()
					link_cfg = JSON.parse(link_cfg_str.replace(/(^[\/\(]\*?)|([\*\)\/]{1,2}\/$)/g,''))
					var link = [currentOpts.cdn[link_cfg.type], link_cfg.name, link_cfg.version, link_cfg.name + link_cfg.ext + "." + link_cfg.type].join('/')
					module.chunks.forEach(function (chunk) {
						if ( currentOpts.filter.length == 0 || currentOpts.filter.indexOf(chunk.name) == -1 || currentOpts.include.indexOf(chunk.name)) {
							link_map[chunk.name] || (link_map[chunk.name] = [])
							log(link_map[chunk.name],link)
							link_map[chunk.name].push(link)
						}
					})
				}
			}
		})
		callback()
	}.bind(this))
	// http://www.cnblogs.com/haogj/p/5649670.html
    compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
    	for (var chunkName in htmlPluginData.assets.chunks) {
    		if (!link_map[chunkName])
    			continue
    		for (var i = link_map[chunkName].length - 1; i >= 0; i--) {
    			if (/\.js$/.test(link_map[chunkName][i])) {
    				htmlPluginData.assets.js.unshift(link_map[chunkName][i])
    			} else {
    				htmlPluginData.assets.css.unshift(link_map[chunkName][i])
    			}
    		}

    	}
        callback(null, htmlPluginData);
    });
  })

}

function extend() {
    var args = Array.prototype.slice.call(arguments)
	var target = args.shift() || {}
	var source = args.shift()
	var deep = args.length
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p]
        }
    }
    args.unshift(target)

    if (deep > 0) {
        return extend.apply(null, args)
    } else {
    	return target
    }
}

module.exports = HtmlWebpackCdnPlugin