define(function(require){

	var schema  = require('components/componentSchema'),
		helper  = require('helper/helper');
		require('lib/vue');
		require('lib/underscore-min');

	var currentIndex,
		pageList    = [];

	var pluginsVm,  //组件列表
		canvasVm, //画布区域
		menuVm, // 菜单区域
		tabVm, //页签区域
		infoVm; //信息区域

	var _index = -1 ,selectIndex = [] , cachekey = {};

	var Designer = {

		DESIGNER_OPEN_TYPE_NEW : 'new',

		DESIGNER_OPEN_TYPE_OPEN : 'open',

		/**
		 * 设计器入口
		 * @param options.type 开发方式 新建|打开|单存的设计器
		**/
		init : function(options){

			var _this = this;

			if(!options){
				options = {
					type : _this.DESIGNER_OPEN_TYPE_NEW,
					id   : '' //type == open时必须传入
				}
			}

			_this.start(options).done(function(){

				currentIndex = pageList.length - 1;

				_this._createPluginPanel();
				_this._createMenuPanel();
				_this._createCanvasPanel();
				_this._createTabPanel();
				_this._createInfoPanel();
			});

		},

		start : function(options){
			var _this = this,
				dfd = new $.Deferred();

			if(options.type === _this.DESIGNER_OPEN_TYPE_OPEN){
				dfd.resolve();
			} else {
				pageList.push({
					components : [

					],
					config : {
						width  : 'auto',
						height : 'auto',
						name   : '自定义表单'
					},
					open : true
				});
				dfd.resolve();
			}

			return dfd;
		},

		_createPluginPanel : function(){
			var componentNames = _.keys(schema);
			var data = {
				components : []
			};

			_(componentNames).each(function(name){
				var component = schema[name];
				var item = {
					title : component.name,
					name  : name,
					icon : 'glyphicon-' + component.icon
				}

				data.components.push(item);
			});

			pluginsVm = new Vue({
				el : '#componentList',
				data : data,
				attached : function(){
					$(this.$el).find('.main').show();
				}
			});
		},

		_createMenuPanel : function(){
			var _this = this;
			menuVm = new Vue({
				el : '#designerMenu',
				data : {},
				methods : {

					newPage : function(){ //新建页面
						pageList.push({
							components : [

							],
							config : {
								width  : 'auto',
								height : 'auto',
								name   : '自定义表单' + pageList.length
							},
							open : true
						});
						var index = pageList.length - 1;
						_this.changePage(index);
					},

					open : function(){ //打开
						alert('open');
					},
					preview : function(){ //预览
						alert('preview');
					},
					save : function(callback){ //保存
						var targetPage = helper.copy(pageList[currentIndex]),
							result     = {
								components : targetPage.components,
								config     : targetPage.config
							}
						//helper.isFunction(callback) && callback.call(this);
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

		_createCanvasPanel : function(){
			var _this = this;
			canvasVm = new Vue({
				el   : '#mainPanel',
				data : {
					components : pageList[currentIndex].components,
					config : pageList[currentIndex].config
				},
				attached : function(){
				},
				methods : {
				}
			});

			helper.addListener('keyup',function(e){
				if(''+e.keyCode === '46'){
					helper.emit('EVENT_KEY_DELETE');
				}
			});
			helper.addListener('keydown',function(e){
				if(+e.keyCode >= 37 && +e.keyCode <= 40){
					e.preventDefault();
					helper.emit('EVENT_KEY_MOVE',''+e.keyCode);
				}
			});
		},

		_createTabPanel : function(){
			var _this = this;
			tabVm = new Vue({
				el : '#tabPanel',
				data : {
					pageList : pageList
				},
				attached : function(){
					$(this.$el).show();
				},
				methods : {
					changePage : function(index){
						_this.changePage(index);
					},

					closePage : function(index){
						_this.closePage(index);
					}
				}
			})
		},

		_createInfoPanel : function(){
			infoVm = new Vue({
				el : '#settingPanel',
				data : {
					component : null,
					config : pageList[currentIndex].config
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
		},

		closePage : function(index){

			var _this = this;

			if(index >= pageList.length || index < 0){
				return;
			}

			pageList.splice(index, 1);
			if(pageList.length > 0 && currentIndex === index){
				_this.changePage(0);
			} else {
				_this.changePage(-1);
			}
		},

		changePage : function(index){
			var page = pageList[index];
			if(page){
				currentIndex = index;
				canvasVm.components = page.components;
				canvasVm.config     = page.config;

				_.each(pageList, function(page, i){
					if(i === index){
						page.open = true;
					} else {
						page.open = false;
					}
				});

				infoVm.config = page.config;
			} else {
				currentIndex = -1;
				canvasVm.components = [];
				canvasVm.config     = {nopage : true};

				infoVm.config = {
					nopage : true
				}
			}

		},

		//获取当前页面
		getCurrentPage : function(){
			return pageList[currentIndex];
		},

		//获取某个页面
		getPage : function(){

		},

		addComponentToCurrentPage : function(component){
			var page = this.getCurrentPage();
			page && page.components.push(component);

			//this.setCurrentComponent(page.components[page.components.length - 1]);
		},

		setCurrentComponent : function(index){
			if(index == -1){
				infoVm.component = null;
			} else {
				infoVm.component = index;
			}
		},
		// 通过拖拽选中某一组件
		selectComponent : function(index){

		}
	}

	return Designer;
});
