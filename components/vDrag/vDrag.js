define(function(require){
	require('components/vDrag/vDrag.css');
	var schema = require('components/ComponentSchema')
		,helper = require('helper/helper')
		,Designer = require('helper/Designer')
		,scale =require('helper/scale_ruler');
	var cursor = {
		'top': 'ns-resize'
		,'right': 'ew-resize'
		,'bottom' :'ns-resize'
		,'left' : ' ew-resize'
		,'left-top' : 'se-resize'
		,'right-top' : 'sw-resize'
		,'right-bottom' : 'se-resize'
		,'left-bottom' : 'sw-resize'
	}
	,toTagName = function(name){
		return name.replace(/[A-Z]/g,function(a){ return '-' + a.toLowerCase() ;})
	}
	,componentslist = (function(){
		var taglist = [];
		for(var attr in schema){
			if(attr != 'vDrag'){
				var _tagname = toTagName(attr);
				taglist.push('<'+ _tagname+' v-if="component.name == \'' + attr +'\'" :id="id" :component="component" :config="config" :components="components"></'+_tagname+'>');
			}
		}
		return taglist.join('');
	})()
	,keyOpp ={
		top : 'bottom'
		,right : 'left'
		,bottom : 'top'
		,left : 'right'
	}
	,offset = {
		x : 238
		,y : 96
	};
	function initDrag(){
		var that = this;
		this.$('>div').each(function(){
			var _$el = $(this) , _name = _$el.attr('name');
			initEldrag.call(that,_$el,_name);
		});
	}
	function initEldrag($el,name){
		if(!name) return;
		var that = this , sinfo = {} ;
		$el.draggable({
				start : function(){
					sinfo = {
						width : that.config.width
						,height : that.config.height
						,top : that.config.top
						,left : that.config.left
					}
				}
				,refreshPositions : true
				,axis  : (function(opt){
					if(opt === 'bottom' || opt === 'top') return 'y';
					else if(opt === 'left' || opt === 'right') return 'x';
					return '';
				})(name)
			//	,revert : name === 'top'
				,revertDuration : 1
				,containment : (function(opt){
					switch(opt){
						case 'top' : { return [0 , offset.y - 2 , 0 , +that.config.top + (+that.config.height) + offset.y - 7 ] ;}
						case 'right':{ return [+that.config.left + offset.x + 4 ,0];	}
						case 'bottom':{ return [0,+that.config.top +  offset.y + 4]; }
						case 'left' : { return [offset.x - 2 , 0 , +that.config.width + (+that.config.left) + offset.x - 7 , 0]; }
						case 'left-top' : { return [offset.x - 2  , offset.y - 2  ,  +that.config.width + (+that.config.left) + offset.x - 7 , +that.config.top + (+that.config.height) + offset.y - 7 ];}
						case 'right-top' : { return [+that.config.left + offset.x + 4  , offset.y - 2  ,Infinity ,  +that.config.top + (+that.config.height) + offset.y - 7 ]; }
						case 'right-bottom':{ return [+that.config.left + offset.x + 4 , +that.config.top +  offset.y + 4]; }
						case 'left-bottom' : { return [offset.x - 2 , +that.config.top +  offset.y + 4 , +that.config.width + (+that.config.left) + offset.x - 7 , Infinity] ;}
					}
					return [];
				})(name)
				,cursor : cursor[name]
				,drag : function(evt,ui){
					var _offsetX = ui.position.left - ui.originalPosition.left
						,_offsetY = ui.position.top  - ui.originalPosition.top;	
					switch(name){
						case 'top':{
							that.config.top = +sinfo.top + _offsetY;
							that.config.height = +sinfo.height - _offsetY;
							ui.position.top = ui.originalPosition.top;
						}break;
						case 'right':{
							that.config.width = +sinfo.width + _offsetX;
						}break;
						case 'bottom':{
							that.config.height = +sinfo.height + _offsetY;
						}break;
						case 'left':{
							that.config.width = +sinfo.width - _offsetX;
							that.config.left = +sinfo.left + _offsetX;
							ui.position.left = ui.originalPosition.left;
						}break;
						case 'left-top' : {
							that.config.width = +sinfo.width - _offsetX;
							that.config.height = +sinfo.height - _offsetY;
							that.config.left = +sinfo.left + _offsetX;
							that.config.top = +sinfo.top + _offsetY;
							ui.position.left = ui.originalPosition.left;
							ui.position.top = ui.originalPosition.top;
						}break;
						case 'right-top' : {
							that.config.top = +sinfo.top + _offsetY;
							that.config.height = +sinfo.height - _offsetY;
							that.config.width = +sinfo.width + _offsetX;
							ui.position.top = ui.originalPosition.top;
						}break;
						case 'right-bottom':{
							that.config.width = +sinfo.width + _offsetX;
							that.config.height = +sinfo.height + _offsetY;
						}break;
						case 'left-bottom':{
							that.config.width = +sinfo.width  - _offsetX;
							that.config.height = +sinfo.height + _offsetY;
							that.config.left = +sinfo.left + _offsetX;
							ui.position.left = ui.originalPosition.left;
						}break;

					}
				}
				,stop : function(){
					var _style = name.split('-').map(function(cn){
						$el.css(cn,'-3px');
						$el.css(keyOpp[cn],'auto');
					});
					initDrag.call(that);
				}
			});
	}
	function getOffset(vm){
		var _rect = vm.$el.getBoundingClientRect();
		return {
			x : _rect.left - offset.x 
			,y : _rect.top - offset.y 
		}
	}
	return require('components/ComponentBase').extend({
		name : 'vDrag',
		props : ['id', 'config','component','components'],
		template : [
			'<div :style="style"   @mousedown="check($event)"   :class="class">',
			//	'<div style="z-index:1;"></div>', 不能由拖拽层来完成此功能
				'<div >',componentslist,'</div>',
			'</div>'
		].join(''),
		options : { // 默认参数 
		},
		data : function(){ // 这里是全局属性
			return {
				$$el : null
				,style : {
					width : this.config.width + 'px'
					,height : this.config.height + 'px'
					,top : this.config.top + 'px'
					,left : this.config.left + 'px'
					,position : 'absolute'
					,'z-index' : this.config.zIndex
					,'box-sizing' : 'content-box'
				}
				,class : {
					drag : true
					,'drag-unselect' : !this.config.checked
				}
			};
		},
		compiled : function(){
			var that = this,html = [];
			this.$$el = $(this.$el);
			['top','right','bottom','left','left-top','right-top','right-bottom','left-bottom'].forEach(function(item,index){
				html.push('<div name="'+item+'" class="drag-'+item+'" style="position:absolute;" ></div>');
			});
			if(this.config.checked){
			 	helper.emit('EVENT_CHECKED_COMPONENT',this);
			}
			this.$$el.append(html.join(''))
			// this.$$el.append('<div style="width: 100px;height: 0px;border: 1px dashed #BAAEFA;left: -107px;top: -1px;"></div>'
			// 		+'<div style="height: 30px;border: 1px dashed #d5d5d5;top: -37px;left: -1px;"></div>');
			this.$$el.data('panelVm',this);
			this.$$el.draggable({ 
				containment : [offset.x,offset.y]
				,zIndex : 99999 
				,start : function(){
					helper.emit('EVENT_DRAG_START');
				}
				,drag : function(event,info){
					that.config.top = info.position.top;
					that.config.left = info.position.left;
					var _offset = getOffset(that);
					helper.emit('EVENT_DRAG_DRAG',_offset.x,_offset.y);
				}
				,stop:function(){
					initDrag.call(that);
					helper.emit('EVENT_DRAG_END');
				}
			});
			initDrag.call(this);
			var _index = +this.$$el.attr('index');
			if(!this.$parent.config.isselect){
				return;
			}
			helper.on('EVENT_DRAG_MAIN',function(sinfo){  // 当在主面板 中拖拽时 
				// console.log('-------'+this.isSelect(sinfo));
				if(this.isSelect(sinfo)){
					this.config.checked = true;
				}else{
					this.config.checked = false;
				}
			},this).on('EVENT_DESTORY_DRAG',function(index){
				if(index.indexOf(_index) > -1){
					helper.off('EVENT_DRAG_MAIN',null,this);
					helper.off('EVENT_DESTORY_DRAG',null,this);
				}
			},this).on('EVENT_KEY_MOVE',function(opt){
				if(!this.config.checked) return;
				switch(opt){
					case '37' :{
						if(this.config.left > 0){
							this.config.left -= 1;
						}
					}break;
					case '38':{
						if(this.config.top > 0){
							this.config.top -= 1;
						}
					}break;
					case '39':{
						this.config.left += 1;
					}break;
					case '40':{
						this.config.top += 1;
					}break;
				}
			},this);
		}
		,beforeDestroy : function(){
			//当销毁当前对象时,要将内容从父级中移除
			helper.emit('EVENT_UNCHECKED_COMPONENT',this);
		}
		,destroyed : function(){
			helper.off('EVENT_DRAG_MAIN',null,this);
			helper.off('EVENT_DESTORY_DRAG',null,this);
			helper.off('EVENT_KEY_MOVE',null,this);
		}
		,watch : {
			'config.width': function(newValue,oldValue){
				this.style.width = newValue + 'px';
			}
			,'config.height' : function(newValue,oldValue){
				this.style.height = newValue + 'px';
			}
			,'config.top' : function(value){
				this.style.top = value + 'px';
			} 
			,'config.left' : function(value){
				this.style.left = value + 'px';
			}
			,'config.zIndex' : function(value){
				this.style['z-index'] = value;
			}
			,'config.checked' :  function(newvalue , oldvalue){
				this.class= {
					drag : true
					,'drag-unselect' : !this.config.checked
				};
				if(newvalue){
					helper.emit('EVENT_CHECKED_COMPONENT',this);
				}else{
					helper.emit('EVENT_UNCHECKED_COMPONENT',this);
				}
			}
		},
		methods : { // 这里是全局方法
			$ : function(selector){
				return $(this.$el).find(selector);
			}
			,isSelect : function(rect){
				var r1 = {
					x1 : +this.config.left
					,y1 : +this.config.top
					,x2 : +this.config.left + +this.config.width
					,y2 : +this.config.top + +this.config.height
				},r2 = {
					x1 : +rect.left
					,y1 : +rect.top
					,x2 : +rect.left + +rect.width
					,y2 : +rect.top + +rect.height
				};
				return Math.abs((r1.x1+r1.x2)/2-(r2.x1+r2.x2)/2) < ((r1.x2+r2.x2-r1.x1-r2.x1)/2) && 
					Math.abs( (r1.y1+r1.y2)/2-(r2.y1+r2.y2)/2) < ((r1.y2+r2.y2-r1.y1-r2.y1)/2);
			}
			,check : function(evt){
				evt.stopPropagation();
				helper.emit('EVENT_UNSELECT_ALL');
				this.config.checked = true;
				//Designer.setCurrentComponent(this.component);
			}
			,getOffset : function(){

			}
		}
	});
});