define(function(require){

	require('components/vInfoPanel/vInfoPanel.css');

	require('components/vInfoSelect/vInfoSelect');
	require('components/vInfoColor/vInfoColor');
	require('components/vInfoInputSelect/vInfoInputSelect');

	var Base = require('components/ComponentBase'),
		schema  = require('components/componentSchema'),
		helper  = require('helper/helper');

	Base.extend({

		name : 'vInfoPanel',

		props : ['component'],

		template : [
			'<div v-if="!component" style="text-align:center;padding-top:40px">',
				'<span style="margin-left:-15px">请选择组件</span>',
			'</div>',
			'<table v-else class="info-tb">',
				'<tr v-for="data in form">',
					'<td class="lt">',
						'<div>{{data.title}}</div>',
					'</td>',
					'<td class="rt">',
						'<input v-if="data.type == \'input\'" :title="data.model.config[data.name]" type="text" disabled="{{data.disabled}}" v-model="data.model.config[data.name]"/>',
						'<input v-if="data.type == \'file\'" type="file" disabled="{{data.disabled}}" v-model="data.model.config[data.name]"/>',
						'<v-info-select v-if="data.type == \'select\'" :data="data"></v-info-select>',
						'<v-info-input-select v-if="data.type == \'inputSelect\'" :data="data"></v-info-input-select>',
						'<v-info-color v-if="data.type == \'color\'" :data="data"></v-info-color>',
						'<div @click="customClick($event, data.name, data)" class="custom-btn" v-if="data.type == \'custom\'">自定义选项</div>',
						'<span class="info-unit" v-if="data.unit">{{data.unit}}</span>',
					'</td>',
				'</tr>',
			'</table>'
		].join(''),

		options : { // 默认参数

		},
		compiled : function(){

		},
		data : function(){ // 这里是全局属性
			return {
				form : [],
				state : false
			};
		},
		watch : {
			'component' : function(newValue, oldValue){
				var self = this;
				if(newValue){
					var target = newValue.name,
					plugin = schema[target];

					var form = [];
					_.each(_.sortBy(plugin.basicSetting, 'title'), function(setting){
						var setting = JSON.parse(JSON.stringify(setting));
						setting.model = self.component;
						form.push(setting);
					});
					this.form = form;
					this.state = true;
				} else {
					this.form = [];
					this.state = false;
				}

			}
		},
		methods : { // 这里是全局方法
			customClick : function(event, key, data){
				var _this = this;
				var dialog = new zDialog({
					type : "page",
					theme : "blue",
					title:"自定义选项",
					position : "left-bottom",
					overlayClose : true,
					url : "components/vInfoCustom/" + data.page,
					showTools : true,
					move:true,
					data : {
						map : {
							data : helper.copy(data),
							key  : key
						}
					},
					btn:[
						{
							text:"确定",
							click:function(form){
								var widget = $(form).find('.widget').data('widget'),
									result = widget.getResult();
								_this.component.config[key] = helper.copy(result);
							}
						},
						{
							text:"取消",
							click:function(){

							}
						}
					]
				});
			}
		}
	});
});
