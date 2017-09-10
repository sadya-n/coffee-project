//  收藏列表
(function ($) {
    function renderTemplate(templateSelector,data,htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }
    $(window).scroll(function() {
        if($(window).scrollTop()>20){
            $("#top")[0].style.display = 'block';
        }else{
            $("#top")[0].style.display = 'none';
        }
    });
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
    jQuery.fn.scrollTo = function(speed) {
        var targetOffset = $(this).offset().top;
        $('html,body').stop().animate({scrollTop: targetOffset}, speed);
        return this;
    };
    touchFunc($("#top")[0],'click',function(){
        $("body").scrollTo(300);
        return false;
    });
    $.ajax({
        type:"GET",
        url:"http://sandias.xin:8989/collectionfind/findCollection",
        dataType:"json",
        success:function (data) {
            var arr=data.list;
            renderTemplate ( $("#collect-template") , data , $("#collect") );
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
            touchFunc($("#top")[0],'click',function(){
                $("body").scrollTo(300);
                return false;
            });
            for(var i=0 ; i<$(".intro").length ; i++) {
                $(".intro").eq(i).attr("href","detail.html?id="+arr[i].id);
                (function(i){
                    touchFunc($(".cancel")[i],"click",function () {
                        $.get("http://sandias.xin:8989/collectionfind/deleteCollection", {
                            id : arr[i].id
                        }, function (data) {
                            if(data.status){
                                $(".collect").eq(i).css("display","none");
                            }
                        });
                    })
                }(i))
            }
        }
    });
})(jQuery);