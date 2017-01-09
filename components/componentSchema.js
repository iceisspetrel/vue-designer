define(function(){
	return {
		'vLabel' : {
			name : '文本框',
			icon : 'text-size',
			basicSetting : [
				{
					name  : 'width',
					title : '宽度',
					type  : 'input',
					value : 150,
					unit  : 'px'
				},
				{
					name  : 'height',
					title : '高度',
					type  : 'input',
					value : 30,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'color',
					title : '字体颜色',
					type  : 'color',
					value : '#000000'
				},
				{
					name  : 'backgroundColor',
					title : '背景颜色',
					type  : 'color',
					value : '#FFFFFF'
				},
				{
					name  : 'content',
					title : '内容',
					type  : 'input',
					value : 'hello'
				},
				{
					name  : 'textAlign',
					title : '对齐方式',
					type  : 'select',
					value : 'left',
					options : [
						{
							name : '居左',
							value : 'left'
						},
						{
							name : '居中',
							value : 'center'
						},
						{
							name : '居右',
							value : 'right'
						}
					]
				}
			]
		},
		'vSelect' : {
			name : '下拉框',
			icon : 'list',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : '130',
					unit  : 'px'
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : '26',
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : '',
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : '',
					unit  : 'px'
				},
				{
					name  : 'fontSize',
					title : '字体大小',
					type  : 'input',
					value : '14',
					unit  : 'px'
				},
				{
					name  : 'fontWeight',
					title : '字体粗细',
					type  : 'select',
					value : '500',
					options : [
						{
							name : '普通',
							value : '500'
						},
						{
							name : '加粗',
							value : '900'
						}
					]
				},
				{
					name  : 'borderColor',
					title : '边框颜色',
					type  : 'input',
					value : "#ccc"
				},
				{
					name  : 'required',
					title : '校验规则',
					type  : 'select',
					value : '0',
					options : [
						{
							name : '必选',
							value : '1'
						},
						{
							name : '非必选',
							value : '0'
						}
					]
				},
				{
					name : "validMsg",
					title : "必填提示",
					value : "必填！",
					type : "input"
				},
				{
					name  : 'borderRadius',
					title : '边框圆角',
					type  : 'input',
					value : '6',
					unit  : 'px'
				},
				{
					name  : 'textAlgin',
					title : '文本对齐',
					type  : 'select',
					value : 'left',
					options : [
						{
							name : '左对齐',
							value : 'left'
						},
						{
							name : '右对齐',
							value : 'right'
						},
						{
							name : '中对齐',
							value : 'center'
						}
					]
				},
				{
					name  : 'color',
					title : '字体颜色',
					type  : 'input',
					value : '#000'
				},
				{
					name  : 'modelType',
					title : '组件模式',
					type  : 'select',
					value : 'edit',
					options : [
						{
							name : '普通模式',
							value : 'normal'
						},
						{
							name : '只读模式',
							value : 'readOnly'
						},
						{
							name : '打印模式',
							value : 'preview'
						},
						{
							name : '编辑模式',
							value : 'edit'
						}
					]
				},
				{
					name  : 'pannelOpacity',
					title : '面板透明度',
					type  : 'select',
					value : '1',
					options : [
						{
							name : '100%',
							value : '1'
						},
						{
							name : '90%',
							value : '0.9'
						},
						{
							name : '80%',
							value : '0.8'
						},
						{
							name : '70%',
							value : '0.7'
						},
						{
							name : '60%',
							value : '0.6'
						},
						{
							name : '50%',
							value : '0.5'
						},
						{
							name : '40%',
							value : '0.4'
						},
						{
							name : '30%',
							value : '0.3'
						},
						{
							name : '20%',
							value : '0.2'
						},
						{
							name : '10%',
							value : '0.1'
						}
					]
				},
				{
					name  : 'placeHolder',
					title : '提示语',
					type  : 'input',
					value : '请选择'
				},
				{
					name  : 'zIndex',
					title : '层级',
					type  : 'input',
					value : '1'
				},
				{
					name  : 'name',
					title : '组件名称',
					type  : 'input',
					value : ''
				},
				{
					name  : 'id',
					title : 'ID',
					type  : 'input',
					value : '',
					disabled : true
				},
				{
					name  : 'initData',
					title : '自定义初始值',
					type  : 'custom',
					page  : 'vInfoCRSCustom.html',
					value : [
						{
							label : 'content-1',
							value : '35',
							defaultChecked : true
						},
						{
							label : 'content-2',
							value : '76'
						},
						{
							label : 'content-3',
							value : '42'
						}
					]
				}
				// {
				// 	name  : 'initData',
				// 	title : '自定义初始值',
				// 	type  : 'dataSelect',
				// 	value : [
				// 		{
				// 			value:"1",
				// 			title:"张三"
				// 		},{
				// 			value:"2",
				// 			title:"李四",
				// 			defaultChecked : true
				// 		},{
				// 			value:"3",
				// 			title:"王五"
				// 		}
				// 	]
				// }

			]
		},
		/*'vDrag' : {
			name : '操作框',
			icon : 'vLabel.png',
			basicSetting : [
				{
					name  : 'width',
					title : '宽度',
					type  : 'input',
					value : '150',
					unit  : 'px'
				},
				{
					name  : 'height',
					title : '高度',
					type  : 'input',
					value : '30',
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : '',
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : '',
					unit  : 'px'
				}
			]
		},*/
		'vInput' : {
			name : '输入框',
			icon : 'edit',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : 150,
					unit  : 'px'
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : 30,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'value',
					title : '内容',
					type  : 'input',
					value : 'hello'
				},
				{
					name  : 'color',
					title : '字体颜色',
					type  : 'color',
					value : '#000'
				},
				{
					name  : 'fontSize',
					title : '字体大小',
					type  : 'input',
					value : 20
				},
				{
					name  : 'modelType',
					title : '组件模式',
					type  : 'select',
					value : 'normal',
					options : [
						{
							name : '普通模式',
							value : 'normal'
						},
						{
							name : '只读模式',
							value : 'readonly'
						},
						{
							name : '打印模式',
							value : 'preview'
						}
					]
				},
				{
					name  : 'maxlength',
					title : '最大长度',
					type  : 'input',
					value : Infinity
				},
				{
					name  : 'minlength',
					title : '最小长度',
					type  : 'input',
					value : '0'
				},
				{
					name  : 'placeHodler',
					title : 'placeHodler',
					type  : 'input',
					value : '请输入'
				},
				{
					name  : 'zIndex',
					title : 'zIndex',
					type  : 'input',
					value : 1
				},
				{
					name  : 'valid',
					title : '验证规则',
					type  : 'inputSelect',
					value : '',
					showprop : 'value',
					options : [ //与type = select的配置一样
						{
							name : '无',
							value : ''
						}
						,{
							name : '整数',
							value : 'number'
						},
						{
							name : '非空',
							value : 'required'
						}
						,{
							name : '电子邮箱',
							value : 'email'
						}
						,{
							name : '手机号码',
							value : 'telphone'
						}
						,{
							name : '身份证号',
							value : 'idcard'
						}
					]
				},
				{
					name : 'validMsg'
					,title : '验证提示'
					,type : 'input'
					,value : ''
				}
			]
		},
		'vImage' : {
			name : '图形',
			icon : 'picture',
			basicSetting : [
				{
					name  : 'value',
					title : '地址',
					type  : 'file'

				},
				{
					name  : 'alt',
					title : '替换文本',
					value : '图片加载失败',
					type  : 'input'
				},
				{
					name  : 'width',
					title : 'W',
					value : '200',
					type  : 'input',
					unit  : "px"
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : '200',
					unit  : "px"
				},
				{
					name  : 'left',
					title : 'X',
					value : '',
					type  : 'input'
				},
				{
					name  : 'top',
					title : 'Y',
					value : '',
					type  : 'input'
				},
				{
					name : "borderRadius",
					title : "圆角",
					value : "0",
					type  : 'input'
				},
				{
					name : "borderColor",
					title : "边框颜色",
					value : "#ccc",
					type  : 'input'
				},
				{
					name : "borderWidth",
					title : "边框宽度",
					value : "",
					type  : 'input'
				},
				{
					name : "borderStyle",
					title : "边框样式",
					value : "solid",
					type  : 'input'
				},
				{
					name : "title",
					title : "tips",
					value : "这是一个图片",
					type  : 'input'
				},
				{
					name  : 'zIndex',
					title : 'z-index',
					type  : 'input',
					value : 1
				},
				{
					name : "modelType",
					title : "组件模式",
					value : "edit",
					type : "select",
					options: [
						{
							"value": "readOnly",
							"name": "只读模式"
						},{
							"value": "normal",
							"name": "普通模式"
						},{
							"value": "preview",
							"name": "打印报告模式"
						},{
							"value": "edit",
							"name": "表单设计模式"
						}
					]
				}
			]
		},
		'vButton' : {
			name : '按钮',
			icon : 'hand-up',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : 150,
					unit  : 'px'
				},
				{
					name    : 'theme',
					title   : '主题风格',
					type    : 'select',
					value   : 'theme-red',
					options : [
						{
							name  : '红',
							value : 'theme-red'
						},
						{
							name  : '蓝',
							value : 'theme-blue'
						},
						{
							name  : '绿',
							value : 'theme-green'
						},
						{
							name  : '白',
							value : 'theme-white'
						},
						{
							name  : '灰',
							value : 'theme-gray'
						},
					]
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : 30,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'zIndex',
					title : 'zIndex',
					type  : 'input',
					value : '0'
				},
				{
					name  : "content",
					title : "内容",
					type  : 'input',
					value : "button"
				},
				{
					name  : "fontSize",
					title : "字体大小",
					type  : 'input',
					value : "12",
					unit  : 'px'
				},
				{
					name  : "fontWeight",
					title : "字体粗细",
					type  : 'select',
					value : "normal",
					options : [
						{
							name  : '正常',
							value : 'normal'
						},
						{
							name : '加粗',
							value : 'bold'
						}
					]
				},
				{
					name  : 'textAlign',
					title : '对齐方式',
					type  : 'select',
					value : 'center',
					options : [
						{
							name : '居左',
							value : 'left'
						},
						{
							name : '居中',
							value : 'center'
						},
						{
							name : '居右',
							value : 'right'
						}
					]
				},
				{
					name  : "disable",
					title : "是否可用",
					type  : 'select',
					value : "on",
					options : [
						{
							name  : '可用',
							value : 'on',
						},
						{
							name  : '禁用',
							value : 'off'
						}
					]
				},
				{
					name  : "visibility",
					title : "是否显示",
					type  : 'select',
					value : "visible",
					options : [
						{
							name  : '显示',
							value : 'visible',
						},
						{
							name  : '隐藏',
							value : 'hidden'
						}
					]
				}
			]
		},
		'vUpload' : {
			name : '上传',
			icon : 'upload',
			basicSetting : [
				{
					name  : 'buttonText',
					title : '内容',
					type  : 'input',
					value : '上传文件'
				},
				{
					name  : 'width',
					title : 'W',
					value : 80,
					type  : 'input'
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : 26
				},
				{
					name  : 'left',
					title : 'X坐标',
					value : '',
					type  : 'input'
				},
				{
					name  : 'top',
					title : 'Y坐标',
					value : '',
					type  : 'input'
				},
				{
					name : "color",
					title : "文本颜色",
					value : "#333",
					type  : 'input'
				},
				{
					name : "textAlign",
					title : "对齐方式",
					value : "center",
					type  : 'select',
					options : [
						{
							name:"居左",
							value:"left"
						},{
							name:"居中",
							value:"center"
						},{
							name:"居右",
							value:"right"
						}
					]
				},
				{
					name : "fontWeight",
					title : "字体粗细",
					value : "500",
					type  : 'select',
					options : [
						{
							name:"普通",
							value:"500"
						},{
							name:"加粗",
							value:"900"
						}
					]

				},
				{
					name  : 'zIndex',
					title : 'z-index',
					type  : 'input',
					value : 1
				},
				{
					name : "disable",
					title : "是否可用",
					value : "off",
					type : "select",
					options : [
						{
							value : "off",
							name : "可用"
						},
						{
							value : "on",
							name : "禁用"
						}
					]
				},
				{
					name : "modelType",
					title : "组件模式",
					value : "edit",
					type : "select",
					options: [
						{
							"value": "readOnly",
							"name": "只读模式"
						},{
							"value": "normal",
							"name": "普通模式"
						},{
							"value": "preview",
							"name": "打印报告模式"
						},{
							"value": "edit",
							"name": "表单设计模式"
						}
					]
				}
			]
		},
		'vTree' : {
			name : '树',
			icon : 'tree-conifer',
			basicSetting : [
				{
					name  : 'width',
					title : '宽度',
					type  : 'input',
					value : 150,
					unit  : 'px'
				},
				{
					name  : 'height',
					title : '高度',
					type  : 'input',
					value : 90,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				}
				,{
					name : 'isList'
					,title : '列表显示'
					,type : 'select'
					,value : 1
					,options : [
						{
							name : '是'
							,value : 1
						}
						,{
							name : '否'
							,value : 0
						}
					]
				}
				,{
					name : 'relateCheck'
					,title : '点击选中'
					,type : 'select'
					,value : 1
					,options : [
					{
						name : '是'
						,value : 1
					},{
						name : '否'
						,value : 0
					}]
				}
				,{
					name : 'chkStyle'
					,title : '选择模式'
					,type : 'select'
					,value : 'checkbox'
					,options : [
					{
						name : '无'
						,value : ''
					},{
						name : '复选模式'
						,value : 'checkbox'
					},{
						name : '单选模式'
						,value : 'radio'
					}]
				}
				,{
					name : 'checkInherit'
					,title : '选择操作'
					,type : 'select'
					,value : 1
					,options : [{
						name : '无影响'
						,value : 0
					},{
						name : '子父相互影响'
						,value : 1
					}]
				}
				,{
					name : 'initData'
					,title : '自定义选项'
					,type : 'custom'
					,page  : 'vInfoTreeCustom.html'
					,value : [
						{ id:1, pId:0, name:"节点1", open:true},
						{ id:11, pId:1, name:"节点2", open:true},
						{ id:21, pId:11, name:"节点3"}
					]
				}
			]
		},
		'vDatePicker' : {
			name : '日期',
			icon : 'time',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : '130',
					unit  : 'px'
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : '26',
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : '',
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : '',
					unit  : 'px'
				},
				{
					name  : 'fontSize',
					title : '字体大小',
					type  : 'input',
					value : '14',
					unit  : 'px'
				},
				{
					name  : 'fontWeight',
					title : '字体粗细',
					type  : 'select',
					value : '500',
					options : [
						{
							name : '普通',
							value : '500'
						},
						{
							name : '加粗',
							value : '900'
						}
					]
				},
				{
					name  : 'textAlgin',
					title : '文本对齐',
					type  : 'select',
					value : 'left',
					options : [
						{
							name : '左对齐',
							value : 'left'
						},
						{
							name : '右对齐',
							value : 'right'
						},
						{
							name : '中对齐',
							value : 'center'
						}
					]
				},
				{
					name  : 'todayBtn',
					title : '今天按钮',
					type  : 'select',
					value : 1,
					options : [
						{
							name : '快速定位今天',
							value : 1
						},
						{
							name : '不需要',
							value : 0
						}
					]
				},
				{
					name  : 'todayHighlight',
					title : '当日高亮',
					type  : 'select',
					value : 1,
					options : [
						{
							name : '需要高亮',
							value : 1
						},
						{
							name : '不需要',
							value : 0
						}
					]
				},
				{
					name  : 'startDate',
					title : '可选开始时间',
					type  : 'input',
					value : '2010-01-01'
				},
				{
					name  : 'endDate',
					title : '可选结束时间',
					type  : 'input',
					value : '2020-01-01'
				},
				{
					name  : 'weekStart',
					title : '周几开头',
					type  : 'select',
					value : 1,
					options : [
						{
							name : '周天',
							value : 0
						},
						{
							name : '周一',
							value : 1
						},{
							name : '周二',
							value : 2
						},{
							name : '周三',
							value : 3
						},{
							name : '周四',
							value : 4
						},{
							name : '周五',
							value : 5
						},{
							name : '周六',
							value : 6
						}
					]
				},
				{
					name  : 'color',
					title : '字体颜色',
					type  : 'input',
					value : '#555'
				},
				{
					name  : 'modelType',
					title : '组件模式',
					type  : 'select',
					value : 'edit',
					options : [
						{
							name : '普通模式',
							value : 'normal'
						},
						{
							name : '只读模式',
							value : 'readOnly'
						},
						{
							name : '打印模式',
							value : 'preview'
						},
						{
							name : '编辑模式',
							value : 'edit'
						}
					]
				},
				{
					name  : 'formateType',
					title : '日期格式',
					type  : 'select',
					value : 'yyyy-mm-dd',
					options : [
						{
							name : 'yyyy-mm-dd',
							value : 'yyyy-mm-dd'
						},
						{
							name : 'yyyy/mm/dd',
							value : 'yyyy/mm/dd'
						},
						{
							name : 'dd-mm-yyyy',
							value : 'dd-mm-yyyy'
						},
						{
							name : 'dd/mm/yyyy',
							value : 'dd/mm/yyyy'
						}
					]
				},
				{
					name  : 'placeHolder',
					title : '提示语',
					type  : 'input',
					value : '请选择日期'
				},
				{
					name  : 'zIndex',
					title : '层级',
					type  : 'input',
					value : '1'
				},
				{
					name  : 'name',
					title : '组件名称',
					type  : 'input',
					value : ''
				},
				{
					name  : 'id',
					title : 'ID',
					type  : 'input',
					value : '',
					disabled : true
				},
				{
					name  : 'required',
					title : '校验规则',
					type  : 'select',
					value : '1',
					options : [
						{
							name : '必选',
							value : '1'
						},
						{
							name : '非必选',
							value : '0'
						}
					]
				},
				{
					name  : 'validMsg',
					title : '必填提示',
					type  : 'input',
					value : '必填！'
				},
				{
					name  : 'initData',
					title : '自定义初始值',
					type  : 'input',
					value : ""
				}

			]
		},
		'vRadio' : {
			name : '单选组',
			icon : 'record',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : 350,
					unit  : 'px'
				},
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : 350,
					unit  : 'px'
				},
				{
					name  : 'error',
					title : '校验提醒',
					type  : 'input',
					value : '请选择一个选项',
				},
				{
					name  : 'required',
					title : '校验规则',
					type  : 'select',
					value : '1',
					options : [
						{
							name : '必选',
							value : '1'
						},
						{
							name : '非必选',
							value : '0'
						}
					]
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : 30,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'zIndex',
					title : 'zIndex',
					type  : 'input',
					value : '1'
				},
				{
					name : 'direction',
					title : '布局方向',
					type : 'select',
					value : 'horizontal',
					options : [
						{
							name  : '横向',
							value : 'horizontal'
						},
						{
							name  : '纵向',
							value : 'vertical'
						}
					]
				},
				{
					name  : "fontSize",
					title : "字体大小",
					type  : 'input',
					value : "12",
					unit  : 'px'
				},
				{
					name  : "color",
					title : "字体颜色",
					type  : 'color',
					value : "#000000"
				},
				{
					name  : "fontWeight",
					title : "字体粗细",
					type  : 'select',
					value : "normal",
					options : [
						{
							name  : '正常',
							value : 'normal'
						},
						{
							name : '加粗',
							value : 'bold'
						}
					]
				},
				{
					name  : "visibility",
					title : "是否显示",
					type  : 'select',
					value : "visible",
					options : [
						{
							name  : '显示',
							value : 'visible',
						},
						{
							name  : '隐藏',
							value : 'hidden'
						}
					]
				},
				{
					name  : 'modelType',
					title : '组件模式',
					type  : 'select',
					value : 'edit',
					options : [
						{
							name : '普通模式',
							value : 'normal'
						},
						{
							name : '只读模式',
							value : 'readOnly'
						},
						{
							name : '打印模式',
							value : 'preview'
						},
						{
							name : '编辑模式',
							value : 'edit'
						}
					]
				},
				{
					name  : 'initData',
					title : '选项',
					type  : 'custom',
					page  : 'vInfoCRSCustom.html',
					value : [
						{
							label : 'content-1',
							value : '1',
							defaultChecked : true
						},
						{
							label : 'content-2',
							value : '2'
						},
						{
							label : 'content-3',
							value : '3'
						}
					]
				}
			]
		},
		'vCheckbox' : {
			name : '复选组',
			icon : 'unchecked',
			basicSetting : [
				{
					name  : 'width',
					title : 'W',
					type  : 'input',
					value : 350,
					unit  : 'px'
				},
				{
					name  : 'error',
					title : '校验提醒',
					type  : 'input',
					value : '请至少选择一个选项',
				},
				{
					name  : 'required',
					title : '校验规则',
					type  : 'select',
					value : '1',
					options : [
						{
							name : '必选',
							value : '1'
						},
						{
							name : '非必选',
							value : '0'
						}
					]
				},
				{
					name  : 'height',
					title : 'H',
					type  : 'input',
					value : 30,
					unit  : 'px'
				},
				{
					name  : 'left',
					title : 'X',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'top',
					title : 'Y',
					type  : 'input',
					value : 0,
					unit  : 'px'
				},
				{
					name  : 'zIndex',
					title : 'zIndex',
					type  : 'input',
					value : '1'
				},
				{
					name : 'direction',
					title : '布局方向',
					type : 'select',
					value : 'horizontal',
					options : [
						{
							name  : '横向',
							value : 'horizontal'
						},
						{
							name  : '纵向',
							value : 'vertical'
						}
					]
				},
				{
					name  : "fontSize",
					title : "字体大小",
					type  : 'input',
					value : "12",
					unit  : 'px'
				},
				{
					name  : "color",
					title : "字体颜色",
					type  : 'color',
					value : "#000000"
				},
				{
					name  : "fontWeight",
					title : "字体粗细",
					type  : 'select',
					value : "normal",
					options : [
						{
							name  : '正常',
							value : 'normal'
						},
						{
							name : '加粗',
							value : 'bold'
						}
					]
				},
				{
					name  : "visibility",
					title : "是否显示",
					type  : 'select',
					value : "visible",
					options : [
						{
							name  : '显示',
							value : 'visible',
						},
						{
							name  : '隐藏',
							value : 'hidden'
						}
					]
				},
				{
					name  : 'modelType',
					title : '组件模式',
					type  : 'select',
					value : 'edit',
					options : [
						{
							name : '普通模式',
							value : 'normal'
						},
						{
							name : '只读模式',
							value : 'readOnly'
						},
						{
							name : '打印模式',
							value : 'preview'
						},
						{
							name : '编辑模式',
							value : 'edit'
						}
					]
				},
				{
					name  : 'initData',
					title : '选项',
					type  : 'custom',
					page  : 'vInfoCRSCustom.html',
					value : [
						{
							label : 'content-1',
							value : '1',
							defaultChecked : true
						},
						{
							label : 'content-2',
							value : '2'
						},
						{
							label : 'content-3',
							value : '3'
						}
					]
				}
			]
		},
		'vObjectSelector':{
			name:"查找带回",
			icon:'search',
			basicSetting:[
				{
					name : "id",
					title : "组件id",
					value : "",
					type : "input",
					disabled : true
				},{
					name : "name",
					title : "组件名称",
					value : "objectSelector",
					type : "input"
				},{
					name : "fontSize",
					title: "字体大小",
					value : 12,
					type : "input",
					unit : "px"
				},{
					name : "color",
					title : "字体颜色",
					value : "#000000",
					type : "color"
				},{
						name  : 'fontWeight',
						title : '字体粗细',
						type  : 'select',
						value : '500',
						options : [
							{
								name : '普通',
								value : '500'
							},
							{
								name : '加粗',
								value : '900'
							}
						]
					},{
					name : "modelType",
					title : "组件模式",
					value : "edit",
					type : "select",
					options: [{
		                        "value": "readOnly",
		                        "name": "只读模式"
		                    },{
		                        "value": "normal",
		                        "name": "普通模式"
		                    },{
		                        "value": "preview",
		                        "name": "打印报告模式"
		                    },{
		                        "value": "edit",
		                        "name": "表单设计模式"
		                    }
		                ]
				},{
					name : "textAlgin",
					title : "左右对齐",
					value : "left",
					type : "select",
					options: [{
		                        "value": "left",
		                        "name": "左对齐"
		                    },{
		                        "value": "center",
		                        "name": "居中"
		                    },{
		                        "value": "right",
		                        "name": "右对齐"
		                    }
		                ]
				},{
					name : "pannelOpacity",
					title : "透明度",
					value : 1,
					type : "select",
					options: [{
		                        "value": "1",
		                        "name": "1"
		                    },{
		                        "value": "0.9",
		                        "name": "0.9"
		                    },{
		                        "value": "0.8",
		                        "name": "0.8"
		                    },{
		                        "value": "0.7",
		                        "name": "0.7"
		                    },{
		                        "value": "0.6",
		                        "name": "0.6"
		                    },{
		                        "value": "0.5",
		                        "name": "0.5"
		                    },{
		                        "value": "0.4",
		                        "name": "0.4"
		                    },{
		                        "value": "0.3",
		                        "name": "0.3"
		                    },{
		                        "value": "0.2",
		                        "name": "0.2"
		                    },{
		                        "value": "0.1",
		                        "name": "0.1"
		                    }
		                ]
				},{
					name : "placeHolder",
					title : "提示文字",
					value : "请输入：",
					type : "input"
				},{
					name : "zIndex",
					title : "z-index",
					value : 1,
					type : "input"
				},{
					name : "SelectModel",
					title : "选择模式",
					value : "single",
					type : "select",
					options: [{
		                        "value": "single",
		                        "name": "单选模式"
		                    },{
		                        "value": "multi",
		                        "name": "多选模式"
		                    },{
		                        "value": "treeMulti",
		                        "name": "树形多选模式"
		                    }
		                ]
				},{
					name : "maxSelect",
					title : "最多选择",
					value : 3,
					type : "select",
					options: [{
		                        "value": "1",
		                        "name": "1"
		                    },{
		                        "value": "2",
		                        "name": "2"
		                    },{
		                        "value": "3",
		                        "name": "3"
		                    },{
		                        "value": "4",
		                        "name": "4"
		                    },{
		                        "value": "5",
		                        "name": "5"
		                    },{
		                        "value": "6",
		                        "name": "6"
		                    },{
		                        "value": "7",
		                        "name": "7"
		                    },{
		                        "value": "8",
		                        "name": "8"
		                    },{
		                        "value": "9",
		                        "name": "9"
		                    },{
		                        "value": "10",
		                        "name": "10"
		                    }
		                ]
				},{
					name : "minSelect",
					title : "至少选择",
					value : 2,
					type : "select",
					options: [{
		                        "value": "1",
		                        "name": "1"
		                    },{
		                        "value": "2",
		                        "name": "2"
		                    },{
		                        "value": "3",
		                        "name": "3"
		                    },{
		                        "value": "4",
		                        "name": "4"
		                    },{
		                        "value": "5",
		                        "name": "5"
		                    },{
		                        "value": "6",
		                        "name": "6"
		                    },{
		                        "value": "7",
		                        "name": "7"
		                    },{
		                        "value": "8",
		                        "name": "8"
		                    },{
		                        "value": "9",
		                        "name": "9"
		                    },{
		                        "value": "10",
		                        "name": "10"
		                    }
		                ]
				},{
					// name:'initData',
					// title:"自定义初始值",
					// value:[
					// 	{
					// 		name:"党政办公室",
					// 		id:35,
					// 		defaultChecked : true,
					// 		code:"CY04841871"
					// 	},{
					// 		name:"公共卫生安全部",
					// 		id:42,
					// 		code:"CY07511117"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	},{
					// 		name:"财务部",
					// 		id:7,
					// 		defaultChecked : true,
					// 		code:"CY03671094"
					// 	}
					// ],
					// type:"custom"
					name:'initData',
					title:"自定义初始值",
					type  : 'custom',
					page  : 'vInfoObjectSelectCustom.html',
					value : [
						{
							label_1 : 'content-1',
							label_2 : '',
							label_3 : 'content-3',
							value : '35',
							defaultChecked : true
						},
						{
							label_1 : 'content-1',
							label_2 : 'content-2',
							label_3 : 'content-3',
							value : '76'
						},
						{
							label_1 : 'content-1',
							label_2 : 'content-2',
							label_3 : 'content-3',
							value : '42'
						}
					]
				},{
					name  : 'required',
					title : '校验规则',
					type  : 'select',
					value : '0',
					options : [
						{
							name : '必选',
							value : '1'
						},
						{
							name : '非必选',
							value : '0'
						}
					]
				},{
					name : "validMsg",
					title : "必填提示",
					value : "必填！",
					type : "input"
				},{
					name : "keyName",
					title : "搜索提示",
					value : "关键字：",
					type : "input"
				},{
					name : "top",
					title : "Y",
					value : 0,
					type : "input"
				},{
					name : "left",
					title : "X",
					value : 0,
					type : "input"
				},{
					name : "width",
					title : "W",
					value : "230",
					type : "input",
					unit:'px'
				},{
					name : "height",
					title : "H",
					value : "26",
					type : "input",
					unit:'px'
				}]
		},
