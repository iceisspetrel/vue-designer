define(function(require){

	var schema   = require('components/componentSchema'),
		Designer = require('helper/Designer');
		helper   = require('helper/helper');
		var offsetConfig = { // 用于面板定位调整
			x : 18
			, y : 18
		},
		offsetPage = { //用于页面针对浏览器的偏移校正
			x : 238
			,y : 96
		};
	Vue.directive('ltDrag', function(value){
		var $clone;
		$(this.el).draggable({
			opacity : '0.00001',
			helper  : 'clone',
			start : function(ev, ui){
				var component = $(ev.target).attr('component'),
					setting   = schema[component];

					$clone = $('#clone_ui');
					if($clone.length > 0){
						$clone.remove();
					}
					$clone = $([
						'<div id="clone_ui" class="clone-ui">',
							'<span class="glyphicon glyphicon-' + setting.icon + '"/>',
							'<span>' + setting.name + '</span>',
						'</div>'
					].join('')).appendTo($('body'));

					$clone.css({
						left : ui.offset.left + 'px',
						top  : ui.offset.top  + 'px'
					});
			},

			drag : function(ev, ui){
				$clone.css({
					left : ui.offset.left + 'px',
					top  : ui.offset.top  + 'px'
				});
				helper.emit('EVENT_DRAG_DRAG',ui.offset.left - offsetPage.x,ui.offset.top - offsetPage.y);
			},

			stop : function(ev, ui){
				$clone.remove();
			}
		})
	});

	Vue.directive('mdDrop', function(value){
		$(this.el).droppable({
			accept : 'div[component]',
			drop : function(event, ui){
				var target = ui.draggable.attr('component');
				var plugin = schema[target];

				var component = {
					name   : target,
					id     : helper.guid(),
					config : {}
				}
				_(plugin.basicSetting).each(function(setting){
					component.config[setting.name] = setting.value ? setting.value : '' ;
				});
				component.config.modeType = 'edit';
				component.config.top = event.offsetY +'';// ui.offset.top + 'px';
				component.config.left = event.offsetX +''; //(ui.offset.left - 200) + 'px';
			}
		});
	});

	//panel 中拖拽
	Vue.directive('panelDrop',function(){
		var that = this
			,getChildern = function(vmObj){
			if(!vmObj || !vmObj.$children || !vmObj.$children.length) return [];
			var _children = vmObj.$children.map(function(_vmobj){
				_vmobj1 = _vmobj.$children[0];
				if(_vmobj1){
					var _component ={
						config : helper.copy( _vmobj1.config)
						,id : helper.copy(_vmobj1.id)
						,name : _vmobj1.constructor.name.replace(/\w/,function(m){return  m.toLowerCase(); })
					}
					_component.components = getChildern(_vmobj1);
					return _component;
				}
			});
			return _children;
			}
			,getOffset = function(dragvm1,acceptvm2){ // vm1
				var rect1 = dragvm1.$el.getBoundingClientRect()
					,rect2 = acceptvm2.$el.getBoundingClientRect();
				return {
					offsetY : rect1.top - rect2.top  + ( acceptvm2.$parent.isMain ? -offsetConfig.y : dragvm1.$parent.isMain ? offsetConfig.y : 0 )
					,offsetX : rect1.left - rect2.left  + ( acceptvm2.$parent.isMain ? -offsetConfig.x : dragvm1.$parent.isMain ? offsetConfig.x : 0)
				};
			};

		$(this.el).droppable({
			accept : 'div',
			greedy : true,
			drop : function(event,ui){
				if(ui.draggable.attr('component')){
					var target = ui.draggable.attr('component')
						,plugin = schema[target];
					var component = {
						name   : target,
						id     : helper.guid(),
						config : {}
					}
					_(plugin.basicSetting).each(function(setting){
						component.config[setting.name] = setting.value ? setting.value : '' ;
					});
					component.config.modeType = 'edit';
					component.config.top = ui.position.top - offsetConfig.y +'';// ui.offset.top + 'px';
					component.config.left = ui.position.left - offsetPage.x  +''; //(ui.offset.left - 200) + 'px';
					component.components = [];
					component.config.checked  = true;
					helper.emit('EVENT_UNSELECT_ALL');
					if(that.vm.$parent.isMain){
						Designer.addComponentToCurrentPage(component);
					}else{
						var _mainvm = function(vm){ if(vm.$parent.isMain) return vm; return _mainvm(vm.$parent);}
						var _offset = getOffset(_mainvm(that.vm),that.vm);
						component.config.top = +component.config.top  + _offset.offsetY;
						component.config.left = +component.config.left + _offset.offsetX;
						that.vm.addComponent(component,ui,'list');
					}
				}else if(ui.draggable.hasClass('drag')){
					var _vm = ui.draggable.parents('div.vm-panel-object:first').data('_vm_panel'); // 拖拽的容器
					// that.vm 接受的容器
					if( _vm.id === that.vm.id ) {  return;} // 接受和拖拽的为同一VM对象 代表此拖拽在同一容器内活动
					var _index = +ui.draggable.attr('index')
						,offset = getOffset(_vm,that.vm);

					var _component = helper.copy(_vm.components[_index]);
					_component.config.left =  ui.position.left + offset.offsetX;

					_component.config.top =  ui.position.top  + offset.offsetY;

					_component.components = getChildern(  _vm.$children[_index].$children[0] );
					that.vm.addComponent(_component,ui,'panel');
					_vm.removeComponentByIndex(_index);
				}
			}
		});
	});
	// 区域选择组件
	Vue.directive('mdDrag',function(value){
		var div = document.createElement('div'),el = this.el,sinfo = {},vm = this;
		if(!this.vm.config.isselect) return;
		div.style.cssText = 'width : 200px; height:200px; border:1px solid #88cdf1; position:absolute;top:20px; height:20px';
		$(this.el).draggable({
			start : function(evt,ui){
				sinfo = {
					x : evt.offsetX
					,y : evt.offsetY
				};
				div.style.top = sinfo.y +'px';
				div.style.left = sinfo.x + 'px';
				el.appendChild(div);
			}
			,refreshPositions : true
			,revertDuration : 1
			,drag : function(evt,ui){
				var _offsetX = ui.position.left - ui.originalPosition.left
					,_offsetY = ui.position.top  - ui.originalPosition.top
					,_width = 0 , _height = 0 , _left = 0, _right = 0;
				if(_offsetX > 0){ // 右拖拽
					_width = +_offsetX;
					_left = sinfo.x ;
					_top = sinfo.y;
					if(_offsetY < 0) //  上拖拽
					{
						_top = sinfo.y +  _offsetY ;
						_height = ~_offsetY;
					}else{
						_height = _offsetY;
					}
				}else{ // 左拖拽
					_width = ~_offsetX;
					_left = sinfo.x + _offsetX;
					_top = sinfo.y;
					if(_offsetY < 0){
						_top = sinfo.y +  _offsetY;
						_height = ~ _offsetY;
					}else{
						_height = _offsetY;
					}
				}
				div.style.top  = _top + 'px';
				div.style.left = _left + 'px';
				div.style.width = _width + 'px';
				div.style.height = _height + 'px';
				ui.position.top = ui.originalPosition.top;
				ui.position.left = ui.originalPosition.left;
				helper.emit('EVENT_DRAG_MAIN',{
					left : _left - 18,
					top : _top - 18,
					width : _width,
					height : _height
				});
			}
			,stop : function(evt){
				div.remove();
			}
		})
	});
	Vue.directive('componentDrag', function(){
		$(this.el).draggable();
	});

	Vue.directive('mcscroll', {

		params : ['options'],

		bind : function(){
			require('designer/lib/mCustomScrollbar/jquery.mCustomScrollbar.min.css');
			require('designer/lib/mCustomScrollbar/jquery.mousewheel.min');
			require('designer/lib/mCustomScrollbar/jquery.mCustomScrollbar.min');

			var options = $.extend({
				setWidth:false,
				setHeight:false,
				setTop:0,
				setLeft:0,
				axis:"y",
				scrollbarPosition:"inside",
				scrollInertia: 500,
				autoDraggerLength:true,
				autoHideScrollbar:true,
				autoExpandScrollbar:false,
				alwaysShowScrollbar:0,
				snapAmount:null,
				snapOffset:0,
				mouseWheel:{
					enable:true,
					scrollAmount:"auto",
					axis:"y",
					preventDefault:false,
					deltaFactor:"auto",
					normalizeDelta:false,
					invert:false,
					disableOver:["select","option","keygen","datalist","textarea"]
				},
				scrollButtons:{
					enable:false,
					scrollType:"stepless",
					scrollAmount:"auto"
				},
				keyboard:{
					enable:true,
					scrollType:"stepless",
					scrollAmount:"auto"
				},
				contentTouchScroll:25,
				advanced:{
					autoExpandHorizontalScroll:false,
					autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
					updateOnContentResize:true,
					updateOnImageLoad:true,
					updateOnSelectorChange:false,
					releaseDraggableSelectors:false
				},
				theme:"minimal-dark", //light(default) | dark | minimal | minimal-dark ...
				callbacks:{
					onInit:false,
					onScrollStart:false,
					onScroll:false,
					onTotalScroll:false,
					onTotalScrollBack:false,
					whileScrolling:false,
					onTotalScrollOffset:0,
					onTotalScrollBackOffset:0,
					alwaysTriggerOffsets:true,
					onOverflowY:false,
					onOverflowX:false,
					onOverflowYNone:false,
					onOverflowXNone:false
				},
				live:false,
				liveSelector:null
			}, this.params.options);

			$(this.el).mCustomScrollbar(options);
		}
	});

});
