define(function(require){

	require('components/vInfoColor/vInfoColor.css');

	require('lib/color/color.all.min');
	require('lib/color/jsColor');

	var Base = require('components/ComponentBase'),
		schema  = require('components/componentSchema'),
		helper  = require('helper/helper');

	Base.extend({

		name : 'vInfoColor',

		props : ["data"],

		template : function(){
			return [
				'<span class="panle-color" title="{{data.model.config[data.name]}}">',
					'<input id="{{inputId}}" prop="{{data.name}}" type="text" v-model="data.model.config[data.name]"/>',
				'</span>'
			].join('');
		},

		options : { // 默认参数

		},
		compiled : function(){

		},
		attached : function(){
			var _this = this;
			$(_this.$el).find('input').data('vm', _this);
			var colors = jsColorPicker('#' + this.inputId, {
				customBG: '#222',
				readOnly: false,
				init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
					elm.style.backgroundColor = elm.value;
					elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
				},
				onColorChange : function(){
					var $input = $(window.ColorPicker.currentInput), prop = $input.attr('prop'), color = $input.val(), _vm = $input.data('vm');
					_vm.data.model.config[prop] = color;
				}
			});
		},
		twoWay : true,
		data : function(){ // 这里是全局属性
			return {
				vm : this
			};
		},
		watch : {

		},
		methods : { // 这里是全局方法

		},
		computed : {
			inputId : function(){
				return 'a' + helper.guid();
			}
		}
	});
});
