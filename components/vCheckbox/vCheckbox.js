/**
 * 按钮组件
**/
define(function(require){

	require('components/vCheckbox/vCheckbox.css');

	var Base = require('components/ComponentBase'),
		helper = require('designer/helper/helper');

	Base.extend({

		name : 'vCheckbox',

		props : ['id', 'config'],

		template : [
			'<div :style="style" class="v-checkbox" :id="id">',
				'<div v-if="modelType === \'edit\'" class="edit-mask"></div>', //编辑模式添加遮罩，禁止操作
				'<div class="preview-content" v-if="modelType === \'preview\'">', //打印模式
				'</div>',
				'<div class="main-wrap" v-else>',
					'<div v-for="item in config.initData" class="check-item" :class="dirClazz">',
						'<input @click="onClick($event, item, $index)" :disabled="modelType === \'readOnly\'" :checked="item.defaultChecked" type="checkbox" :value="item.value" id="{{id + \'-\' + $index}}" name="{{config.name ? config.name : id}}"/>',
						'<label @click="onClick($event, item, $index)" :style="labelStyle" v-text="item.label" for="{{id + \'-\' + $index}}"></label>',
					'</div>',
					'<div class="error-msg" v-text="config.error"></div>',
				'</div>',
			'</div>'
		].join(''),

		options : {
			width      : 'auto', //默认宽度
			height     : 'auto', //默认高度
			fontSize   : '12', //默认字体大小
			fontWeight : 'normal', //默认字体粗细  normal | bold
			visibility : 'visible', //是否显示 visible | hidden
			modelType  : 'normal',
			color      : '#000000',
			name       : '',
			required   : '1', //是否必选 可选值 '1' | '0 //错误提示信息
			error      : '请至少选择一个选项', //错误提示信息
			direction  : 'horizontal', //radio排列方向
			labelWidth : void(0), //label的宽度，如果有类似所有的label都等长的需求可传入此参数. 如果有此参数，label超出部分将以...的形式展示
			initData   : [
				{
					label : 'content-1',
					value : '1',
					defaultChecked : true //默认选中
				},
				{
					label : 'content-2',
					value : '2'
				},
				{
					label : 'content-3',
					value : '3'
				}
			],
			/**
			* @param ev 事件源参数
			* @param item 点击的radio对应的initData
			**/
			onSelect : function(ev, item){ //点击事件、此事件只在 disable == on时执行

			}
		},

		compiled : function(){

		},
		data : function(){ // 这里是全局属性

			if(!this.id){
				this.id = helper.guid();
			}

			var style = {
					width : this.config.width === 'auto' ? this.config.width : this.config.width + 'px',
					height : this.config.height === 'auto' ? this.config.height : this.config.height + 'px',
					visibility : this.config.visibility
				},
				dirClazz = {
					vertical   : this.config.direction == 'vertical',
					horizontal : this.config.direction == 'horizontal'
				},
				labelStyle = {
					fontSize   : this.config.fontSize + 'px',
					fontWeight : this.config.fontWeight,
					color      : this.config.color
				};
				//定制label的长度，以及样式
				if(this.config.labelWidth){
					labelStyle.width        = this.config.labelWidth + 'px';
					labelStyle.overFlow     = 'hidden';
					labelStyle.textOverflow = 'ellipsis';
					labelStyle.whiteSpace   = 'nowrap';
				}

			return {
				style : style,
				dirClazz : dirClazz,
				labelStyle : labelStyle,
				modelType : this.config.modelType
			};
		},
		watch : {

			'config.direction' : function(newValue, oldValue){
				this.dirClazz[newValue] = true;
				this.dirClazz[oldValue] = false;
			},

			'config.width' : function(newValue, oldValue){
				this.style.width = newValue + 'px';
			},

			'config.height' : function(newValue, oldValue){
				this.style.height = newValue + 'px';
			},

			'config.color' : function(newValue, oldValue){
				this.labelStyle.color = newValue;
			},

			'config.fontSize' : function(newValue, oldValue){
				this.labelStyle.fontSize = newValue + 'px';
			},

			'config.fontWeight' : function(newValue, oldValue){
				this.labelStyle.fontWeight = newValue;
			},

			'config.visibility' : function(newValue, oldValue){
				$(this.$el).css('visibility', newValue);
			}
		},
		methods : { // 这里是全局方法
			onClick : function(ev, item, index){

				$(this.$el).find('.error-msg').hide();

				var currentItem = helper.copy(item);

				var $box = $('#' + this.id + '-' + index);

				currentItem.checked = $box.is(':checked');

				this.modelType === 'normal' && helper.typeof(this.config.onSelect) === '[object Function]' && this.config.onSelect.call(this, ev, currentItem);
			},

			/**
			 * 获取当前组件的值
			 * @return Array [item[checked=true].value] 所有选中的项的value集合
			**/
			getValue : function(){

				var result = [];

				var $box = $(this.$el).find('.check-item input[type="checkbox"]');

				_.each($box, function($item){
					if($($item).is(':checked')){
						result.push($item.value);
					}
				});

				if(result.length > 0){
					var value = {}, name = this.config.name ? this.config.name : 'checkbox';
					value[name] = result.join(',');
					return value;
				}

				if(this.config.modelType === 'normal' && ~~this.config.required){
					$(this.$el).find('.error-msg').show();
				}

				return false;
			}
		}
	});
});
