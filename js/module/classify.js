//  分类

(function ($) {

    //classify页面地址
    var GETCLASSIFY = "http://sandias.xin:8989/find/findPageAll";

    //渲染模板函数封装
    function renderTemplate(templateSelector,data,htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    //渲染模板
    $.getJSON(GETCLASSIFY,function (data) {
        renderTemplate("#guessLike-template", data, "#like-pics");//猜你喜欢图片渲染
        renderTemplate("#new-template", data, "#new");//最新跳转箭头、商品详情渲染
        renderTemplate("#hot-template", data, "#hot");//最热图片渲染

        //点击换一换
        var clickChange = true;
        var distance = $('.like-pics li')[0].offsetWidth*3;
        touchFunc($('.btn')[0], 'click', function () {

            $('.like-pics img').animate({'opacity': 0},700);
            if(!clickChange){
                distance = 0;
            }else{
                distance = -$('.like-pics li')[0].offsetWidth*3;
            }
            clickChange = !clickChange;
            setTimeout(function change() {
                $('.like-pics').css('left',distance);
                console.log(data.guessLike);
            },700);
            $('.like-pics img').animate({'opacity': 1}, 1000);
        });



    });

    //拼id；
    Handlebars.registerHelper('addId',function (v1,v2) {
        console.log(v1+"?id="+v2);
        return v1+"?id="+v2;
    });

    //底部导航栏，点击和点击后变样式效果
    var b = document.querySelectorAll("#m-nav a");
    $(b[1]).css("color","#ff8a00");
    for (var i = 0; i < b.length; i++) {
        (function (i) {
            touchFunc(b[i],"click",function () {
                $(b[i]).css("color","#ff8a00");
                $(b).not(b[i]).css("color","#ffffff");
            })
        })(i)
    }

    //touch事件封装
    function touchFunc(obj,type,func){
        var init={x:5,y:5,sx:0,sy:0,ex:0,ey:0};
        var sTime=0;
        var eTime=0;
        type=type.toLowerCase();
        obj.addEventListener("touchstart",function(ev){
            var ev=ev||event;
            sTime=new Date().getTime();
            init.sx=ev.targetTouches[0].pageX;
            init.sy=ev.targetTouches[0].pageY;
            init.ex=init.sx;
            init.ey=init.sy;
            if(type.indexOf("start")!=-1){
                func();
            }
        },"false");
        obj.addEventListener("touchmove",function(ev){
            init.ex=ev.targetTouches[0].pageX;
            init.ey=ev.targetTouches[0].pageY;
            if(type.indexOf("move")!=-1){
                func();
            }
        },false);
        obj.addEventListener("touchend",function(){
            var changeX=init.ex-init.sx;
            var changeY=init.ey-init.sy;
            if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y){
                if(changeX>0){
                    if(type.indexOf("right")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("left")!=-1){
                        func();
                    }
                }
            }else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
                if(changeY>0){
                    if(type.indexOf("bottom")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("top")!=-1){
                        func();
                    }
                }
            }else if(Math.abs(changeX)<init.x&&Math.abs(changeY)<init.y){
                eTime=new Date().getTime();
                if(eTime-sTime>300){
                    if(type.indexOf("long")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("click")!=-1){
                        func();
                    }
                }
            }
        },false);
    }

})(jQuery);


