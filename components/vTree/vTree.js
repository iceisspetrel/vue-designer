define(function(require){
	require('designer/lib/jquery-ztree/jquery.ztree.all.min');
	require('components/vTree/vTree.css');
	var defaultsetting = {
			check: {
				enable: false
				,chkboxType :{ "Y": "ps", "N": "ps" }
				,radioType  : 'all'
			},
			data: {
				simpleData: {
					enable: true
				}
			}
			,view : {
				showLine : false
				,selectedMulti: false
				,showIcon : false
				,expandSpeed : ""
			}
		};
	var zNodes =[
		{ id:1, pId:0, name:"节点1", open:true},
		{ id:11, pId:1, name:"节点2", open:true},
		{ id:21, pId:11, name:"节点3"}
	];
	function isObject(obj){
		return '[object Object]' === Object.prototype.toString.call(obj);
	}
	// 实现简单的继承
	function extend(toproto,oldproto){
		for(var attr in oldproto){
			if(isObject(oldproto[attr])){
				toproto[attr] = extend({},oldproto[attr]);
			}else{
				toproto[attr] = oldproto[attr];
			}
		}
		return toproto;
	}

	// 获取父亲点下有展开节点  
	function getDeepPnode(node){
		var _deep = 0;
		node.children.map(function(item,index){
			if(item.isParent && item.open){
				_deep += getDeepPnode(item);
			}
			_deep += 1;
		});
		return _deep;
	}
	// 获取节点上一兄弟结点
	function getPreDeep(node){
		var _deep = 0;
		if(node.isParent && node.open){
			_deep += getDeepPnode(node);
		}
		var pre = node.getPreNode();
		if(pre) _deep += (1 + getPreDeep(pre));
		else _deep += 1;
		return _deep;
	}
	// 获取节点从下往上的深度
	function getDeep(node){
		var pre =  node.getPreNode() , _deep = 1;
		if(pre){
			_deep += getPreDeep(pre);
		}
		var parent = node.getParentNode();
		while(parent){
			pre = parent.getPreNode();
			if(pre){
				_deep += getPreDeep(pre);
			}
			_deep += 1;
			parent = parent.getParentNode();
		}
		return _deep;
	}

	function getNodeByNode(node,deep){
		var _node;
		node.children.some(function(item){
			deep -= 1
			if(!deep){
				_node = item;
				return true;
			}
			if(item.isParent && item.open){
				var _res = getNodeByNode(item,deep);
				if(typeof _res != 'number'){
					_node = _res;
					return true;
				}
				deep = _res;
			}
			return false;
		});
		return _node || deep; 
	}
	function getNodeByDeep(tree,deep){
		if(typeof deep != 'number') return null;
		var _node;
		tree.getNodes().some(function(node){
			deep -= 1;
			if(!deep){
				_node = node;
				return true;
			}
			if(node.isParent && node.open){
				var _res = getNodeByNode(node,deep);
				if(typeof _res != 'number'){
					_node = _res;
					return true;
				}
				deep = _res;
			}
			return false;		
		});
		return _node;
	}

	function getShowCount(nodes){
		var count = 0;
		nodes = nodes || this.getNodes();
		nodes.map(function(_node){
			count ++ ;
			if(_node.isParent && _node.open){
				count += getShowCount(_node.children);
			}
		});
		return count;
	}
	// 选择单个节点
	function selectNode(node,index,single){
		if(!index) index = getDeep(node) - 1;
		if(single){
			this.checkedlist = [{
				top : 27 * index + 'px'
				,display : 'static'
				,name : node.name
			}];
			return;
		}
		if(typeof this.checkIndex[node.id] === 'undefined'){
			if(node.checked){
				this.checkIndex[node.id] = this.checkedlist.push({
					top : 27 * index + 'px'
					,display : 'static'
					,name : node.name
				}) - 1;
			}
		}else{
			var isHidden = (function(pnode){
				while(pnode){
					if(!pnode.open) return true;
					pnode = pnode.getParentNode();
				}
				return false;
			})(node.getParentNode());
			this.checkedlist.$set(this.checkIndex[node.id],node.checked && !isHidden ?  {
				top : 27 * index + 'px'
				,display : 'static'
				,name : node.name
			} : {
				display : 'none'
				,name : node.name
			});
		}
	}
	// 选择所有选中的节点 
	function selectAllNode(){
		if(this.config.chkStyle === '') return;
		var that = this;
		this.method('transformToArray',this.getNodes()).map(function(node){
				selectNode.call(that,node);
		});
	}
	require('components/ComponentBase').extend({
		
		name : 'vTree',

		props : ['id', 'config'],

		options : {
			url : ''
			,params : {}
			,dataFilter : function(data) { return data;}	
			,async : true
			,relateCheck : true // 当点击时,是否关联选中
			,isList : true // 是否为列表形式(带表格显示方式)
			,checkInherit : true // 选中子节点或父节点时 父节点或子节点是否关联选中
			,initData : []
			,chkStyle : 'checkbox' // 
			,onCheck : function(){ console.log('check');} // 选中节点时触发,当relateCheck为true或chkStyle为''时不触发
			,onClick : function(){console.log('click');} //点击节点时触发
			,onExpand : function(){ console.log('onExpand');} // 用于捕获节点被展开/关闭的事件回调函数
			,modeType : 'normal'
		},
		template : [
			'<div :class="class" >'
				,'<div v-if="isEdit" class="tree-back-edit"></div>'
				,'<div :class="hoverclass" name="hover" style="display:none;"></div>'
				,'<div :class="hoverclass" v-for="val in checkedlist" :style="val"></div>'
				,'<ul id="tree_{{id}}" class="ztree"></ul>'
			,'</div>'
		].join(''),
		attached : function(){
			var that = this;
			
			this.tree = $("#tree_"+this.id).zTree.init($("#tree_"+this.id), this.getSetting(),this.config.initData); // this.config.initData
			var $hover = $(that.$el).find('div[name=hover]');
			selectAllNode.call(that);
			if(this.config.modeType === 'edit') return;
			var _lastnode;
			$(this.$el).mousemove(function(evt){
				var _rect = that.$el.getBoundingClientRect();
				var _index = Math.floor( (evt.clientY - _rect.top ) / 27  );
				var _node  = getNodeByDeep(that.tree,_index+1);
				if(_node){
					$hover.css('top',27 * _index +'px');
					$hover.show();
				}
				if(_lastnode  && _lastnode != _node){
					$('#tree_'+that.id).zTree._z.view.removeTreeDom(that.tree.setting,_lastnode);
				}
				if(_node && (_lastnode != _node || !$('tree_'+_node.tId + '_add').length) && !_node.editNameFlag){
					$('#tree_'+that.id).zTree._z.view.addHoverDom(that.tree.setting,_node);
					_lastnode = _node;
				}
			}).mouseout(function(evt){
				if(!$(evt.target).closest('div.tree-back').length){
					$('#tree_'+that.id).zTree._z.view.removeTreeDom(that.tree.setting,_lastnode);
				}
				$hover.hide();
			}).click(function(evt){
				var _rect = that.$el.getBoundingClientRect()
					,_index = Math.floor( (evt.clientY - _rect.top ) / 27  )
					,_node = getNodeByDeep(that.tree,_index+1)
					,_tagName = evt.target.tagName;
				if(!_node || ( _tagName === 'SPAN' &&  (  /(check)|(span)/.test(evt.target.id) || ( /(switch)/.test(evt.target.id) && _node.isParent) ) )){
					return;
				}
				if(that.config.chkStyle != ''){ // 是选中模式
					if(+that.config.relateCheck){
						that.tree.checkNode(_node,undefined,true,true);
					}
				}else{
					selectNode.call(that,_node,undefined,true);
				}
			});
		},
		data : function(){ // 这里是全局属性
			return {
				class :  +this.config.isList ? ['tree-back','tree-back-list'] : 'tree-back'
				,hoverclass : +this.config.isList  ? 'tree-back-img' : 'tree-back-border'
				,checkedlist : []
				,checkIndex : {}
				,isEdit : this.config.modeType === 'edit'
			};
		},
		watch : {
			'config.isList' : function(newval,oldval){
				this.class = +newval ? ['tree-back','tree-back-list'] : 'tree-back';
				this.hoverclass = +newval ? 'tree-back-img' : 'tree-back-border';
			}
			,'config.chkStyle' : function(newval,oldval){
				if(newval === '' || oldval === ''){
					this.tree.setting.check.chkStyle = newval;
					this.tree.setting.check.enable = newval != '';
					this.tree.refresh();
				}
			}
			,'config.initData' : function(newval,oldval){
				$("#tree_"+this.id).zTree.destroy();
				this.tree = $("#tree_"+this.id).zTree.init($("#tree_"+this.id), this.getSetting(),newval);
				if(this.config.modeType === 'edit'){
					//this.$parent.config.height  = getShowCount.call(this) * 28 + 10;
				}
			}
		},
		methods : { // 这里是全局方法
			// 动态 返回 setting 方便重新渲染数据
			getSetting : function(){
				var that = this;
				var setting = $.extend({},defaultsetting,{
					check : {
						chkStyle : this.config.chkStyle === '' ?  ''  : 'checkbox'
						,enable : this.config.chkStyle != '' //是否显示选中按键 
						,chkboxType : (this.config.chkStyle != 'radio' && +this.config.checkInherit) ? { "Y": "ps", "N": "ps" } : {'Y':'' , 'N':''}
					}
					,edit : {
						showRenameBtn : true
						,enable  : true
					}
					,view : {
						addHoverDom : function(id,node){
							if(node.editNameFlag) return;
							var aObj = $("#" + node.tId + "_a");
							if ($("#tree_"+node.tId+'_add').length>0) return;
							var editStr = '<span class="button add" id="tree_'+node.tId+'_add" title="rename" treenode_edit="" style=""></span>';
							aObj.append(editStr);

							var btn = $("#tree_"+node.tId+'_add');
							if (btn) btn.bind("click", function(){
								that.addNodes(node,{name : 'test'},-1);
							});
						}
						,removeHoverDom : function(id,node){
							$('#tree_'+node.tId + '_add').remove();
						}
					}
					,callback :{
						onClick : function(evt,id,node){
							var _tree = this.getZTreeObj(id);
							if(+that.config.relateCheck){
								_tree.checkNode(node,undefined,true,true);
							}
							if(that.config.chkStyle === ''){
								selectNode.call(that,node,undefined,true);
							}
							that.config.onClick && that.config.onClick(node,_tree);
						}
						,onCheck : function(evt,id,node){
							if(!+that.config.relateCheck){
								that.config.onCheck && that.config.onCheck(node,_tree);
							}
							selectAllNode.call(that);
						}
						,onCollapse : function(evt,id,node){
							selectAllNode.call(that);
							that.config.onExpand && that.config.onExpand(node,this.getZTreeObj(id),false);
						}
						,onExpand : function(evt,id,node){
							selectAllNode.call(that);
							that.config.onExpand && that.config.onExpand(node,this.getZTreeObj(id),true);
						}
						,beforeEditName : function(id,node){
							$('#tree_'+node.tId + '_add').remove();
						}
						,beforeCheck : function(id,node){
							if(that.config.chkStyle === 'radio'){
								that.checkAllNodes(false);
							}
							return true;
						}
					}
				});
				if(!this.config.initData.length && this.config.url){
					$.extend(setting,{
						async : {
							enable : this.config.async
							,dataFilter : function(id,nuse,data){
								return that.config.dataFilter(data,this.getZTreeObj(id));
							}
							,url : function(id,node){
								return typeof that.config.url === 'string'  
										? that.config.url
										: that.config.url(node,this.getZTreeObj(id));
							}
							,type :'GET'
							,dataType : 'text'
							,otherParam : this.config.params
						}
					});
				}
				return setting;
			},
			/**
			*新增节点 
			*	@pnode { Node | String} 指定父节点 ,可传入节点ID
			*	@node 	{ Node | String} 要插入的节点 ,可传入节点ID
			*	@index 	{ Number } 要插入的位置 不传入时默认在最后
			*
			*/
			addNodes : function(pnode,node,index){
				if(typeof pnode === 'string'){
					pnode = this.getNodeByTId(pnode);
				}
				if(typeof node === 'string'){
					node = this.getNodeByTId(node);
				}
				this.method('addNodes',pnode,index,node);
			}
			/*
			* 移除节点 
			*	@node {Node | String } 要移除的节点 可传入节点 ID
			**/
			,removeNode : function(node){
				if(typeof node === 'string'){
					node = this.getNodeByTId(node);
				}
				this.method('removeNode',node);
			}
			/**
			* 选中/取消选中所有的节点 
			*	@tag {Boolean} true 选中所有 false 取消选中所有 
			*
			*
			**/
			,checkAllNodes : function(tag){
				this.method('checkAllNodes',tag);
			}
			/**
			*
			* 选中/取消选中某一节点 
			*	node {Node | String }	操作节点 可传入节点 ID
			*	checked {Boolean } true 选中节点  false 取消选择
			**/
			,checkNode : function(node,checked){
				if(typeof node === 'string'){
					node = this.getNodeByTId(node);
				}
				this.method('checkNode',node,checked);
			}
			/**
			*	展开/折叠所有节点 
			*	tag {Boolean} true 展开所有节点 false 折叠所有节点
			*
			*/
			,expandAll : function(tag){
				this.method('expandAll',tag);
			}
			/**
			* 展开 / 折叠某一节点 
			*	node {Node | String } 要操作的节点 支持传入节点ID
			*	tag {Boolean} true 展开节点  false 折叠节点 
			**/
			,expandNode : function(node,tag){
				if(typeof node === 'string'){
					node = this.getNodeByTId(node);
				}
				this.method('expandNode',node,tag);
			}
			/**
			* 获取所有选中/未选中节点 
			*	tag {Boolean} true 获取选中节点  false 获取未选中节点 
			**/
			,getCheckedNodes : function(tag){
				return this.method('getCheckedNodes',tag);
			}
			/**
			* 根据节点ID获取节点
			* id {String } 节点 ID
			*/
			,getNodeByTId : function(id){
				return this.method('getNodeByTId',id);
			}
			/**
			* 获取节点在当前层级的位置
			*	node {Node | String} 支持节点 ID
			**/
			,getNodeIndex : function(node){
				if(typeof node === 'string'){
					node = this.getNodeByTId(node);
				}
				return this.method('getNodeIndex',node);
			}
			/**
			*	获取所有节点 
			**/
			,getNodes : function(){
				return this.method('getNodes');
			}
			/**
			* 扩展tree方法
			*	arguments[0] {String} 方法名称
			* 	arguments[1] --- arguments[n] 方法参数 
			*/
			,method : function()
			{
				if(arguments.length < 1) return null;
				var name = arguments[0] , params = Array.prototype.slice.call(arguments,1);
				if(this.tree[name] && 'function' === typeof this.tree[name])
				{
					return this.tree[name].apply(this.tree,params);
				}
				return null;
			}
			,getValue:function(){
				return this.getCheckedNodes();
			}
		}
	});
});
