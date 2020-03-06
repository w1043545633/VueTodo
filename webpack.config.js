const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const isDev = process.env.NODE_ENV === "development"

const config = {
    target: 'web',
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process_env' : {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin(),
        new OpenBrowserPlugin({
            url: "http://localhost:8080/"
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-aaa.[ext]'
                        }
                    }
                ]

            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules | bower_component)/,
                loader: 'babel-loader'
            }
        ]
    }
}

if(isDev){
    config.module.rules.push({
        test: /\.styl(us)?$/,
        use: [
            "style-loader",
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: true
                }
            },
            "stylus-loader"
        ]
    })
    config.devtool = "#cheap-module-eval-source-map"
    config.devServer = {
        port: 8080,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2, maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }
    config.output.filename = "[name].[chunkhash:8].js"
    config.plugins.push(
        new ExtractPlugin("style.[md5:contenthash:hex:8].css")
    )
    config.module.rules.push({
        test: /\.styl(us)?$/,
        use: ExtractPlugin.extract({
            fallback: "style-loader",
            use: [
                "css-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true
                    },
                },
                "stylus-loader"
            ]
        })

    })
}

module.exports = config