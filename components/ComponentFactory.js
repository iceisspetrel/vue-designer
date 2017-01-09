seajs.config({
	'paths': { //映射模块路径
		'components' :'designer/components'
		,'helper' : 'designer/helper'
		,'lib' : 'designer/lib'
		,'style' : 'designer/style'
	},
	'charset': 'utf-8'
});
define(function(require){
	var schema  = require('components/componentSchema'),
		helper  = require('helper/helper');
		require('lib/vue');
		require('lib/underscore-min');
	function toVueName(name){
		name = name.split('-');
		return name[0]+name.slice(1).map(function(n){
			return n.replace(/(\w)/,function(v){return v.toUpperCase()});
		}).join('');
	}
	var _require_ = require;


	return {
		/**
		 * 创建组件
		 * 通过js的方式创建Vue组件，
		 * @param selector 选择器，字符串 如 '#id' '.class' 以及dom对象 document.getElementById(id)
		 * @param tagName  组件标签，如果要创建vButton, 需要传入 v-button
		 * @param options  组件配置，非必需。
		 *           options格式 ： options = {
		 *								config : {
		 *									width : 150
		 *								}
	 	 *			               }
		 * PS: 各个组件options中的config各有不同，需要各组件在必需在源码 options 中陈述说明。各属性可根据使用场景选择传入
		 **/
		createComponent  : function(selector, tagName, options){
			var vtname = toVueName(tagName);
			_require_('components/'+vtname+'/'+vtname);

			if(_.isUndefined(options)){
				options = {
					config : {}
				};
			}

			if(_.isUndefined(options.config)){
				options.config = {};
			}

			var component = Vue.options.components[vtname];
			if(component){
				for(var attr in component.options.options){
					if(options.config[attr] === undefined){
						options.config[attr] = component.options.options[attr];
					}
				}
			}
			var temp = [
				'<' + tagName + ' :config="config"></' + tagName + '>'
			].join();

			$(selector).append(temp);
			var comVue = new Vue({
				el : selector,
				data : options
			});

			$(selector).data('_vm', comVue.$children[0]); //
			return comVue.$children[0]; //
		},

		loadComponents : function(){
			require('helper/directive');
			require('components/vSelect/vSelect');
			require('components/vLabel/vLabel');
			require('components/vDrag/vDrag');
			require('components/vInput/vInput');
			require('components/vImage/vImage');
			require('components/vButton/vButton');
			require('components/vUpload/vUpload');
            require('components/vCrcheck/vCrcheck');
            require('components/vTree/vTree');
            require('components/vDatePicker/vDatePicker');
			require('components/vDatePicker/bootstrap-datetimepicker');
			require('components/vTree/vTree');
			require('components/vRadio/vRadio');
			require('components/vCheckbox/vCheckbox');
			require('components/vGrid/vGrid');
			require('components/vObjectSelector/vObjectSelector');
			require('components/vTab/vTab');
			require('components/vPanel/vPanel');
			require('components/vButtonList/vButtonList');

			require('components/vInfoPanel/vInfoPanel');
			require('components/vMainPanel/vMainPanel');
		},

		createMenuPanel : function(data){
			Vue.designer.menuPanel = new Vue({
				el : '#designerMenu',
				data : data,
				methods : {
					open : function(){ //打开
						alert('open');
					},
					preview : function(){ //预览
						alert('preview');
					},
					save : function(callback){ //保存
						alert('save');
						helper.isFunction(callback) && callback.call(this);
					},
					saveAs : function(){ //另存为
						alert('saveAs');
					},
					template : function(){ //模板设置
						alert('template');
					},
					help : function(){ //模板设置
						alert('help');
					},
					close : function(){ //模板设置
						var _this = this;
						$.zConfirm('您还有页面未保存，保存后再退出？', function(){
							_this.save(_this.closeWindow);
						}, function(){
							_this.closeWindow()
						});
					},

					closeWindow : function(){
						var userAgent = navigator.userAgent;
						if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
						   window.location.href="about:blank";
						   window.close();
						} else {
						   window.opener = null;
						   window.open("", "_self");
						   window.close();
						};
					}
				}
			});
		},

		createLtComponentList : function(){
			var componentNames = _.keys(schema);
			var data = {
				components : []
			};
			_(componentNames).each(function(name){
				var component = schema[name];
				var item = {
					title : component.name,
					name  : name,
					icon : 'img/' + component.icon
				}

				data.components.push(item);
			});

			Vue.designer.ltPanel = new Vue({
				el : '#componentList',
				data : data
			})
		},

		createMainPanel : function(data){
			Vue.designer.mainPanel = new Vue({
				el   : '#mainPanel',
				data : data,
				attached : function(){
					$(this.$el).data('_vm_panel',this);
				},
				methods : {
					setCurrentComponent : function(event){
						var $target = $(event.target);
						var $parent = $target.closest('div.drag');
						var index = $parent.attr('index') - 0;
						// $('.drag').addClass('drag-unselect');
						// $parent.removeClass('drag-unselect');
						helper.setCurrentComponent(index);
					},
					panelClick : function(event){
						helper.setCurrentComponent(-1);
						// $('.drag').addClass('drag-unselect');
					}
					,removeComponentByIndex :function(index){
						helper.removeComponentByIndex(index);
					}
				}
			});
			helper.addListener('keyup',function(e){
				if(''+e.keyCode === '46'){
					helper.removeSelectComponents();
				}
			});
			helper.addListener('keydown',function(e){
				if(+e.keyCode >= 37 && +e.keyCode <= 40){
					helper.moveSelectComponents(''+e.keyCode);
				}
			});
		},


		createLtComponentList : function(){
			var componentNames = _.keys(schema);
			var data = {
				components : []
			};
			_(componentNames).each(function(name){
				var component = schema[name];
				var item = {
					title : component.name,
					name  : name,
					icon  : 'img/' + component.icon
				}

				data.components.push(item);
			});

			Vue.designer.ltPanel = new Vue({
				el : '#componentList',
				data : data,
				attached : function(){
					$(this.$el).find('.main').show();//避免页面闪烁
				}
			})
		},


		createRtPanel : function(){
			Vue.designer.rtPanel = new Vue({
				el : '#settingPanel',
				data : {
					component : null,
					page : Vue.designer.mainForm.page
				},
				watch : {
					'component' : function (newValue, oldValue) {
						//$("#basic_info .main").mCustomScrollbar('scrollTo', 'top');
					 }
				},
				attached : function(){
					$(this.$el).find('.info-list').show();//避免页面闪烁
				},
				methods : {
					infoItemClick : function(event){
						var $target = $(event.target),
							$parent = $target.closest('.item');
						if($parent.hasClass("open")) return;

						$('.info-list .open').removeClass('open');

						$parent.addClass('open');
					}
				}
			});
		}
	}
});
