const path = require('path');
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin');

module.exports = {
    //入口文件的配置项
    entry: [    
        './src/index.js', 
        './src/js/ResourceData.js', 
        './src/js/Prototype.js', 
        './src/js/Class.js',
        './src/js/Object.js',
        './src/js/JColor.js',
        './src/js/JMain.js',
        './src/js/JFunction.js', 
        './src/js/JControls.js', 
        './src/js/GControls.js', 
        './src/js/Base64.js', 
        './src/js/Cookie.js',
        './src/js/Http.js',
        './src/js/Game.js',
        './src/js/App.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {

        rules: [
            {
                test: /\.(png|jpg|gif)/,
                loader: 'file-loader?limit=8192&name=images/[name].[ext]'
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]

    },
    plugins: [
        new uglifyjsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            }
        }),
        new htmlPlugin({
            minify : {
                removerAttributeQuotes : true
            },
            hash : true,
            template :'./src/index.html'
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        compress: true,
        port: 80
    }
}