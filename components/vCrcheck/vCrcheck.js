/**
 * Created by wy_sf1711 on 2016/7/18.
 */
define(function(require){
    var Base = require('components/ComponentBase');
    Base.extend({
        name : 'vCrcheck',
        props : ['id', 'config'],
        template:[
            '<div class="v-CRCheck" style="white-space: nowrap;" :style="style">',
            '<template v-for="item in datas">',
            '<label><input v-if="disabled" :type="type" disabled v-on:change="_change" checked="{{value.indexOf(item.value)>=0 ? \'checked\' : undefined}}" :value="item.value" :name="tag"/>',
            '<input v-if="!disabled" :type="type" v-on:change="_change" checked="{{value.indexOf(item.value)>=0 ? \'checked\' : undefined}}" :value="item.value" :name="tag"/>',
            '{{item.title}}</label>',
            '</template>',
            '</div>'
        ].join(''),
        data:function(){
            window.vcheck = this;
            var datas = {
                type:'checkbox',
                modeType:'nomarl',//
                tag:new Date().getTime()+Math.floor(Math.random(100)*100),
                disabled:false,
                value:'1,2,3',
                style:{
                    width:"100px",
                    border:""
                },
                datas:[
                    {title:"value1",value:"1"},
                    {title:"value2",value:"2"},
                    {title:"value2",value:"3"}
                ]
            };
            return datas;
        },
        methods:{
            getValue:function(){
                return {status:"",value:this.value};
            },
            setValue:function(val){
                this.value = val;
            },
            checkValidate:function(){
                return {status:false,message:""}
            },
            _change:function(event){
                var target = event.target;
                var value = target.value;
                if(this.type === "radio"){
                    this.value = value;
                }else{
                    if(target.checked){
                        this.value.indexOf(value)>=0 ? this.value : (!this.value ? this.value += value : this.value += ","+value);
                    }else{
                        var valueArr = this.value.split(",");
                        valueArr.indexOf(value)>=0 ? valueArr.splice(valueArr.indexOf(value),1) : "";
                        this.value = valueArr.join(",");
                    }
                }
            }
        },
        watch:{
            'config.width':function(newVaule,oldValue){
                this.style.width = newVaule + 'px';
            },
            'config.zIndex':function(newVaule,oldValue){
                this.style.zIndex = newVaule;
            },
            'config.height':function(newVaule,oldValue){
                this.style.height = newVaule + 'px';
            },
            'config.top':function(newVaule,oldValue){
                this.style.top = newVaule + 'px';
            },
            'config.left':function(newVaule,oldValue){
                this.style.left = newVaule + 'px';
            },
            'value':function(newValue,oldValue){

            }
        }
    })
})