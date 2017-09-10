//  留言列表
(function($) {
    var messageHTML = "http://sandias.xin:8989/Comment/showAllComment";
    var goodsDetail = "http://sandias.xin:8989/Comment/updatelike";
    // var goodsDetail = "http://www.easy-mock.com/mock/598c595aa1d30433d85d2dcd/messageList/goodsdetail";
    // var messageHTML = "http://www.easy-mock.com/mock/598d76b7a1d30433d85e47ae/message/message";
    $.ajaxSetup({
        error: function () {
            alert("调用接口失败");
            return false;
        }
    });
    var str = location.search;
    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }
    $.get(messageHTML+str,function (data) {
            renderTemplate($("#label-template")[0], data.goods, "#label");
            renderTemplate($("#message-template")[0], data.comment, "#message");
            var imgPraise = document.querySelectorAll("#mes-first .iconfont");
            var aLi = document.getElementsByTagName("li");
            var onOff = true;
            for (var i = 0; i < aLi.length; i++) {
                (function(i){
                    touchFunc(imgPraise[i], "click", function () {
                        if(onOff){
                            $.get(goodsDetail,{
                                isLike : 1,
                                commentId: data.comment[i].commentId
                            },function(data){
                                if(data.status) {
                                    imgPraise[i].style.color = "#ff4200";
                                    var num =$(imgPraise[i]).next().html();
                                    num++;
                                    $(imgPraise[i]).next().html(num);
                                    $(imgPraise[i]).next().css("color", "#ff4200");
                                    onOff = false;
                                }
                            });
                        }else{
                            var number = data.comment[i].likeNum;
                            $.get(goodsDetail,{
                                isLike : -1,
                                commentId: data.comment[i].commentId
                            },function(data){
                                if(data.status) {
                                    imgPraise[i].style.color = "#855b31";
                                    var num = number;
                                    $(imgPraise[i]).next().html(num);
                                    $(imgPraise[i]).next().css("color", "#855b31");
                                    onOff = true;
                                }
                            });
                        }
                    });
                })(i)
            }
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
        }
    )
})(jQuery);