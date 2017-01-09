define(function(require){
	var vueMethods = ['init','created','beforeCompile','compiled','ready','attached','detached','beforeDestory','destoryed'];
	var vueAttr =['config','name','template','props','data','watch','options','methods'];
	var vueAll = vueMethods.concat(vueAttr);
	var isVue = function(attr){
		return vueAll.indexOf(attr) > -1;
	}
	var isFunction = function(obj){  return '[object Function]' === Object.prototype.toString.call(obj); }
	var fnMatch = /hv/.test(function(){ 
				hv; }) ? /\b_super\b/ : /.*/;
	var isUndefined = function isUndefined(obj) { return 'undefined' === typeof obj; }
	var helper = require('helper/helper.js');
	var VueBase = function(){
	}
	VueBase.prototype = {
		name : '', // 必要参数
		options : {}, // 入参默认参数,必须全部写上
		config : {
		},
		template : function(){ // 棋板
			return '';
		},
		props : ['id', 'config', 'wrap'],
		data : function(){ // 内部数据
			return {};
		},
		beforeCompile : function(){
			if(!this.id)
			{
				this.id = helper.guid();
			}
		},
		attached : function(){

		},
		watch : { // 监听器

		},
		methods : { // 方法

		}
	};
	function Cltr(){}
	function createProto(proto){
		Cltr.prototype = proto;
		return new Cltr();
	}
	VueBase.extend = function(newproto){

		if(!newproto.name) throw 'ComponentBase extend error: make sure to provide the "name" option.'

		var _super = this.prototype;

		var component = new Function('return function '+newproto.name+'(){ this.init && this.init(); }')();

		var oldproto = createProto(_super);

		for(var attr in newproto){
			oldproto[attr] = isFunction(oldproto[attr]) && isFunction(newproto[attr]) && fnMatch.test( newproto[attr]) 
							? (function(name,fn){
								return function(){
									var tmp = this._super,ret;
									this._super = oldproto[name];
									ret = fn.apply(this,arguments);
									this._super = tmp;
									return ret;
								}
							})(attr,newproto[attr]) : newproto[attr];
		}

		//基类添加通用设置组件属性方法
		oldproto.methods.attr = function(key, value){
			this.config[key] && (this.config[key] = value);
		}

		component.prototype = oldproto;

		component.constructor = component;

		return component;
	}
	function toVueComponent(comp){
		var proto = comp.prototype || comp.__proto__;
		var template = proto.template;
		if(isFunction(template)){ template = template(); }
		var compara  =
		 {
			methods : {}
			,config : {}
		};
		for(var attr in proto){
			if(!isVue(attr)){
				compara[attr] = proto[attr];
			}else{
				compara[attr] = proto[attr];
			}
		}
		if(isFunction(compara.template)){
			compara.template = compara.template();
		}
		return Vue.component(proto.name,compara);
	}
	return {
		extend : function(sub){
			return toVueComponent(VueBase.extend(sub));
		}
	}
})
