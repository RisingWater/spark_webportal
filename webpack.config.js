var path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'false',
    mode: 'production',
    entry: {
        admin_bundle: './src/frontend/admin_bundle.js',
        login_bundle: './src/frontend/login_bundle.js',
        userportal_bundle: './src/frontend/userportal_bundle.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/script')
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                use : {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-0', 'react'],
                        plugins: [['import', {"libraryName": "antd", "libraryDirectory": "es", "style": "css"}]]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./public/script/bundle-manifest.json')
        }),
    ]
};
