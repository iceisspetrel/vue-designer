define(function(require){
	var ruler = require('helper/scale_ruler')
		,helper = require('helper/helper')
		,Designer = require('helper/Designer')
		,unselect = function(children){
			if(!children || !children.length) return;
			children.forEach(function(vm){
				vm.config.checked = false;
				unselect(vm.$children);
			})
		};
	return require('components/ComponentBase').extend({
		name : 'vMainPanel',
		props : ['id', 'config', 'wrap','components'],
		template : [
				'<v-panel v-else :config="panelConfig" :pageconfig="config" @mousedown="unSelectComponent($event)" :components="components"></v-panel>'
		].join(''),
		option : {
			modelType :'edit'//
		},
		attached:function(){
			ruler.init('#mainPanel>div');
			helper.on('EVENT_UNSELECT_ALL',function(){
				this.unSelectComponent();
			},this);
			helper.on('EVENT_CHECKED_COMPONENT',function(com){
				this.checkedList.push(com);
			},this).on('EVENT_UNCHECKED_COMPONENT',function(com){
				this.checkedList.$remove(com);
			},this);
		}
		,destroyed : function(){
			helper.off('EVENT_UNSELECT_ALL',null,this);
			helper.off('EVENT_UNCHECKED_COMPONENT',null,this);
			helper.off('EVENT_CHECKED_COMPONENT',null,this);
		}
		,watch : {
			'checkedList':function(newvalue){
				if(newvalue.length === 1){
					Designer.setCurrentComponent(newvalue[0].component);
				}else{
					Designer.setCurrentComponent(-1);
				}
			}
		}
		,data : function(){
			return {
				panelConfig :{
					width : '100%'
					,height : '100%'
					,borderWidth : 0
					,borderColor : 'black'
					,borderStyle : 'solid'
					,borderRadius :  0
					,backgroundColor : 'white'
					,zIndex : 0
					,isselect : true
					,top : 0
					,left : 0
				}
				,isMain : true
				,checkedList :[]
			}
		}
		,methods:{
			unSelectComponent : function(){
				unselect(this.$children);
			}
		}
	});
})