/*		'vTab' :{
			name : 'Tab',
			icon : 'vLabel.png',
			basicSetting : [{
				name : 'width'
				,title : 'W'
				,value : 350
				,type : 'input'
			},{
				name : 'height'
				,title : 'H'
				,value : 40
				,type : 'input'
			},{
				name : 'top'
				,title : 'Y'
				,type : 'input'
				,value : 0
			},{
				name : 'left'
				,title : 'X'
				,type : 'input'
				,value : 0
			},{
				name : 'initData'
				,title : '自定义初始值'
				,type : 'custom'
				,value : [
					{
						name : 'tab-1'
					},{
						name : 'tab-2'
					},{
						name : 'tab-3'
					}
				]
			}]
		},*/
		'vPanel' : {
			name : '容器面板',
			icon : 'stop',
			basicSetting : [{
				name : 'width'
				,title : 'W'
				,value : 300
				,type : 'input'
			},{
				name : 'height'
				,title : 'H'
				,value : 300
				,type : 'input'
			},{
				name : 'top'
				,title : 'Y'
				,type : 'input'
				,value : 0
			},{
				name : 'left'
				,title : 'X'
				,type : 'input'
				,value : 0
			},{
				name : 'borderWidth'
				,title : '边框粗细'
				,unit : 'px'
				,value : 1
				,type : 'input'
			},{
				name : 'borderStyle'
				,title : '边框样式'
				,value : 'solid'
				,type : 'select'
				,options : [{
					name : '无'
					,value : 'none'
				},{
					name : '点状'
					,value : 'dotted'
				},{
					name : '虚线'
					,value :'dashed'
				},{
					name :'实线'
					,value :'solid'
				},{
					name : '双线'
					,value : 'double'
				},{
					name : '3D 凹槽'
					,value : 'groove'
				},{
					name : '3D 垄状'
					,value : 'ridge'
				},{
					name : 'inset 边框'
					,value : 'inset'
				},{
					name : ' 3D outset'
					,value : 'outset'
				}]
			},{
				name : 'borderColor'
				,title : '边框颜色'
				,value : 'balck'
				,type : 'color'
			},{
				name : 'backgroundColor'
				,title : '背景颜色'
				,value : 'white'
				,type : 'color'
			},{
				name : 'borderRadius'
				,title : '圆角程度'
				,value : '0'
				,type : 'input'
				,unit : 'px'
			},{
				name : 'zIndex'
				,title : 'zIndex'
				,value : '1'
				,type : 'input'
			}]
		}

	}
});
