/**
* 下拉输入框， 既可以下拉选择也可以输入， 类似dataList
* 用于schema配置
* 配置示例
*      {
			name  : 'required',
			title : '是否必选',
			type  : 'inputSelect', //配置类型为 inputSelect 即可自动绘制本组件
			value : '0',   //value 任意值
			showprop : 'name', //下拉选择某一项后展示的文本， 对应options 中的 属性。 name | value。 如果填写name 选择以后展示option.name
			options : [ //与type = select的配置一样
				{
					name : '是',
					value : '1'
				},
				{
					name : '否',
					value : '0'
				}
			]
		}
**/
define(function(require){

	require('components/vInfoInputSelect/vInfoInputSelect.css');

	var Base = require('components/ComponentBase'),
		schema  = require('components/componentSchema');

	Base.extend({

		name : 'vInfoInputSelect',

		props : ["data"],

		template : [
			'<span class="v-info-input-select">',
				'<input debounce="500" @focus="inputFocus" @blur="inputBlur" type="text" :title="modelValue" class="select-input" v-model="modelValue"/>',
				'<select @change="selectChange" v-model="data.model.config[data.name]" class="v-info-select">',
					'<option v-for="item in data.options" v-text="item.name" value="{{item.value}}" ></option>',
				'</select>',
			'<span/>'
		].join(''),

		options : { // 默认参数

		},
		compiled : function(){

		},
		twoWay : true,
		data : function(){ // 这里是全局属性
			window.vm = this;

			var modelValue = this.data.model.config[this.data.name];
			var option = _.find(this.data.options, function(item){
				return item.value === modelValue;
			});
			if(option){
				modelValue = option[this.data.showprop];
			}

			return {
				modelValue : modelValue,
				isInputFocus : false,
			};
		},
		watch : {
			'modelValue' : function(newValue, oldValue){
				if(this.isInputFocus){
					this.data.model.config[this.data.name] = newValue;
				}
			}
		},
		methods : { // 这里是全局方法

			inputFocus : function(){
				//$(this.$el).find('select').focus();+
				this.isInputFocus = true;
			},

			inputBlur : function(){
				this.isInputFocus = true;
			},

			selectChange : function(){
				this.isInputFocus = false;
				var modelValue = this.data.model.config[this.data.name];
				var option = _.find(this.data.options, function(item){
					return item.value === modelValue;
				});
				if(option){
					this.modelValue = option[this.data.showprop];
				}
			}
		}
	});
});
