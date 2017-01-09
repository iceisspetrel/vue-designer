define(function(require){

	require('components/vLabel/vLabel.css');

	var Base = require('components/ComponentBase');

	Base.extend({

		name : 'vLabel',

		props : ['id', 'config'],

		template : [
			'<span class="v-label" :style="style">{{config.content}}</span>'
		].join(''),

		compiled : function(){

		},
		data : function(){ // 这里是全局属性
			var style = {
				width : this.config.width + 'px',
				height : this.config.height + 'px',
				lineHeight : this.config.height + 'px',
				color : this.config.color,
				backgroundColor : this.config.backgroundColor,
				textAlign : this.config.textAlign
			}

			return {
				style : style
			};
		},
		watch : {
			'config.width' : function(newValue, oldValue){
				$(this.$el).css('width', newValue + 'px');
			},
			'config.height' : function(newValue, oldValue){
				$(this.$el).css('height', newValue + 'px').css('line-height', newValue + 'px');
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
			}
		},
		methods : { // 这里是全局方法

		}
	});
});
