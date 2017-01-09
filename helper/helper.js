define(function(require){
	var _index = -1 ,selectIndex = [] , cachekey = {};
	var EventManger = new (require('helper/EventEmitter'));

	var _typeof = function(arg){
		return Object.prototype.toString.call(arg);
	}

	var isArray = function(arg){
		return _typeof(arg) === '[object Array]';
	}

	var isDate = function(arg){
		return _typeof(arg) === '[object Date]';
	}

	var isRegExp = function(arg){
		return _typeof(arg) === '[object RegExp]';
	}

	var isObject = function(arg){
		return _typeof(arg) === '[object Object]';
	}

	var isFunction = function(arg){
		return _typeof(arg) === '[object Function]';
	}

	var copy = function(source, destination, stackSource, stackDest) {

	    if (!destination) {
	        destination = source;
	        if (source) {
	            if (isArray(source)) {
	                destination = copy(source, [], stackSource, stackDest);
	            } else if (isDate(source)) {
	                destination = new Date(source.getTime());
	            } else if (isRegExp(source)) {
	                destination = new RegExp(source.source,source.toString().match(/[^\/]*$/)[0]);
	                destination.lastIndex = source.lastIndex;
	            } else if (isObject(source)) {
	                var emptyObject = Object.create(Object.getPrototypeOf(source));
	                destination = copy(source, emptyObject, stackSource, stackDest);
	            }
	        }
	    } else {
	        if (source === destination)
	            throw new Error("Can't copy! Source and destination are identical.");
	        stackSource = stackSource || [];
	        stackDest = stackDest || [];
	        if (isObject(source)) {
	            var index = stackSource.indexOf(source);
	            if (index !== -1)
	                return stackDest[index];
	            stackSource.push(source);
	            stackDest.push(destination);
	        }
	        var result;
	        if (isArray(source)) {
	            destination.length = 0;
	            for (var i = 0; i < source.length; i++) {
	                result = copy(source[i], null , stackSource, stackDest);
	                if (isObject(source[i])) {
	                    stackSource.push(source[i]);
	                    stackDest.push(result);
	                }
	                destination.push(result);
	            }
	        } else {
	            if (isArray(destination)) {
	                destination.length = 0;
	            } else {
	                _.each(destination, function(value, key) {
	                    delete destination[key];
	                });
	            }
	            for (var key in source) {
	                if (source.hasOwnProperty(key)) {
	                    result = copy(source[key], null , stackSource, stackDest);
	                    if (isObject(source[key])) {
	                        stackSource.push(source[key]);
	                        stackDest.push(result);
	                    }
	                    destination[key] = result;
	                }
	            }
	        }
	    }
	    return destination;
	}

	var getCode = function(){
		return (65536 * (1 + Math.random() ) | 0).toString(16).substring(1);
	}


	var helper = window.helper =  {

		isArray : isArray,

		isDate  : isDate,

		isRegExp : isRegExp,

		isObject : isObject,

		isFunction : isFunction,

		/**
		* 深度拷贝对象 包括 数组、日期、object、正则对象、function、基本类型
		**/
		copy : function(arg){
			return copy.call(this, arg);
		},

		/**
		 * 原型对象
		 **/
		typeof : function(arg){
			return _typeof.call(this, arg);
		},

		guid : function(){
			return getCode() + getCode() + '-' + getCode() + '-' + getCode() + '-' + getCode() + '-' + getCode() + getCode() + getCode();
		},
		// //单击选中某一组件
		// setCurrentComponent : function(index){
		// 	if(_index == index){
		// 		selectIndex = [];
		// 		return;
		// 	}
		// 	_index = index;
		// 	if(index == -1){
		// 		Vue.designer.rtPanel.component = null;
		// 	} else {
		// 		Vue.designer.rtPanel.component = Vue.designer.mainForm.components[index];
		// 	}
		// }
		// // 通过拖拽选中某一组件
		// ,selectComponent : function(index){
		// 	if(selectIndex.indexOf(index) > -1) return;
		// 	selectIndex.push(index);
		// 	console.log(selectIndex);
		// }
		// //通过拖拽取消选中某一组件
		// ,unSelectComponent : function(index){
		// 	var i = selectIndex.indexOf(index);
		// 	if(i < 0) return;
		// 	selectIndex.splice(i,1);
		// 	console.log(selectIndex);
		// }
		// // 根据索引删除某一组件 
		// ,removeComponentByIndex : function(index){
		// 	debugger;
		// 	Vue.designer.mainForm.components.splice(index,1);
		// 	this.emit('EVENT_DESTORY_DRAG',[index]);
		// 	this.setCurrentComponent(-1);
		// }
		// // 删除选中组件
		// ,removeSelectComponents : function(){
		// 	if(_index < 0){
		// 		if(selectIndex.length){
		// 			Vue.designer.mainForm.components = Vue.designer.mainForm.components.filter(function(item,i){ return selectIndex.indexOf(i) < 0 ;});
		// 			this.emit('EVENT_DESTORY_DRAG',selectIndex);
		// 			selectIndex = [];
		// 		}
		// 	}else{
		// 		Vue.designer.mainForm.components.splice(_index,1);
		// 		this.emit('EVENT_DESTORY_DRAG',[_index]);
		// 		this.setCurrentComponent(-1);
		// 	}
		// }
		// // 移动选中组件
		// ,moveSelectComponents : function(type){
		// 	if(_index < 0){
		// 		for(var i = 0 , len = selectIndex.length ; i < len ; i ++){
		// 			this._moveSelectComponent(Vue.designer.mainForm.components[i],type);
		// 		}
		// 	}else{
		// 		this._moveSelectComponent(Vue.designer.mainForm.components[_index],type);
		// 	}
		// }
		// // 组件某一组件
		// ,_moveSelectComponent : function(compont,type){
		// 	var _componts = compont
		// 		, _top = +_componts.config.top
		// 		, _left = +_componts.config.left;
		// 	switch(type){
		// 		case '37' : {
		// 			if(_left > 0){
		// 				_componts.config.left = _left - 1;
		// 			}
		// 		}break;
		// 		case '39' : {
		// 			_componts.config.left = _left + 1;
		// 		}break;
		// 		case '38' : {
		// 			if(_top > 0){
		// 				_componts.config.top = _top - 1;
		// 			}
		// 		}break;
		// 		case '40' : {
		// 			_componts.config.top = _top + 1;
		// 		}break;
		// 	}
		// }
		// 添加全局按键监听事件
		addListener : function(name,handle,context){
			EventManger.on('key_'+name,handle,context || this);
			if(!cachekey[name]){
				window['on'+name] = function(e){
					EventManger.emit('key_'+name,e);
				}
				cachekey[name] = true;
			}
		}
		// 移除全局按键事件
		,removeListener : function(name,handle , context){
			EventManger.off('key_'+name,handle,context || this);
		}
		// 添加监听事件
		,on : function(){
			return EventManger.on.apply(EventManger,arguments);
		}
		// 触发事件
		,emit : function(){
			EventManger.emit.apply(EventManger,arguments);
		}
		// 关闭监听事件
		,off : function(name,handle,context){
			EventManger.off(name,handle,context || this);
		},


	};

	return helper;
});
