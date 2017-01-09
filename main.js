seajs.config({
	'base': '/',
	debug : true,
	'alias': { //简化模块名称
	},
	'paths': { //映射模块路径
		'components' :'designer/components'
		,'helper' : 'designer/helper'
		,'lib' : 'designer/lib'
		,'style' : 'designer/style'
	},
	'charset': 'utf-8',
	'preload': [ // 在普通模块加载前加块此模块
		'designer/lib/vue.js',
		'designer/lib/jquery-ruler/jquery.ui.ruler.css',
		'designer/lib/jquery-ruler/jquery.ui.ruler.js',
		'designer/lib/underscore-min.js',
		'designer/lib/bootstrap.css',
		'designer/lib/bootstrap',
		'lib/jquery-scroll/scroll.css',
		'lib/jquery-scroll/easyscroll',
		'lib/jquery-scroll/mousewheel'
	]
});
seajs.use('./index');