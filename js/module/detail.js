//  详情//渲染模板
(function($){
    var str=location.search;
    var detail="http://sandias.xin:8989/goodsDetail/findGoodsInform"+str;
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
    $.getJSON(detail,function(data) {
       // console.log(data);
        renderTemplate($("#detail-template"), data, "#m-detail0");
      //  console.log(data.detailImg);
        renderTemplate($("#three-template"), data.detailImg, ".picture");
        renderTemplate($("#buy-template"), data, ".buy");

        //封装
        //touchFuncStart
        function touchFunc(obj, type, func) {
            var init = {x: 5, y: 5, sx: 0, sy: 0, ex: 0, ey: 0};
            var sTime = 0;
            var eTime = 0;
            type = type.toLowerCase();
            obj.addEventListener("touchstart", function (ev) {
                var ev = ev || event;
                sTime = new Date().getTime();
                init.sx = ev.targetTouches[0].pageX;
                init.sy = ev.targetTouches[0].pageY;
                init.ex = init.sx;
                init.ey = init.sy;
                if (type.indexOf("start") != -1) {
                    func();
                }
            }, "false");
            obj.addEventListener("touchmove", function (ev) {
                init.ex = ev.targetTouches[0].pageX;
                init.ey = ev.targetTouches[0].pageY;
                if (type.indexOf("move") != -1) {
                    func();
                }
            }, false);
            obj.addEventListener("touchend", function () {
                var changeX = init.ex - init.sx;
                var changeY = init.ey - init.sy;
                if (Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > init.y) {
                    if (changeX > 0) {
                        if (type.indexOf("right") != -1) {
                            func();
                        }
                    } else {
                        if (type.indexOf("left") != -1) {
                            func();
                        }
                    }
                } else if (Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > init.x) {
                    if (changeY > 0) {
                        if (type.indexOf("bottom") != -1) {
                            func();
                        }
                    } else {
                        if (type.indexOf("top") != -1) {
                            func();
                        }
                    }
                } else if (Math.abs(changeX) < init.x && Math.abs(changeY) < init.y) {
                    eTime = new Date().getTime();
                    if (eTime - sTime > 300) {
                        if (type.indexOf("long") != -1) {
                            func();
                        }
                    } else {
                        if (type.indexOf("click") != -1) {
                            func();
                        }
                    }
                }
            }, false);
        }
        //touchFuncEnd
        //收藏特效
        //点击收藏给后台传数据
        var coll= document.querySelector("#collection");
        var off=true;

        touchFunc(coll,"click",function () {
            //收藏成功
            if(off==true){
                coll.style.color="#ff8a00";
                off=false;
                $.get("http://sandias.xin:8989/goodsDetail/collect",{
                    id:str.replace(/[^0-9]+/g,'')
                })
            }
            //取消收藏
            else{
                coll.style.color="#7d5426";
                off=true;
                $.get("http://sandias.xin:8989/collectionfind/deleteCollection",{
                    id:str.replace(/[^0-9]+/g,'')
                })
            }
        });

        //加入购物车点击收起界面
        var addCar= document.querySelector("#addCar");
        var buyNow=document.querySelector("#buyNow");
        var open=document.querySelector(".open");
        var more=document.querySelector(".more");
        //加入购物车规格出现于隐藏
        var determine0=document.querySelector("#determine0");
        var determine1=document.querySelector("#determine1");
        touchFunc(addCar,"click",function () {
            $(".open").css("display","block");
            $(".open").velocity({"bottom":0+"rem"},{duration:200});
            $(".more").css("display","block").velocity({"opacity":"0.3"},{duration:300});
            $("#determine1").css("display","none");
            $("#determine0").css("display","block");

            touchFunc(determine0,"click",function () {
                $(".open").css("display","none");
                $(".more").css("display","none");
                $.get("http://sandias.xin:8989/goodsDetail/addGoods",{
                    id:str.replace(/[^0-9]+/g,''),
                    size:size0,
                    count:$("#count").html()
                })
            })
        });
        //立即购买
        touchFunc( buyNow,"click",function () {
            $(".open").css("display","block");
            $(".open").velocity({"bottom":0+"rem"},{duration:200});
            $(".more").css("display","block").velocity({"opacity":"0.3"},{duration:300});
            $("#determine0").css("display","none");
            $("#determine1").css("display","block");
           /* $(".open").css("display","block");
            $(".open").velocity({"bottom":0+"rem"},{duration:200});
            $(".more").css("display","block").velocity({"opacity":"0.3"},{duration:300});
            $("#determine0").css("display","none");
            $("#determine1").css("display","flex");*/
            touchFunc(determine1,"click",function () {
                determine1.href="dinTable.html";
                $.get("http://sandias.xin:8989/goodsDetail/addGoods",{
                    id:str.replace(/[^0-9]+/g,''),
                    size:size0,
                    count:parseInt($("#count").html())
                })
            })
        });
        var close=document.querySelector("#close");
        touchFunc(close,"click",function () {
            open.style.display="none";
            more.style.display="none";
        });
        touchFunc(more,"click",function () {
            open.style.display="none";
            more.style.display="none";
        });
        //大中小的选择特效
        var size = document.querySelectorAll(".size input");
        $(size[0]).css("background-color","#855b31");
        $(size[0]).css("color","#fff");
        var size0="big";
        for (var i = 0; i < size.length; i++) {
            (function (i) {
                touchFunc(size[i],"click",function () {
                    $(size[i]).css("background-color","#855b31");
                    $(size).not(size[i]).css("background-color","#ffffff");
                    $(size[i]).css("color","#fff");
                    $(size).not(size[i]).css("color","#855b31");
                    var sizeStr = encodeURI(encodeURI($(".size input")[i].className));
                    if(sizeStr == 'big'){
                        size0 = 'big';
                    }else if(sizeStr == 'mid'){
                        size0 = 'mid';
                    }else{
                        size0 = 'small';
                    }
                })
            })(i)
        }
//加减的效果
        var plus=document.querySelector("#plus");
        var reduce=document.querySelector("#reduce");
        var count=document.querySelector("#count");
        touchFunc( plus,"click",function () {
            count.innerHTML++;
        });
        touchFunc(reduce, "click", function () {
            if(count.innerHTML>1) {
                count.innerHTML--;
            }
        });

//点击确定跳转页面
    });
})(jQuery);