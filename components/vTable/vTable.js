define(function(require){
	require('components/vTable/vTable.css');
	var Cell = function(rs,cs){
		this.rowspan = rs === undefined ? 1 : rs;
		this.colspan = cs === undefined ? 1 : cs;
	}
	var Table = function(row,col){
		this.row = row;
		this.col = col;
		this.row = [];
		for(var i = 0 ; i < this.row ; i ++){
			var col = [];
			for(var j = 0 ; j < this.col ; j ++){
				col.push(new Cell());
			}
			this.row.push(col);
		}
	}
	Table.prototype.addRow = function(i){
		var row = [];
		for(var i = 0; i < this.row.length ; i ++){
			var cell = this.row[i];
			if(cell.rowspan === 1 && cell.colspan === 1 ){
				row.push(new Cell());
			}
		}
	}
	Table.prototype.addCol = function(i){

	}
	Table.prototype.merge = function(row,col){
		var cell ;
		try { cell= this.table[row][col]; }
		catch(e){}
		if(cell){

		}
	}
	return require('components/ComponentBase').extend({
		name : 'vTable', // 必要参数
		options : {
			row : 3 // 行
			,col : 3 // 列
		}, // 入参默认参数,必须全部写上
		config : {
		},
		template : [
			'<table class="table">'
				,'<tr v-for="i in row">'
					,'<td :style="style" v-for="j in col"></td>'
				,'</tr>'
			,'</table>'
		].join(''),
		props : ['id', 'config', 'wrap'],
		data : function(){ // 内部数据
			return {
				row : this.config.row
				,col : this.config.col
				,tclass : ''
				,rclass : ''
				,style : {
					width : (300 / this.config.col ) + 'px'
				}
			};
		},
		watch : { // 监听器

		},
		methods : { // 方法
		},
	});
});
