//对象选择器
//Creat By LMZ  2016-06-30
//参数定义：
// params={
// 		showName:["name","age","sex"],		//必填，列表查询数据库展示名称，至少需要一个值，最多支持三列的展示，与参数验证相挂钩，当宽度不够又要求展示三列，则报错不绘制
// 		tableName:"person",					//必填，搜索表名称
// 		selectModle:"single",				//必填，选择模式是单选 single  还是多选 ：multi
// 		searchName:["name","age","sex"],	//非必填，搜索名称，根据字段名提供数据遍历，当没有值或空时，则采用showName来做 search 匹配
// 		keyName:"关键字：",					//非必填，左上方中文展示位，如果没有，则默认渲染  关键字：
// 		maxSelect:"5",						//非必填，如果是多选，最多选择多少个
// 		minSelect:"2",						//非必填，如果是多选，最少需要选择多少个
//		readOnly:false,						//非必填，如果是真true，则设置 只读属性
//      placeholder:"请输入仪器名称、编号"  //非必填，设置HT placeholder 效果
// 		submitReg:{
// 			maxLength:999,					//提交时超长验证，值超过这个数额则视为提交无效
// 			minLength:0,					//提交时最少验证，值少于这个长度则视为提交无效
// 			isEmpty:0						//提交时非空验证，1 需要非空验证，   0 不需要非空验证
// 		}
// }                 
(function(win,undefined){
	var Person_demoData = {
		status:1,
		body:[
			{
				name:"李四",
				id:152,
				age:"21",
				sex:"男"
			},{
				name:"王五",
				id:78,
				age:"35",
				sex:"女"
			},{
				name:"廖三",
				id:44,
				age:"12",
				sex:"男"
			}
		]
	}
	var Department_demoData = {
		status:1,
		body:[
			{
				name:"党政办公室",
				id:35,
				code:"CY04841871"
			},{
				name:"公共卫生安全部",
				id:42,
				code:"CY07511117"
			},{
				name:"财务部",
				id:7,
				code:"CY03671094"
			}
		]
	}
	var car_demoData = {
		status:1,
		body:[
			{
				factory:"一汽大众",
				id:35,
				price:"720.000.00",
				size:"1764 * 1157 * 350"
			},{
				factory:"一汽大众",
				id:35,
				price:"720.000.00",
				size:"1764 * 1157 * 350"
			},{
				factory:"一汽大众",
				id:35,
				price:"720.000.00",
				size:"1764 * 1157 * 350"
			},{
				factory:"一汽大众",
				id:35,
				price:"720.000.00",
				size:"1764 * 1157 * 350"
			},{
				factory:"凯迪拉克",
				id:142,
				price:"280.000.00",
				size:"1708 * 1149 * 348"
			},{
				factory:"凯迪拉克",
				id:142,
				price:"280.000.00",
				size:"1708 * 1149 * 348"
			},{
				factory:"凯迪拉克",
				id:142,
				price:"280.000.00",
				size:"1708 * 1149 * 348"
			},{
				factory:"凯迪拉克",
				id:142,
				price:"280.000.00",
				size:"1708 * 1149 * 348"
			},{
				factory:"奔驰",
				id:7,
				price:"445.000.00",
				size:"1864 * 1030 * 332"
			},{
				factory:"奔驰",
				id:7,
				price:"445.000.00",
				size:"1864 * 1030 * 332"
			},{
				factory:"奔驰",
				id:7,
				price:"445.000.00",
				size:"1864 * 1030 * 332"
			},{
				factory:"奔驰",
				id:7,
				price:"445.000.00",
				size:"1864 * 1030 * 332"
			},{
				factory:"奔驰",
				id:7,
				price:"445.000.00",
				size:"1864 * 1030 * 332"
			}
		]
	}

	var basicSetting = [{
			name : "id",
			label : "组件id",
			value : "",
			type : "input",
			disable : true 
		},{
			name : "name",
			label : "组件名称",
			value : "objectSelector",
			type : "input" 
		},{
			name : "fontSize",
			label: "字体大小",
			value : 12,
			type : "input",
			unit : "px" 
		},{
			name : "color",
			label : "字体颜色",
			value : "#FFFFFF",
			type : "colorPicker"
		},{
			name : "fontWeight",
			label : "字体粗细",
			value : 500,
			type : "select",
			options: [{
                        "selectVal": "100",
                        "label": "100"
                    },{
                        "selectVal": "200",
                        "label": "200"
                    },{
                        "selectVal": "300",
                        "label": "300"
                    },{
                        "selectVal": "400",
                        "label": "400"
                    },{
                        "selectVal": "500",
                        "label": "500"
                    },{
                        "selectVal": "600",
                        "label": "600"
                    },{
                        "selectVal": "700",
                        "label": "700"
                    },{
                        "selectVal": "800",
                        "label": "800"
                    },{
                        "selectVal": "900",
                        "label": "900"
                    }
                ] 
		},{
			name : "modelType",
			label : "组件模式",
			value : "normal",
			type : "select",
			options: [{
                        "selectVal": "readOnly",
                        "label": "只读模式"
                    },{
                        "selectVal": "normal",
                        "label": "普通模式"
                    },{
                        "selectVal": "preview",
                        "label": "打印报告模式"
                    },{
                        "selectVal": "edit",
                        "label": "表单设计模式"
                    }
                ] 
		},{
			name : "borderWidth",
			label : "边框粗细",
			value : 1,
			type : "input",
			unit : "px"  
		},{
			name : "borderColor",
			label : "边框颜色",
			value : "#D4D4D4",
			type : "colorPicker" 
		},{
			name : "borderRadius",
			label : "圆角程度",
			value : 3,
			type : "input",
			unit : "px"  
		},{
			name : "textAlgin",
			label : "左右对齐",
			value : "left",
			type : "select",
			options: [{
                        "selectVal": "left",
                        "label": "左对齐"
                    },{
                        "selectVal": "center",
                        "label": "居中"
                    },{
                        "selectVal": "right",
                        "label": "右对齐"
                    },{
                        "selectVal": "edit",
                        "label": "表单设计模式"
                    }
                ]  
		},{
			name : "pannelOpacity",
			label : "透明度",
			value : 1,
			type : "select",
			options: [{
                        "selectVal": "1",
                        "label": "1"
                    },{
                        "selectVal": "0.9",
                        "label": "0.9"
                    },{
                        "selectVal": "0.8",
                        "label": "0.8"
                    },{
                        "selectVal": "0.7",
                        "label": "0.7"
                    },{
                        "selectVal": "0.6",
                        "label": "0.6"
                    },{
                        "selectVal": "0.5",
                        "label": "0.5"
                    },{
                        "selectVal": "0.4",
                        "label": "0.4"
                    },{
                        "selectVal": "0.3",
                        "label": "0.3"
                    },{
                        "selectVal": "0.2",
                        "label": "0.2"
                    },{
                        "selectVal": "0.1",
                        "label": "0.1"
                    }
                ]  
		},{
			name : "placeholder",
			label : "提示文字",
			value : "请输入：",
			type : "input" 
		},{
			name : "z-index",
			label : "z-index",
			value : 1,
			type : "input" 
		},{
			name : "SelectModel",
			label : "选择模式",
			value : "single",
			type : "select",
			options: [{
                        "selectVal": "single",
                        "label": "单选模式"
                    },{
                        "selectVal": "multi",
                        "label": "多选模式"
                    },{
                        "selectVal": "treeMulti",
                        "label": "树形多选模式"
                    }
                ]  
		},{
			name : "maxSelect",
			label : "最多选择",
			value : 1,
			type : "select",
			options: [{
                        "selectVal": "1",
                        "label": "1"
                    },{
                        "selectVal": "2",
                        "label": "2"
                    },{
                        "selectVal": "3",
                        "label": "3"
                    },{
                        "selectVal": "4",
                        "label": "4"
                    },{
                        "selectVal": "5",
                        "label": "5"
                    },{
                        "selectVal": "6",
                        "label": "6"
                    },{
                        "selectVal": "7",
                        "label": "7"
                    },{
                        "selectVal": "8",
                        "label": "8"
                    },{
                        "selectVal": "9",
                        "label": "9"
                    },{
                        "selectVal": "10",
                        "label": "10"
                    }
                ]   
		},{
			name : "minSelect",
			label : "至少选择",
			value : 1,
			type : "select",
			options: [{
                        "selectVal": "1",
                        "label": "1"
                    },{
                        "selectVal": "2",
                        "label": "2"
                    },{
                        "selectVal": "3",
                        "label": "3"
                    },{
                        "selectVal": "4",
                        "label": "4"
                    },{
                        "selectVal": "5",
                        "label": "5"
                    },{
                        "selectVal": "6",
                        "label": "6"
                    },{
                        "selectVal": "7",
                        "label": "7"
                    },{
                        "selectVal": "8",
                        "label": "8"
                    },{
                        "selectVal": "9",
                        "label": "9"
                    },{
                        "selectVal": "10",
                        "label": "10"
                    }
                ]   
		},{
			name : "keyName",
			label : "搜索提示",
			value : "关键字：",
			type : "input" 
		},{
			name : "top",
			label : "距顶部距离",
			value : null,
			type : "input" 
		},{
			name : "left",
			label : "距左线距离",
			value : null,
			type : "input" 
		},{
			name : "width",
			label : "宽度",
			value : null,
			type : "input" 
		},{
			name : "height",
			label : "高度",
			value : null,
			type : "input" 
		}]



	var isArray = function(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
	var isString = function(obj){
		return typeof obj === 'string';
	}
	var bind = function(ele,name,callback){
		if(! (name || callback) ) return;
		if(window.attachEvent){
			ele.attachEvent('on' + name,callback);
		}else{
			ele.addEventListener(name,callback);
		}
	}

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
	}

	//根据出入的ele，判断之前有没有 前端缓存数据，提高性能
	var checkIsQuery = function(dom){
		var hasData = false;
		if (dom.getAttribute("isQuery") == 1) {
			hasData = true;
		}
		return hasData;
	}

	//验证参数的有效性
	var checkSetting = function(dom,option){
		//判断基础参数有没有

		//判断父级内容长度是否支撑绘制

		return true;
	}

	var ObjectSelector = function(option){
		var self = this;
		//判断构造函数是否满足
		if(option.ele){
			this.ele = option.ele;
		}else if(option.id){
			this.ele = document.getElementById(option.id);
		}else{
			throw 'Container can not be empty.';
			return; 
		}
		self.option = option;

		if (checkSetting(this.ele,option)) {
			this.container = document.createElement('div');
			this.container.className += " ObjectSelector_Container";

			this.content = document.createElement('div');
			this.content.className += " ObjectSelector_Content";
			this.content.style.width = countPX(this.ele.style.width,28,false);

			this.input = document.createElement('input');
			this.input.className += " ObjectSelector_Input";
			this.input.style.width = countPX(this.content.style.width,33,false);

			this.content.appendChild(this.input);

			this.error = document.createElement('div');
			this.error.className += " ObjectSelector_Error";
			this.content.appendChild(this.error);

			this.container.appendChild(this.content);

			this.btn = document.createElement('div');
			this.btn.className += " ObjectSelector_btn";
			this.container.appendChild(this.btn);

			if (option.readOnly) {
				this.input.className += "  ObjectSelector_disabled";
				this.error.className += "  ObjectSelector_disabled";
				this.btn.className += "  ObjectSelector_disabled";
				this.input.setAttribute("disabled","disabled");
				this.error.setAttribute("disabled","disabled");
				this.btn.setAttribute("disabled","disabled");
			}

			this.ele.setAttribute("isQuery","0");
			this.ele.appendChild(this.container);

			bind(this.container,"click",function(e){
				//阻止事件冒泡
				if (e.cancelBubble) {
					//IE 兼容写法
					e.cancelBubble = true;
				}else{
					e.stopPropagation();
				}
			});

			//注册初始化绑定事件
			bind(this.input,"click",function(e){
				//先判断是否readOnly
				if (this.getAttribute("disabled")) {
					return;
				}
				// 统一窗体控制
				for (var i = 0; i < document.getElementsByClassName("ObjectSelector_Selection").length; i++) {
					document.getElementsByClassName("ObjectSelector_Selection")[i].style.display = "none";
				}
				//判断是否之前已经请求过数据
				if(checkIsQuery(self.ele)){
					//如果请求过数据了，直接取前端缓存数据控制显影
					self.sel_main.style.display = "block";
				}else{
					//没有请求过数据，则请求数据，然后再走 render
					//绘制基础窗体
					self.CreatBasicSelect();
				}


				// if (option.selectModle == "single") {
				// 	//如果是单选模式，选中input则清除input中的值和取值的data值
				// 	self.ele.setAttribute("data","");
				// 	self.input.value = "";
				// }
				//注册事件弹出层
			});

			bind(this.error,"click",function(){
				//先判断是否readOnly
				if (this.getAttribute("disabled")) {
					return;
				}
				// 统一窗体控制
				for (var i = 0; i < document.getElementsByClassName("ObjectSelector_Selection").length; i++) {
					document.getElementsByClassName("ObjectSelector_Selection")[i].style.display = "none";
				}
				//清除当前Input 和 隐藏data 中的值
				self.input.value = "";
				self.input.setAttribute("data","");
				if (self.sel_main) {
					for (var i = 0; i < self.lis.length; i++) {
						if (self.option.selectModle == "multi") {
							self.lis[i].getElementsByTagName("input")[0].checked = false ;
						}
					}
				}
				//判断是否之前已经请求过数据
				if(checkIsQuery(self.ele)){
					//如果请求过数据了，直接取前端缓存数据控制显影
					self.sel_main.style.display = "block";
				}else{
					//没有请求过数据，则请求数据，然后再走 render
					//绘制基础窗体
					self.CreatBasicSelect();
				}
			});

			bind(this.btn,"click",function(){
				//先判断是否readOnly
				if (this.getAttribute("disabled")) {
					return;
				}
				// 统一窗体控制
				for (var i = 0; i < document.getElementsByClassName("ObjectSelector_Selection").length; i++) {
					document.getElementsByClassName("ObjectSelector_Selection")[i].style.display = "none";
				}
				//判断是否之前已经请求过数据
				if(checkIsQuery(self.ele)){
					//如果请求过数据了，直接取前端缓存数据控制显影
					self.sel_main.style.display = "block";
				}else{
					//没有请求过数据，则请求数据，然后再走 render
					//绘制基础窗体
					self.CreatBasicSelect();
				}			
			});
		
		}
	}
	ObjectSelector.prototype.css = function(attr,val){
		if(val != undefined) this.ele.style[attr] = val;
		return this.ele.style[attr];
	}
	ObjectSelector.prototype.render = function(data){
		var self = this;
		self.data = isArray(data) ? data : [data];
		var hover_Width = self.option.selectModle == "single" ? countPX(self.ele.style.width,18,false) : countPX(self.ele.style.width,20,false) ;
		var ul = document.createElement('ul') , sli = [] ,  currentWidthPercent = (1 / (self.option.showName.length > 3 ? 3 : self.option.showName.length).toFixed(1));
		var showWidth = self.option.selectModle == "single" ? (hover_Width.substr(0,hover_Width.indexOf('px')) * currentWidthPercent)+ "px" : (hover_Width.substr(0,hover_Width.indexOf('px')) - 23) * currentWidthPercent + "px";
		self.data = self.data.map(function(item ,  index){
			li_Html = new Array();
			li_Html.push('<li data-index="'+index+'" data="'+item.id+'">');
			li_Html.push('<div class="ObjectSelector_item" style="width:'+hover_Width+'">');
			//根据长度动态判断每一列应显示长度
			if (self.option.selectModle == "multi") {
				li_Html.push('<input class="ObjectSelector_checkBox" type="checkbox" />');
			}
			//根据用户参数取值长度，动态设置显示值，最长取前三位
			for (var i = 0; i < self.option.showName.length; i++) {
				if (i==0) {
					li_Html.push('<div class="ObjectSelector_item_0" style="width:'+showWidth+';">'+item[self.option.showName[0]]+'</div>');
				}else if (i== 1) {
					li_Html.push('<div class="ObjectSelector_item_1" style="width:'+showWidth+';">'+item[self.option.showName[1]]+'</div>');
				}else{
					li_Html.push('<div class="ObjectSelector_item_2" style="width:'+showWidth+';">'+item[self.option.showName[2]]+'</div>');
				}
			}
			sli.push(li_Html.join(""));
			return item;
		});
		var fanalHtml = sli.join("");
		ul.innerHTML = fanalHtml;
		self.sel_cont_mid.appendChild(ul);
		self.lis  = ul.getElementsByTagName('li');
		//绑定事件
		bind(ul,'click',function(e){
			if(e.target.tagName === 'DIV'){
				//带回数据到页面，并绑定隐藏值到对应input框中
				//单选模式，推送一个值回去并绑定
				if (self.option.selectModle == "single") {
					self.input.value = e.target.parentNode.getElementsByTagName("div")[0].innerHTML;
					self.input.setAttribute("data",[e.target.parentNode.parentNode.getAttribute("data")]);
					self.sel_main.style.display = "none";
				}else{
					//多选模式下，前方勾选复选框
					var currentCheckedStatus = e.target.parentNode.getElementsByTagName("input")[0].checked;
					if (currentCheckedStatus == true) {
						e.target.parentNode.getElementsByTagName("input")[0].checked = false;
					}else{
						e.target.parentNode.getElementsByTagName("input")[0].checked = "checked";
					}
					


					// //点击确认，直接带回所有数值
					// self.input.value = e.target.parentNode.getElementsByTagName("div")[0].innerHTML;
					// self.input.setAttribute("data",[e.target.parentNode.parentNode.getAttribute("data")]);
				}
				
			}
		});

		// bind();
		
		
	}
	ObjectSelector.prototype.goto = function(index){
		if(this.index === index) return;
		if(this.index > -1){
			this.data[this.index].ele.style.display = 'none';
			this.lis[this.index].removeAttribute('focus');
		}
		this.data[index].ele.style.display = 'block';
		this.lis[index].setAttribute('focus','');
		this.index = index;
	}

	//根据选择类型，多选还是单选，绘制对应下拉选择的窗体
	ObjectSelector.prototype.CreatBasicSelect = function(){
		var self = this;
		//绘制前清除之前的窗体内容，重新绘制
		if (this.option.selectModle == "single") {
			//如果是单选模式
			this.sel_main = document.createElement('div');
			this.sel_main.className += " ObjectSelector_Selection";

			this.sel_arror = document.createElement('div');
			this.sel_arror.className += " ObjectSelector_Sel_Arror";
			this.sel_main.appendChild(this.sel_arror);

			this.sel_content = document.createElement('div');
			this.sel_content.className += " ObjectSelector_Sel_Content";

			this.sel_cont_mid = document.createElement('div');
			this.sel_cont_mid.className += " ObjectSelector_Sel_Middle";
			this.sel_content.appendChild(this.sel_cont_mid);
			this.sel_main.appendChild(this.sel_content);

			this.ele.appendChild(this.sel_main);

			bind(this.sel_main,"click",function(e){
				//阻止事件冒泡
				if (e.cancelBubble) {
					//IE 兼容写法
					e.cancelBubble = true;
				}else{
					e.stopPropagation();
				}
			});

			//中间还应该有一系列的数据查询和 loading控制
			//查询取到数据之后，还有一系列复杂的循环匹配，构造新的data
			//假如说已经构造完成，开始绘制页面了
			this.ele.setAttribute("isQuery","1");
			this.render(Person_demoData.body);

		}else{
			//如果是多选模式

			this.sel_main = document.createElement('div');
			this.sel_main.className += " ObjectSelector_Selection";

			this.sel_arror = document.createElement('div');
			this.sel_arror.className += " ObjectSelector_Sel_Arror";
			this.sel_main.appendChild(this.sel_arror);

			this.sel_content = document.createElement('div');
			this.sel_content.className += " ObjectSelector_Sel_Content";

			this.sel_cont_top = document.createElement('div');
			this.sel_cont_top.className += " ObjectSelector_Sel_Top";

			this.sel_cont_top_key = document.createElement('div');
			this.sel_cont_top_key.className += " ObjectSelector_Sel_Key";
			this.sel_cont_top_key.innerHTML = this.option.keyName == undefined ? "关键字：" : this.option.keyName;
			this.sel_cont_top.appendChild(this.sel_cont_top_key);

			this.sel_cont_top_input = document.createElement('input');
			this.sel_cont_top_input.className += " ObjectSelector_Sel_SearchInput";
			this.sel_cont_top_input.setAttribute("placeholder",this.option.placeholder == undefined ? "请输入查找内容" : this.option.placeholder);
			this.sel_cont_top_input.style.width = countPX(this.ele.style.width,140,false);
			this.sel_cont_top.appendChild(this.sel_cont_top_input);

			this.sel_cont_top_btn = document.createElement('div');
			this.sel_cont_top_btn.className += " ObjectSelector_Sel_SearchBtn";
			this.sel_cont_top_btn.innerHTML = "查找";
			this.sel_cont_top.appendChild(this.sel_cont_top_btn);
			this.sel_content.appendChild(this.sel_cont_top);

			this.sel_cont_mid = document.createElement('div');
			this.sel_cont_mid.className += " ObjectSelector_Sel_Middle";
			this.sel_content.appendChild(this.sel_cont_mid);

			this.sel_cont_btm = document.createElement('div');
			this.sel_cont_btm.className += " ObjectSelector_Sel_Buttom";

			this.sel_cont_btm_sub = document.createElement('div');
			this.sel_cont_btm_sub.className += " ObjectSelector_Sel_SubmitBtn";
			this.sel_cont_btm_sub.innerHTML = "确定";
			this.sel_cont_btm.appendChild(this.sel_cont_btm_sub);

			this.sel_cont_btm_can = document.createElement('div');
			this.sel_cont_btm_can.className += " ObjectSelector_Sel_CancelBtn";
			this.sel_cont_btm_can.innerHTML = "取消";
			this.sel_cont_btm.appendChild(this.sel_cont_btm_can);
			this.sel_content.appendChild(this.sel_cont_btm);
			this.sel_main.appendChild(this.sel_content);

			this.ele.appendChild(this.sel_main);

			bind(this.sel_main,"click",function(e){
				//阻止事件冒泡
				if (e.cancelBubble) {
					//IE 兼容写法
					e.cancelBubble = true;
				}else{
					e.stopPropagation();
				}
			});

			//确定按钮点击，返回推值到input框
			bind(this.sel_cont_btm_sub,"click",function(e){
				var inputVal = new Array() , dataVal = new Array();
				for (var i = 0; i < self.lis.length; i++) {
					if (self.lis[i].getElementsByTagName("input")[0].checked) {
						inputVal.push(self.lis[i].getElementsByClassName("ObjectSelector_item_0")[0].innerHTML);
						dataVal.push(self.lis[i].getAttribute("data"));
					}
				}
				self.input.value = inputVal.join(",");
				self.input.setAttribute("data",dataVal);

				//赋值完成关闭窗体
				self.sel_main.style.display = "none";

			});

			//取消按钮点击
			bind(this.sel_cont_btm_can,"click",function(e){
				//关闭窗体
				self.sel_main.style.display = "none";
			});

			//中间还应该有一系列的数据查询和 loading控制
			//查询取到数据之后，还有一系列复杂的循环匹配，构造新的data
			//假如说已经构造完成，开始绘制页面了
			this.ele.setAttribute("isQuery","1");
			this.render(Department_demoData.body);
		}
	}


	ObjectSelector.prototype.destroy = function()
	{
		this.ele = null;
		this.title = null;
		this.content = null;
		var item;
		while((item = this.data.pop()) ){
			item.ele = null;
			item = null;
		};

		//记得移除掉body上的事件

	}
	win.ObjectSelector = ObjectSelector;
})(this);




// var objectSelector = function(){

// 	//初始化控件
// 	init:function(){
		
		
// 	},

// 	//验证参数的有效性
// 	checkSetting : function(){
// 		//判断基础参数有没有

// 		//判断父级内容长度是否支撑绘制



// 	},

// 	//如果默认有值需要初始化进去，则初始化
// 	setInputValue:function(){
		
// 	},

// 	//获取当前的InputValue的值
// 	getInputValue:function(){
		
// 	},

// 	//清除控件值
// 	clearInputValue:function(){
		
// 	},

// 	//验证提交数据
// 	checkIsSubmit:function(){
		
// 	},


// };