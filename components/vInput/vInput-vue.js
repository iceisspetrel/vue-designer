define(function(require){
	require('components/vInput/vInput.css');
	function isString(obj){ return typeof obj === 'string'; }
	function isObject(obj){ return '[object Object]' === Object.prototype.toString.call(obj); } 
	function isFunction(obj){ return typeof obj === 'function'; }
	function isRegExp(obj){ return  '[object RegExp]' === Object.prototype.toString.call(obj); }
	function msgFmt(msg,data){ 
		for(var attr in data){
			msg = msg.replace(new RegExp('\{'+attr+'\}'),function(m){
	          return data[attr];
	        });
		}
		return msg;
	}
	function validReg(reg){
		return function(){
			return reg.test(this.value);
		}
	}
	var defaultrule ={
		maxlength : {
			rule : function(){
				return this.value.length > Infinity;
			}
			,msg : '输入最大字数不能超过{maxlength}个长度,当前长度{length}'
		}
		,minlength :{
			rule :  function(){
				return this.value.length < 0
			}
			,msg : '输入字数最小不能少于{minlength},当前长度{length}'
		}
		,number : {
			rule : validReg(/^\d*$/)
			,msg : '请输入非零整数'
		}
		,required : {
			rule : function(obj){
				return !!this.value.length && this.value != '';
			}
			,msg : '此字段为必填项。'
		}
		,email : {
			rule : validReg(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)
			,msg : '请输入有效的电子邮箱地址。'
		}
		,telphone : {
			rule : validReg(/^(13|15|18)\d{9}$/)
			,msg : '请输入有效的手机号码。'
		}
		,idcard : {
			rule : validReg(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)
			,msg : '请输入有效的身份证号码。'
		}
	};
	Vue.component('vInput', {
		options : { // 默认参数 
			type : 'normal' // 组件类型 label
			,valid : [] // 验证
			,msg : '' // 提示消息 	
			,value : '' // 默认值
			,width : 200 // 宽度
			,height : 30 // 高度
			,disable : false
		},
		props : ['id', 'config','css'],
		data : function(){
			var self = this;
			return {
				class : ['input-normal']
				,value : this.config.value 
			};
		},
		template : [
			'<div :class="class" >',
				'<input v-on:focus.self="onFocus" v-on:blur.self="onBlur" readonly="{{config.disable}}"  v-model="value" />',
			'</div>'
		].join(''),
		watch : {
			'config.disable' : function(newValue,oldValue){
			}
			,'value':function(newValue,oldValue){
			}
		},
		compiled : function(){
			if(!this.value) this.value = this.config.msg;
			if(this.config.type === 'label'){
				this.class.push('input-label');
				this.disable(true);
			}
		},
		methods : {
			getValue : function(){
				return this.value === this.config.msg ? '' : this.value;
			}
			,disable : function(disable){
				this.config.disable = disable;
			}
			,onFocus : function(){
				if(this.config.disable) return;
				this.class.push('input-active');
				if(this.value === this.config.msg){
					this.value = '';
				}
			}
			,onBlur : function(){
				if(this.config.disable) return;
				this.class = this.class.filter(function(cls){
					return ['input-active' , 'input-error' , 'input-success'].indexOf(cls) < 0;
				});
				this.class.push('input-complate');
				this.class.push( this.valid() ? 'input-success' : 'input-error');
			}
			,valid : function(){
				this.$el.setAttribute('errormsg','');
				var that = this;
				return this.config.valid.every(function(v){
					var _valid = true,_msg = '' , input = that.$el.firstChild;
					if(isString(v)){
						if(defaultrule[v])
						{
							_valid = defaultrule[v].rule.call(that.$el.firstChild,that);
							_msg = defaultrule[v].msg;
						}
					}
					if(_valid && isObject(v)){
						for(var attr in v){
							if(attr === 'maxlength'){
								 _valid = input.value.length <= v['maxlength'];
								 _msg = msgFmt(defaultrule[attr].msg,{
								 	maxlength : v['maxlength']
								 	,length : input.value.length
								 });

							}else if(attr === 'minlength'){
								_valid = input.value.length >= v['minlength'];
								_msg = msgFmt(defaultrule[attr].msg,{
								 	minlength : v['minlength']
								 	,length : input.value.length
								});
							}else{
								var _rule = v[attr].rule;
								if(isRegExp(_rule)){
									_rule = validReg(_rule);
								}
								_valid = _rule.call(input,that);
								_msg = v[attr].msg;
							}
							if(!_valid) break;
						}
					}
					if(!_valid){
						that.$el.setAttribute('errormsg',_msg);
					}
					return _valid;
				});
			}
		}
	});
});