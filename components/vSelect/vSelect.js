define(function(require) {

	require('components/vSelect/vSelect.css');

	var Base = require('components/ComponentBase');

	//根据传入的dom对象和需要加减的值来处理，返回 带px 的像素值
	//domValue : 25px
	//num : int
	//isAdd : true   相加为true  减为 false
	var countPX = function(domValue,num,isAdd){
		var afterCount = 0;
		var elementValue = domValue.substr(0,domValue.indexOf('px'));
		if (isAdd) {
			afterCount = elementValue + num;
		}else{
			afterCount = (elementValue - num) > 0 ? (elementValue - num) : 0 ;
		}
		return afterCount + "px";
	};

	
	Base.extend({

		name: 'vSelect',

		props: ['id', 'config'],

		template: [
			// '<div style="position: absolute;">',
			'<div class="select_Container" data="" style="position: absolute;" :style="containerStyle" name="{{name}}">',
			'<div class="select_Content" v-on:click="toggelSelectList"  :style="contentStyle">',
			'<div :style="inputStyle" class="select_Input">{{value}}</div>',
			'</div>',
			'<div class="select_btn" v-on:click="toggelSelectList" :style="btnStyle">',
			'<span class="{{arrow}}" :style="arrowStyle"></span>',
			'</div>',
			'</div>'
			// '</div>'
		].join(''),

		options : {
			ele: "",
			tableName: "",
			showName: [""],
			sefonSql: [null],
			initData: [{}],
			width      : 130, //默认宽度
			height     : 24, //默认高度
			textAlgin  : 'left', //默认文字对齐方式  left | center | right
			fontSize   : '12', //默认字体大小
			fontWeight : 'normal', //默认字体粗细  normal | bold
			modelType  : 'normal', //默认状态、表单申明状态下默认normal
			borderColor: '#D4D4D4', //默认边框颜色
			borderRadius:6, //默认边框圆角
			placeHolder: "请选择",//默认提示语，没有值的情况下存在
			zIndex     : 1, //默认z-index层级
			required:0, //默认下拉组件非必填
			validMsg : "必填！",  //如果出现配置了必填验证，但为必填的情况的提示文字
			color      : '#000000', //默认字体颜色
			onSelect    : function(e){ //点击事件、此事件只在 normal状态时时执行
			}
		},

		compiled: function() {

		},
		data: function() { // 这里是全局属性
			return {
				placeHolder: this.config.placeHolder,
				value: this.config.value || this.config.placeHolder,
				readonly: this.config.modelType != 'normal',
				isEdit: this.config.modelType === 'edit',
				name: this.config.name,
				isOpen: false,
				selectdId : -1,
				containerStyle: {
					width: (this.config.width + 'px') || '100%',
					height: (this.config.height || 26) + 'px',
					// 'border-width': (this.config.borderWidth || 3) + 'px',
					'border-color': this.config.borderColor || ' #D4D4D4',
					'border-radius': (this.config.borderRadius || 6) + 'px',
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'z-index': this.config.zIndex || 1
				},
				contentStyle: {
					width: (this.config.width - 36) || 100 + 'px',
					height: (this.config.height || 24) + 'px'
				},
				inputStyle: {
					width: (this.config.width - 38) || 100 + 'px',
					height: (this.config.height < 24 ? 24 : this.config.height) + 'px',
					'line-height': ((this.config.height < 24 ? 24 : this.config.height) || 24) + 'px',
					'font-size': (this.config.fontSize || 12) + 'px',
					'font-weight': this.config.fontWeight || 500,
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'text-align': this.config.textAlgin || 'left',
					color: this.config.color || '#000000'
				},
				btnStyle: {
					height: (this.config.height < 24 ? 24 : this.config.height) + 'px',
					// 'border-left-width': (this.config.borderWidth || 3) + 'px',
					'border-left-color': this.config.borderColor || ' #D4D4D4',
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'line-height':(this.config.height < 24 ? 24 : this.config.height) + 'px'
				},
				arrow: this.isOpen ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down",
				arrowStyle: {
					// margin: (((this.config.height < 26 ? 26 : this.config.height) / 2 - 4) || 9) + 'px auto'
				}
			};
			// debugger;
		},
		watch: {
			'config.placeHolder': function(newValue, oldVaule) {
				if (!this.value || this.value === oldVaule) this.value = newValue;
			},
			'config.value': function(newValue) {
				this.value = newValue;
				if (this.value === '') this.value = this.config.placeHolder;
			},
			'config.fontSize': function(newValue) {
				this.inputStyle['font-size'] = newValue + 'px';
			},
			// 'config.borderWidth': function(newValue) {
			// 	this.containerStyle['border-width'] = newValue + 'px';
			// 	this.btnStyle['border-left-width'] = newValue + 'px';
			// },
			'config.borderColor': function(newValue) {
				this.containerStyle['border-color'] = newValue;
				this.btnStyle['border-left-color'] = newValue;
			},
			'config.height': function(newValue) {
				if (newValue < 24) {
					this.config.height = 24;
				}
				this.containerStyle.height = newValue + 'px';
				this.contentStyle.height = newValue + 'px';
				this.inputStyle.height = (newValue < 24 ? 24 : newValue) + 'px';
				this.inputStyle['line-height'] = (newValue < 24 ? 24 : newValue) + 'px';
				this.btnStyle.height = newValue + 'px';
				this.btnStyle['line-height'] = newValue + 'px';
				// this.arrowStyle.margin = ((newValue < 26 ? 26 : newValue) / 2 - 4 || 11) + 'px auto'
			},
			'config.width': function(newValue) {
				this.containerStyle.width = newValue + 'px';
				this.contentStyle.width = (newValue - 34) + 'px';
				this.inputStyle.width = (newValue - 36) + 'px';
			},
			'config.fontWeight': function(newValue) {
				this.inputStyle['font-weight'] = newValue;
			},
			'config.borderRadius': function(newValue) {
				this.containerStyle['border-radius'] = newValue + 'px';
			},
			'config.textAlgin': function(newValue) {
				this.inputStyle['text-align'] = newValue;
			},
			'config.color': function(newValue) {
				this.inputStyle.color = newValue;
			},
			'config.modelType': function(newValue) {

			},
			'config.pannelOpacity': function(newValue) {

			},
			'config.zIndex': function(newValue) {
				this.containerStyle['z-index'] = newValue
			},
			'config.name': function(newValue) {
				this.name = newValue;
			},'isOpen':function(newValue){
				// console.log(this.isOpen);
				// this.arrowStyle.margin = ((newValue < 26 ? 26 : newValue) / 2 - 4 || 11) + 'px auto'
			}
		},
		ready: function() {
			if (this.config.modelType != "normal") {
				return;
			}
			//根据父容器宽度绘制容器宽度，不能用百分比来表示
			var eleWidth = $(this.$el).css("width");
			var self = this;
			var inputWidth = eleWidth =="0px" ? "100%": ((parseInt(eleWidth.substr(0,eleWidth.indexOf('px'))) - 29)+'px');
			//即刻计算改变input的宽度
			$(this.$el).find(".select_Content").css("width",inputWidth);
			//$(this.$el).find(".select_Content").css("width",($(this.$el.parentNode).width() - 30) + "px");
			//拿到初始值或数据库查询的数据去绘制列表
			var marginTop = (parseInt($(this.$el).css("height").substr(0,$(this.$el).css("height").indexOf('px'))) + 2)+'px';
			if (this.config.tableName) {
				//如果initData和 table数据绑定方式都存在，优先以数据绑定为主
				//当父级dom绘制完成后
				if (this.config.modelType == "normal") {
					var selectList = ['<div class="select_itemBox" style="width:'+eleWidth+';opacity:'+ (this.config.pannelOpacity || 1)+';margin-top:'+marginTop+'" >'];
					selectList.push('<ul>');

					//这里会有一大坨的数据请求和内容绘制，还涉及到时序性问题


					selectList.push('</ul></div>');
					
					selectList = selectList.join('');
					$(this.$el).after(selectList);
				}
			}else if(this.config.initData && this.config.initData[0]){
				//根据initData来绘制列表
				//当父级dom绘制完成后
				if (this.config.modelType == "normal") {
					var selectList = ['<div class="select_itemBox" style="width:'+eleWidth+';opacity:'+ (this.config.pannelOpacity || 1)+';margin-top:'+marginTop+'" >'];
					selectList.push('<div class="select_ErrorMsg"></div>');
					selectList.push('<ul>');
					//如果没有配置必填，则默认给 下拉列表添加  请选择  字样，也可以选择该值
					if (!this.config.required) {
						selectList.push('<li data-index="-1" data="-1">');
						selectList.push('<div class="select_item_0" style="width:'+  countPX(eleWidth,15,false)+'">请选择</div></li>');
					}
					for (var i = 0; i < this.config.initData.length; i++) {
						selectList.push('<li data-index="'+i+'" data="'+this.config.initData[i].value+'">');
						selectList.push('<div class="select_item_'+i+'" style="width:'+  countPX(eleWidth,15,false)+'">'+this.config.initData[i].label+'</div></li>');
						//循环过程中监听是否有默认选中，如果有，则绘制影响父级
						if (this.config.initData[i].defaultChecked) {
							$(self.$el).find(".select_Input").text(this.config.initData[i].label);
							$(self.$el).attr("data",this.config.initData[i].value);
							//如果客户配置了多个 defaultChecked，以最后一个为准
							self.selectdId = this.config.initData[i].value;
						}
					}
					selectList.push('</ul></div>');
					
					selectList = selectList.join('');
					$(this.$el).append(selectList);
				}
			}

			$(self.$el).parent().find('.select_itemBox').loadScroll();

			// var vm = new Vue({
	  //       	el : $(self.$el).parent().find('.select_itemBox')[0],
	  //       	data : {
	  //       		options : {
	        			
	  //       		}
	  //       	}
	  //       });



			//事件委托
			$(this.$el).parent().find(".select_itemBox").find("li").on("click",function(e){
				//阻止事件冒泡
				if (e.cancelBubble) {
					//IE 兼容写法
					e.cancelBubble = true;
				}else{
					e.stopPropagation();
				}
				if (self.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件
					//取当前li的数据id 和 名称、展示到select中
					var currentDataId = $(this).attr("data") == undefined ? 0 : $(this).attr("data");
					var currentText = $(this).text(); 
					$(self.$el).find(".select_Input").text(currentText);
					$(self.$el).attr("data",currentDataId);
					self.selectdId = currentDataId;
					//点击事件选择完毕后，关闭窗体
					$(self.$el).parent().find(".select_itemBox").hide('normal');
					self.isOpen = false;
					$(self.$el).find(".select_btn").find("span").attr("class","glyphicon glyphicon-chevron-down");

					//触发 onSelect 事件，外抛给业务线
					self.config.onSelect && self.config.onSelect();

				}
			});

			if (!window.selectRegClick) {
				//document事件绑定
				if (document.attachEvent)//ie浏览器
	            {
	                document.attachEvent("onclick",function(e){
						var targetClassName = e.target.getAttribute("class");
						// debugger;
					　　var windowBox = document.getElementsByClassName("select_itemBox");
						for (var i = 0; i < windowBox.length; i++) {
							$(windowBox[i]).hide('normal');
							$(windowBox[i]).parent().find("span").attr("class","glyphicon glyphicon-chevron-down");
						}
						var errorMsgBox = document.getElementsByClassName("select_ErrorMsg")
						for (var j = 0; j < errorMsgBox.length; j++) {
							$(errorMsgBox[j]).hide('normal');
						}
					});
					//注册window对象，标记防止事件多次注册
					window.selectRegClick = true;
	            }
	            else if (document.addEventListener) //非ie浏览器
	            {
	                document.addEventListener("click",function(e){
						var targetClassName = e.target.getAttribute("class");
					　　var windowBox = document.getElementsByClassName("select_itemBox");
						for (var i = 0; i < windowBox.length; i++) {
							$(windowBox[i]).hide('normal');
							$(windowBox[i]).parent().find("span").attr("class","glyphicon glyphicon-chevron-down");
						}
						var errorMsgBox = document.getElementsByClassName("select_ErrorMsg")
						for (var j = 0; j < errorMsgBox.length; j++) {
							$(errorMsgBox[j]).hide('normal');
						}
					});
					//注册window对象，标记防止事件多次注册
					window.selectRegClick = true;
	            };
			}
		},
		methods: { // 这里是全局方法
			getValues: function() {
				//返回值有三种，分别适配三种不同场景
				//形式1：当取值有值时，返回的是  {aaa:"1"}  其中，aaa 是用户实例化组件时传递的 config.name
				//形式2：当并未配置必填，并且用户没有选择时，返回的是  {aaa:null}
				//形式3：当配置了必填，但验证不通过时，返回的是 false 
				if (this.valid()) {
					var keyName = this.config.name || "vSelect";
					var obj = {};
					// debugger;
					if (this.selectdId == undefined || this.selectdId == -1) {
						return null;
					}else{
						obj[keyName] = this.selectdId.toString();
						return obj;
					}
					// return this.selectdId == undefined ? null : { "+"keyName"+" : this.selectdId.toString()};
				}else{
					return false;
				}
				
			},
			toggelSelectList:function(event){
				// console.log("in toggelSelectList function");
				this.errorMsg("hide");
				//阻止事件冒泡
				if (event.cancelBubble) {
					//IE 兼容写法
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
				//只有normal状态下才响应点击事件，展开或收起下拉列表
				if (this.config.modelType == "normal") {
					var currentStatus = $(this.$el).find(".select_btn").find("span").attr("class");
					if ($(this.$el).parent().find(".select_ErrorMsg").css("display") == "block") {
						//先判断当前的错误信息有没有展示出来，如果有的话，直接替换提示信息的展示内容，然后注销红色提示
						this.errorMsg("hide");
					}else if (currentStatus == "glyphicon glyphicon-chevron-down") {
						//如果当前处于收起状态，点击应展示面板框
						$(this.$el).parent().find(".select_itemBox").show('normal');
						this.isOpen = true;
						$(this.$el).find(".select_btn").find("span").attr("class","glyphicon glyphicon-chevron-up");

					}
					else{
						//如果当前处于展开状态，收起面板框
						$(this.$el).parent().find(".select_itemBox").hide('normal');
						this.isOpen = false;
						$(this.$el).find(".select_btn").find("span").attr("class","glyphicon glyphicon-chevron-down");
					}
				}
			},valid:function(){
				// console.log("in valid function");
				var isSubmited = true;
				//根据当前配置的验证规则来处理当前是否可取值提交
				//select只验证其必填与否
				if (this.config.required) {
					// console.log("in required");
					// debugger;
					if (this.selectdId == -1) {
						// console.log("in show error");
						isSubmited = false;
						//将样式处理为红色标记，并外抛配置的 requiredMsg
						this.errorMsg("show",this.config.validMsg || "必填！");
						return isSubmited;
					}
				}
				return isSubmited;
			},
			errorMsg:function(type,msg){
				// console.log(this.config.borderColor);
				// debugger;
				//增加统一控制方法，控制错误提示信息的显影
				// console.log("in errorMsg function");
				if (type == "show") {
					//显示当前组件错误提示信息，并更新当前的errorMsg
					$(this.$el).parent().find("ul").hide("fast");
					$(this.$el).addClass("select_Container_Error");
					$(this.$el).css("border-color","red");
					$(this.$el).parent().find(".select_ErrorMsg").text(msg);
					$(this.$el).parent().find(".select_ErrorMsg").show("normal");
					$(this.$el).parent().find(".select_itemBox").show('normal');
				}else{
					//隐藏当前组件的错误提示
					$(this.$el).parent().find("ul").show("fast");
					$(this.$el).removeClass("select_Container_Error");
					$(this.$el).css("border-color",this.config.borderColor);
					$(this.$el).parent().find(".select_ErrorMsg").text("");
					$(this.$el).parent().find(".select_ErrorMsg").hide("normal");
				}
			}
		}
	});
});