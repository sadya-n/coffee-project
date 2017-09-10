//  首页
(function($){
    //获取地址
    var index="http://sandias.xin:8989/indexPage";
    $.ajaxSetup({
        error:function() {
            alert("调用接口失败");
            return false;
        }
    });
    function renderTemplate(templateSelector,data,htmlSelector) {
        var t=$(templateSelector).html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $(htmlSelector).html(h);
    }
    $.getJSON(index,function(data){
        renderTemplate($("#banner-template")[0],data.banner,$(".banner"));
        renderTemplate($("#card-template"),data.card,$(".like-pics"));
        renderTemplate($("#description-template"),data.category,$("#description"));
        renderTemplate($("#search-template"),data,$("#search"));

        var liNum = data.banner.length;
        //console.log($("#banner").length);

        for (var i = 0; i < liNum; i++) {
            $("<li>").appendTo($(".list"));
        }
        $(".list").css({"width": (liNum * 20) / 100 + "rem", "margin-left": (-liNum * 20 / 2) / 100 + "rem"});
        $(".list li").eq(0).addClass("active");
        $("#banner").html($("#banner").html() + $("#banner").html());
        $("#banner").css("width", $(".header")[0].offsetWidth * data.banner.length * 2);

        //搜索框的数据渲染
        var ee=document.querySelector("#searchCard");
        touchFunc(ee,"click",function () {
            var bb=document.querySelector("#searchUrl");
            var name=bb.value;
            $("#search a").attr("href","goodsList.html?name="+name);
        });
    });
    //换一换
    $.getJSON(index,function(data){
        var index=3;
        var distance=$(".like-pics li")[0].offsetWidth;
        touchFunc($(".btn")[0],"click",function () {
            index--;
            if(index==0){
                distance=0;
                index=3;
            }
            else{
                distance=-$(".like-pics li")[0].offsetWidth*index;
            }
            setTimeout(function charge(){
                $(".like-pics").css("left",distance);
            },300);
            $(".like-pics img").velocity({"opacity":1})
        });

    });

        //轮播效果图，左右滑动轮播图效果


    var nowImg = 0;
    var isOn = true;


//console.log($(".banner li")[0].offsetWidth);

    function fn() {
        if (isOn) {
            isOn = false;
            nowImg++;
            //console.log($(".banner")[0].offsetLeft);
            $("#banner").velocity({"left": -$("#banner li")[0].offsetWidth * nowImg}, {
                    complete: function () {
                        //console.log($(".banner li").length);
                        if (nowImg == $("#banner li").length / 2) {
                            nowImg = 0;
                            $("#banner").css("left", "0");
                        }
                        $(".list li").eq(nowImg).addClass("active").siblings().removeClass("active");
                        isOn = true;

                    }
                }
            )
        }
    }


    function toRight() {
        if (isOn) {
            isOn = false;
            if (nowImg == 0) {
                nowImg = 3;
                $("#banner").css("left", -$("#banner li")[0].offsetWidth * nowImg);
            }
            nowImg--;
            $("#banner").velocity({"left": -$("#banner li")[0].offsetWidth * nowImg}, {
                complete: function () {
                    isOn = true;
                }
            });
            $(".list li").eq(nowImg).addClass("active").siblings().removeClass("active");
        }
    }

    timer = setInterval(fn, 1600);

    touchFunc($("#banner")[0], "left", function () {
        fn();
    });
    touchFunc($("#banner")[0], "right", function () {

        clearInterval(timer);
        toRight();


    });

//底部导航栏，点击和点击后变样式效果
    var b = document.querySelectorAll("#m-nav a");
    $(b[0]).css("color","#ff8a00");
    for (var i = 0; i < b.length; i++) {
        (function (i) {
            touchFunc(b[i],"click",function () {
                $(b[i]).css("color","#ff8a00");
                $(b).not(b[i]).css("color","#ffffff");
            })
        })(i)
    }
// touchFunc start
    function touchFunc(obj,type,func) {
        var init = {x:5, y:5, sx:0, sy:0, ex:0, ey:0};
        var sTime = 0;
        var eTime = 0;
        type = type.toLowerCase();
        obj.addEventListener("touchstart", function(ev) {
            var ev = ev || event;
            sTime = new Date().getTime();
            init.sx = ev.targetTouches[0].pageX;
            init.sy = ev.targetTouches[0].pageY;
            init.ex = init.sx;
            init.ey = init.sy;
            if(type.indexOf("start") != -1){
                func();
            }
        }, "false");
        obj.addEventListener("touchmove", function(ev) {
            init.ex = ev.targetTouches[0].pageX;
            init.ey = ev.targetTouches[0].pageY;
            if(type.indexOf("move") != -1){
                func();
            }
        }, false);
        obj.addEventListener("touchend", function() {
            var changeX = init.ex - init.sx;
            var changeY = init.ey - init.sy;
            if(Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > init.y){
                if(changeX > 0){
                    if(type.indexOf("right") != -1){
                        func();
                    }
                } else{
                    if(type.indexOf("left") != -1){
                        func();
                    }
                }
            }else if(Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > init.x) {
                if(changeY > 0){
                    if(type.indexOf("bottom") != -1){
                        func();
                    }
                }else{
                    if(type.indexOf("top") != -1){
                        func();
                    }
                }
            }else if(Math.abs(changeX) < init.x && Math.abs(changeY) < init.y){
                eTime = new Date().getTime();
                if(eTime - sTime > 300){
                    if(type.indexOf("long") != -1){
                        func();
                    }
                }else{
                    if(type.indexOf("click") != -1){
                        func();
                    }
                }
            }
        },false);
    }
// touchFunc end


    var h = $(window).height();
//console.log(h);为何不同页面同一电脑的$(window).width()不同
    $(window).on("resize", function () {
        //console.log(this)  window
        var h1 = $(this).height();
        if (h - h1 > 50) {
            $("#m-nav").hide();
        } else {
            $("#m-nav").show();
        }
    });

})(jQuery)
