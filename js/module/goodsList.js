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

touchFunc($("#up")[0],'click',function(){
    $("body").scrollTo(300);
    return false;
});
$(window).scroll(function() {
    if($(window).scrollTop()>0){
        $("#up")[0].style.display = 'block';
    }else{
        $("#up")[0].style.display = 'none';
    }
});
function renderTemplate(templateSelector,data,htmlSelector) {
    var t = $(templateSelector).html();
    var f = Handlebars.compile(t);
    var h = f(data);
    $(htmlSelector).html(h);
}
(function($) {
    var searchgoods = "http://sandias.xin:8989/goods/searchGoodsByText";
    var eatgoods = "http://sandias.xin:8989/goods/findGoodsByCategory?id=1";
    var drinkgoods = "http://sandias.xin:8989/goods/findGoodsByCategory?id=2";
    var diygoods = "http://sandias.xin:8989/goods/findGoodsByCategory?id=3";
    var moregoods = "http://sandias.xin:8989/goods/findGoodsByCategory?id=4";
    var hotgoods = "http://sandias.xin:8989/goods/findGoodsBySalesCount";
    var newgoods = "http://sandias.xin:8989/goods/findGoodsByCreateTime";
    var information=[];
    var info1 = location.search;
    for(var i=0;i<info1.length;i++){
        if(info1[i]!="&"){
            information.push(info1[i]);
        }
        else{
            break;
        }
    }
    var accept = information.join("");
    switch (accept){
        case "?id=search" :  ensure = searchgoods;break;
        case "?id=eat" :  ensure = eatgoods;break;
        case "?id=drink" :  ensure = drinkgoods; break;
        case "?id=diy" : ensure = diygoods;break;
        case "?id=more" : ensure = moregoods;break;
        case "?id=hot" :  ensure = hotgoods;break;
        case "?id=new" :  ensure = newgoods;break;
        default : ensure = "http://sandias.xin:8989/goods/searchGoodsByText"+accept;
    }
    $.ajax({
        type:"GET",
        url:ensure,
        dataType:"json",
        success:function (data) {
            renderTemplate ( $("#good-template") , data , $("#good") );
            var arr=data.list;
            for(var i=0 ; i<$(".intro").length ; i++) {
                $(".intro").eq(i).attr("href","detail.html?id="+arr[i].id);
            }
        }
    })

})(jQuery);

