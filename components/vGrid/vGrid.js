/**
 * Created by wy_sf1711 on 2016/7/22.
 * 扩展组件jquery-ui  datagrid
 */
define(function(require){
    require("./vGrid.css");
    var Base = require('components/ComponentBase');
    Base.extend({
        props:["id","config"],
        name:'vGrid',
        options:{},
        template:[
            '<div class="jquery-ui-vgrid"></div>'
        ].join(""),
        data:function(){
            return {}
        },
        methods:{
            onClickRow:function(){
            },
            gridLoadSuccess:function(){},
            /*
            * datagrid 外抛方法
            * @funName:
            * getSelections:获取所有选中的数据，
            * selectAll:选中当前页面所有数据
            * unselectAll:取消当前页面数据选中
            * selectRow:根据index索引选择行数据,param:index索引
            * selectRecord：根据Id选择行数据， param : row.id
            * unselectRow : 根据索引index取消选中 ,param : index 索引
            * refreshRow ： 根据索引index刷新行数据，param：index索引
            * */
            grid:function(funName,param,callback){
                var self = this;
                var ret = "";
                if(param){
                    ret = this.tableGrid.datagrid(funName,param);
                }else{
                    ret = this.tableGrid.datagrid(funName);
                }
                callback && callback.call(self,ret);
            },
            getALlSelectIds:function(){
                var rows = this.tableGrid.datagrid("getSelections") || [];
                var ids = [];
                for(var i=0;i<rows.length;i++){
                    ids.push(rows[i].id);
                }
                return ids;
            },
            getSelections:function(){
                var rows = this.tableGrid.datagrid("getSelections") || [];
                return rows;
            },
            getAllSelectedRow:function(){
                return {
                    pages:{
                        "page_1":{
                            ids:[1,2],
                            row:[{},{}]
                        },
                        "page_2":{
                            ids:[3,4],
                            row:[{},{}]
                        }
                    },
                    allIds:[1,2,3,4],
                    allRow:[{},{},{},{}]
                }
            }
        },
        watch:{},
        attached:function(){
            $.extend($.fn.datagrid.defaults, {
                autoUpdateDetail: true  // Define if update the row detail content when update a row
            });

            var detailview = $.extend({}, $.fn.datagrid.defaults.view, {
                render: function(target, container, frozen){
                    var state = $.data(target, 'datagrid');
                    var opts = state.options;
                    if (frozen){
                        if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
                            return;
                        }
                    }

                    var rows = state.data.rows;
                    var fields = $(target).datagrid('getColumnFields', frozen);
                    var table = [];
                    table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
                    for(var i=0; i<rows.length; i++) {
                        // get the class and style attributes for this row
                        var css = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
                        var classValue = '';
                        var styleValue = '';
                        if (typeof css == 'string'){
                            styleValue = css;
                        } else if (css){
                            classValue = css['class'] || '';
                            styleValue = css['style'] || '';
                        }

                        var cls = 'class="datagrid-row ' + (i % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
                        var style = styleValue ? 'style="' + styleValue + '"' : '';
                        var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + i;
                        table.push('<tr id="' + rowId + '" datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
                        table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
                        table.push('</tr>');

                        table.push('<tr style="display:none;">');
                        if (frozen){
                            table.push('<td colspan=' + (fields.length+(opts.rownumbers?1:0)) + ' style="border-right:0">');
                        } else {
                            table.push('<td colspan=' + (fields.length) + '>');

                        }

                        table.push('<div class="datagrid-row-detail">');
                        if (frozen){
                            table.push('&nbsp;');
                        } else {
                            table.push(opts.detailFormatter.call(target, i, rows[i]));
                        }
                        table.push('</div>');

                        table.push('</td>');
                        table.push('</tr>');

                    }
                    table.push('</tbody></table>');

                    $(container).html(table.join(''));
                },

                renderRow: function(target, fields, frozen, rowIndex, rowData){
                    var opts = $.data(target, 'datagrid').options;

                    var cc = [];
                    if (frozen && opts.rownumbers){
                        var rownumber = rowIndex + 1;
                        if (opts.pagination){
                            rownumber += (opts.pageNumber-1)*opts.pageSize;
                        }
                        cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
                    }
                    for(var i=0; i<fields.length; i++){
                        var field = fields[i];
                        var col = $(target).datagrid('getColumnOption', field);
                        if (col){
                            var value = rowData[field];	// the field value
                            var css = col.styler ? (col.styler(value, rowData, rowIndex)||'') : '';
                            var classValue = '';
                            var styleValue = '';
                            if (typeof css == 'string'){
                                styleValue = css;
                            } else if (cc){
                                classValue = css['class'] || '';
                                styleValue = css['style'] || '';
                            }
                            var cls = classValue ? 'class="' + classValue + '"' : '';
                            var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');

                            cc.push('<td field="' + field + '" ' + cls + ' ' + style + '>');

                            if (col.checkbox){
                                style = '';
                            } else if (col.expander){
                                style = "text-align:center;height:16px;";
                            } else {
                                style = styleValue;
                                if (col.align){style += ';text-align:' + col.align + ';'}
                                if (!opts.nowrap){
                                    style += ';white-space:normal;height:auto;';
                                } else if (opts.autoRowHeight){
                                    style += ';height:auto;';
                                }
                            }

                            cc.push('<div style="' + style + '" ');
                            if (col.checkbox){
                                cc.push('class="datagrid-cell-check ');
                            } else {
                                cc.push('class="datagrid-cell ' + col.cellClass);
                            }
                            cc.push('">');

                            if (col.checkbox){
                                cc.push('<input type="checkbox" name="' + field + '" value="' + (value!=undefined ? value : '') + '">');
                            } else if (col.expander) {
                                if(opts.expandField && rowData[opts.expandField] && rowData[opts.expandField].trim()){
                                    cc.push('<span class="datagrid-row-expander datagrid-row-expand" style="display:inline-block;width:16px;height:16px;cursor:pointer;" />');
                                }else{
                                    cc.push('<span style="display:inline-block;width:16px;"></span>');
                                }
                            } else if (col.formatter){
                                cc.push(col.formatter(value, rowData, rowIndex));
                            } else {
                                cc.push(value);
                            }

                            cc.push('</div>');
                            cc.push('</td>');
                        }
                    }
                    return cc.join('');
                },

                insertRow: function(target, index, row){
                    var opts = $.data(target, 'datagrid').options;
                    var dc = $.data(target, 'datagrid').dc;
                    var panel = $(target).datagrid('getPanel');
                    var view1 = dc.view1;
                    var view2 = dc.view2;

                    var isAppend = false;
                    var rowLength = $(target).datagrid('getRows').length;
                    if (rowLength == 0){
                        $(target).datagrid('loadData',{total:1,rows:[row]});
                        return;
                    }

                    if (index == undefined || index == null || index >= rowLength) {
                        index = rowLength;
                        isAppend = true;
                        this.canUpdateDetail = false;
                    }

                    $.fn.datagrid.defaults.view.insertRow.call(this, target, index, row);
                    _insert(true);
                    _insert(false);

                    this.canUpdateDetail = true;

                    function _insert(frozen){
                        var tr = opts.finder.getTr(target, index, 'body', frozen?1:2);
                        if (isAppend){
                            var detail = tr.next();
                            var newDetail = tr.next().clone();
                            tr.insertAfter(detail);
                        } else {
                            var newDetail = tr.next().next().clone();
                        }
                        newDetail.insertAfter(tr);
                        newDetail.hide();
                        if (!frozen){
                            newDetail.find('div.datagrid-row-detail').html(opts.detailFormatter.call(target, index, row));
                        }
                    }
                },

                deleteRow: function(target, index){
                    var opts = $.data(target, 'datagrid').options;
                    var dc = $.data(target, 'datagrid').dc;
                    var tr = opts.finder.getTr(target, index);
                    tr.next().remove();
                    $.fn.datagrid.defaults.view.deleteRow.call(this, target, index);
                    dc.body2.triggerHandler('scroll');
                },

                updateRow: function(target, rowIndex, row){
                    var dc = $.data(target, 'datagrid').dc;
                    var opts = $.data(target, 'datagrid').options;
                    var cls = $(target).datagrid('getExpander', rowIndex).attr('class');
                    $.fn.datagrid.defaults.view.updateRow.call(this, target, rowIndex, row);
                    $(target).datagrid('getExpander', rowIndex).attr('class',cls);

                    // update the detail content
                    if (opts.autoUpdateDetail && this.canUpdateDetail){
                        var row = $(target).datagrid('getRows')[rowIndex];
                        var detail = $(target).datagrid('getRowDetail', rowIndex);
                        detail.html(opts.detailFormatter.call(target, rowIndex, row));
                    }
                },

                bindEvents: function(target){
                    var state = $.data(target, 'datagrid');

                    if (state.ss.bindDetailEvents){return;}
                    state.ss.bindDetailEvents = true;

                    var dc = state.dc;
                    var opts = state.options;
                    var body = dc.body1.add(dc.body2);
                    var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
                    body.unbind('click').bind('click', function(e){
                        var tt = $(e.target);
                        var tr = tt.closest('tr.datagrid-row');
                        if (!tr.length){return}
                        if (tt.hasClass('datagrid-row-expander')){
                            var rowIndex = parseInt(tr.attr('datagrid-row-index'));
                            if (tt.hasClass('datagrid-row-expand')){
                                $(target).datagrid('expandRow', rowIndex);
                            } else {
                                $(target).datagrid('collapseRow', rowIndex);
                            }
                            $(target).datagrid('fixRowHeight');

                        } else {
                            clickHandler(e);
                        }
                        e.stopPropagation();
                    });
                },

                onBeforeRender: function(target){
                    var state = $.data(target, 'datagrid');
                    var opts = state.options;
                    var dc = state.dc;
                    var t = $(target);
                    var hasExpander = false;
                    var fields = t.datagrid('getColumnFields',true).concat(t.datagrid('getColumnFields'));
                    for(var i=0; i<fields.length; i++){
                        var col = t.datagrid('getColumnOption', fields[i]);
                        if (col.expander){
                            hasExpander = true;
                            break;
                        }
                    }
                    if (!hasExpander){
                        if (opts.frozenColumns && opts.frozenColumns.length){
                            opts.frozenColumns[0].splice(0,0,{field:'_expander',expander:true,width:24,resizable:false,fixed:true});
                        } else {
                            opts.frozenColumns = [[{field:'_expander',expander:true,width:24,resizable:false,fixed:true}]];
                        }

                        var t = dc.view1.children('div.datagrid-header').find('table');
                        var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-expander" style="width:24px;"></div></td>');
                        if ($('tr',t).length == 0){
                            td.wrap('<tr></tr>').parent().appendTo($('tbody',t));
                        } else if (opts.rownumbers){
                            td.insertAfter(t.find('td:has(div.datagrid-header-rownumber)'));
                        } else {
                            td.prependTo(t.find('tr:first'));
                        }
                    }
                },

                onAfterRender: function(target){
                    var that = this;
                    var state = $.data(target, 'datagrid');
                    var dc = state.dc;
                    var opts = state.options;
                    var panel = $(target).datagrid('getPanel');

                    $.fn.datagrid.defaults.view.onAfterRender.call(this, target);

                    if (!state.onResizeColumn){
                        state.onResizeColumn = opts.onResizeColumn;
                    }
                    if (!state.onResize){
                        state.onResize = opts.onResize;
                    }
                    function resizeDetails(){
                        var ht = dc.header2.find('table');
                        var fr = ht.find('tr.datagrid-filter-row').hide();
                        var ww = ht.width()-1;
                        var details = dc.body2.find('>table.datagrid-btable>tbody>tr>td>div.datagrid-row-detail:visible')._outerWidth(ww);
                        // var details = dc.body2.find('div.datagrid-row-detail:visible')._outerWidth(ww);
                        details.find('.easyui-fluid').trigger('_resize');
                        fr.show();
                    }

                    opts.onResizeColumn = function(field, width){
                        if (!opts.fitColumns){
                            resizeDetails();
                        }
                        var rowCount = $(target).datagrid('getRows').length;
                        for(var i=0; i<rowCount; i++){
                            $(target).datagrid('fixDetailRowHeight', i);
                        }

                        // call the old event code
                        state.onResizeColumn.call(target, field, width);
                    };
                    opts.onResize = function(width, height){
                        if (opts.fitColumns){
                            resizeDetails();
                        }
                        state.onResize.call(panel, width, height);
                    };

                    this.canUpdateDetail = true;	// define if to update the detail content when 'updateRow' method is called;

                    var footer = dc.footer1.add(dc.footer2);
                    footer.find('span.datagrid-row-expander').css('visibility', 'hidden');
                    $(target).datagrid('resize');

                    this.bindEvents(target);
                    var detail = dc.body1.add(dc.body2).find('div.datagrid-row-detail');
                    detail.unbind().bind('mouseover mouseout click dblclick contextmenu scroll', function(e){
                        e.stopPropagation();
                    });
                }
            });

            $.extend($.fn.datagrid.methods, {
                fixDetailRowHeight: function(jq, index){
                    return jq.each(function(){
                        var opts = $.data(this, 'datagrid').options;
                        if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
                            return;
                        }
                        var dc = $.data(this, 'datagrid').dc;
                        var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
                        var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
                        // fix the detail row height
                        if (tr2.is(':visible')){
                            tr1.css('height', '');
                            tr2.css('height', '');
                            var height = Math.max(tr1.height(), tr2.height());
                            tr1.css('height', height);
                            tr2.css('height', height);
                        }
                        dc.body2.triggerHandler('scroll');
                    });
                },
                getExpander: function(jq, index){	// get row expander object
                    var opts = $.data(jq[0], 'datagrid').options;
                    return opts.finder.getTr(jq[0], index).find('span.datagrid-row-expander');
                },
                // get row detail container
                getRowDetail: function(jq, index){
                    var opts = $.data(jq[0], 'datagrid').options;
                    var tr = opts.finder.getTr(jq[0], index, 'body', 2);
                    // return tr.next().find('div.datagrid-row-detail');
                    return tr.next().find('>td>div.datagrid-row-detail');
                },
                expandRow: function(jq, index){
                    return jq.each(function(){
                        var opts = $(this).datagrid('options');
                        var dc = $.data(this, 'datagrid').dc;
                        var expander = $(this).datagrid('getExpander', index);
                        if (expander.hasClass('datagrid-row-expand')){
                            expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
                            var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
                            var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
                            tr1.show();
                            tr2.show();
                            $(this).datagrid('fixDetailRowHeight', index);
                            if (opts.onExpandRow){
                                var row = $(this).datagrid('getRows')[index];
                                opts.onExpandRow.call(this, index, row);
                            }
                        }
                    });
                },
                collapseRow: function(jq, index){
                    return jq.each(function(){
                        var opts = $(this).datagrid('options');
                        var dc = $.data(this, 'datagrid').dc;
                        var expander = $(this).datagrid('getExpander', index);
                        if (expander.hasClass('datagrid-row-collapse')){
                            expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
                            var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
                            var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
                            tr1.hide();
                            tr2.hide();
                            dc.body2.triggerHandler('scroll');
                            if (opts.onCollapseRow){
                                var row = $(this).datagrid('getRows')[index];
                                opts.onCollapseRow.call(this, index, row);
                            }
                        }
                    });
                }
            });

            $.extend($.fn.datagrid.methods, {
                subgrid: function(jq, conf){
                    return jq.each(function(){
                        createGrid(this, conf);

                        function createGrid(target, conf, prow){
                            var queryParams = $.extend({}, conf.options.queryParams||{});
                            // queryParams[conf.options.foreignField] = prow ? prow[conf.options.foreignField] : undefined;
                            if (prow){
                                var fk = conf.options.foreignField;
                                if ($.isFunction(fk)){
                                    $.extend(queryParams, fk.call(conf, prow));
                                } else {
                                    queryParams[fk] = prow[fk];
                                }
                            }

                            var plugin = conf.options.edatagrid ? 'edatagrid' : 'datagrid';

                            $(target)[plugin]($.extend({}, conf.options, {
                                subgrid: conf.subgrid,
                                view: (conf.subgrid ? detailview : undefined),
                                queryParams: queryParams,
                                detailFormatter: function(index, row){
                                    return '<div><table class="datagrid-subgrid"></table></div>';
                                },
                                onExpandRow: function(index, row){
                                    var opts = $(this).datagrid('options');
                                    var rd = $(this).datagrid('getRowDetail', index);
                                    var dg = getSubGrid(rd);
                                    if (!dg.data('datagrid')){
                                        createGrid(dg[0], opts.subgrid, row);
                                    }
                                    rd.find('.easyui-fluid').trigger('_resize');
                                    setHeight(this, index);
                                    if (conf.options.onExpandRow){
                                        conf.options.onExpandRow.call(this, index, row);
                                    }
                                },
                                onCollapseRow: function(index, row){
                                    setHeight(this, index);
                                    if (conf.options.onCollapseRow){
                                        conf.options.onCollapseRow.call(this, index, row);
                                    }
                                },
                                onResize: function(){
                                    var dg = $(this).children('div.datagrid-view').children('table')
                                    setParentHeight(this);
                                },
                                onResizeColumn: function(field, width){
                                    setParentHeight(this);
                                    if (conf.options.onResizeColumn){
                                        conf.options.onResizeColumn.call(this, field, width);
                                    }
                                },
                                onLoadSuccess: function(data){
                                    setParentHeight(this);
                                    if (conf.options.onLoadSuccess){
                                        conf.options.onLoadSuccess.call(this, data);
                                    }
                                }
                            }));
                        }
                        function getSubGrid(rowDetail){
                            var div = $(rowDetail).children('div');
                            if (div.children('div.datagrid').length){
                                return div.find('>div.datagrid>div.panel-body>div.datagrid-view>table.datagrid-subgrid');
                            } else {
                                return div.find('>table.datagrid-subgrid');
                            }
                        }
                        function setParentHeight(target){
                            var tr = $(target).closest('div.datagrid-row-detail').closest('tr').prev();
                            if (tr.length){
                                var index = parseInt(tr.attr('datagrid-row-index'));
                                var dg = tr.closest('div.datagrid-view').children('table');
                                setHeight(dg[0], index);
                            }
                        }
                        function setHeight(target, index){
                            $(target).datagrid('fixDetailRowHeight', index);
                            $(target).datagrid('fixRowHeight', index);
                            var tr = $(target).closest('div.datagrid-row-detail').closest('tr').prev();
                            if (tr.length){
                                var index = parseInt(tr.attr('datagrid-row-index'));
                                var dg = tr.closest('div.datagrid-view').children('table');
                                setHeight(dg[0], index);
                            }
                        }
                    });
                },
                getSelfGrid: function(jq){
                    var grid = jq.closest('.datagrid');
                    if (grid.length){
                        return grid.find('>.datagrid-wrap>.datagrid-view>.datagrid-f');
                    } else {
                        return null;
                    }
                },
                getParentGrid: function(jq){
                    var detail = jq.closest('div.datagrid-row-detail');
                    if (detail.length){
                        return detail.closest('.datagrid-view').children('.datagrid-f');
                    } else {
                        return null;
                    }
                },
                getParentRowIndex: function(jq){
                    var detail = jq.closest('div.datagrid-row-detail');
                    if (detail.length){
                        var tr = detail.closest('tr').prev();
                        return parseInt(tr.attr('datagrid-row-index'));
                    } else {
                        return -1;
                    }
                }
            });

            $.fn.datagrid.defaults.loader = function(queryParam, loadSuccess, loadError){
                var opts = $(this).datagrid("options");
                if (!opts.url) {
                    return false;
                }
                //重构查询参数，和后台数据格式匹配。。。
                if(queryParam){
                    queryParam.page = {
                        index:queryParam.pageNumber || queryParam.page,
                        rows:queryParam.pageSize || queryParam.rows
                    }
                }
                delete queryParam["rows"];
                $.ajax({
                    type: opts.method,
                    url: opts.url,
                    data: queryParam,
                    dataType: "json",
                    success: function(data) {
                        //重构data数据源
                        var dataList = data;
                        if(data.data){
                            dataList = {
                                rows:data.data.list,
                                total:data.data.total
                            }
                        }
                        loadSuccess(dataList);
                    },
                    error: function() {
                        loadError.apply(this, arguments);
                    }
                });
            }

            /**
             * Created by wy_sf1711 on 2016/5/11.
             * 页码
             */
//            (function(win){
                $.fn.pageNum = function(pageparam){
                    var containerLayout = $(this);
                    var params = pageparam || {};
                    var pageLayout = new page(containerLayout,params)
                    pageLayout.oninit();
                    function page(){
                        return {
                            template:"<div class='pub_pageNum'></div>",
                            container:arguments[0],
                            firstLoad:true,
                            defaultParam:$.extend({
                                totalPage:3,
                                total:"",
                                pageSize:5,
                                pageList:[5,10,20],
                                currentNum:1,
                                maxShowNum:9,
                                layoutAlign:'center',
                                changeEventFn:function(ret){}
                            },arguments[1]),
                            pageNumObj:{},
                            oninit:function(){
                                $(this.template).html("");
                                this.layout = $(this.template);
                                this.layout.css("text-align",this.defaultParam.layoutAlign)
                                this.container.html(this.layout);
                                this.loadImg();
                                this.createPageNum();
                                this.pageChangeEvent();
                                this.setPageNmChecked(this.defaultParam.currentNum);
                            },
                            /*
                             * 图片处理
                             * */
                            loadImg:function(){
                                var imgArr = [
                                    './src/designer/components/vGrid/images/image_arrow_left_black.png',
                                    './src/designer/components/vGrid/images/image_arrow_left_gray.png',
                                    './src/designer/components/vGrid/images/image_arrow_right_black.png',
                                    './src/designer/components/vGrid/images/image_arrow_right_gray.png'
                                ]
                                for(var i=0;i<imgArr.length;i++){
                                    var img = new Image();
                                    img.src = imgArr[i];
                                }
                            },
                            /*
                             * 构建页码
                             * */
                            createPageNum : function(){
                                var pageHtml = "<ul class='pub_page_ul'><li class='pub_page_pre'> " +
                                    "<img src='./src/designer/components/vGrid/images/image_arrow_left_black.png' style='display:none;' class='pub_page_preblack'>" +
                                    "<img src='./src/designer/components/vGrid/images/image_arrow_left_gray.png' style='display:none;' class='pub_page_pregray'>" +
                                    "</li>";
                                for(var i = 1;i<=this.defaultParam.totalPage;i++){
                                    pageHtml += "<li class='pub_page_item' pageNum='"+i+"' style='display:none;'>"+i+"</li>";
                                }
                                pageHtml += "<li class='pub_page_next'> " +
                                    "<img src='./src/designer/components/vGrid/images/image_arrow_right_black.png' style='display:none;' class='pub_page_nextblack'>" +
                                    "<img src='./src/designer/components/vGrid/images/image_arrow_right_gray.png' style='display:none;' class='pub_page_nextgray'>" +
                                    " </li>" +
                                    "<span class='pub_page_gototext'>跳转到：</span>" +
                                    "<input type='text' class='pub_page_gototxt'>" +
                                    "<li class='pub_page_gotoBtn'>GO</li>" +
                                    "</ul>" +
                                    "<div style='display: inline-block;float:right;margin-right: 10px;'>" +
                                    "<select class='pageListChange' style='width:55px;'>"+this.createPageList(this.defaultParam.pageList)+"</select>" +
                                    "</div>";
                                this.layout.append(pageHtml);
                                this.preBtn = this.layout.find(".pub_page_pre");
                                this.nextBtn = this.layout.find(".pub_page_next");
                                this.preImgBlack = this.layout.find(".pub_page_preblack");
                                this.preImgGray = this.layout.find(".pub_page_pregray");
                                this.nextImgBlack = this.layout.find(".pub_page_nextblack");
                                this.nextImgGray = this.layout.find(".pub_page_nextgray");
                            },
                            /*
                            * 页码列表
                            * */
                            createPageList:function(pageList){
                                var option = "";
                                for(var i=0;i<pageList.length;i++){
                                    if(pageList[i] == this.defaultParam.pageSize){
                                        option += "<option value='"+pageList[i]+"'selected='selected'>"+pageList[i]+"</option>"
                                    }else{
                                        option += "<option value='"+pageList[i]+"'>"+pageList[i]+"</option>"
                                    }
                                }
                                return option;
                            },
                            /*
                             * 页码点击事件
                             * */
                            pageChangeEvent:function(){
                                var self = this;
                                this.layout.on("click",function(e){
                                    var target = e.target;
                                    var targetClass = target.className;
                                    if(targetClass.indexOf("pub_page_item")>=0){
                                        var selectIndex = target.getAttribute("pageNum");
                                        self.setPageNmChecked(selectIndex);
                                    }
                                    if(targetClass.indexOf("pub_page_pre")>=0){
                                        self.prve();
                                    }
                                    if(targetClass.indexOf("pub_page_next")>=0){
                                        self.next();
                                    }
                                });
                                this.layout.find(".pageListChange").on("change",function(){
                                    var value = $(this).val();
                                    self.defaultParam.pageSize = parseInt(value,10);
                                    self.defaultParam.totalPage = Math.ceil(parseInt(self.defaultParam.total,10)/self.defaultParam.pageSize);
                                    self.oninit();
                                });
                                this.layout.find(".pub_page_gototxt").on("change",function(){
                                    var val = this.value;
                                    self.gotoPage(parseInt(val,10));
                                });
                                this.layout.find(".pub_page_gotoBtn").on("click",function(){
                                    var val = self.layout.find(".pub_page_gototxt").val();
                                    self.gotoPage(parseInt(val,10));
                                });
                            },
                            /*
                             * 下一页
                             * */
                            next:function(){
                                if(this.currentNum>=this.defaultParam.totalPage){
                                    return;
                                }
                                this.setPageNmChecked(this.currentNum+1);
                            },
                            /*
                             * 上一页
                             * */
                            prve:function(){
                                if(this.currentNum<=1){
                                    return;
                                }
                                this.setPageNmChecked(this.currentNum-1);
                            },
                            /*
                             * 跳转到某页
                             * */
                            gotoPage:function(indexPage){
                                if(indexPage<=0 || indexPage >this.defaultParam.totalPage){
                                    return;
                                }
                                this.setPageNmChecked(indexPage);
                            },
                            /*
                             * 设置当前选中页码
                             * */
                            setPageNmChecked:function(pageIndex){
                                this.hasSelectedNum && this.hasSelectedNum.removeClass("hasChecked");
                                if(!this.pageNumObj[pageIndex+""]){
                                    this.pageNumObj[pageIndex+""] = this.layout.find(".pub_page_item[pageNum='"+pageIndex+"']");
                                }
                                this.hasSelectedNum = this.pageNumObj[pageIndex+""];
                                this.currentNum = parseInt(pageIndex,10);
                                this.hasSelectedNum.addClass("hasChecked");
                                this.setPreOrNext(parseInt(pageIndex,10));
                                this.setEscli(parseInt(pageIndex,10));
                                if(!this.firstLoad){
                                    this.defaultParam.changeEventFn.call(this,pageIndex,this.defaultParam.pageSize);
                                }
                                this.firstLoad = false;
                            },
                            /*
                             * 判断上一页和下一页是否可用
                             * */
                            setPreOrNext:function(index){
                                if(index === 1){
                                    this.preImgBlack.hide();
                                    this.preImgGray.show();
                                    this.preBtn.addClass("noSelect")
                                }else{
                                    this.preImgGray.hide();
                                    this.preImgBlack.show();
                                    this.preBtn.removeClass("noSelect")
                                }
                                if(index === this.defaultParam.totalPage){
                                    this.nextImgBlack.hide();
                                    this.nextImgGray.show();
                                    this.nextBtn.addClass("noSelect")
                                }else{
                                    this.nextImgGray.hide();
                                    this.nextImgBlack.show();
                                    this.nextBtn.removeClass("noSelect")
                                }
                            },
                            /*
                             * 判断展示区域
                             * */
                            setEscli:function(index){
                                this.layout.find(".pub_page_escli").remove();
                                this.layout.find(".pub_page_item").hide();
                                if(this.defaultParam.totalPage<=9) {
                                    this.layout.find(".pub_page_item").show();
                                    return;
                                }
                                var begin = index - 2 ;
                                var end = index + 2;
                                if(begin<=0){
                                    end = end + Math.abs(index-2)+1;
                                    begin = 1;
                                }
                                if(end>this.defaultParam.totalPage){
                                    begin = begin - (end - this.defaultParam.totalPage);
                                    end = this.defaultParam.totalPage;
                                }
                                for(var i = begin;i<=end;i++){
                                    this.layout.find(".pub_page_item[pageNum='"+i+"']").show();
                                }
                                this.layout.find(".pub_page_item[pageNum='1']").show();
                                this.layout.find(".pub_page_item[pageNum='2']").show();
                                this.layout.find(".pub_page_item[pageNum='"+(this.defaultParam.totalPage - 1)+"']").show();
                                this.layout.find(".pub_page_item[pageNum='"+this.defaultParam.totalPage+"']").show();
                                var escli = "<li class='pub_page_escli'>...</li>";
                                if(begin>3){
                                    this.layout.find(".pub_page_item[pageNum='"+begin+"']").before(escli);
                                }
                                if(end+2 < this.defaultParam.totalPage){
                                    this.layout.find(".pub_page_item[pageNum='"+end+"']").after(escli);
                                }
                            }
                        }
                    }
                    return pageLayout;
                }

            var self = this;
//            self.focusLay = $("body").focusBox();
//            self.focusLay.create();
//            $(this.$el).delegate(".datagrid-row","mouseover",function(e){
//                var target = e.currentTarget;
//                var top = $(target).offset().top;
//                var left = $(target).offset().left;
//                var width = target.offsetWidth;
//                var heigth = target.offsetHeight;
//                self.focusLay.renderPosition(top,left,width,heigth);
//            })
            self.clickFn = {};
            self.clickFnRowData = {};
            this.table = $("<table id='table-grid' class='easyui-datagrid'></table>").appendTo($(this.$el));
            var param = $.extend({
                striped:true,
                pagination:true,
                queryParams:{
                },
                idField:"id"
            },this.config.gridParam);
            var tdHtml = "<thead><tr>"
            for(var t = 0;t<param.columns[0].length;t++){
                tdHtml += '<td field="'+param.columns[0][t].field+'" width="'+param.columns[0][t].width+'">'+param.columns[0][t].title+'</td>'
            }
            tdHtml += "</tr></thead>";
            this.table.append(tdHtml);

            $(this.$el).delegate("button","click",function(e){
                var target = $(e.target);
                var tagFn = target.attr("fnTag");
                if(self.clickFn[tagFn]){
                    self.clickFn[tagFn].call(self,self.clickFnRowData[tagFn]);
                }
            });
            for(var i = 0;i<param.columns[0].length;i++){
                if(param.columns[0][i].createBtn){
                    param.columns[0][i].formatter = function(value,row,index){
                        var btns = this.createBtn.call(this,value,row,index);
                        var btnHtml = "";
                        for(var m=0;m<btns.length;m++){
                            var fnTag = row.id+"_"+btns[m].fnName;
                            self.clickFn[fnTag] = btns[m].clickFn;
                            self.clickFnRowData[fnTag] = row;

                            btnHtml += '<button fnTag="'+fnTag+'" style="'+btns[m].style+'">'+btns[m].title+'</button> ';
                        };
                        return btnHtml;
                    }
                }
            }
            param.columns[0].push(
                {field:'id',title:'ID',hidden:true,align:'left'}
            )
            if(param.expandField){
                param.columns[0].push(
                    {field:param.expandField,title:'expandField',hidden:true,align:'left'}
                )
                param.view = detailview;
                param.detailFormatter = function(index,row){
                    return '<div class="ddv" id="ddv-'+index+'" style="padding:5px 0"></div>';
                }
                param.onExpandRow = function(index,row){
                    param.expandTableParam.onResize=function(){
                        $('#acquisitionTab').datagrid('fixDetailRowHeight',index);
                    }
                    param.expandTableParam.onLoadSuccess=function(){
                        setTimeout(function(){
                            $('#acquisitionTab').datagrid('fixDetailRowHeight',index);
                        },0);
                    }
                    $('#ddv-'+index).datagrid(param.expandTableParam);
                    $('#acquisitionTab').datagrid('fixDetailRowHeight',index);
                }
            }
            param.onLoadSuccess = function(){

                var options = self.tableGrid.datagrid('getPager').data("pagination").options;
                if(!self.pageNum){
                    self.pageNum = $(".datagrid-pager").pageNum({
                        totalPage:Math.ceil(parseInt(options.total,10)/parseInt(options.pageSize,10)),
                        currentNum:options.pageNumber,
                        pageSize:options.pageSize,
                        pageList:options.pageList,
                        total:options.total,
                        changeEventFn:function(ret,pageSize){
                            self.tableGrid.datagrid('load',{
                                pageNumber:ret,
                                pageSize:pageSize,
                                onLoadSuccess:function(){
                                    $(self.$el).find(".datagrid-body").loadScroll && $(self.$el).find(".datagrid-body").loadScroll();
                                }
                            })
                        }
                    });
                }else{

                }
                $(self.$el).find(".datagrid-body").loadScroll && $(self.$el).find(".datagrid-body").loadScroll();
                self.gridLoadSuccess.call(self);
            }
            this.tableGrid = this.table.datagrid(param);

        }
    })
});
