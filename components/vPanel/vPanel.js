define(function(require){
	var schema = require('components/ComponentSchema')
		,Designer = require('helper/Designer')
		,helper = require('helper/helper');
	var toTagName = function(name){
			return name.replace(/[A-Z]/g,function(a){ return '-' + a.toLowerCase() ;})
		}
		,componentslist = (function(){
			var taglist = [];
			for(var attr in schema){
				if(attr != 'vDrag'){
					var _tagname = toTagName(attr);
					taglist.push('<'+ _tagname+' v-if="component.name == \'' + attr +'\'" :id="id" :config="config"></'+_tagname+'>');
				}
			}
			return taglist.join('');
		})();

	return require('components/ComponentBase').extend({
		name : 'vPanel'
		,props : ['id', 'config', 'wrap','components', 'pageconfig']
		,template : [
			'<div class="vm-panel-object"  v-md-drag  v-panel-drop  :style="style">',
				'<div v-if="nopage()"></div>',
				'<v-drag v-else v-for="item in components"  index={{$index}} :config="item.config" :id="item.id" :component="item" :components="item.components" ></v-drag>',
			'</div>'
		].join('')
		,options : {
			width : 300
			,height : 300
			,borderWidth : 1
			,borderColor : 'black'
			,borderStyle : 'solid'
			,borderRadius :  0
			,backgroundColor : 'white'
			,zIndex : 1
			,isselect : false /// 是否支持拖拽选中
		}
		,attached : function(){
			$(this.$el).data('_vm_panel',this);

			this.components = this.components || [];
			helper.on('EVENT_KEY_DELETE',function(){
				var that = this;
				var _checklist = this.components.filter(function(item){
					return item.config.checked;
				});
				_checklist.forEach(function(item){
					that.components.$remove(item);
				})
				_checklist = null;
			},this);
		}
		,destroyed : function(){
			helper.off('EVENT_KEY_DELETE',null,this);
		}
		,data : function(){
			return {
				style : {
					width : this.config.width + ( (this.config.width+'').indexOf('%') > -1 ? '' :  'px')
					,height : this.config.height + ( (this.config.height + '' ).indexOf('%') > -1 ? '' :  'px')
					,'border-width': this.config.borderWidth + 'px'
					,'border-color' : this.config.borderColor
					,'border-style' : this.config.borderStyle
					,'border-radius' : this.config.borderRadius + 'px'
					,'background-color' : this.config.backgroundColor
					,'z-index' : this.config.zIndex
					,'position' : 'relative'
					,'overflow' : 'hidden'
				}
			};
		}
		,watch : {
			'config.width':function(width){
				this.style.width = width + 'px';
			}
			,'config.height' : function(height){
				this.style.height = height + 'px'
			}
			,'config.borderWidth' : function(bw){
				this.style['border-width'] = bw + 'px';
			}
			,'config.borderStyle' : function(bs){
				this.style['border-style'] = bs;
			}
			,'config.borderColor' : function(bc){
				this.style['border-color'] = bc;
			}
			,'config.borderRadius' : function(br){
				this.style['border-radius'] = br + 'px';
			}
			,'config.backgroundColor' : function(bgc){
				this.style['background-color'] = bgc;
			}
			,'config.zIndex' : function(zi){
				this.style['z-index'] = zi;
			}
			,'components' : function(){
			}
		}
		,methods : {
			addComponent : function(component,ui,type){
				var that = this;
				this.components.push(component);
			}
			,removeComponentByIndex : function(index){
				this.components.splice(index,1)
			},

			nopage : function(){
				return this.pageconfig.nopage || false;
			}
		}
	});
});
