define(function(require){

	require('components/vInfoSelect/vInfoSelect.css');

	var Base = require('components/ComponentBase'),
		schema  = require('components/componentSchema');

	Base.extend({

		name : 'vInfoSelect',

		props : ["data"],

		template : [
			'<select v-model="data.model.config[data.name]" class="v-info-select">',
				'<option v-for="item in data.options" v-text="item.name" value="{{item.value}}"></option>',
			'</select>'
		].join(''),

		options : { // 默认参数

		},
		compiled : function(){

		},
		twoWay : true,
		data : function(){ // 这里是全局属性
			return {

			};
		},
		watch : {

		},
		methods : { // 这里是全局方法

		}
	});
});
