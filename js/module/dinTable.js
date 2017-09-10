//  餐桌
(function($) {
    var dinTable = "http://sandias.xin:8989/ShopCar/selectAllShopCarGoods";
    var updateHerfUrl = "http://sandias.xin:8989/ShopCar/updateGoodsNum";
    var deleteHerfUrl = "http://sandias.xin:8989/ShopCar/deleteGoods";
    var acountHerfUrl = "http://sandias.xin:8989/ShopCar/updateShopCarTotal";
    // var dinTable = "http://www.easy-mock.com/mock/5986d039a1d30433d8568050/table/list/table";
    // var deleteHerfUrl = "http://www.easy-mock.com/mock/5986d039a1d30433d8568050/table/list/delete";
    // var updateHerfUrl = "http://www.easy-mock.com/mock/598ff30ca1d30433d85f86e0/goods/update";
    // var acountHerfUrl = "http://www.easy-mock.com/mock/5986d039a1d30433d8568050/table/list/account";
    $.ajaxSetup({
        error:function () {
            alert("调用接口失败");
            return false;
        }
    });
    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }
    function refreshGoods(num) {
        $.get(dinTable, function(data) {
            renderTemplate("#current-template", data.cart[num], "#current");
            $(".all").html(data.cart.length);
            renderTemplate("#box-template", data.cart[num], "#box");
            renderTemplate("#coffeename-template", data.cart[num], "#coffeename");
            renderTemplate("#numPrice-template", data.cart[num], "#numPrice");
        });
    }
    $.get(dinTable, function(data) {
        renderTemplate("#current-template", data.cart[num], "#current");
        $(".all").html(data.cart.length);
        renderTemplate("#box-template", data.cart[num], "#box");
        renderTemplate("#coffeename-template", data.cart[num], "#coffeename");
        renderTemplate("#definiteNum-template", data.cart[num], "#definiteNum");
        renderTemplate("#numPrice-template", data.cart[num], "#numPrice");
        var arr = [ ];
        for(var i=0;i<data.cart.length;i++){
            arr.push(data.cart[i].count);
        }
        touchFunc(left1, "click", function () {
            if(num>0){
                num-=1;
            }else{
                num=$(".all").html()-1;
            }
            refreshGoods(num);
            $("#definiteNum span").html(arr[num]);
        });
        touchFunc(right1, "click", function () {
            if(num<$(".all").html()-1){
                num+=1;
            }else{
                num=0;
            }
            $("#definiteNum span").html(arr[num]);
            refreshGoods(num);
        });
        touchFunc($("#number  #less")[0], "click",function() {
            if($("#definiteNum span").html()>1) {
                var lessId = data.cart[num].id;
                $.get(updateHerfUrl, {
                    goodsDetailId : lessId,
                    count : parseInt($("#definiteNum span").html())-1
                }, function (data) {
                    if (data.status) {
                        var goodsNum = $("#definiteNum span").html();
                        if (goodsNum > 0) {
                            goodsNum--;
                        }
                        $("#definiteNum span").html(goodsNum);
                        arr[num] = goodsNum;
                    }
                })
            }
        });
        touchFunc($("#number #add")[0], "click",function() {
            var addId = data.cart[num].id;
            $.get(updateHerfUrl, {
                goodsDetailId : addId,
                count : parseInt($("#definiteNum span").html())+1
            }, function(data){
                if(data.status){
                    var goodsNum = $("#definiteNum span").html();
                    goodsNum++;
                    $("#definiteNum span").html(goodsNum);
                    arr[num] = goodsNum;
                }
            })
        });
        touchFunc($("#box")[0], "left", function () {
            if(num<$(".all").html()-1){
                num+=1;
            }else{
                num=0;
            }
            $("#definiteNum span").html(arr[num]);
            refreshGoods(num);
        });
        touchFunc($("#box")[0], "right", function () {
            if(num>0){
                num-=1;
            }else{
                num=$(".all").html()-1;
            }
            $("#definiteNum span").html(arr[num]);
            refreshGoods(num);
        });
    });
    var num=0;
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
    Handlebars.registerHelper("addOne", function (v) {
        return v+1;
    });
    function openChange () {
        $("#nowBuy").css({"display" : "block"});
        $("#cover").css({"display" : "block"});
        $.get(dinTable,function (data) {
            renderTemplate("#goodsList-template",data.cart,"#goodsList");
            var allCount = 0;
            for(var i=0;i<data.cart.length;i++){
                allCount += parseInt(data.cart[i].count);
            }
            $("#nowNumber .totalNum").html(allCount);
            var allMoney = 0;
            for(var i=0;i<data.cart.length;i++){
                allMoney += data.cart[i].count * data.cart[i].price;
            }
            $("#summation .totalNum").html(allMoney);
            var aLi=document.querySelectorAll("#goodsList li");
            for(var i=0;i<aLi.length;i++){
                (function(i){
                    var bOn =1;//记录是否被选择
                    //点一下减
                    touchFunc(aLi[i],"click",function(){
                        if(bOn) {//已经选择的,并且再次点击
                            $.get(deleteHerfUrl,{
                                visi : 1,
                                deleteGoods : data.cart[i].id
                            },function(){
                                console.log(data.cart[i].id);
                                $(aLi[i]).css("color", "#977558");
                                $(aLi[i]).css("backgroundColor", "white");
                                allCount -= data.cart[i].count;
                                $("#nowNumber .totalNum").html(allCount);
                                allMoney -= data.cart[i].count * data.cart[i].price;
                                $("#summation .totalNum").html(allMoney);
                                bOn =0;
                            })
                        }
                        else{
                            $.get(deleteHerfUrl,{
                                visi : 0,
                                deleteGoods : data.cart[i].id
                            },function(){
                                $(aLi[i]).css("color", "white");
                                $(aLi[i]).css("backgroundColor", "#977558");
                                allCount += data.cart[i].count;
                                $("#nowNumber .totalNum").html(allCount);
                                allMoney += data.cart[i].count * data.cart[i].price;
                                $("#summation .totalNum").html(allMoney);
                                bOn =1;
                            })
                        }
                    });
                })(i)
            }
        });
    }
    function closeChange () {
        $("#nowBuy").css({"display" : "none"});
        $("#cover").css({"display" : "none"});
    }
    function payClose() {
        $("#payWhy").css({"display" : "none"});
    }
    function cover() {
        $("#nowBuy").css("display","none");
        $("#payWhy").css("display","none");
        $("#success").css("display","none");
        $("#cover").css("display" , "none");
    }
    function FunImmbuy(){
        $.get(acountHerfUrl,
            function(){
                $("#payWhy").css({"display": "block"});
                $("#payMoney span").html($("#summation span").html());
            })
    }
    function FunAffirmpay() {
        $("#success").css({"display" : "block"});
        $("#payWhy").css({"display" : "none"});
        $("#nowBuy").css({"display" : "block"});
    }
    var left1=document.querySelector("#leftArrow");
    var right1=document.querySelector("#rightArrow");
    var close = document.querySelector("#buttonClose");
    touchFunc($("#buy")[0], "click", openChange);
    touchFunc($("#nowBuy .iconfont")[0], "click", closeChange);
    touchFunc($("#cover")[0], "click",cover);
    touchFunc($("#immediateBuy")[0], "click",FunImmbuy);
    touchFunc(close,"click",payClose);
    touchFunc($("#affirmPay")[0],"click",FunAffirmpay);
    var b = document.querySelectorAll("#m-nav a");
    $(b[2]).css("color","#ff8a00");
    for (var i = 0; i < b.length; i++) {
        (function (i) {
            touchFunc(b[i],"click",function () {
                $(b[i]).css("color","#ff8a00");
                $(b).not(b[i]).css("color","#ffffff");
            })
        })(i)
    }
})(jQuery);
