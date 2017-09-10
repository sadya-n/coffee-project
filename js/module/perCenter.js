(function($){

    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    $.ajax({
        type: "GET",
        url: "http://sandias.xin:8989/homePage/showHomepage",
        dataType: "json",
        success: function (data) {
            renderTemplate($("#nav-middle"),data,$("#perCer-body"));
        },
        error: function () {
            alert('调用接口失败!');
        }

    });

    function touchFunc(obj,type,func) {//对象  时间 执行的函数
        //滑动范围在5x5内则做点击处理，s是开始，e是结束
        var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};//判断手指是点击还是拖拽（不超过5 点击） 落下时起始位置 落下的开始之间 抬起的的时间
        var sTime = 0, eTime = 0;
        type = type.toLowerCase();//字符串中大写转小写

        obj.addEventListener("touchstart",function(){
            sTime = new Date().getTime();//起始时间
            init.sx = event.targetTouches[0].pageX;//当前手指位置
            init.sy = event.targetTouches[0].pageY;
            init.ex = init.sx;//结束时=开始时
            init.ey = init.sy;
            if(type.indexOf("start") != -1) func();
        }, false);//点击开始

        obj.addEventListener("touchmove",function() {
            event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
            init.ex = event.targetTouches[0].pageX;//结束为止永远=当前位置
            init.ey = event.targetTouches[0].pageY;
            if(type.indexOf("move")!=-1) func();//move的时候干什么  写到这
        }, false);

        obj.addEventListener("touchend",function() {
            var changeX = init.sx - init.ex;//手指起始位置-抬起时位置，用正负判断移动方向
            var changeY = init.sy - init.ey;
            if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y) {
                //左右事件 （往哪个方向移动，）
                if(changeX > 0) {//向左移动
                    if(type.indexOf("left")!=-1) func();
                }else{//右
                    if(type.indexOf("right")!=-1) func();
                }
            }
            else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
                //上下事件
                if(changeY > 0) {
                    if(type.indexOf("top")!=-1) func();
                }else{
                    if(type.indexOf("down")!=-1) func();
                }
            }
            else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){//点击事件
                eTime = new Date().getTime();
                //点击事件，此处根据时间差细分下
                if((eTime - sTime) > 300) {
                    if(type.indexOf("long")!=-1) func(); //长按
                }
                else {
                    if(type.indexOf("click")!=-1) func(); //当点击处理
                }
            }
            if(type.indexOf("end")!=-1) func();//touch结束
        }, false);
    }

    //底部导航栏，点击和点击后变样式效果
    var b = document.querySelectorAll("#footer a");
    $(b[3]).css("color","#ff8a00");
    for (var i = 0; i < b.length; i++) {
        (function (i) {
            touchFunc(b[i],"click",function () {
                $(b[i]).css("color","#ff8a00");
                $(b).not(b[i]).css("color","#ffffff");
            })
        })(i)
    }
})(jQuery);

