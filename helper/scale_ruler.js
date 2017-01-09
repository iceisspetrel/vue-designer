define(function(requrie){
	requrie('lib/jquery-scroll/scroll.css');
	requrie('lib/jquery-scroll/easyscroll');
	requrie('lib/jquery-scroll/mousewheel');
	var helper = requrie('helper/helper');
	return  {
		init : function(seletor){
			this.$el = $(seletor)
			this.$el.ruler({
				 showCrosshair : false,
    			showMousePos: false
			});
			this.$('div.tick').remove();
			this.$('div.ruler').css('background-color','rgba(0,0,0,0)');
			//this.$('div.ef-ruler>div').css('border','0px');
			// this.$('div.ef-ruler').css('overflow','hidden'); // 滚动条

			// this.$('div.ef-ruler').scroll_absolute({arrows:true});
			this.$('.top').css('width','100%');
			this.tcanvas = $('<canvas style="position:absolute;top:0px;left:0px;width:100%;height:100%;"></canvas>').appendTo(this.$('.top'))[0];
			this.lcanvas = $('<canvas style="position:absolute;top:0px;left:0px;width:100%;height:100%;"></canvas>').appendTo(this.$('.left'))[0];
			var that = this;
			helper.addListener('resize',function(){
				this.$('div.tick').remove();
				this.$('.top').css('width','100%');
				this.refresh();
			},this);
			this._drawView();
			this.$leftline =  this.$('div.left-line');
			this.$topline = this.$('div.top-line');
			this.$dtop = $('<div style="width:100%;left:0px;display:none;z-index:999999999; position:absolute;border-top:1px dashed rgb(154,154,154);"></div>');
			this.$dleft = $('<div style="display:none; height:100%;position:absolute;z-index:999999999; top:0px; border-left:1px dashed rgb(154,154,154);"></div>');
			this.$('div.ef-ruler').append(this.$dtop);
			this.$('div.ef-ruler').append(this.$dright);
			this.$('div.ef-ruler').append(this.$dbottom);
			this.$('div.ef-ruler').append(this.$dleft);
			helper.on('EVENT_DRAG_START',function(){
				this.$dtop.show();
				this.$dleft.show();
			},this).on('EVENT_DRAG_END',function(){
				this.$dtop.hide();
				this.$dleft.hide();
			},this).on('EVENT_DRAG_DRAG',function(x,y){
				this.$dtop.css('top',(y+18)+'px');
				this.$dleft.css('left',(x + 18) + 'px');
				this.$leftline.css('top',y+'px');
				this.$topline.css('left' , x + 'px');
			},this);
		}
		,$ : function(seletor){
			return $(seletor,this.$el);
		}
		,refresh : function(){
			this._drawView();
		}
		,_drawView : function(){
			this._drawTop();
			this._drawLeft();
		}
		,_drawTop : function(){
			var ctx = this.tcanvas.getContext('2d')
			,width = this.tcanvas.clientWidth || this.tcanvas.offsetWidth
			,height = this.tcanvas.clientHeight || this.tcanvas.offsetHeight
			,offsetY = 18
			,offsetX = 0;
		 	this.tcanvas.width = width;
			this.tcanvas.height = height ;
			for(var i = offsetX , j = 0 ; i < width ; i += 10 , j ++){
				if(j === 5){
					this._drawLine(ctx,[i,offsetY - 9],[i , offsetY ]);
				}else if(j === 10){
					ctx.fillStyle ='#535d71';
					ctx.fillText(i - offsetX,i + 5,10);
					this._drawLine(ctx , [i,3],[i , offsetY ]);
					j = 0;
				}else{
					this._drawLine(ctx , [i,offsetY - 6],[i , offsetY ]);
				}
			}
		}
		,_drawLeft : function(){
			var ctx = this.lcanvas.getContext('2d')
			,width = this.lcanvas.clientWidth || this.lcanvas.offsetWidth
			,height = this.lcanvas.clientHeight || this.lcanvas.offsetHeight
			,offsetY = 0
			,offsetX = 18;
		 	this.lcanvas.width = width;
			this.lcanvas.height = height ;
			for(var i = offsetY , j = 0; i < height ; i += 10 , j ++){
				if(j === 5){
					this._drawLine(ctx , [offsetX - 9,i],[offsetX ,i]);
				}else if(j === 10){
					ctx.save();
					ctx.fillStyle ='#535d71';
					ctx.textAlign = "center";
					ctx.translate(offsetX - 15,i + 12);
					ctx.rotate(90 *  Math.PI / 180);
					ctx.fillText(i - offsetY,0,0);
					ctx.restore();
					this._drawLine(ctx , [3,i],[offsetX ,i]);
					j = 0;
				}else{
					this._drawLine(ctx , [offsetX - 6,i],[offsetX ,i]);
				}
			}
		}
		,_drawLine : function(ctx,p1,p2){
			ctx.save();
			ctx.translate(0.5,0.5);  
			ctx.lineWidth = 1;  
			ctx.beginPath();  
			ctx.moveTo(p1[0],p1[1]);
			ctx.lineTo(p2[0],p2[1]);
			ctx.stroke();  
			ctx.restore();  
		}
	}
});