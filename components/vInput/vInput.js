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
			,msg : '请输入整数'
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
		},
		fax : {
			rule : validReg(/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){7,12})+$/)
			,msg : '请输入正确传真名。'
		}
	};
	var vInputMethod ={
		onFocus : function(){
			this.class.push('input-active');
			this.class = this.class.filter(function(cls){
				return ['input-error'].indexOf(cls) < 0;
			});
			if(this.value === this.config.placeHodler){
				this.value = '';
			}
			this.errormsg = '';
			this.config.onFocus.apply(this,arguments);
		}
		,onBlur : function(){
			this.class = this.class.filter(function(cls){
				return ['input-active' , 'input-error' , 'input-success'].indexOf(cls) < 0;
			});
			this.class.push('input-complate');
			this.class.push( this.valid() ? 'input-success' : 'input-error');
			this.config.onBlur.apply(this,arguments);
		}
		,onKey : function(name,evt){
			switch(name){
				case 'enter':{
					this.config.onEnter.call(this,evt);
				}break;
			}
		}
	};
	return require('components/ComponentBase').extend({
		name : 'vInput',
		template : [
			'<div  :class="class" :style="style">',
				'<div v-if="isEdit"  >{{value}}</div>',
				'<input v-else @keyup.enter="_method(\'onKey\',\'enter\', $event)" v-on:focus.self="_method(\'onFocus\', $event)" v-on:blur.self="_method(\'onBlur\', $event)"',
				'  disabled="{{readonly}}" v-model="value" />',
				'<div :style="errorStyel" class="input-error-container">{{errormsg}}</div>',
			'</div>'
		].join(''),
		options : { // 默认参数 
			//type : 'normal' // 组件类型 label
			valid : "" // 验证
			,validMsg : ""
			,maxlength : Infinity
			,minlength : -1
			,isrequired : false // 是否必填 
			,placeHodler : '' // 提示消息 	
			,value : '' // 默认值
			,width : 'auto' // 宽度
			,height : 30 // 高度
			,modeType :'normal' // 'readonly' || 'preview' || 'edit'
			,tableName : ''
			//,multi : false  
			,onChange : function(newValue,oldVaule){}  // 当内容发生改事件
			,onFocus : function(){ } // 获取焦点事件 
			,onBlur : function(){ } // 失去焦点事件
			,onEnter : function(){ } // 当点击回车键时
			,onValid : function(ele,value){ return true } // 自定义验证方法  ele 当前输入框DOM value 当前输入框的值  作用域为vm对象
		},
		compiled : function(){
			if(this.config.modeType === 'edit'){
				this.disable(true);
				this.class.push('input-edit');
				if(!this.value) this.value = this.config.placeHodler;
			}else if(this.config.modeType === 'preview'){
				this.class.push('input-label');
				this.disable(true);
				this.value = this.config.value;
			}else{
				if(!this.value) this.value = this.config.placeHodler;
			}
		},
		data : function(){ // 这里是全局属性
			var self = this;
			return {
				class : ['input-normal']
				,value : this.config.value || this.config.placeHodler
				,style : {
					width : this.config.width === 'auto' ?  'auto' : this.config.width + 'px'
					,height : this.config.height + 'px'
					,color : this.config.color || ''
					,'font-size' : this.config['fontSize'] + 'px'
					,'line-height' : this.height + 'px'
				}
				,errorStyel : {
					display : 'none'
				}
				,isEdit : this.config.modeType === 'edit'
				,readonly : this.config.modeType != 'normal'
				,errormsg : ''
			};
		},
		watch : {
			'value' : function(newValue,oldVaule){
				if(!this.isEdit) this.config.onChange(newValue,oldVaule);
			}
			,'config.value':function(newValue,oldVaule){
				this.value = newValue;
			}
			,'config.width':function(newValue){
				this.style.width = newValue + 'px';
			}
			,'config.height' : function(newValue){
				this.style.height = newValue + 'px';
				this.style['line-height'] = newValue + 'px';
			}
			,'config.color' : function(newValue){
				this.style.color = newValue;
			}
			,'config.placeHodler' : function(newValue,oldVaule){
				if(!this.value || this.value === oldVaule) this.value = newValue;
			}
			,'config.value' : function(newValue){
				this.value = newValue;
				if(this.value === '') this.value = this.config.placeHodler;
			}
			,'config.fontSize':function(newValue){
				this.style['font-size'] = newValue + 'px';
			}
			,'readonly' : function(newValue,oldVaule){
				if(newValue){ 
					this.config.modeType = 'readonly';
				}else{ // 从禁用变为启用
					this.config.modeType = 'normal';
				}
			}
			,'config.modeType':function(newValue,oldVaule){ // normoal,preview,readonly
				this.config.modeType = newValue;		
			}
			,'config.valid' : function(newValue,oldVaule){
				if(!defaultrule[newValue] && newValue.length){
					if(newValue[0] != '/' || newValue.substr(-1) != '/'){
						this.class.push('input-error');
						this.errormsg = '[warn]:非法验证表达式';
						return;
					}
				}else{
					if(newValue.length){
						this.config.validMsg = defaultrule[newValue].msg;
					}
				}
				this.class = this.class.filter(function(cls){ return cls != 'input-error'; });
				this.errormsg = '';
			}
			,'errormsg' : function(newValue,oldVaule){
				this.errorStyel.display = newValue === '' ? 'none' : 'block';
			}
		},
		methods : { // 这里是全局方法
			getValue : function(){
				return this.value === this.config.placeHodler ? '' : this.value;
			}
			,disable : function(disable){
				this.readonly = this.isEdit ? true : disable;
				this.class = this.class.filter(function(cls){
					return ['input-active' , 'input-error' , 'input-success'].indexOf(cls) < 0;
				});
				this.errormsg = '';
			}
			,valid : function(){
				this.$el.setAttribute('errormsg','');
				var that = this,input = this.$el.firstChild,_msg = "";
			//	if(this.config.isrequired){
				if(!this.value || !this.value.length){
					this.errormsg = this.config.isrequired ? defaultrule['required'].msg : '';
					return !this.config.isrequired;
				}
				// }else{
				// 	if(!this.value || !this.value.length){
				// 		return true;
				// 	}
				// }
				if( input.value.length > this.config.maxlength ){
					_msg = msgFmt(defaultrule['maxlength'].msg,{
							 	maxlength : this.config.maxlength
							 	,length : input.value.length
					});
					this.errormsg =  _msg;
					return false;
				}
				if(input.value.length < this.config.minlength){
					_msg = msgFmt(defaultrule['minlength'].msg,{
					 	minlength : this.config.minlength
					 	,length : input.value.length
					});
					this.errormsg =  _msg;
					return false;
				}

				var _valid = true ;
				_valid = this.config.onValid && this.config.onValid.call( this, this.$el.firstChild ,this.getValue());
				if(!_valid) return _valid;
				if(typeof this.config.valid === 'string'){
					if(this.config.valid === '') return _valid;
					if(this.config.valid[0] === '/' || this.config.valid.substr(-1) === '/'){
						_valid = validReg(new RegExp(this.config.valid.substring(1,this.config.valid.length-1))).call(this.$el.firstChild,this);
						_msg  = this.config.validMsg;
					}else{
						_valid = defaultrule[this.config.valid].rule.call(this.$el.firstChild,this);
						_msg = this.config.validMsg || defaultrule[this.config.valid].msg;
					}
				}else{
					_valid = validReg(this.config.valid).call(this.$el.firstChild,this);
					_msg = this.config.validMsg;
				}
				if(!_valid){
					
						this.errormsg = _msg;
					}
				return _valid;
			}
			,_method : function(name){
				if(this.isEdit) return false;
				if(this.config.modeType != 'normal' ) return;
				vInputMethod[name] && vInputMethod[name].apply(this,[].slice.call(arguments,1))
			}
		}
	});
});