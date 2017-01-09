define(function(require){
	var factory  = require('components/ComponentFactory'),
		Designer = require('helper/Designer');

	factory.loadComponents(); //加载所有组件
	/*Vue.designer = {
		mainForm : {
			components : [
			],
			page : {
				width  : 'auto',
				height : 'auto',
				name   : '自定义表单'
			}
		}
	}

	factory.createMenuPanel(Vue.designer.mainForm);
	factory.createLtComponentList(); //绘制左侧组件列表
	factory.createMainPanel(Vue.designer.mainForm); //绘制中间主面板
	factory.createRtPanel();*/

	Designer.init();

});
