define(function(require){
	require("components/vUpload/vUpload.css");
	
	var Base = require("components/ComponentBase");
	var instanceNumber = $(".zUploader").length;
	Base.extend({
		name : "vUpload",
		props : ['id', 'config'],
		template : [
			'<div class="vUpload zUploader" :class="class">',
				'<input type="file" class="fileSelectBtn" name="fileselect[]" :multiple="config.multi" :accept="fileType" @change="funGetFiles($event)">',
				'<a class="vUpload-button" :class="classz" :style="style" @click="addEvent($event)">{{config.buttonText}}</a>',
				'<div v-if="showQueue" class="vUpload-queue"></div>',
			'</div>'
			
		].join(''),
		options : {
			ele:"",
			fileType:'',//允许上传的文件类型，格式'*.jpg;*.doc'
			uploader:'components/vUpload/uPload.php',//文件提交的地址
			auto:true,//是否开启自动上传
			method:'post',//发送请求的方式，get或post
			multi:true,//是否允许选择多个文件
			formData:null,//发送给服务端的参数
			fileObjName:'file',//在后端接受文件的参数名称
			totalFileSize:1024*20,//允许上传的总文件大小，单位KB
			fileSizeLimit:2048,//允许上传的文件大小，单位KB
			fileMaxLimit:3, //允许上传的最大文件个数
			showUploadQueue:true, //是否显示上传队列
			showUploadedPercent:true,//是否实时显示上传的百分比，如20%
			showUploadedSize:false,//是否实时显示已上传的文件大小，如1M/2M
			buttonText:'选择文件',//上传按钮上的文字
			removeTimeout: 1000,//上传完成后进度条的消失时间
			fileFilter: [],//过滤后的文件数组
			totalSize:0,//文件总大小
			itemTemplate:'<div id="${fileID}" class="zUploader-queue-item"><div class="zUploader-progress"><div class="zUploader-progress-bar"></div></div><span class="fileName">${fileName}</span><span class="uploadBtn">上传</span><span class="delfileBtn">删除</span></div>',//上传队列显示的模板
			initData:null, //初始化数据
			onSelect:function(){},//选择文件后的动作
			onUploadStart:function(){},//上传开始时的动作
			onUploadSuccess:function(){},//上传成功的动作
			onUploadComplete:function(){},//上传完成的动作
			onUploadError:function(){}, //上传失败的动作
			onInit:function(){},//初始化时的动作
			onCancel:function(){}//删除掉某个文件后的回调函数
		},
		compiled : function(){

		},
		data : function(){
			var classz = {
				"zUploader-disable" : this.config.disable == "on" ? true : false
			}
			return {
				class:this.config.class,
				fileType:this.config.fileType,
				showQueue:this.config.showQueue,
				value:this.config.buttonText,
				style : {
					width : this.config.width + 'px',
					height : this.config.height + 'px',
					lineHeight : (this.config.height-2) + 'px',
					color : this.config.color,
					textAlign : this.config.textAlign,
					fontWeight : this.config.fontWeight,
					zIndex : this.config.zIndex || 1
				},
				isEdit:this.config.modeType === "edit",
				classz : classz
			};
		},
		watch : {
			'config.value' : function(value){
				this.value = value;
			},
			'config.width' : function(value){
				this.style.width = value + "px";
			},
			'config.height' : function(value){
				this.style.height = value + "px";
				this.style.lineHeight = (value-2) + "px";
			},
			'config.color' : function(value){
				this.style.color = value;
			},
			'config.zIndex' : function(value){
				this.style.zIndex = value;
			},
			'config.textAlign' : function(value){
				this.style.textAlign = value;
			},
			'config.fontWeight' : function(value){
				this.style.fontWeight = value;
			},
			'config.disable' : function(value){
				if(value == "on"){
					this.classz["zUploader-disable"] = true;
				} else {
					this.classz["zUploader-disable"] = false;
				}
			},
		},
		methods : {
			extend:function(option){
				if(option==null||typeof option!="object") return;
				for(var key in option){
					if(this.get(key)!=undefined) this.set(key,option[key]);
				}
			},
			get:function(name){
				return this.config[name];
			},
			set:function(name,value){
				this.config[name] = value;
			},
			//将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
			formatFileSize:function(size,isKB){
				if (size> 1024 * 1024&&!isKB){
					size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}else{
					size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
				}
				return size;
			},
			//根据文件序号获取文件
			getFile:function(index,files){
				for(var i=0;i<files.length;i++){
					if(files[i].index == index){
						return files[i];
					}
				}
				return false;
			},
			//选择文件组的过滤方法
			filter: function(files){
				debugger;
				var u = this;
				var arr = [];
				var typeArray = u.getFileTypes(u.get("fileType")),
					totalSize = u.get("totalSize"),
					totalFileSize = u.get("totalFileSize"),
					fileSizeLimit = u.get("fileSizeLimit");
				if(typeArray.length>0){
					for(var i=0,len=files.length;i<len;i++){
						var thisFile = files[i];
						if(parseInt(u.formatFileSize((totalSize+thisFile.size),true))>totalFileSize){
							alert('文件总大小超过限制!');
							break;
						}
						if(parseInt(u.formatFileSize(thisFile.size,true))>fileSizeLimit){
							alert('文件\"'+thisFile.name+'\"的大小超出限制！');
							continue;
						}
						if($.inArray(thisFile.name.split('.').pop(),typeArray)>=0){
							arr.push(thisFile);	
						}else{
							alert('文件\"'+thisFile.name+'\"是不允许的文件类型！');
						}
					}	
				}
				return arr;  	
			},
			//将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
			getFileTypes:function(str){
				var result = [];
				var arr1 = str.split(";");
				for(var i=0,len=arr1.length;i<len;i++){
					result.push(arr1[i].split(".").pop());
				}
				return result;
			},
			//获取选择的文件，file控件
			funGetFiles: function(e) {
				// 获取文件列表对象
				var files = e.target.files,
					fileFilter = this.config.fileFilter,
					fileMaxLimit = this.config.fileMaxLimit,
					totalSize = this.config.totalSize;
				if((fileFilter.length+1)>fileMaxLimit){
					alert('最多只能上传'+fileMaxLimit+'个文件！');
					return false;
				}

				//继续添加文件
				files = this.filter(files);
				for(var i=0,len=files.length;i<len;i++){
					fileFilter.push(files[i]);
					totalSize += files.size;
				}
				this.set("fileFilter",fileFilter);
				this.set("totalSize",totalSize);

				this.funDealFiles(files);
				return this;
			},
			//选中文件的处理与回调
			funDealFiles: function(files) {
				var u = this;
				var fileCount = $(this.$el).find('.zUploader-queue .zUploader-queue-item').length;//队列中已经有的文件个数
				for(var i=0,len=files.length;i<len;i++){
					files[i].index = ++fileCount;
					files[i].id = files[i].index;
				}
				//执行选择回调
				u.onSelect(files);
				return this;
			},
			//文件选择后
			onSelect: function(files){
				var u = this;
				if(typeof u.get("onSelect")=="function") u.get("onSelect")(files,u.get("fileFilter"));

				var itemTemplate = u.get("itemTemplate"),
					uploadFileList = $("<div id=\"file-upload-"+instanceNumber+"-queue\" class=\"zUploader-queue\"></div>");

				if(u.get("showUploadQueue")) $(this.$el).append(uploadFileList); //是否显示队列

				for(var i=0,len=files.length;i<len;i++){
					var file = files[i];

					//处理模板中使用的变量
					var $html = $(itemTemplate.replace(/\${fileID}/g,'fileupload-'+instanceNumber+'-'+file.index).replace(/\${fileName}/g,file.name).replace(/\${fileSize}/g,u.formatFileSize(file.size)));
					
					if(u.get("showUploadQueue")){
						//如果是自动上传，去掉上传按钮
						if(u.get("auto")){
							$html.find('.uploadbtn').remove();
						}
						uploadFileList.append($html);


						//判断是否显示已上传文件大小
						if(u.get("showUploadedSize")){
							var num = '<span class="progressNum"><span class="uploadedSize">0KB</span>/<span class="totalSize">${fileSize}</span></span>'.replace(/\${fileSize}/g,u.formatFileSize(file.size));
							$html.find('.zUploader-progress').after(num);
						}

						//判断是否显示上传百分比	
						if(u.get("showUploadedPercent")){
							var percentText = '<span class="percent">0%</span>';
							$html.find('.zUploader-progress').after(percentText);
						}
					}

					//判断是否是自动上传
					if(u.get("auto")){
						u.funUploadFile(file);
					}else{
						//如果配置非自动上传，绑定上传事件
						$html.find('.uploadBtn').on('click',(function(file){
							return function(){u.funUploadFile(file);}
						})(file));
					}

					//为删除文件按钮绑定删除文件事件
					$html.find('.delfileBtn').on('click',(function(file){
						return function(){u.funDeleteFile(file.index);}
					})(file));
				}
			},
			//文件上传进度
			onProgress: function(file, loaded, total) {
				var u = this;
				var eleProgress = $(this.$el).find('#fileupload_'+instanceNumber+'_'+file.index+' .zUploader-progress');
				var percent = (loaded / total * 100).toFixed(2) +'%';
				if(u.get("showUploadedSize")){
					eleProgress.nextAll('.progressNum .uploadedSize').text(u.formatFileSize(loaded));
					eleProgress.nextAll('.progressNum .totalSize').text(u.formatFileSize(total));
				}
				if(u.get("showUploadedPercent")){
					eleProgress.nextAll('.percent').text(percent);	
				}
				eleProgress.children('.zUploader-progress-bar').css('width',percent);
			},
			//删除对应的文件
			funDeleteFile: function(index) {
				var u = this,
					fileFilter = u.get("fileFilter");
				for (var i = 0,len=fileFilter.length; i<len; i++) {
					var file = fileFilter[i];
					if (file.index == index) {
						fileFilter.splice(i,1);
						u.get("ele").find('#fileupload-'+instanceNumber+'-'+index).fadeOut();
						if(typeof u.get("onCancel")=="function") u.get("onCancel")(file,fileFilter)
						break;
					}
				}
				return this;
			},
			//文件上传
			funUploadFile: function(file) {
				var u = this;
				var xhr = false;
				try{
					xhr=new XMLHttpRequest();//尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
				}catch(e){	  
					xhr=ActiveXobject("Msxml12.XMLHTTP");//使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
				}

				if (xhr.upload) {
					//上传中
					xhr.upload.addEventListener("progress", function(e) {
						u.onProgress(file, e.loaded, e.total);
					}, false);
					//文件上传成功或是失败
					xhr.onreadystatechange = function(e) {
						if (xhr.readyState == 4) {
							if (xhr.status == 200) {
								if(u.get("showUploadQueue")){
									var target = $(this.$el);
									//校正进度条和上传比例的误差
									var thisfile = target.find('#fileupload-'+instanceNumber+'-'+file.index);
									thisfile.find('.zUploader-progress-bar').css('width','100%');
									u.get("showUploadedSize")&&thisfile.find('.uploadedSize').text(thisfile.find('.totalSize').text());
									u.get("showUploadedPercent")&&thisfile.find('.percent').text('100%');

									if(typeof u.get("onUploadSuccess")=="function") u.get("onUploadSuccess")(file, xhr.responseText);
									//在指定的间隔时间后删掉进度条
									/*setTimeout(function(){
										_this.find('#fileupload_'+instanceNumber+'_'+file.index+' .uploader-progress').fadeOut();
									},option.removeTimeout);*/

									target.find('.uploadBtn,.zUploader-progress,.percent').remove(); //上传完成之后移除进度条等相关内容
								}
							}else{	
								if(typeof u.get("onUploadError")=="function") u.get("onUploadError")(file, xhr.responseText);
							}
							if(typeof u.get("onUploadComplete")=="function") u.get("onUploadComplete")(file, xhr.responseText);
							//清除文件选择框中的已有值
							$(this.$el).find(".fileSelectBtn").val('');
						}
					};
					if(typeof u.get("onUploadStart")=="function") u.get("onUploadStart")();
					//开始上传
					xhr.open(u.get("method"), u.get("uploader"), true);
					xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					var fd = new FormData();
					fd.append(u.get("fileObjName"),file);
					if(u.get("formData")){
						for(var key in u.get("formData")){
							fd.append(key,u.get("formData")[key]);
						}
					}
					xhr.send(fd);
				}	
			},
			//事件绑定
			addEvent:function(ele){
				if(this.isEdit) return false;
				$(this.$el).find(".fileSelectBtn").trigger("click");
				
			},
			//初始化数据
			initData:function(files){
				var u = this,
					fileFilter = u.get("fileFilter"),
					totalSize = u.get("totalSize"),
					uploadFileList = u.get("ele").find("zUploader-queue");
				for(var i=0,len=files.length;i<len;i++){
					var file = files[i];
					//处理模板中使用的变量
					var $html = $(u.get("itemTemplate").replace(/\${fileName}/g,file.name).replace(/\${fileID}/g,'fileupload-'+instanceNumber+'-'+(i+1)));
					var num = '<span class="totalSize">'+u.formatFileSize(file.size)+'</span></span>';
					$html.find(".fileName").before(num);
					//去除上传按钮以及进度条
					$html.find(".uploadBtn,.zUploader-progress").remove();

					uploadFileList.append($html);

					//为删除文件按钮绑定删除文件事件
					$html.find(".delfileBtn").on("click",(function(file){
						return function(){u.funDeleteFile(file.index);}
					})(file));

					file.index = i+1; //定义文件在队列中的index
					fileFilter.push(file);  //添加到文件队列中
					totalSize += file.size //初始化已有文件总大小
				}
				u.set("fileFilter",fileFilter);
				u.set("totalSize",totalSize);
			},

			init:function(){
				var u = this;
				if(typeof u.get("onInit")=="function") u.get("onInit")();
				u.initData(u.get("ele"));
			}
		}
	});
});