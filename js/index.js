/**
 * Created by 小样儿 on 2016/9/29.
 */
$(function(){
    var can=$("#can");
    var CANW=can.width();
    var ctx=can.get(0).getContext("2d");
    var flag=true;//判断该画白棋还是黑棋
    var chessArr={};
    //棋盘格宽度
    var ROW=15;
    var divW=CANW / ROW;
    var ai=false
    var blank={}
    var t=0;
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            blank[s2k(i,j)]=true
        }
    }

    //制作心位
    function makeCir(x,y){
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x * divW +0.5,y * divW +0.5)
        ctx.arc(x * divW +0.5,y * divW +0.5,2.5,0,2 * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    function makePan(){
        ctx.beginPath()
        for(var i=0;i<15;i++){
            ctx.moveTo( divW/2 + 0.5,divW/2 + 0.5 + divW * i)
            ctx.lineTo( 14.5 * divW,divW/2 + 0.5 + divW * i)
            ctx.stroke()
        }
        for(var i=0;i<15;i++){
            ctx.moveTo( divW/2 + 0.5 + divW * i,divW/2 + 0.5 )
            ctx.lineTo( divW/2 + 0.5 + divW * i,14.5 * divW  )
            ctx.stroke()
        }
        ctx.closePath()

        makeCir(3.5,3.5)
        makeCir(7.5,7.5)
        makeCir(3.5,11.5)
        makeCir(11.5,3.5)
        makeCir(11.5,11.5)

    }
    makePan()
    function o2k(position){
        return position.x+"_"+position.y
    }
    function s2k(x,y){
        return x+"_"+y
    }
    function k2s(pos){
        var arr={}
        var pos=pos.split("_")
        arr = {x:parseInt(pos[0]),y:parseInt(pos[1])};
        return arr
    }
    function checkChess(position,color){
        var LRnum=1;
        var TBnum=1;
        var TLnum=1;
        var BLnum=1;
        var table={};

        $.each(chessArr,function(i,v){
            if(v == color ){
                table[i] = v
            }
        })

        var tx=position.x
        var ty=position.y
        while(table[s2k(tx+1,ty)]){
             LRnum++;
             tx++;
        }
        var tx=position.x
        var ty=position.y
        while(table[s2k(tx-1,ty)]){
            LRnum++;
            tx--;
        }

        var tx=position.x
        var ty=position.y
        while(table[s2k(tx,ty+1)]){
            TBnum++;
            ty++;
        }
        var tx=position.x
        var ty=position.y
        while(table[s2k(tx,ty-1)]){
            TBnum++;
            ty--;
        }

        var tx=position.x
        var ty=position.y
        while(table[s2k(tx-1,ty-1)]){
            TLnum++;
            ty--;
            tx--;
        }
        var tx=position.x
        var ty=position.y
        while(table[s2k(tx+1,ty+1)]){
            TLnum++;
            ty++;
            tx++;
        }

        var tx=position.x
        var ty=position.y
        while(table[s2k(tx-1,ty+1)]){
            BLnum++;
            ty++;
            tx--;
        }
        var tx=position.x
        var ty=position.y
        while(table[s2k(tx+1,ty-1)]){
            BLnum++;
            ty--;
            tx++;
        }

        // if(LRnum >= 5 || TBnum >= 5 || TLnum >= 5 || BLnum >= 5 ){
            return Math.max(LRnum,TBnum,TLnum,BLnum)
        // }

    }
    function drawChess(position,color){
        if(color=="black"){
            ctx.shadowBlur=0
            ctx.shadowColor="transparent"
            var fS  = ctx.createRadialGradient(-4.5,-4.5,1.5,0,0,15.5)
            fS.addColorStop("0","#aaa")
            fS.addColorStop("1","#000")
            ctx.fillStyle=fS
        }else if(color == "white"){
            var fS  = ctx.createRadialGradient(-4.5,-4.5,1.5,0,0,15.5)
            fS.addColorStop("0","#fff")
            fS.addColorStop("1","#eee")
            ctx.fillStyle=fS
        }
        ctx.save()
        ctx.translate((position.x+0.5)*divW + 0.5,(position.y+0.5)*divW + 0.5)
        ctx.beginPath()
        ctx.moveTo(0,0)
        ctx.arc(0,0,15.5,0,2 * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
        b=0;
        w=0;
        clearInterval(t)

        chessArr[o2k(position)]=color
        delete blank[o2k(position)]

        if(checkChess(position,color) >= "5"){
            if(color == "black"){
                $(".win-title").text("恭喜黑棋胜利啦")
                if(confirm("是否查看棋谱?")){
                    look()
                    b=0;
                    w=0;
                    clearInterval(t)
                }
                $(".wintitle").show()
            }else if(color == "white"){

                $(".win-title").text("恭喜白棋胜利啦")
                if(confirm("是否查看棋谱?")){
                    look()
                    w=0;
                    b=0;
                     clearInterval(t)
                }
                $(".wintitle").show()
            }
            can.off("click")
        }

        if(color=="black"){
            $(".blackBlock").hide()
            $(".whiteBlock").show()
            wseconds()
            t = setInterval(function(){
                wseconds()
            },1000)
            function wseconds(){
                wla.clearRect(0,0,150,150)
                wla.save()
                wla.translate(75.5,75.5)
                wla.rotate( Math.PI * w  / 30)
                wla.beginPath()
                wla.moveTo(0,0)
                wla.lineTo(0,10)
                wla.stroke()
                wla.moveTo(0,0)
                wla.lineTo(0,-67)
                wla.stroke()
                wla.closePath()
                wla.restore()
                w++
                if(w>=60){
                    b=0;
                    w=0;
                    $(".win-title").text("恭喜黑棋胜利啦")
                    if(confirm("是否查看棋谱?")){
                        b=0;
                        w=0;
                        clearInterval(t)
                        look()
                    }
                    $(".wintitle").show()
                    clearInterval(t)
                    can.off("click")
                    return;
                }
            }
        }else if(color=="white"){
            $(".whiteBlock").hide()
            $(".blackBlock").show()
            bseconds()
            t = setInterval(function(){
                bseconds()
            },1000)
            function bseconds(){
                bla.clearRect(0,0,150,150)
                bla.save()
                bla.translate(75.5,75.5)
                bla.rotate( Math.PI * b  / 30)
                bla.beginPath()
                bla.moveTo(0,0)
                bla.lineTo(0,10)
                bla.stroke()
                bla.moveTo(0,0)
                bla.lineTo(0,-67)
                bla.stroke()
                bla.closePath()
                bla.restore()
                b++
                if(b>60){
                    b=0;
                    w=0;
                    $(".win-title").text("恭喜白棋胜利啦")
                    if(confirm("是否查看棋谱?")){
                        b=0;
                        w=0;
                        clearInterval(t)
                        look()
                    }
                    $(".wintitle").show()
                    clearInterval(t)
                    can.off("click")
                    return;
                }
            }
        }
    }
    function look(){
        var text = 1
        $.each(chessArr,function(i,v){
            drawText(i,text,v)
            text++
        })
    }
    function drawText(i,text,v){
        var arr = i.split("_");
        var x=parseInt(arr[0]);
        var y=parseInt(arr[1]);
        ctx.save();
        ctx.font = "15px 黑体";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if(v == "black"){
            ctx.fillStyle="white";
        }else if(v == "white"){
            ctx.fillStyle="black";
        }
        ctx.fillText(text,(x+0.5)*divW,(y+0.5)*divW);
        ctx.restore();
    }
    can.on("click",handMouseUp);

    $("#btn").on("click",function(){
        ctx.clearRect(0,0,600,600)
        chessArr={};
        ai=false
        $(".wintitle").hide()
        $(".blackBlock").hide()
        $(".whiteBlock").hide()
        clearInterval(t)
        b=0;
        w=0;
        blank={}
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                blank[s2k(i,j)]=true
            }
        }
        ctx.clearRect(0,0,600,600)
        flag=true
        makePan()
        $(".blackBlock").show()
        t = setInterval(function(){
            bseconds()
        },1000)
        function bseconds(){
            bla.clearRect(0,0,150,150)
            bla.save()
            bla.translate(75.5,75.5)
            bla.rotate( Math.PI * b  / 30)
            bla.beginPath()
            bla.moveTo(0,0)
            bla.lineTo(0,10)
            bla.stroke()
            bla.moveTo(0,0)
            bla.lineTo(0,-67)
            bla.stroke()
            bla.closePath()
            bla.restore()
            b++
            if(b>60){
                b=0;
                w=0;
                $(".win-title").text("恭喜白棋胜利啦")
                if(confirm("是否查看棋谱?")){
                    b=0;
                    w=0;
                    clearInterval(t)
                    look()
                }
                $(".wintitle").show()
                clearInterval(t)
                can.off("click")
                return;
            }
        }
        ai = true
    })
    $("#free").on("click",function(){
        ctx.clearRect(0,0,600,600)
        chessArr={};
        ai=false
        $(".wintitle").hide()
        $(".blackBlock").hide()
        $(".whiteBlock").hide()
        clearInterval(t)
        b=0;
        w=0;
        blank={}
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                blank[s2k(i,j)]=true
            }
        }
        ctx.clearRect(0,0,600,600)
        flag=true
        makePan()
        $(".blackBlock").show()
        t = setInterval(function(){
            bseconds()
        },1000)
        function bseconds(){
            bla.clearRect(0,0,150,150)
            bla.save()
            bla.translate(75.5,75.5)
            bla.rotate( Math.PI * b  / 30)
            bla.beginPath()
            bla.moveTo(0,0)
            bla.lineTo(0,10)
            bla.stroke()
            bla.moveTo(0,0)
            bla.lineTo(0,-67)
            bla.stroke()
            bla.closePath()
            bla.restore()
            b++
            if(b>60){
                b=0;
                w=0;
                $(".win-title").text("恭喜白棋胜利啦")
                if(confirm("是否查看棋谱?")){
                    b=0;
                    w=0;
                    clearInterval(t)
                    look()
                }
                $(".wintitle").show()
                clearInterval(t)
                can.off("click")
                return;
            }
        }
    })

    function handMouseUp(e){
        var position={x:(Math.round((e.offsetX-divW/2)/divW)),y:(Math.round((e.offsetY-divW/2)/divW))}
        if(chessArr[o2k(position)]){
            return
        }

        if(ai){
            drawChess(position,"black")
            drawChess(k2s(AIpos()),"white")
            return
        }

        if(flag){
            drawChess(position,"black")
        }else{
            drawChess(position,"white")
            checkChess(position,"black")
        }
        flag = !flag
    }
    function AIpos(){
       var blackScore=-Infinity
       var blackPos={}
       var whiteScore=-Infinity
       var whitePos={}

       $.each(blank,function(i,v){
          if (checkChess(k2s(i),"black") > blackScore){
             blackScore = checkChess(k2s(i),"black")
             blackPos = i
          }
           if (checkChess(k2s(i),"white") > whiteScore){
               whiteScore = checkChess(k2s(i),"white")
               whitePos = i
           }
       })

       if(whiteScore >= blackScore){
           console.log(whitePos)
           return whitePos
       }else{
           console.log(blackPos)
           return blackPos
       }

   }
    $("#reset").on("click",function(){
        if(confirm("确定重新开始吗?")){
            chessArr={};
           ai=false
            $(".wintitle").hide()
            blank={}
            for(var i=0;i<15;i++){
                for(var j=0;j<15;j++){
                    blank[s2k(i,j)]=true
                }
            }
            ctx.clearRect(0,0,600,600)
            flag=true;
            $(".blackBlock").hide()
            $(".whiteBlock").hide()
            clearInterval(t)
            b=0;
            w=0;
            makePan()
            $(".blackBlock").show()
            t = setInterval(function(){
                bseconds()
            },1000)
            function bseconds(){
                bla.clearRect(0,0,150,150)
                bla.save()
                bla.translate(75.5,75.5)
                bla.rotate( Math.PI * b  / 30)
                bla.beginPath()
                bla.moveTo(0,0)
                bla.lineTo(0,10)
                bla.stroke()
                bla.moveTo(0,0)
                bla.lineTo(0,-67)
                bla.stroke()
                bla.closePath()
                bla.restore()
                b++
                if(b>60){
                    b=0;
                    w=0;
                    $(".win-title").text("恭喜白棋胜利啦")
                    if(confirm("是否查看棋谱?")){
                        b=0;
                        w=0;
                        clearInterval(t)
                        look()
                    }
                    $(".wintitle").show()
                    clearInterval(t)
                    return;
                }
            }
            can.off("click").on("click",handMouseUp);
        }
    })

    $(".title .title-btns .start").on("click",function(){
        $(".title").slideUp()
    })

    $(".gameDiff").on("click",function(){
        $(this).addClass("hov")
    })
    $("#close").on("click",function(){
        event.stopPropagation()
        $(this).closest(".gameDiff").removeClass("hov")
    })

    var black=$("#black")
    var bla=black.get(0).getContext("2d")
    var b = 0

    var white=$("#white")
    var wla=white.get(0).getContext("2d")
    var w = 0

    $(".blackBlock").show()
    t = setInterval(function(){
        bseconds()
    },1000)
    function bseconds(){
        bla.clearRect(0,0,150,150)
        bla.save()
        bla.translate(75.5,75.5)
        bla.rotate( Math.PI * b  / 30)
        bla.beginPath()
        bla.moveTo(0,0)
        bla.lineTo(0,10)
        bla.stroke()
        bla.moveTo(0,0)
        bla.lineTo(0,-67)
        bla.stroke()
        bla.closePath()
        bla.restore()
        b++
        // console.log(b)
        if(b>60){
            b=0;
            w=0;
            $(".win-title").text("恭喜白棋胜利啦")
            $(".wintitle").show()
            clearInterval(t)
            can.off("click")
            return;
        }
    }

    $(document).on("click",function(){
        $(".wintitle").hide()
    })

    $(".start").on("click",function(){
        var audio=document.getElementsByTagName("audio")
        audio[0].play()
    })

})