module.exports = {
	lintOnSave: false,
	publicPath: './',
	pages: {
		index: {
			entry: './src/main.js',
			template: './public/index.html',
			title: '宫子恰布丁-Vue by守望时空33'
		}
	},
	devServer: {
		port: 8848,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8802/',
				changOrigin: true
			}
		}
	}
}