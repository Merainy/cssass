Array.prototype.distinct = function(){
    var
        newArr = [],
        temp = {};
    for(var i = 0, item; (item = this[i]) != null; i++){
        if(!temp[item]){
            newArr.push(item);
            temp[item] = true;
        }
    }
    return newArr;
}
function rgb2hex(rgb) {
    //nnd, Firefox / IE not the same, fxck
    if (rgb.charAt(0) == '#') {
        return rgb;
    }else{
        return rgb.colorHex();
    }
}

//十六进制颜色值域RGB格式颜色值之间的相互转换
//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    var that = this;
    if(/^(rgb)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex;
            }
            if(1 == (aa = hex.split('').length)){
                strHex += '0' + hex;
            }else{
                strHex += hex;
            }
        }
        if(strHex.length !== 7){
            strHex = that;
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};
//-------------------------------------------------
/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
    var sColor = this.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;
    }
};
    //正则
var rgExps = {
        //第一个/和最后一个/
        FL : /^([\/]*)|\/([^\/]*)$/g,
        //冒号左右空格
        CLR : /\s:\s|\s:|:\s|:/g,
        //空格,连续空格,开头空格,{左空格 注：{右边空格构建数组时已被删除，所以不作处理
        space : [/\s/g,/\s\s+/g,/^\s/g,/(\s{)|{/g],
        //property:value;
        property : /([-A-Za-z|\+|\*]+\s*:.*?[;}])/,  //   /([A-Za-z|-]+\s*:(.|\s)*?;)/
        //selector{
        selector : /[^{}/]+{/,
        //css注释
        cssNote : /\/\*([\S\s]*?)\*\//,
        //单引号之间的内容
        SQM : /([\'"])([^\'"\.]*?)\1/,
        //双引号之间的内容
        DQM : /([\""])([^\""\.]*?)\1/,
        //匹配字体
        font : /(font|font-family)\s*:[^;]+;/g,
        //匹配content
        content : /(content\s*:\s*("|'))[^("|')]+(("|')\s*;)/g,
        //匹配url
        url : /(url\()[^\,;]+\)/g,
        //匹配/*[note]*/
        markNote :/\/\*\[note\]\*\//g,
        //;}
        lastSem : /(;+|;\s+)}/g,
        //正则匹配0.x
        snum : /\d+\./,
        //数字值匹配单位
        num : /(-?\d+)(\.\d+)?([a-zA-Z]+)/g,
        //浮点数
        nfloat : /(-?\d+)(\.\d+)?/,
        rgb : /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi,
        hex : /#[0-9a-fA-F]{3,6}/g
    },
    //正则处理
    rgExpHandle = {
        rgExpBuilder : function(rgExp){
            var flg = (rgExp instanceof Array),
                rg = '';
            if(flg){
                for(var len = rgExp.length, i = len -1; i >= 0; i--){
                    rg += rgExp[i].toString().replace(rgExps.FL,'');
                }
            }else{
                rg += rgExp.toString().replace(rgExps.FL,'');
            }
            return new RegExp(rg, arguments[1] != undefined ? arguments[1] : '');
        }
    },
    // 中英对应字体表
    arrfont = [
        ['宋体','微软雅黑','黑体','华文细黑','华文黑体','微软正黑体','新宋体','新细明体','仿宋','楷体'],
        ['SimSun','Microsoft YaHei','SimHei','STHeiti Light [STXihei]','STHeiti','Microsoft JhengHei','NSimSun','PMingLiU','FangSong','KaiTi']
    ],
    //获取
    get = {
        val : function(id){
            return document.getElementById(id).value;
        },
        fmt : function(str){
            var
                rgExpNote = range(rgExps.cssNote).r,
                rgExpSelector = range(rgExps.selector).r,
                rgExpProperty = range(rgExps.property).r,
                //TODO 属性之间含有逗号的匹配
                rgExpPropertyC = /value[^value]+value/,
                rgExpCB = range(/}/).r,
                rgExpCBl = range(/}/).l,
                rgExpCBlr = range(/}/).lr;
            function range(rgExp){
                return {
                    lr :  [/(\s*|(\n\r)*)/,rgExp,/(\s*|(\n\r)*)/],
                    r : [/(\s*|(\n\r)*)/,rgExp],
                    l : [rgExp,/(\s*|(\n\r)*)/]
                };
            }
            //注释后格式
            function note(){
                return _alwaysGet(rgExps.cssNote,'',rgExpNote);
            }
            //组选择器的,格式
            function selectorClr(){
                return _alwaysGet(/,/,',\n\r',rgExpSelector);
            }
            //{左格式 注：{右边空格构建数组时已被删除，所以不作处理
            function obl(){
                return _alwaysGet(/{/,'{ ',rgExpSelector);
            }
            //:左右格式
            function colonlr(){
                return _alwaysGet(/:/,': ',rgExpProperty);
            }
            //;左右格式
            function slr(){
                return _alwaysGet(/;/,'; ',rgExpProperty);
            }
            //}右格式 左边格式放以后全局处理
            function cbr(){
                return _alwaysGet(/}/,' }\n\r',rgExpCB);
            }
            function cbl(){
                return _alwaysGet(/}/,' }',rgExpCBl);
            }
            function cblr(){
                return _alwaysGet(/}/,' }\n\r',rgExpCBlr);
            }
            //属性中的,格式
            function propertyClr(){
                return _alwaysGet(/,/,', ',rgExpPropertyC);
            }
            //二级缩进
            function indent(){
                var rgExpIndent = /[^\n|{]\s*/, //  /(\s*|(\n\r)*)/ 包括回车的缩进
                    rgExpsSubstr = rgExpHandle.rgExpBuilder([/selector2/,rgExpIndent]),
                    arr = str.match(rgExpsSubstr),
                    len = !arr ? 0 : arr.length,
                    s = '';
                for(var i = 0; i < len; i++){
                    if(rgExpIndent.test(arr[i])){
                        s = arr[i];
                        return _getFmt(s,rgExpIndent)[0];
                    }
                }
                return '';
            }
            function _getFmt(str,rgExp){
                return rgExp.exec(str);
            }
            function _alwaysGet(rgExpTest,d,rgExpsSubstr){
                var
                    rgExp = rgExpHandle.rgExpBuilder(rgExpsSubstr),
                    arr = str.match(rgExp),
                    len = !arr ? 0 : arr.length,
                    rgExpFmt = rgExpHandle.rgExpBuilder(range(rgExpTest).lr,'g'),
                    s = '';
                for(var i = 0; i < len; i++){
                    if(rgExpTest.test(arr[i])){
                        s = arr[i];
                        return _getFmt(s,rgExpFmt)[0];
                    }
                }
                return d;
            }
            return {
                note : note(),
                selectorClr : selectorClr(),
                obl : obl(),
                colonlr : colonlr(),
                slr : slr(),
                cbl : cbl(),
                cbr : cbr(),
                cblr : cblr(),
                propertyClr : propertyClr(),
                indent : indent()
            }
        },
        //获取注释
        note : function(str){
            var rgExp = rgExpHandle.rgExpBuilder(rgExps.cssNote,'g');
            return str.match(rgExp);
        },
        //获取字体
        font : function(str){
            return str.match(rgExps.font);
        },
        url : function(str){
            return str.match(rgExps.url);
        },
        content : function(str){
            return str.match(rgExps.content);
        },
        num : function(str){
            return str.match(rgExps.num);
        },
        //构建并返回序列arr
        sortArr : function(str){
            str = str.replace(rgExps.space[0], '');
            return str.split(',');
        },
        space : function(str,l,r){
            var
                //常用格式 hash 表
                hs = [
                    [str,str + ' ',str + '  ',str + '   ',str + '    '],
                    [' ' + str,' ' + str + ' ',' ' + str + '  ',str + '   ',' ' + str +  '    ']
                ],
                s = '';
            if(l > 2 || r > 4){
                for(var len = l, i = len - 1; i >= 0; i--){
                    s += ' ';
                }
                s += ':';
                for(var len = r, i = len - 1; i >= 0; i--){
                    s += ' ';
                }
            }else{
                s = hs[l][r];
            }
            return s;
        },
        rgb : function(str){
            return str.match(rgExps.rgb);
        },
        hex : function(str){
            return str.match(rgExps.hex);
        }
    },
    //标记
    mark = {
        NOTE : '/*[note]*/',
        FONT : 'font: ;',
        CONTENT : 'content: ;',
        URL : '/*[url]*/',
        NUM : '/*[num]*/',
        RGB : '/*[rgb]*/',
        HEX : '/*[hex]*/',
        //标记注释
        note : function(str){
            var rgExp = rgExpHandle.rgExpBuilder(rgExps.cssNote,'g');
            return str.replace(rgExp, this.NOTE);
        },
        font : function(str){
            return str.replace(rgExps.font, this.FONT);
        },
        content : function(str){
            return str.replace(rgExps.content, this.CONTENT);
        },
        url : function(str){
            return str.replace(rgExps.url, this.URL);
        },
        num : function(str){
            return str.replace(rgExps.num, this.NUM);
        },
        rgb : function(str){
            return str.replace(rgExps.rgb, this.RGB);
        },
        hex : function(str){
            return str.replace(rgExps.hex, this.HEX);
        },
        recover : function(str,real,marker,colonlr){
            var item;
            if(real){
                for(var i = 0, len = real.length; i < len; i++){
                    item = real[i].replace(rgExps.CLR,colonlr);
                    str = (function(css){
                        css = css.replace(marker,item);
                        return css;
                    })(str);//逐个替换标记
                }
            }
            return str;
        }
    },
    //删除
    del = {
        //删除注释
        note : function(str){
            return str.replace(rgExps.cssNote, '');
        }
    },
    //整理
    tidy = {
        //中文转换英文
        cnToEn : function(f,arrfont,len,rgExp){
            var m = f.match(rgExp);
            if(m){
                //TODO 优化循环 数组去重方式，采用全局替换
                for(var i = len; i >= 0; i--){
                    var
                        b = arrfont[0][i];
                    if(m[0] == b){
                        f = f.replace(b,arrfont[1][i]);
                        break;
                    }
                }
                return arguments.callee(f,arrfont,len,rgExp);
            }
            return f;
        },
        //最终规范字体输出
        font : function(str,realfont,colonlr){
            var
                item,
                afl = arrfont[0].length - 1;//font中英文对照表长度
                rgExp = (function(fonts){
                    var
                        _rgExp = '';
                    for(var i = afl; i >= 0; i--){
                        _rgExp += fonts[0][i] + (i == 0 ? '' : '|');
                    }
                    return new RegExp(_rgExp,'g');
                })(arrfont);
            if(realfont){
                for(var i = 0, len = realfont.length; i < len; i++){
                    item = realfont[i].replace(rgExps.space[1],' ');
                    item = item.replace(rgExps.CLR,colonlr);
                    item = this.cnToEn(item,arrfont,afl,rgExp);
                    str = (function(css){
                        css = css.replace(mark.FONT,item);
                        return css;
                    })(str);//递归替换标记
                }
            }
            return str;
        },
        //TODO优化
        num : function(str,realNum,isDelZB,isDelZ){
            var item,
                n,
                zero = false;
            if(realNum){
                for(var i = 0, len = realNum.length; i < len; i++){
                    item = realNum[i];
                    if(isDelZB){
                        if(realNum[i].match(rgExps.nfloat)[0] == 0){
                            item = '0';
                            zero == true;
                        }
                    }
                    if(!zero && isDelZ){
                        n = realNum[i].match(rgExps.nfloat)[0];
                        item =  (0 < n && n < 1) ?  item.replace('0.','.') : item;
                    }
                    str = (function(css){
                        css = css.replace(mark.NUM,item);
                        return css;
                    })(str);//递归替换标记
                }
            }
            return str;
        },
        rgb : function(str,realRgb,isHex){
            var item;
            if(realRgb && isHex){
                for(var i = 0, len = realRgb.length; i < len; i++){
                    item = rgb2hex(realRgb[i].toLowerCase());
                    str = (function(css){
                        css = css.replace(mark.RGB,item);
                        return css;
                    })(str);
                }
            }
            return str;
        },
        zip : function(str){
            str = str.replace(rgExps.space[1],' ');
            return str.replace(rgExps.CLR,':');
        },
        selectorFmt : function(selector,arrRp){
            return selector.replace(/\n/g,'')
                           .replace(rgExps.space[2],arrRp[0])
                           .replace(/(,\s)|,/g, arrRp[1])
                           .replace(/(\s{)|{/g,arrRp[2]);
        },
        propertyFmt : function(property,arrRp){
            return property.replace(':', arrRp[0]).replace(';',arrRp[1]).toLowerCase();
        },
        //删除undefined
        delUn : function(arr){
            var a = [],
                str;
            for(var len = arr.length, i = len - 1; i >= 0; i--){
                if(arr[i] instanceof Array){
                    for(var len = arr[i].length, j = len - 1; j >= 0; j--){
                        if(arr[i][j] == undefined){
                            arr[i].splice(j,1);
                        }
                    }
                    str = arr[i].join('');
                }else{
                    str = arr[i];
                }
                a.unshift(str)
            }
            return a;
        },
        lastSem : function(css,isDelLastSem,cbl){
            if(isDelLastSem){
                return css.replace(rgExps.lastSem,cbl);
            }else{
                cbl = ';'+ cbl;
                return css.replace(rgExps.lastSem,cbl);
            }
        },
        core : function(op){
            var
                rgSp = rgExpHandle.rgExpBuilder([rgExps.property,'/|/',rgExps.selector,'/|/',rgExps.cssNote,'/|/',/}/],'g'),
                arrCss = op.strCss.replace(/\n/g,'').match(rgSp),
                len = arrCss.length,
                item,
                fmt = get.fmt(op.strformat),
                sortArrlen,
                arrline = [],
                arr = [],
                isMatch,
                index,
                m = 0,
                p = 0,
                pp = 0,
                css;
            arrline.length = sortArrlen = op.arrSort.length;
            for(var i = 0; i < len; i++){
                item = arrCss[i];
                if(item.match(rgExps.property)){
                    isMatch = false;
                    for(var j = sortArrlen - 1; j >= 0; j--){
                        if(rgExpHandle.rgExpBuilder([op.arrSort[j]],'g').test(item)){
                            isMatch = true;
                            index = j;
                            break;
                        }
                    }
                    item = this.propertyFmt(item,[fmt.colonlr,fmt.slr]);
                    //移除最后一个分号
                    if(op.isDelLastSem){
                        /}/.test(item) && m--;
                        isMatch ? (arrline[index + 1] == undefined ? arrline.splice(index + 1,1,item) : arrline.splice(index + 1,1,arrline[index + 1] + item)) : arrline.push(item);
                    }else{
                        if(/}/.test(item)){
                            m--;
                            item = item.replace('}', ';' + fmt.cbr);
                            isMatch ? arrline.splice(index + 1,1,item) : arrline.push(item);
                            arr.push(arrline);
                            arrline = [];
                        }
                        else{
                            isMatch ? (arrline[index + 1] == undefined ? arrline.splice(index + 1,1,item) : arrline.splice(index + 1,1,arrline[index + 1] + item)) : arrline.push(item);
                        }
                    }
                }else if(item.match(rgExps.selector)){
                    item = this.selectorFmt(item,['',fmt.selectorClr,fmt.obl]);
                    m++;
                    if(m == 2){
                        item = fmt.indent + item;
                        if(p == 1){
                            var ind = fmt.cbr.match(/\n/);
                            item = (ind != null ? ind + item : item);
                        }
                    }
                    arrline.splice(m,1,item);
                    p = m;
                }else if(item.match(/}/)){
                    m--;
                    arrline.push(fmt.cblr);
                    arr.push(arrline);
                    arrline = [];
                    pp = m;
                }else if(item.match(rgExps.markNote)){
                    item = item.replace('/*[note]*/',fmt.note);
                    arr.push(item);
                }
                else{
                    arrline.push(item);
                }
            }
            css = this.delUn(arr).join('');
            //缓存用户hex颜色
            realHex = get.hex(css)
            //标记hex
            css = mark.hex(css);
            //缓存用户rbg颜色
            realRgb = get.rgb(css);
            //标记rgb
            css = mark.rgb(css);
            //缓存用户数字
            realNum = get.num(css);
            //标记数字
            css = mark.num(css);
            //还原font
            css = this.font(css,op.realFont,fmt.colonlr);
            //还原url
            css = mark.recover(css,op.realUrl,mark.URL,fmt.colonlr);
            //还原content
            css = mark.recover(css,op.realContent,mark.CONTENT,fmt.colonlr);
            //还原note
            css = mark.recover(css,op.realNote,mark.NOTE,fmt.colonlr);
            //还原数字
            css = this.num(css,realNum,op.isDelZBehind,op.isDelZ);
            //还原hex颜色
            css = mark.recover(css,realHex,mark.HEX,'');
            //还原rgb颜色
            css = this.rgb(css,realRgb,op.isHex);
            //处理最后的分号
            css = tidy.lastSem(css,op.isDelLastSem,fmt.cbl);

            return css;
        }
    }

