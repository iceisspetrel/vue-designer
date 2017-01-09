define(function(require) {

	require('components/vObjectSelector/vObjectSelector.css');

	var Base = require('components/ComponentBase');

	//从initData中剥离出真实需要存储的value id 和 需要展示到input框中的  text
	//type 是 类型  当传入 value 时，取value id 用数组包裹返回
	//type 是 类型  当传入 showText 时，取展示文本 展示到 input中，用逗号隔开
	var getInitDataValue = function(initData,type,model){
		//先取各个键的内容，需要保障每一个 data的具体实例，其 键值对格式一致
		var keyArray = new Array();
		//再定义一个值，取显示的key， 剔除id
		var showArrayLength = 0;
		//设定如果有默认值的情况下，需要先展示到input文本中的值
		var showText = "";
		var showData = "";

		for(var key in initData[0])
		{
			keyArray.push(key);
		}
		//处理应展示的key内容，剔除id
		keyArray.remove("value");
		keyArray.remove("defaultChecked");
		//initData 是需要过滤的数据源
		//type 是标记当前这个需要剥离出来的，是value 还是 对应的显示值 text
		//model 是标记当前是 单选模式还是 多选模式，单选模式下，text和value只返回一条值，相当于这里做了容错处理，如果外面有配置多条也只记录回填一条数据
		var returnValue = new Array;
		for (var i = 0; i < initData.length; i++) {
			if (type == "text") {
				//如果是需要从 initData中剥离出 对应的 text值，则分是单选还是多选
				if (initData[i].defaultChecked) {
					if (model == "single") {
						//单选模式下，只返回对应的一条数据，以遍历的第一条为准
						return initData[i][keyArray[0]];
					}else if(model == "multi"){
						//多选模式下，往对应返回值中不断推送数据，并返回array后需要join一下
						returnValue.push(initData[i][keyArray[0]]);
					}
				}
			}else{
				//如果是需要从 initData中剥离出 对应的 默认value值，则直接往 数组中push值
				if (initData[i].defaultChecked) {
					if (model == "single") {
						//单选模式下，只返回对应的一条数据，以遍历的第一条为准
						return initData[i].value;
					}else if(model == "multi"){
						//多选模式下，往对应返回值中不断推送数据，并返回array后需要join一下
						returnValue.push(initData[i].value);
					}
				}

			}
		}
		if (model == "multi") {
			if (type == "text") {
				return returnValue.join(",");
			}else{
				return returnValue;
			}
		}
	};

	//判断当前的initData 是否为空
	var checkObjectEmpty  = function(obj){
		if (typeof obj === "object" && !(obj instanceof Array)){  
		    var hasProp = false;  
		    for (var prop in obj){  
		        hasProp = true;  
		        break;  
		    }  
		    return hasProp;  
		}  
	};

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

	//根据出入的ele，判断之前有没有 前端缓存数据，提高性能
	var checkIsQuery = function(dom){
		var hasData = false;
		if (dom.getAttribute("isQuery") == 1) {
			hasData = true;
		}
		return hasData;
	};

	//申明数组删除方法，删除对应值
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
		this.splice(index, 1);
		}
	};

	//数据筛选功能，只针对 第一列的数据进行筛选
	var dataFilter = function(dataVal,ele){
		// console.log("in dataFilter function");
		var afterFilter = new Array();
		var data = ele.config.initData;
		var keyArray = new Array();
		//再定义一个值，取显示的key， 剔除id
		for(var key in data[0])
		{
			keyArray.push(key);
		}
		//处理应展示的key内容，剔除id
		keyArray.remove("value");
		keyArray.remove("defaultChecked");
		for (var i = 0; i < data.length; i++) {
			if (data[i][keyArray[0]].indexOf(dataVal) >= 0) {
				afterFilter.push(data[i]);
			}
		}
		return afterFilter;
	};


	//根据已获取的符合绘制规范的数据集合，来绘制当前下拉内容
	//单选绘制
	var renderSingle = function(data,ele,isFirstCreat){
		if(typeof(ele.value) == "string"){
			ele.value = ele.value.split(",");
		}else if(typeof(ele.value) == "number"){
			ele.value = ele.value.toString().split(",")
		}
		if (isFirstCreat) {
			// console.log("isFirstCreat  141");
			//如果是第一次绘制，先直接绘制整体面板
			//先取各个键的内容，需要保障每一个 data的具体实例，其 键值对格式一致
			var keyArray = new Array();
			//再定义一个值，取显示的key， 剔除id
			var showArrayLength = 0;
			//设定如果有默认值的情况下，需要先展示到input文本中的值
			var showText = "";
			var showData = "";

			for(var key in data[0])
			{
				keyArray.push(key);
			}
			//处理应展示的key内容，剔除id
			keyArray.remove("value");
			keyArray.remove("defaultChecked");
			showArrayLength = keyArray.length;
			//处理每一列的应展示宽度 的变量
			var hover_Width = ele.config.SelectModel == "single" ? countPX($(ele.$el).parent().css("width"),18,false) : countPX($(ele.$el).parent().css("width"),15,false) ;
			var currentWidthPercent = 1;
			var showWidth = ele.config.SelectModel == "single" ? (hover_Width.substr(0,hover_Width.indexOf('px')) * currentWidthPercent)+ "px" : (hover_Width.substr(0,hover_Width.indexOf('px')) - 34 - (showArrayLength-1)*5) * currentWidthPercent + "px";
			var marginTop = (parseInt($(ele.$el).css("height").substr(0,$(ele.$el).css("height").indexOf('px'))) + 5)+'px';

			//开始绘制
			var selectHtml = new Array();
			selectHtml.push('<div class="ObjectSelector_Selection" style="margin-top:'+marginTop+'; opacity:'+ele.config.pannelOpacity+'; width:'+$(ele.$el).parent().css("width")+';">');
	        selectHtml.push('<span class="ObjectSelector_Triangle">▲</span>');
	        selectHtml.push('<div class="ObjectSelector_ErrorMsg"></div>');
	        selectHtml.push('<div class="ObjectSelector_Middle">');
	        selectHtml.push('<ul>');

	        for (var i = 0; i < data.length; i++) {
	        	selectHtml.push('<li data-index="'+i+'" data="'+data[i].value+'">');
	        	selectHtml.push('<div class="ObjectSelector_item" style="width:'+hover_Width+'">');
	        	//循环过程中监听是否有默认选中，如果有，则绘制影响父级
				if (data[i].defaultChecked) {
					//默认取第一个属性值做展示
					showText = data[i][keyArray[0]];
					showData = data[i].value;
					ele.value.push(data[i].value);
				}
				selectHtml.push('<div class="ObjectSelector_item_0" title="'+data[i][keyArray[0]]+'" style="width:'+showWidth+';">'+data[i][keyArray[0]]+'</div>');
				selectHtml.push('</li>');
	        }
	        selectHtml.push('</ul>');
	        selectHtml.push('</div>');
	        selectHtml.push('</div>');

	        selectHtml = selectHtml.join('');
	        //添加之前，先清空当前的追加content内容
	        $(ele.$el).parent().find(".ObjectSelector_Selection").remove();
	        $(ele.$el).after(selectHtml);
	        //如果有默认选中值，则向上影响Input文本框的展示
	        $(ele.$el).find(".ObjectSelector_Input").val(showText);
	        $(ele.$el).find(".ObjectSelector_Input").attr("data",showData);
	        ele.oldText = showText;
	        // ele.value.push(showData);

	        $(ele.$el).parent().find('.ObjectSelector_Middle').loadScroll();
	        //  //注册Scroller
	        // var vm = new Vue({
	        // 	el : $(ele.$el).parent().find('.ObjectSelector_Selection')[0],
	        // 	data : {
	        // 		options : {

	        // 		}
	        // 	}
	        // });
		}else{
			//之后的逻辑操作和重绘，直接只影响 中间  ObjectSelector_Middle 的HTML，用户不体验到整体面板反复绘制，提高用户体验
			if(data && data[0]){
				// console.log("creat new list  211");
				//如果当前传入的有值，则绘制
				//先取各个键的内容，需要保障每一个 data的具体实例，其 键值对格式一致
				var keyArray = new Array();
				//再定义一个值，取显示的key， 剔除id
				var showArrayLength = 0;
				//设定如果有默认值的情况下，需要先展示到input文本中的值
				var showText = "";
				var showData = "";

				for(var key in data[0])
				{
					keyArray.push(key);
				}
				//处理应展示的key内容，剔除id
				keyArray.remove("value");
				keyArray.remove("defaultChecked");
				showArrayLength = keyArray.length;
				//处理每一列的应展示宽度 的变量
				var hover_Width = ele.config.SelectModel == "single" ? countPX($(ele.$el).parent().css("width"),18,false) : countPX($(ele.$el).parent().css("width"),15,false) ;
				var currentWidthPercent = 1;
				var showWidth = ele.config.SelectModel == "single" ? (hover_Width.substr(0,hover_Width.indexOf('px')) * currentWidthPercent)+ "px" : (hover_Width.substr(0,hover_Width.indexOf('px')) - 34 - (showArrayLength-1)*5) * currentWidthPercent + "px";

				//开始绘制
				var selectHtml = new Array();
				selectHtml.push('<ul>');

				var needClean = true;

		        for (var i = 0; i < data.length; i++) {
		        	selectHtml.push('<li data-index="'+i+'" data="'+data[i].value+'">');
		        	selectHtml.push('<div class="ObjectSelector_item" style="width:'+hover_Width+'">');
					selectHtml.push('<div class="ObjectSelector_item_0" title="'+data[i][keyArray[0]]+'" style="width:'+showWidth+';">'+data[i][keyArray[0]]+'</div>');
					selectHtml.push('</li>');
					//根据用户输入的值，到原始initData中做匹配，如果原来就有这个值，则自动绑定data，如果没有，则对应data标记为 0，作为新增
		        	for (var j = 0; j < ele.config.afterQueryData.length; j++) {
		        		if (ele.config.afterQueryData[j][keyArray[0]] == ele.oldText) {
		        			ele.value[0] = data[i].value;
		        			$(ele.$el).find(".ObjectSelector_Input").attr("data",data[i].value);
		        			needClean = false;
		        		}
		        		//如果全部匹配下来都没有对应的值，则需要清除 对应的 data 内容,避免影响
		        	}
		        }
		        if (needClean) {
		        	ele.value = new Array();
		        	$(ele.$el).find(".ObjectSelector_Input").attr("data","");
		        }
		        selectHtml.push('</ul>');
		        selectHtml = selectHtml.join('');
		        $(ele.$el).parent().find(".ObjectSelector_Middle").html("");
	        	$(ele.$el).parent().find(".ObjectSelector_Middle").html(selectHtml);
			}else{
				// console.log("no data");
				$(ele.$el).find(".ObjectSelector_Input").attr("data","");
				ele.value = new Array();
				//改变中间部分的HTML，提示暂无数据
				var selectHtml = new Array();
				selectHtml.push('<div class="errorInfoContent" style="text-align:center;font-size:23px;color:#D4D4D4;line-height:170px;width:100%;">');
				selectHtml.push('<span class="errorIcon glyphicon glyphicon-exclamation-sign"></span>');
				selectHtml.push('<span class="errorMsg" style="margin-left:20px;">暂无数据<span>');
		        selectHtml.push('</div>');
		        selectHtml = selectHtml.join('');
		        $(ele.$el).parent().find(".ObjectSelector_Middle").html("");
	        	$(ele.$el).parent().find(".ObjectSelector_Middle").html(selectHtml);
			}

			//事件委托
			$(ele.$el).parent().find(".ObjectSelector_Middle").find("li").on("click",function(e){
				// console.log("in 223");
				if (ele.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，多重控制
					if(ele.config.SelectModel == "single"){
						if (e.target.nodeName == "LI") {
							return;
						}
						//如果出现点击到了 每一个item容器的那 1px 的 border
						if(e.target.getAttribute("class") == "ObjectSelector_item"){
							return;
						}
						//先判断是单选还是多选，单选的话，取当前li的数据id 和 名称、展示到selector的外层input中，并赋值对应 data和 当前value，关闭选择框
						ele.value = e.target.parentNode.parentNode.getAttribute("data");
						$(ele.$el).find(".ObjectSelector_Input").attr("data",e.target.parentNode.parentNode.getAttribute("data"));
						$(ele.$el).find(".ObjectSelector_Input").val(e.target.parentNode.getElementsByTagName("div")[0].innerHTML);	
						ele.oldText = 	e.target.parentNode.getElementsByTagName("div")[0].innerHTML;
						ele.value = e.target.parentNode.parentNode.getAttribute("data")
						//赋值完成关闭窗体
						$(ele.$el).parent().find(".ObjectSelector_Selection").hide('normal');

						//触发 onSelect 事件，外抛给业务线
						ele.config.onChange && ele.config.onChange();

					}else if(ele.config.SelectModel =="multi"){
						if (e.target.type == "checkbox" || e.target.nodeName == "LI") {
							return;
						}
						//如果是多选的情况下，取当前li前面checkbox，设置勾选选中情况
						var currentCheckedStatus = e.target.parentNode.getElementsByTagName("input")[0].checked;
						if (currentCheckedStatus == true) {
							e.target.parentNode.getElementsByTagName("input")[0].checked = false;
						}else{
							e.target.parentNode.getElementsByTagName("input")[0].checked = "checked";
						}
					}
				}
			});
		}
	};
	
	//根据已获取的符合绘制规范的数据集合，来绘制当前下拉内容
	//多选绘制
	//代码自动判断下面列应该绘制多宽、自动获取initData中的 键key，只需要满足有id就行了，其他随意乱写
	var renderMulti = function(data,ele,isFirstCreat){
		//由于数据结构有所不同，所以需要先遍历整体数据，判断整体是一条数据还是两条数据还是三条，哪怕有一个数据里面有，都需要绘制
		//如果需要绘制，则需要 for循环 嵌套 for in 来做，太消耗性能
		//看能否和后端同学商量一致，保障第一个数值是全量的key 或者  回填的返回值中，每一个对象都是 全量的key，只不过 值为“”

		// var countData = {};
		// if (data && data[0]) {
		// 	for (var g = 0; g < data.length; g++) {
		// 		if (g==0) {
		// 			if (data[g]) {

		// 			}
		// 		}else if(g==1){
		// 			if (data[g]) {

		// 			}
		// 		}else if(g==2){
		// 			if (data[g]) {

		// 			}
		// 		}
		// 	}
		// }

		if(typeof(ele.value) == "string"){
			ele.value = ele.value.split(",");
		}else if(typeof(ele.value) == "number"){
			ele.value = ele.value.toString().split(",")
		}

		if (isFirstCreat) {
			// console.log("in 351 isFirstCreat multi");
			//如果是第一次绘制，先直接绘制整体面板
			//先取各个键的内容，需要保障每一个 data的具体实例，其 键值对格式一致
			var keyArray = new Array();
			//再定义一个值，取显示的key， 剔除id
			var showArrayLength = 0;
			//设定如果有默认值的情况下，需要先展示到input文本中的值
			var showText = new Array();
			var showData = new Array();

			//现在的for in 取法，是取的 data的 第零条数据
			for(var key in data[0])
			{
				keyArray.push(key);
			}
			//处理应展示的key内容，剔除id
			keyArray.remove("value");
			keyArray.remove("defaultChecked");
			showArrayLength = keyArray.length;
			//处理每一列的应展示宽度 的变量
			
			var hover_Width = ele.config.SelectModel == "single" ? countPX($(ele.$el).parent().css("width"),18,false) : countPX($(ele.$el).parent().css("width"),15,false) ;
			var currentWidthPercent = (1 / (showArrayLength > 3 ? 3 : showArrayLength).toFixed(1));
			var showWidth = ele.config.SelectModel == "single" ? (hover_Width.substr(0,hover_Width.indexOf('px')) * currentWidthPercent)+ "px" : (hover_Width.substr(0,hover_Width.indexOf('px')) - 34 - (showArrayLength-1)*5) * currentWidthPercent + "px";
			var eachBtnMargin = (($(ele.$el).parent().css("width").substr(0,hover_Width.indexOf('px')) - 120)/3).toFixed(1);
			var inputWidth = ($(ele.$el).parent().css("width").substr(0,hover_Width.indexOf('px')) - 60).toFixed(1);
			var marginTop = (parseInt($(ele.$el).css("height").substr(0,$(ele.$el).css("height").indexOf('px'))) + 5)+'px';			
			var selectHtml = new Array();
			selectHtml.push('<div class="ObjectSelector_Selection" style="margin-top:'+marginTop+'; opacity:'+ele.config.pannelOpacity+' ;width:'+$(ele.$el).parent().css("width")+';">');
	        selectHtml.push('<span class="ObjectSelector_Triangle">▲</span>');
	        selectHtml.push('<div class="ObjectSelector_ErrorMsg"></div>');
	        selectHtml.push('<div class="ObjectSelector_Top">');
	        // selectHtml.push('<div class="ObjectSelector_Key">'+ele.config.keyName+'</div>');
	        selectHtml.push('<input class="ObjectSelector_SearchInput" placeHolder="'+ele.config.placeHolder+'" style="width:'+inputWidth+'px;" />');
	        selectHtml.push('<div class="ObjectSelector_SearchBtn"><span class="glyphicon glyphicon-search"></span></div>');
	        selectHtml.push('</div>');
	        selectHtml.push('<div class="ObjectSelector_Middle">');
	        selectHtml.push('<ul>');
	        // console.log(data);
	        // console.log(data.length);
	        // debugger;
	        for (var i = 0; i < data.length; i++) {
	        	selectHtml.push('<li data-index="'+i+'" data="'+data[i].value+'">');
	        	selectHtml.push('<div class="ObjectSelector_item" style="width:'+hover_Width+'">');
	        	//循环过程中监听是否有默认选中，如果有，则绘制影响父级
				if (data[i].defaultChecked) {
					selectHtml.push('<input class="ObjectSelector_checkBox" type="checkbox" checked="checked" />');
					//默认取第一个属性值做展示
					showText.push(data[i][keyArray[0]]);
					showData.push(data[i].value);
					ele.value.push(data[i].value);
				}else{
	        		selectHtml.push('<input class="ObjectSelector_checkBox" type="checkbox" />');
	        	}
	        	//根据用户参数取值长度，动态设置显示值，最长取前三位
				for (var j = 0; j < showArrayLength; j++) {
					if (j==0) {
						selectHtml.push('<div class="ObjectSelector_item_0" title="'+data[i][keyArray[0]]+'" style="width:'+showWidth+';">'+data[i][keyArray[0]]+'</div>');
					}else if (j== 1) {
						selectHtml.push('<div class="ObjectSelector_item_1" title="'+data[i][keyArray[1]]+'" style="width:'+showWidth+';">'+data[i][keyArray[1]]+'</div>');
					}else{
						selectHtml.push('<div class="ObjectSelector_item_2" title="'+data[i][keyArray[2]]+'" style="width:'+showWidth+';">'+data[i][keyArray[2]]+'</div>');
					}
				}
				selectHtml.push('</li>');
	        }
	        selectHtml.push('</ul>');
	        selectHtml.push('</div>');
	        selectHtml.push('<div class="ObjectSelector_Buttom">');
	        selectHtml.push('<div class="ObjectSelector_SubmitBtn" style="margin-left:'+eachBtnMargin+'px;">确定</div>');
	        selectHtml.push('<div class="ObjectSelector_CancelBtn" style="margin-left:'+eachBtnMargin+'px;">取消</div>');		
	        selectHtml.push('</div>');
	        selectHtml.push('</div>');

	        selectHtml = selectHtml.join('');
	        $(ele.$el).after(selectHtml);
	        //如果有默认选中值，则向上影响Input文本框的展示
	        $(ele.$el).find(".ObjectSelector_Input").val(showText.join(","));
	        $(ele.$el).find(".ObjectSelector_Input").attr("data",showData.join(","));
	        ele.oldText = showText.join(",");
	        // ele.value.push(showData.join(","));
	        // debugger;

	        $(ele.$el).parent().find('.ObjectSelector_Middle').loadScroll();

	        // //注册Scroller
	        // var vm = new Vue({
	        // 	el : $(ele.$el).parent().find('.ObjectSelector_Selection')[0],
	        // 	data : {
	        // 		options : {
	        			
	        // 		}
	        // 	}
	        // });
		}
		else{
			//之后的逻辑操作和重绘，直接只影响 中间  ObjectSelector_Middle 的HTML，用户不体验到整体面板反复绘制，提高用户体验
			if(data && data[0]){
				// console.log("creat new list  445");
				//如果当前传入的有值，则绘制
				//先取各个键的内容，需要保障每一个 data的具体实例，其 键值对格式一致
				var keyArray = new Array();
				//再定义一个值，取显示的key， 剔除id
				var showArrayLength = 0;
				//设定如果有默认值的情况下，需要先展示到input文本中的值
				var showText = "";
				var showData = "";

				for(var key in data[0])
				{
					keyArray.push(key);
				}
				//处理应展示的key内容，剔除id
				keyArray.remove("value");
				keyArray.remove("defaultChecked");
				showArrayLength = keyArray.length;
				//处理每一列的应展示宽度 的变量
				var hover_Width = ele.config.SelectModel == "single" ? countPX($(ele.$el).parent().css("width"),18,false) : countPX($(ele.$el).parent().css("width"),15,false) ;
				var currentWidthPercent = (1 / (showArrayLength > 3 ? 3 : showArrayLength).toFixed(1));
				var showWidth = ele.config.SelectModel == "single" ? (hover_Width.substr(0,hover_Width.indexOf('px')) * currentWidthPercent)+ "px" : (hover_Width.substr(0,hover_Width.indexOf('px')) - 34 - (showArrayLength-1)*5) * currentWidthPercent + "px";

				//开始绘制
				var selectHtml = new Array();
				var currentValue = new Array();

				var currentValue = $(ele.$el).parent().find(".ObjectSelector_Input").attr("data").split(",");
				selectHtml.push('<ul>');

		        for (var i = 0; i < data.length; i++) {
		        	selectHtml.push('<li data-index="'+i+'" data="'+data[i].value+'">');
		        	selectHtml.push('<div class="ObjectSelector_item" style="width:'+hover_Width+'">');
		        	var needChecked = false;
		        	for (var g = 0; g < currentValue.length; g++) {
		        		if (data[i].value == currentValue[g]) {
		        			needChecked = true;
		        		}
		        	}

		        	if (needChecked) {
		        		selectHtml.push('<input class="ObjectSelector_checkBox" type="checkbox" checked="checked" />');
		        	}else{
		        		selectHtml.push('<input class="ObjectSelector_checkBox" type="checkbox" />');
		        	}
		        	//根据用户参数取值长度，动态设置显示值，最长取前三位
					for (var j = 0; j < showArrayLength; j++) {
						if (j==0) {
							selectHtml.push('<div class="ObjectSelector_item_0" title="'+data[i][keyArray[0]]+'" style="width:'+showWidth+';">'+data[i][keyArray[0]]+'</div>');
						}else if (j== 1) {
							selectHtml.push('<div class="ObjectSelector_item_1" title="'+data[i][keyArray[1]]+'" style="width:'+showWidth+';">'+data[i][keyArray[1]]+'</div>');
						}else{
							selectHtml.push('<div class="ObjectSelector_item_2" title="'+data[i][keyArray[2]]+'" style="width:'+showWidth+';">'+data[i][keyArray[2]]+'</div>');
						}
					}
					selectHtml.push('</li>');
		        }
		        
		        selectHtml.push('</ul>');
		        selectHtml = selectHtml.join('');
		        $(ele.$el).parent().find(".ObjectSelector_Middle").html("");
	        	$(ele.$el).parent().find(".ObjectSelector_Middle").html(selectHtml);

	        	//事件委托
			$(ele.$el).parent().find(".ObjectSelector_Middle").find("li").on("click",function(e){
				// console.log("in 652");
				if (ele.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，多重控制
					if (e.target.type == "checkbox" || e.target.nodeName == "LI") {
						return;
					}
					//如果是多选的情况下，取当前li前面checkbox，设置勾选选中情况
					var currentCheckedStatus = e.target.parentNode.getElementsByTagName("input")[0].checked;
					if (currentCheckedStatus == true) {
						e.target.parentNode.getElementsByTagName("input")[0].checked = false;
					}else{
						e.target.parentNode.getElementsByTagName("input")[0].checked = "checked";
					}
				}
			});


			}else{
				//改变中间部分的HTML，提示暂无数据
				var selectHtml = new Array();
				selectHtml.push('<div class="errorInfoContent" style="text-align:center;font-size:23px;color:#D4D4D4;line-height:170px;width:100%;">');
				selectHtml.push('<span class="errorIcon glyphicon glyphicon-exclamation-sign"></span>');
				selectHtml.push('<span class="errorMsg" style="margin-left:20px;">暂无数据<span>');
		        selectHtml.push('</div>');
		        selectHtml = selectHtml.join('');
		        $(ele.$el).parent().find(".ObjectSelector_Middle").html("");
	        	$(ele.$el).parent().find(".ObjectSelector_Middle").html(selectHtml);
			}
		}
	};

	//根据已获取的配置的url或者initData，来实例化vTree组件 来控制
	//树形多选
	var renderTreeMulti = function(data,ele,url,isFirstCreat){
		
	};

	Base.extend({

		name: 'vObjectSelector',

		props: ['id', 'config'],

		template: [
            '<div class="ObjectSelector_Container" :style="containerStyle">',
	    		'<div :style="inputStyle" class="ObjectSelector_Input" v-if="isEdit" title="{{placeHolder}}" v-on:click="toggelSelectList">{{placeHolder}}</div>',
	    		'<template v-else>', 
	    		'<input v-if="isSingle" v-on:focus="focusInput" v-on:blur="blurInput" v-on:keyUp="keyUpInput" class="ObjectSelector_Input" data="" :style="inputStyle" placeHolder="{{placeHolder}}" type="text" v-model="showText" disabled="{{readonly}}">',
	    		'<input v-else v-on:click="toggelSelectList" class="ObjectSelector_Input" :style="inputStyle" data="" placeHolder="{{placeHolder}}" type="text" v-model="showText" readonly="readonly">',
	    		'</template>',
            	'<div class="ObjectSelector_btn glyphicon glyphicon-th-list" style="top:0;" :style="errorStyle" v-on:click="toggelSelectList" ></div>',
            	'<div class="ObjectSelector_Error glyphicon glyphicon-remove-circle" :style="errorStyle" v-on:click="cleanSelect"></div>',
            '</div>',
  		].join(''),

		options : {
			ele: "",
			tableName: "",
			showName: [""], //ObjectSelector 可以有最多三个showName
			value : new Array(),
			height : 26,
			sefonSql: [null], //对应，就需要有最多三个 sefonSql
			initData: [], //默认 初始化值，可以不填写
			afterQueryData : [],
			textAlgin  : 'left', //默认文字对齐方式  left | center | right
			fontSize   : '12', //默认字体大小
			fontWeight : 'normal', //默认字体粗细  normal | bold
			modelType  : 'normal', //默认状态、表单申明状态下默认normal
			placeHolder: "请选择", //默认提示语，没有值的情况下存在
			zIndex     : 1, //默认z-index层级
			SelectModel:'single', //组件需要采用哪种选择模式，默认为 单选 ，提供 多选multi 树选treeMulti
			maxSelect : 10, //选填，最多选择多少个值，值尽量控制在 1~10 区间内，与表单设计器相对应
			minSelect : 1, //选填，至少需要选择多少个值
			keyName :"关键字：", //选填，定义多选模式下，搜索标题，不填时，默认为：   关键字：
			color      : '#000000', //默认字体颜色
			required : 1,  //默认组件是必填的，必须有值才能提交
			pannelOpacity:'1', //默认选择面板的透明度，默认为 1 
			onChange    : function(e){ //点击事件、此事件只在 normal状态时时执行
			},
			onKeyUp : function(e){ //input文本框 keyUp事件外抛，此事件只在 normal状态时时执行
			},
			onClean : function(e){ //清除按钮点击事件 ，此事件只在 normal状态时时执行
			}
		},

		compiled: function() {

		},
		data: function() { // 这里是全局属性
			return {
				placeHolder: this.config.placeHolder || "请选择",
				value: this.config.initData != undefined ? getInitDataValue(this.config.initData,"value",this.config.SelectModel) : new Array(),
				readonly: this.config.modelType == 'readOnly' ? "disabled" : false ,
				isEdit: this.config.modelType == "edit",
				isSingle:this.config.SelectModel == "single",
				// isEdit: false,
				oldText : this.config.initData != undefined ? getInitDataValue(this.config.initData,"text",this.config.SelectModel) : "",
				name: this.config.name,
				initData : this.config.initData,
				pannelOpacity:this.config.pannelOpacity || 1,
				keyName:this.config.keyName || "关键字：",
				minSelect:this.config.minSelect || 1,
				maxSelect : this.config.maxSelect || 10,
				SelectModel:this.config.SelectModel || "single",
				modelType:this.config.modelType || "normal",
				showText: this.config.initData != undefined ? getInitDataValue(this.config.initData,"text",this.config.SelectModel) : "",
				afterQueryData : [],
				required:this.config.required || 1,
				validMsg:this.config.validMsg || "必填！",
				containerStyle: {
					width: this.config.width ?  (this.config.width + 'px') : "100%",
					height: (this.config.height || 26) + 'px',
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'z-index': this.config.zIndex || 1
				},
				inputStyle: {
					width: (this.config.width - 54 || 108) + 'px',
					height: (this.config.height < 26 ? 26 : this.config.height) + 'px',
					'line-height': (this.config.height < 26 ? 26 : this.config.height) + 'px',
					'font-size': (this.config.fontSize || 12) + 'px',
					'font-weight': this.config.fontWeight || "normal",
					cursor: this.config.modelType == 'readonly' ? 'not-allowed' : 'pointer',
					'text-align': this.config.textAlgin || 'left',
					color: this.config.color || '#555555'
				},
				errorStyle:{
					height: ((this.config.height < 26 ? 26 : (this.config.height-2)) || 26) + 'px',
					'line-height': ((this.config.height < 26 ? 26 : (this.config.height-2)) || 26) + 'px'
				}
				// ,isOpen : false
			};
		},
		watch: {
			'config.placeHolder': function(newValue, oldVaule) {
				this.placeHolder = newValue;
			},
			'config.fontSize': function(newValue) {
				this.inputStyle['font-size'] = newValue + 'px';
			},
			'config.height': function(newValue) {
				if (newValue < 26) {
					this.config.height = 26;
				}
				this.containerStyle.height = newValue + 'px';
				this.inputStyle.height = newValue + 'px';
				this.inputStyle['line-height'] = newValue + 'px';
				this.errorStyle.height = (newValue-2) + 'px';
				this.errorStyle['line-height'] = (newValue-2) + 'px';
			},
			'config.width': function(newValue) {
				//控制最小绘制宽度，保障样式完整性
				if (newValue < 230) {
					this.config.width = 230;
				}
				this.containerStyle.width = newValue + 'px';
				this.inputStyle.width = (newValue - 54) + 'px';
			},
			'config.fontWeight': function(newValue) {
				this.inputStyle['font-weight'] = newValue;
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
				//initData是一种 默认推送对象，需要符合一定的数据格式才行

			},
			'config.textAlgin' : function(newValue){

			},
			'config.maxSelect' : function(newValue){

			},
			'config.minSelect' : function(newValue){

			},
			'config.keyName' : function(newValue){

			},
			'config.pannelOpacity' : function(newValue){

			},
			'config.zIndex': function(newValue) {
				this.containerStyle['z-index'] = newValue
			},
			'config.name': function(newValue) {
				this.name = newValue;
			}
		},
		ready: function() {
			//根据父容器宽度绘制容器宽度，不能用百分比来表示
			var eleWidth = $(this.$el).parent().css("width");
			var self = this;
			var inputWidth = eleWidth =="0px" ? "100%": ((parseInt(eleWidth.substr(0,eleWidth.indexOf('px'))) - 54)+'px');
			//即刻计算改变input的宽度
			$(this.$el).find(".ObjectSelector_Input").css("width",inputWidth);

			//拿到初始值或数据库查询的数据去绘制列表
			var data = new Array();
			if (this.config.tableName) {
				//如果initData和 table数据绑定方式都存在，优先以数据绑定为主

				//这句话的作用在于，记忆原始数据源，如果是数据库查询出来的，则以此为准，如果是InitData有配置，则赋值initData;
				this.config.afterQueryData = data;

				//当父级dom绘制完成后
				if (this.config.modelType == "normal") {
					//根据tableName 和 showName 去请求数据库
					//当有数据集并且已构造成可绘制的样子后，在回调里面再去判断什么模式
					if (self.config.SelectModel == "single") {
						renderSingle(data,this,true);
					}else if(self.config.SelectModel == "multi"){
						renderMulti(data,this,true);
					}else if(self.config.SelectModel == "treeMulti"){
						renderTreeMulti(data,this,"",true);
					}
				}
			}else if(this.config.initData && this.config.initData[0]){
				//根据initData来绘制列表
				//这句话的作用在于，记忆原始数据源，如果是数据库查询出来的，则以此为准，如果是InitData有配置，则赋值initData;
				this.config.afterQueryData = this.config.initData;

				//当父级dom绘制完成后
				if (this.config.modelType == "normal") {
					//根据initData 直接改造
					data = this.config.initData;
					//当有数据集并且已构造成可绘制的样子后，逻辑判断绘制
					if (self.config.SelectModel == "single") {
						renderSingle(data,this,true);
					}else if(self.config.SelectModel == "multi"){
						renderMulti(data,this,true);
					}else if(self.config.SelectModel == "treeMulti"){
						renderTreeMulti(data,this,"",true);
					}
				}
			}

			//事件委托
			$(this.$el).parent().find(".ObjectSelector_Middle").find("li").on("click",function(e){
				// console.log("in 652");
				if (self.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，多重控制
					if(self.config.SelectModel == "single"){
						if (e.target.nodeName == "LI") {
							return;
						}
						//如果出现点击到了 每一个item容器的那 1px 的 border
						if(e.target.getAttribute("class") == "ObjectSelector_item"){
							return;
						}
						//先判断是单选还是多选，单选的话，取当前li的数据id 和 名称、展示到selector的外层input中，并赋值对应 data和 当前value，关闭选择框
						self.value = e.target.parentNode.parentNode.getAttribute("data");
						$(self.$el).find(".ObjectSelector_Input").attr("data",e.target.parentNode.parentNode.getAttribute("data"));
						$(self.$el).find(".ObjectSelector_Input").val(e.target.parentNode.getElementsByTagName("div")[0].innerHTML);	
						self.oldText = 	e.target.parentNode.getElementsByTagName("div")[0].innerHTML;
						self.value = e.target.parentNode.parentNode.getAttribute("data")
						//赋值完成关闭窗体
						$(self.$el).parent().find(".ObjectSelector_Selection").hide('normal');

						//触发 onSelect 事件，外抛给业务线
						self.config.onChange && self.config.onChange();

					}else if(self.config.SelectModel =="multi"){
						if (e.target.type == "checkbox" || e.target.nodeName == "LI") {
							return;
						}
						//如果是多选的情况下，取当前li前面checkbox，设置勾选选中情况
						var currentCheckedStatus = e.target.parentNode.getElementsByTagName("input")[0].checked;
						if (currentCheckedStatus == true) {
							e.target.parentNode.getElementsByTagName("input")[0].checked = false;
						}else{
							e.target.parentNode.getElementsByTagName("input")[0].checked = "checked";
						}
					}
				}
			});

			//多选情况下，确认按钮事件注册
			$(this.$el).parent().find(".ObjectSelector_SubmitBtn").on("click",function(){
				if (self.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，多重控制
					if (self.config.SelectModel == "multi") {
						//如果是多选模式,取当前面板中选中项目，并赋值影响当前变量value
						var inputVal = new Array() , dataVal = new Array(),lis = $(self.$el).parent().find("li");
						for (var i = 0; i < lis.length; i++) {
							if (lis[i].getElementsByTagName("input")[0].checked) {
								inputVal.push(lis[i].getElementsByClassName("ObjectSelector_item_0")[0].innerHTML);
								dataVal.push(lis[i].getAttribute("data"));
							}
						}
						$(self.$el).find(".ObjectSelector_Input").val(inputVal.join(","));
	        			$(self.$el).find(".ObjectSelector_Input").attr("data",dataVal.join(","));
	        			self.value = dataVal;
	        			self.oldText = inputVal.join(",");
	        			//触发 onSelect 事件，外抛给业务线
						self.config.onChange && self.config.onChange();
					}else{
						//如果是树形多选模式


					}

					//赋值完成关闭窗体
					$(self.$el).parent().find(".ObjectSelector_Selection").hide('normal');
				}
			});

			//多选情况下，取消按钮事件注册
			$(this.$el).parent().find(".ObjectSelector_CancelBtn").on("click",function(){
				if (self.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，多重控制
					// self.isOpen = false;
					$(self.$el).parent().find(".ObjectSelector_Selection").hide('normal');
				}
			});


			//多选情况下，面板中的搜索按钮事件注册
			$(this.$el).parent().find(".ObjectSelector_SearchBtn").on("click",function(e){
				if (self.config.modelType == "normal") {
					//只有在normal情况下，接受点击事件，执行搜索
					var SearchInputVal = $(self.$el).parent().find(".ObjectSelector_SearchInput").val();
					// debugger;
					//根据当前的值，重新遍历绘制data，然后重新调用绘制方法
					var AfterFilterData = dataFilter(SearchInputVal,self);
					if(self.config.SelectModel == "multi"){
						renderMulti(AfterFilterData,self,false);
					}
				}
			});


			$(this.$el).parent().find(".ObjectSelector_Selection").on("click",function(){
				//阻止事件冒泡
				if (event.cancelBubble) {
					//IE 兼容写法
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
			});


			if (!window.ObjectSelectorRegClick) {
				//document事件绑定
				if (document.attachEvent)//ie浏览器
	            {
	                document.attachEvent("onclick",function(e){
						var targetClassName = e.target.getAttribute("class");
						// debugger;
						if (targetClassName == "ObjectSelector_Input" || targetClassName == "ObjectSelector_Container" || targetClassName == "ObjectSelector_btn") {
							return;
						}
					　　var windowBox = document.getElementsByClassName("ObjectSelector_Selection");
						for (var i = 0; i < windowBox.length; i++) {
							$(windowBox[i]).hide('normal');
							// $(windowBox[i]).parent().find("span").attr("class","glyphicon glyphicon-chevron-down");
						}
						var errorMsgBox = document.getElementsByClassName("ObjectSelector_ErrorMsg")
						for (var j = 0; j < errorMsgBox.length; j++) {
							$(errorMsgBox[j]).hide('normal');
						}
					});
					//注册window对象，标记防止事件多次注册
					window.ObjectSelectorRegClick = true;
	            }
	            else if (document.addEventListener) //非ie浏览器
	            {
	                document.addEventListener("click",function(e){
						var targetClassName = e.target.getAttribute("class");
						if (targetClassName == "ObjectSelector_Input" || targetClassName == "ObjectSelector_Container" || targetClassName == "ObjectSelector_btn") {
							return;
						}
					　　var windowBox = document.getElementsByClassName("ObjectSelector_Selection");
						for (var i = 0; i < windowBox.length; i++) {
							$(windowBox[i]).hide('normal');
							// $(windowBox[i]).parent().find("span").attr("class","glyphicon glyphicon-chevron-down");
						}
						var errorMsgBox = document.getElementsByClassName("ObjectSelector_ErrorMsg")
						for (var j = 0; j < errorMsgBox.length; j++) {
							$(errorMsgBox[j]).hide('normal');
						}
					});
					//注册window对象，标记防止事件多次注册
					window.ObjectSelectorRegClick = true;
	            };
			}
			

		},
		methods: { // 这里是全局方法
			getValues: function() {
				//console.log($(this.$el).find(".form-control").val());
				if (this.valid()) {
					if ($(this.$el).find(".form-control").val() == this.config.placeHolder) {
						 return false;
					}else{
						if(typeof(this.value) == "string"){
							this.value = this.value.split(",");
						}
						return this.value;
					}				
				}else{
					return false;
				}
			},
			toggelSelectList:function(event){
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
					if ($(this.$el).parent().find(".ObjectSelector_ErrorMsg").css("display") == "block") {
						//先判断当前的错误信息有没有展示出来，如果有的话，直接替换提示信息的展示内容，然后注销红色提示
						this.errorMsg("hide")
					}else if($(this.$el).parent().find(".ObjectSelector_Selection").css("display") == "none"){
						// 先进行统一窗体控制，把页面上所有的选择器都关闭
						for (var i = 0; i < document.getElementsByClassName("ObjectSelector_Selection").length; i++) {
							document.getElementsByClassName("ObjectSelector_Selection")[i].style.display = "none";
						}
						// //判断是否之前已经请求过数据
						// 	//如果请求过数据了，直接取前端缓存数据控制显影
						$(this.$el).parent().find(".ObjectSelector_Selection").show('normal');
					}else if($(this.$el).parent().find(".ObjectSelector_Selection").css("display") == "block"){
						$(this.$el).parent().find(".ObjectSelector_Selection").hide('normal');
					}
				}
			},
			//清除事件的注册
			cleanSelect:function(){
				this.errorMsg("hide");
				//阻止事件冒泡
				if (event.cancelBubble) {
					//IE 兼容写法
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
				//清除当前选中的数值，或者清除树的选中值，或者清除单选下的选中值
				if (this.config.modelType == "normal") {
					$(this.$el).find(".ObjectSelector_Input").val("");
					// debugger;
	    			$(this.$el).find(".ObjectSelector_Input").attr("data","");
	    			this.value = new Array();
	    			this.oldText = "";
	    			$(this.$el).parent().find(".ObjectSelector_Selection").show('normal');
	    			if (this.config.SelectModel == "single") {
	    				//清空中间区域内容，还原出所有的可选列表
	    				renderSingle(this.config.afterQueryData,this,false);
	    			}
	    			//如果是多选模式，遍历每一个checkbox，清除选中
	    			if (this.config.SelectModel == "multi") {
	    				var lis = $(this.$el).parent().find("li");
	    				if (lis) {
							for (var i = 0; i < lis.length; i++) {
								lis[i].getElementsByTagName("input")[0].checked = false ;
							}
						}
						//清除多选框中的输入值，然后重新绘制当前的下拉列表
	    				renderMulti(this.config.afterQueryData,this,false);
	    				$(this.$el).parent().find(".ObjectSelector_SearchInput").val("");

	    			}else if(this.config.SelectModel == "treeMulti"){
	    				//如果是树形多选模式，调用树方法清空选中checkbox

	    			}

	    			//外抛onclean事件，提供给业务线做自己的回调内容
	    			this.config.onClean && this.config.onClean();

				}
			},
			valid:function(){
				// console.log("in valid function");
				var isSubmited = true;
				//根据当前配置的验证规则来处理当前是否可取值提交
				//ObjectSelector只验证其必填与否
				if (this.config.required == 1) {
					if(typeof(this.value) == "string"){
						this.value = this.value.split(",");
					}
					if (!(this.value && this.value[0])) {
						isSubmited = false;
						//将样式处理为红色标记，并外抛配置的 validMsg
						this.errorMsg("show",this.config.validMsg || "必填！");
						return isSubmited;
					}
				}
				if (this.config.maxSelect) {
					//只有多选 或 树形多选 的情况下，才判断maxSelect
					if(this.config.SelectModel == "multi" || this.config.SelectModel == "treeMulti"){
						if(typeof(this.value) == "string"){
							this.value = this.value.split(",");
						}
						if(this.value.length > this.config.maxSelect){
							isSubmited = false;
							//将样式处理为红色标记，并外抛：最多只能选择 '' 条
							this.errorMsg("show","最多只能选择 "+this.config.maxSelect+" 条数据");
							return isSubmited;
						}
					}
				}
				if (this.config.minSelect) {
					//只有在多选 或 树形多选 的情况下，才判断minSelect
					if(this.config.SelectModel == "multi" || this.config.SelectModel == "treeMulti"){
						if(typeof(this.value) == "string"){
							this.value = this.value.split(",");
						}
						if(this.value.length < this.config.minSelect){
							//将样式处理为红色标记，并外抛：至少选择 '' 条
							isSubmited = false;
							this.errorMsg("show","最少需要选择 "+this.config.minSelect+" 条数据");
							return isSubmited;
						}
					}
				}
				return isSubmited;
			},
			focusInput:function(e){
				this.errorMsg("hide");
				//阻止事件冒泡
				if (event.cancelBubble) {
					//IE 兼容写法
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
				//注册 单选模式下，input被focus的场景
				//input被focus，监看当前有没有警告状态，有的话，清除当前警告样式为正常模式
				// console.log("input被focus，监看当前有没有警告状态，有的话，清除当前警告样式为正常模式");
				$(this.$el).parent().find(".ObjectSelector_Selection").show('normal');
			},
			blurInput:function(e){
				//注册 单选模式下，input失去焦点的场景
				//input被blur，监看当前的值是自己输入的还是选择的，
				//由系统去遍历数据集合，当当前数据集合中有客户输入的值时，自动带入填充data数据
				//当当前数据集合中没有客户输入的值时，构造出的数据， id：0  标记为新增模式
				// console.log("input被blur，监看当前的值是自己输入的还是选择的，由系统去遍历数据集合，当当前数据集合中有客户输入的值时，自动带入填充data数据,当当前数据集合中没有客户输入的值时，构造出的数据， id：0  标记为新增模式");
			},
			keyUpInput:function(e){
				//注册 单选模式下，input的keyUp时的场景
				//每一次keyUp，触发，为了提升效率，做输入值前端存储
				if(this.oldText != e.target.value){
					//绘制完成后，改变之前的oldText
					this.oldText = e.target.value;

					//根据当前的值，重新遍历绘制data，然后重新调用绘制方法
					var AfterFilterData = dataFilter(e.target.value,this);
					if (this.config.SelectModel == "single") {
						renderSingle(AfterFilterData,this,false);
					}
					else if(this.config.SelectModel == "multi"){
						renderMulti(AfterFilterData,this,false);
					}
					else if(this.config.SelectModel == "treeMulti"){
						renderTreeMulti(AfterFilterData,this,"",false);
					}
				}
			},
			errorMsg:function(type,msg){
				//增加统一控制方法，控制错误提示信息的显影
				if (type == "show") {
					$(this.$el).parent().find(".ObjectSelector_Selection").show('normal');
					//显示当前组件错误提示信息，并更新当前的errorMsg
					$(this.$el).addClass("ObjectSelector_Container_Error");
					$(this.$el).parent().find(".ObjectSelector_ErrorMsg").text(msg);
					if (this.config.SelectModel=="multi") {
						$(this.$el).parent().find(".ObjectSelector_Top").hide("normal");
						$(this.$el).parent().find(".ObjectSelector_Buttom").hide("normal");
					}
					$(this.$el).parent().find(".ObjectSelector_Middle").hide("normal");
					$(this.$el).parent().find(".ObjectSelector_ErrorMsg").show("normal");
				}else{
					//隐藏当前组件的错误提示
					$(this.$el).removeClass("ObjectSelector_Container_Error");
					$(this.$el).parent().find(".ObjectSelector_ErrorMsg").text("");
					if (this.config.SelectModel=="multi") {
						$(this.$el).parent().find(".ObjectSelector_Top").show("normal");
						$(this.$el).parent().find(".ObjectSelector_Buttom").show("normal");
					}
					$(this.$el).parent().find(".ObjectSelector_Middle").show("normal");
					$(this.$el).parent().find(".ObjectSelector_ErrorMsg").hide("normal");
				}
			}
		}
	});
});