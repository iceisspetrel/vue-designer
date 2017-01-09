/**
 * 按钮组件
**/
define(function(require){

	require('components/vButtonList/vButtonList.css');

	require('components/vButton/vButton');

	var Base = require('components/ComponentBase');

	Base.extend({

		name : 'vButtonList',

		props : ['id', 'config'],

		template : [
			'<ul class="button-list">',
				'<li class="button-item" :style="style" :class="clazz" v-for="item in config.buttons">',
					'<v-button :config="item"></v-button>',
				'</li>',
			'</ul>'
		].join(''),

		options : {
			buttons : [
				{
					width      : 150, //默认宽度
					height     : 30, //默认高度
					textAlign  : 'center', //默认文字对齐方式  left | center | right
					fontSize   : '12', //默认字体大小
					fontWeight : 'normal', //默认字体粗细  normal | bold
					visibility : 'visible', //是否显示 visible | hidden
					disable    : 'on', //是否禁用 off 禁用 |  on 启用
					content    : 'button1', //按钮文本内容
					theme      : 'theme-red', //按钮风格  theme-red | theme-blue | theme-green | theme-white | theme-gray
					onClick    : function(e){ //点击事件、此事件只在 disable == on时执行

					}
				}
			],
			direction : 'horizontal', //按钮列表方向  横向排布 ： horizontal  | 纵向排布 : vertical,
			space     : 10 //每个按钮之间的间隔 纵向时为行间隔， 横向时为 列间隔
		},

		compiled : function(){

		},
		data : function(){ // 这里是全局属性
			var style = {};
			if(this.config.direction === 'vertical'){
				style.marginBottom = this.config.space + 'px';
			} else {
				style.marginRight = this.config.space + 'px';
			}
			return {
				clazz : {
					'horizontal' : this.config.direction === 'horizontal',
					'vertical'   : this.config.direction === 'vertical'
				},
				style : style
			}
		},
		watch : {

		},
		methods : { // 这里是全局方法

		},

		destroyed : function(){

		}
	});
});
