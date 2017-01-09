/**
 * 按钮组件
**/
define(function(require){

	require('components/vButton/vButton.css');

	var Base = require('components/ComponentBase');

	Base.extend({

		name : 'vButton',

		props : ['id', 'config'],

		template : [
			'<div @click="onClick" :id="id" class="vbutton" :class="clazz" :style="style" :title="config.content">',
				'<span :style="spanStyle" class="vbutton-text" v-text="config.content"></span>',
			'</div>'
		].join(''),

		options : {
			width      : 150, //默认宽度
			height     : 30, //默认高度
			textAlign  : 'center', //默认文字对齐方式  left | center | right
			fontSize   : '12', //默认字体大小
			fontWeight : 'normal', //默认字体粗细  normal | bold
			visibility : 'visible', //是否显示 visible | hidden
			disable    : 'on', //是否禁用 off 禁用 |  on 启用
			content    : 'button', //按钮文本内容
			theme      : 'theme-red', //按钮风格  theme-red | theme-blue | theme-green | theme-white | theme-gray
			onClick    : function(e){ //点击事件、此事件只在 disable == on时执行

			}
		},

		compiled : function(){

		},
		data : function(){ // 这里是全局属性
			var style = {
				width : this.config.width + 'px',
				height : this.config.height + 'px',
				lineHeight : (this.config.height-4) + 'px',
				textAlign : this.config.textAlign,
				fontWeight : this.config.fontWeight,
				fontSize : this.config.fontSize + 'px',
				visibility : this.config.visibility,
				overflow: "hidden",
    			zoom: "1"
			},
			clazz = {
				'theme-red'     : 'theme-red' == this.config.theme ? true : false,
				'theme-blue'    : 'theme-blue' == this.config.theme ? true : false,
				'theme-green'   : 'theme-green' == this.config.theme ? true : false,
				'theme-white'   : 'theme-white' == this.config.theme ? true : false,
				'theme-gray'    : 'theme-gray' == this.config.theme ? true : false,
				'theme-disable' : 'off' == this.config.disable ? true : false,
			}

			return {
				style : style,
				clazz : clazz,
				spanStyle : {
					height : (~~this.config.height - 1) + 'px'
				}
			};
		},
		watch : {
			'config.width' : function(newValue, oldValue){
				if(newValue < 30){
					this.config.width = 30;
				} else {
					$(this.$el).css('width', newValue + 'px');
				}
			},
			'config.height' : function(newValue, oldValue){
				$(this.$el).css('height', newValue + 'px').css('line-height', (newValue-4) + 'px');

				this.spanStyle.height = (newValue - 1) + 'px';
			},
			'config.backgroundColor' : function(newValue, oldValue){
				$(this.$el).css('background-color', newValue);
			},
			'config.color' : function(newValue, oldValue){
				$(this.$el).css('color', newValue);
			},
			'config.backgroundColor' : function(newValue, oldValue){
				$(this.$el).css('background-color', newValue);
			},
			'config.left' : function(newValue, oldValue){
				if(typeof newValue === 'string'){
					$(this.$el).closest('.component-wrap').css('left', newValue + 'px');
				}
			},
			'config.top' : function(newValue, oldValue){
				if(typeof newValue === 'string'){
					$(this.$el).closest('.component-wrap').css('top', newValue + 'px');
				}
			},
			'config.textAlign' : function(newValue, oldValue){
				$(this.$el).css('text-align', newValue);
			},

			'config.fontSize' : function(newValue, oldValue){
				$(this.$el).css('font-size', newValue + 'px');
			},

			'config.fontWeight' : function(newValue, oldValue){
				$(this.$el).css('font-weight', newValue);
			},

			'config.visibility' : function(newValue, oldValue){
				$(this.$el).css('visibility', newValue);
			},

			'config.theme' : function(newValue, oldValue){
				this.clazz[oldValue] = false;
				this.clazz[newValue] = true;
			},

			'config.disable' : function(newValue, oldValue){
				if(newValue == 'on'){
					this.clazz['theme-disable'] = false;
				} else {
					this.clazz['theme-disable'] = true;
				}
			},

			'config.zIndex' : function(newValue, oldValue){

			}
		},
		methods : { // 这里是全局方法
			onClick : function(e){
				this.config.disable == 'on' && this.config.onClick && this.config.onClick(e);
			}
		},

		destroyed : function(){

		}
	});
});
