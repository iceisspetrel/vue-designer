define(function(require) {

	require('components/vDatePicker/bootstrap-datetimepicker.css');
	require('components/vDatePicker/vDatePicker.css');

	var Base = require('components/ComponentBase');
	var stringToDate = function getDate(strDate) {
	    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	     function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	    return date;
	};


	Base.extend({

		name: 'vDatePicker',

		props: ['id', 'config'],

		template: [
			'<div class="input-group date date_Container" data-date="" data-link-format="{{dateFormat}}" v-on:click="toggelDatePannel" :style="dateContainerStyle">',
				'<div :style="inputStyle" class="date_Input" v-if="isEdit">{{placeHolder}}</div>',
                '<input v-else class="form-control" :style="inputStyle" placeHolder="{{placeHolder}}" style="border-radius: 6px 0 0 6px;"  type="text" v-model="placeHolder" readonly>',
				'<span class="input-group-addon" style="padding: 4px 8px;border-radius: 0 6px 6px 0;" v-on:click="toggelDatePannel" ><span class="glyphicon glyphicon-calendar"></span></span>',
            '</div>'
		].join(''),

		options : {
			ele: "",
			tableName: "",
			showName: [""],
			sefonSql: [null],
			initData: "",
			height:26,
			// width: 120,
			textAlign  : 'left', //默认文字对齐方式  left | center | right
			fontSize   : '12', //默认字体大小
			fontWeight : 'normal', //默认字体粗细  normal | bold
			modelType  : 'normal', //默认状态、表单申明状态下默认normal
			formateType: 'yyyy-mm-dd', //默认日期格式
			borderColor: '#D4D4D4', //默认边框颜色
			borderRadius:6, //默认边框圆角
			placeHolder: "请选择", //默认提示语，没有值的情况下存在
			zIndex     : 1, //默认z-index层级
			color      : '#000000', //默认字体颜色
			weekStart  : '1', //默认设置从星期一开始算第一天，展示在最左侧
			startDate  : '2010-01-01', //默认可选的最早日期
			endDate    : '2030-01-01', //默认可选的最晚日期
			todayBtn   : '1', //默认 出现 今天按钮
			todayHighlight : "1", //默认 当天高亮
			required:0,
			onChange    : function(e){ //点击事件、此事件只在 normal状态时时执行
			}
		},

		compiled: function() {

		},
		data: function() { // 这里是全局属性
			return {
				placeHolder: this.config.initData || this.config.placeHolder,
				value: this.config.initData || "",
				readonly: this.config.modelType != 'normal',
				isEdit: this.config.modelType == 'edit',
				name: this.config.name,
				dateFormat: this.config.formateType || "yyyy-mm-dd",
				selectdId : 0,
				initData : this.config.initData,
				weekStart : this.config.weekStart,
				todayBtn : this.config.todayBtn || 1,
				todayHighlight : this.config.todayHighlight || 1,
				startDate:this.config.startDate || "2010-01-01",
				endDate : this.config.endDate || "2030-01-01",
				datetimepicker:null,
				dateContainerStyle: {
					width: (this.config.width + 'px') || '100%' ,
					height: ((this.config.height) || 26) + 'px',
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'z-index': this.config.zIndex || 1
				},
				inputStyle: {
					width: ((this.config.width - 31)+ 'px') || "100%" ,
					height: ((this.config.height < 24 ? 24 : (this.config.height)) || 24) + 'px',
					'line-height': ((this.config.height < 24 ? 24 : (this.config.height)) || 24) + 'px',
					'font-size': (this.config.fontSize || 12) + 'px',
					'font-weight': this.config.fontWeight || 500,
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'text-align': this.config.textAlgin || 'left',
					color: this.config.color || '#555555'
				}
			};
		},
		watch: {
			'config.placeHolder': function(newValue, oldVaule) {
				this.placeHolder = newValue;
			},
			'config.fontSize': function(newValue) {
				this.inputStyle['font-size'] = newValue + 'px';
			},
			'config.borderWidth': function(newValue) {
				this.dateContainerStyle['border-width'] = newValue + 'px';
			},
			'config.borderColor': function(newValue) {
				this.dateContainerStyle['border-color'] = newValue;
			},
			'config.height': function(newValue) {
				if (newValue < 26) {
					this.config.height = 26;
				}
				this.dateContainerStyle.height = newValue + 'px';
				this.inputStyle.height = (newValue < 24 ? 24 : newValue) + 'px';
				this.inputStyle['line-height'] = (newValue < 24 ? 24 : newValue) + 'px';

			},
			'config.width': function(newValue) {
				if (newValue < 130) {
					this.config.width = 130;
				}
				this.dateContainerStyle.width = newValue + 'px';
				this.inputStyle.width = (newValue - 31) + 'px';
			},
			'config.fontWeight': function(newValue) {
				this.inputStyle['font-weight'] = newValue;
			},
			'config.borderRadius': function(newValue) {
				this.dateContainerStyle['border-radius'] = newValue + 'px';
			},
			'config.textAlgin': function(newValue) {
				this.inputStyle['text-align'] = newValue;
			},
			'config.color': function(newValue) {
				this.inputStyle.color = newValue;
			},
			'config.modelType': function(newValue) {

			},
			'config.initData' : function(newValue){
				// console.log(newValue);
				//监控initData，当initData有值时，取代placeHolder，展示到表单设计器上
				if(newValue){
					this.placeHolder = newValue;
					this.value = newValue;
				}else if(newValue == ""){
					//当initData从有值被清空时，表单设计器展示placeHolder
					this.placeHolder = this.config.placeHolder;
				}
			},
			'config.weekStart' : function(newValue){
				this.weekStart = newValue;
			},
			'config.startDate' : function(newValue){
				this.startDate = newValue;
			},
			'config.zIndex': function(newValue) {
				this.dateContainerStyle['z-index'] = newValue
			},
			'config.todayBtn' : function(newValue){
				this.todayBtn = newValue;
			},
			'config.todayHighlight' : function(newValue){
				this.todayHighlight = newValue;
				// debugger;
			},
			'config.name': function(newValue) {
				this.name = newValue;
			},'isOpen':function(newValue){
				// console.log(this.isOpen);
				// this.arrowStyle.margin = ((newValue < 28 ? 28 : newValue) / 2 - 4 || 11) + 'px auto'
			}
		},
		ready: function() {
			var self = this;
			var eleWidth = $(this.$el).parent().parent().css("width");
			// debugger;
			//$(this.$el).find(".select_Content").css("width",($(this.$el.parentNode).width() - 30) + "px");
			var inputWidth = $(this.$el).parent().css("width") =="0px" ? "100%": ((parseInt($(this.$el).parent().css("width").substr(0,$(this.$el).parent().css("width").indexOf('px'))) - 31)+'px');
			//即刻计算改变input的宽度
			$(this.$el).find(".form-control").css("width",inputWidth);
			var marginTop = (parseInt($(this.$el).css("height").substr(0,$(this.$el).css("height").indexOf('px'))) + 2)+'px';
			//拿到相关数据，动态绘制当前的错误提示文本
			var dateErrorInfo = ['<div class="date_ErrorMsg" style="width:'+eleWidth+';opacity:'+ (this.config.pannelOpacity || 1)+';margin-top:'+marginTop+'" >'];
			// dateErrorInfo.push('<div class="date_ErrorMsg"></div>');
			dateErrorInfo.push('</div>');
			dateErrorInfo = dateErrorInfo.join('');
			$(this.$el).append(dateErrorInfo);

			//拿到初始值或数据库查询的数据去绘制列表
			if (this.config.modelType == "normal") {
				//日期选择
				this.datetimepicker = $(this.$el).datetimepicker({
			        language:  'cn',	//设置的语言类型，可自定义加上 aaa  bbb 这种
			        weekStart: self.weekStart,		//从星期几算开头
			        todayBtn:  self.todayBtn,		//是否需要 今天  这个按钮
					autoclose: 1,		//是否自动关闭
					todayHighlight: self.todayHighlight,  //高亮
					startView: 2,		//从第几个层级开始展示视图
					minView: 2,			//最小可缩到什么层级
					forceParse: 0,		//是否强制验证变更
					startDate: self.startDate,
					endDate:self.endDate,
					format: self.dateFormat
			    }).on('changeDate', function(ev){
				    self.value = ev.date;
				    self.config.onChange && self.config.onChange();
				});
			}


			window.aaa = this;
			//}
		},
		methods: { // 这里是全局方法
			getValues: function() {
				//console.log($(this.$el).find(".form-control").val());
				//返回格式有三种
				//形式1：当取值有值时，返回的是 Date格式的数据
				//形式2：当并未配置必填，并且用户没有选择日期时，返回的是 null
				//形式3：当配置了必填，但验证不通过时，返回的是 false
				// debugger;
				if ($(this.$el).find(".form-control").val() == this.config.placeHolder) {
					if (this.config.required) {
						//将样式处理为红色标记，并外抛配置的 requiredMsg
						this.errorMsg("show",this.config.validMsg || "必填！");
						return false;
					}else{
						return null;
					}
				}else{
					if(this.valid()) {
						if(typeof(this.value) == "string"){
							this.value = stringToDate(this.value);
						}
						return this.value;
					}else{
						return false;
					}
				}
			},valid:function(){
				console.log("in valid function");
				var isSubmited = true;
				//根据当前配置的验证规则来处理当前是否可取值提交
				//dataPicker只验证其必填与否
				if (this.config.required) {
					if(typeof(this.value) == "string"){
						this.value = stringToDate(this.value);
					}
					if (!this.value) {
						isSubmited = false;
						//将样式处理为红色标记，并外抛配置的 validMsg
						this.errorMsg("show",this.config.validMsg || "必填！");
						return isSubmited;
					}
				}
				return isSubmited;
			},
			toggelDatePannel:function(){
				console.log("in toggelDatePannel function");
				//监控当前日期面板并设置样式
				this.errorMsg("hide");
				//阻止事件冒泡
				if (event.cancelBubble) {
					//IE 兼容写法
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
			},
			errorMsg:function(type,msg){
				//增加统一控制方法，控制错误提示信息的显影
				if (type == "show") {
					//显示当前组件错误提示信息，并更新当前的errorMsg
					$(".datetimepicker-dropdown-bottom-right").hide();
					$(this.$el).addClass("date_Container_error");
					$(this.$el).css("border-color","red");
					$(this.$el).parent().find(".date_ErrorMsg").text(msg);
					$(this.$el).parent().find(".date_ErrorMsg").show("normal");
				}else{
					//隐藏当前组件的错误提示
					// this.datetimepicker.show();
					$(this.$el).removeClass("date_Container_error");
					$(this.$el).css("border-color",this.config.borderColor);
					$(this.$el).parent().find(".date_ErrorMsg").text("");
					$(this.$el).parent().find(".date_ErrorMsg").hide("normal");
				}
			}
		}
	});
});