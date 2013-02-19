(function(mp){
    var myplug = {
            prefix : 'mp-',
            tab : {
                grp : 'tab-group',
                t : 'tab-title',
                con : 'tab-con'
            },
            radio :{
                grp : 'radio-group'

            },
            item : 'item',
            get : function(plug){
                //方便定义前缀，防止class冲突
                return $('.' + this.prefix + plug);
            },
            param : function(defaults,param){
                return $.extend(defaults,param || {});
            }

        },
        plug = {
            tab : function(param){
                var defaults = {
                        e : 'click',
                        st : 0,
                        cls : 'cur'
                    },
                    tabGroup = myplug.get(myplug.tab.grp),
                    tabTitle = myplug.get(myplug.tab.t),
                    tabCon = myplug.get(myplug.tab.con),
                    titleCls = myplug.prefix + myplug.tab.t;
                tabGroup && tabGroup.each(function(){
                    var tha = $(this),
                        cfg = myplug.param(defaults,$.parseJSON(tha.attr('param'))),
                        cls = cfg.cls;
                    $(this).live('click',function(){
                        var et = $(event.target).hasClass(titleCls),
                            etp = $($(event.target).parents('.' + titleCls)[0]).hasClass(titleCls);
                        if(et || etp){
                            var t = tha.find(tabTitle),
                                c = tha.find(tabCon),
                                thi = et ? $(event.target)[0] : $(event.target).parents('.' + titleCls)[0];
                            index = $.inArray(thi,t);
                            if(tabCon.eq(index)){
                                t.removeClass(cls).eq(index).addClass(cls);
                                c.hide().stop(false,true);
                                cfg.st == 0 ? c.eq(index).show() :
                                    cfg.st == 1 ? c.eq(index).fadeIn(300) : c.eq(index).slideDown(300);
                            }
                        }
                    })
                })
            },
            radio : function(){
                var rdGroup = myplug.get(myplug.radio.grp),
                    cls = myplug.prefix + myplug.item;
                rdGroup && rdGroup.each(function(){
                    var tha = $(this);
                    tha.live('click',function(){
                        var et = $(event.target).hasClass(cls),
                            etp = $($(event.target).parents('.' + cls)[0]).hasClass(cls);
                        if(et || etp){
                            var thi = et ? $(event.target)[0] : $(event.target).parents('.' + titleCls)[0],
                                val = $(thi).attr('val'),
                                cur = !tha.attr('param') ?  'cur' : tha.attr('param');
                            $(thi).addClass(cur);
                            $(thi).siblings().removeClass(cur);
                            mp().radio(val,tha);
                            return false;
                        }
                    });
                });
            },
            ckbox : function(){

            },
            progress : function(){

            },
            select : function(){

            },
            dialog : function(){

            },
            guid : function(){

            }
        };
    plug.tab();
    plug.radio();
})(mp);
