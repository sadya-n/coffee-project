function touchFunc(obj,type,func) {
    var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
    var sTime = 0, eTime = 0;
    type = type.toLowerCase();

    //1.添加手指落下事件
    obj.addEventListener("touchstart",function(){
        sTime = new Date().getTime();
        //获取并记录：起始手指位置
        init.sx = event.targetTouches[0].pageX;
        init.sy = event.targetTouches[0].pageY;
        init.ex = init.sx;
        init.ey = init.sy;
        if(type.indexOf("start") != -1) func();
    }, false);

    //2.添加手指滑动事件
    obj.addEventListener("touchmove",function() {
        event.preventDefault();
        //获取并记录：手指抬起位置
        init.ex = event.targetTouches[0].pageX;
        init.ey = event.targetTouches[0].pageY;
        if(type.indexOf("move")!=-1) func();
    }, false);

    //3.触摸结束，根据时间、方向，判断执行事件的类型
    obj.addEventListener("touchend",function() {
        var changeX = init.sx - init.ex;//起始-结束
        var changeY = init.sy - init.ey;
        if(Math.abs(changeX)>Math.abs(changeY)&&(changeY)>init.y) {//滑动范围大于5  且偏于水平滑动 Math.abs：绝对值
            if(changeX > 0) {
                if(type.indexOf("left")!=-1) func();//此代码中没有写鼠标上下滑事件，可根据左右滑动类推
            }else{
                if(type.indexOf("right")!=-1) func();
            }
        }
        else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){//同上  判断垂直
            if(changeY > 0) {
                if(type.indexOf("top")!=-1) func();
            }else{
                if(type.indexOf("down")!=-1) func();
            }
        }
        else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){//若改变范围<5,则默认为点击事件
            eTime = new Date().getTime();
            if((eTime - sTime) > 300) {//长按事件
                if(type.indexOf("long")!=-1) func();
            }
            else {//点击事件
                if(type.indexOf("click")!=-1) func(obj);
            }
        }
        if(type.indexOf("end")!=-1) func();
    }, false);
};

$(".list").attr("bOn","true");

for(var i=0;i<$(".list").length;i++){
    ;(function (i){
        touchFunc($(".list").eq(i)[0],"click",function () {
            $(".incofont-up").css("display","none");
            $(".top").css("display","block");

            if( $(".list").eq(i).attr("bOn")==="true" ){
                //展开
                $(".list").eq(i).attr("bOn","false");

                $(".incofont-up").eq(i).css("display","block");
                $(".top").eq(i).css("display","none");
            }else{
                //收起
                $(".list").eq(i).attr("bOn","true");

                $(".incofont-up").eq(i).css("display","none");
                $(".top").eq(i).css("display","block");
            }

            $(".text").eq(i).slideToggle(600);

            $(".list").eq(i).next().css("display","block").parents("li").siblings().find(".text").css("display","none");

            $(".list").eq(i).next().css("display","block").parents("li").siblings().find(".list").attr("bOn","true");
        });
    })(i)
}
