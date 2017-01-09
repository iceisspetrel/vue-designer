define(function(require){
	require("components/vImage/vImage.css");

	return require("components/ComponentBase").extend({
		name : "vImage",
		template : [
			"<div @click=\"onClick\" class=\"vImage\" :style=\"style\" :title=\"title\">"+
				"<img  :src=\"value\" :alt=\"alt\"  />"+
			"</div>"
		].join(''),
		options : { // 默认参数
			value : "", //
			initData : "components/vImage/vImage.png", //默认值
			title: "替换文本",
			width : 200, // 宽度
			height : 200, // 高度
			disable : true, //是否禁用
			modelType  : "normal",
			onClick : function(e){},  // 点击事件,只有在disable为false时有效
		},
		compiled : function(){
			if(this.config.modeType === 'round'){
				this.class.push('image-round');
				if(!this.value) this.value = this.config.value;
			}else{
				if(!this.value) this.value = this.config.value;
			}
		},
		data : function(){ // 这里是全局属性
			var self = this;
			return {
				value : this.config.value||this.config.initData||"components/vImage/vImage.png",
				alt : this.config.alt||this.config.title,
				title : this.config.title,
				isEdit : this.config.modeType === 'edit',
				style : {
					"width" : this.config.width + "px",
					"height" : this.config.height + "px",
					"borderRadius" : this.config.borderRadius||0 + "%",
					"borderWidth" : this.config.borderWidth||0 + "px",
					"borderColor" : this.config.borderColor,
					"borderStyle" : this.config.borderStyle,
					"z-index" : this.config.zIndex || 1
				}
			};
		},
		watch : {
			'config.value':function(value){
				this.value = value;
			},
			'config.width':function(value){
				this.style.width = value + 'px';
			},
			'config.height' : function(value){
				this.style.height = value + 'px';
			},
			'config.alt' : function(value){
				this.alt = value||this.config.title;
			},
			'config.borderRadius' : function(value){
				this.style.borderRadius = value+"%";
			},
			'config.borderWidth' : function(value){
				if(value=="") value = 0;
				this.style.borderWidth = value+"px";
			},
			'config.borderColor' : function(value){
				this.style.borderColor = value;
			},
			'config.borderStyle' : function(value){
				this.style.borderStyle = value;
			},
			'config.title' : function(value){
				this.title = value||this.config.alt;
			}
		},
		methods : { // 这里是全局方法
			getValue : function(){
				return this.value;
			},
			valid:function(){
				return true
			},
			onClick : function(e){
				if(this.config.modelType == "edit") return;
				this.config.disable == false && this.config.onClick && this.config.onClick(e);
			}
		}
	});
});
