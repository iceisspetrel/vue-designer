define(function(require) {
	require('components/vTab/vTab.css');
	return require('components/ComponentBase').extend({

		name: 'vTab',

		props: ['id', 'config'],

		template: [
			'<div class="tab-title">'
			,'<ul>'
				,'<li :style="style" v-for="item in data | filterBy _init item"  @click="_click(item,$index,$event)" >{{item.name}}</li>'
			,'</ul>'
			,'</div>'
		].join(''),
	/*
		data :[{
			name : ''
			,ele :
		},{
			name : ''
			,ele : 
		},'']
			
		*/
		options : {
				modeType : 'normal'
				,width : 120
				,height : 40
				,initData : []
				,beforeChange : function(){
					console.log('v-tab:beforeChange') ; 
				}
				,onChange : function(){ 
					console.log('v-tab:onChange') ; 
				}
				,onLoad : function(){
					console.log('v-tab:onLoad')
				}
		},

		compiled: function() {

		},
		data: function() { // 这里是全局属性
			return {
				data : this.config.initData
				,index : -1
				,style : {
					width : this.config.width +'px'
					,height : this.config.height + 'px'
					,'line-height' : this.config.height + 'px'
				}
			};
		},
		watch: {
			'index' : function(newval,oldval){
				this.config.beforeChange(this.data[newval] , this.data[oldval] || undefined);
				if(oldval > -1){
					$(this.data[oldval].ele).hide();
					$('li',this.$el).eq(oldval).removeAttr('check');
				}
				$(this.data[newval].ele).show();
				$('li',this.$el).eq(newval).attr('check','');
				this.config.onChange(this.data[newval] , this.data[oldval] || undefined);
			}
		},
		ready: function() {
			this.$parent.$el.classList.add('tab');
			if(this.config.modeType === 'edit') return;
			this.config.onLoad();
			if(this.index < 0){
				this.goto(0);
			}
		},
		methods: { // 这里是全局方法
			getValues: function() {
				return {};
			}
			,_init : function(item){
				// item.ele && $(item.ele).hide();
				return true;
			}
			,_click : function(item,index,evt){
				this.data[index].onclick && this.data[index].onclick(this.data[index]);
				if(index === this.index) return;
				this.goto(index);
			}
			,goto : function(index){
				if(typeof index != 'number'){
					index = this.getIndexByName();
				}
				this.index = index;
			}
			,getIndexByName : function(name){
				for(var i = 0 ;i < this.data.length ; i++){
					if(name === this.data[i].name)
					{
						return i;
					}
				}
			}
		}
	});
});