module.exports = {
	lintOnSave: false,
	publicPath: './',
	devServer: {
		port: 8848,
		proxy: {
			'/mapi': {
				target: 'http://127.0.0.1:8802',
				changOrigin: true,
				pathRewrite: {
					'^/mapi': '/api'
				}
			}
		}
	}
}