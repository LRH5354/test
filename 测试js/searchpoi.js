   // 百度地图API功能 该页面已经成功 动态分页
var map;
    var midu=0.01 ;
    var kindex=0;
    var cindex=0;
    var index = 0;
    var jindu =0;
    var  BL=[];
    var rs = {};
    var local ;
    var citys;
    var keywords;
    var options = {
        onSearchComplete: function (results) {

            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                if( results.getNumPois()>=760)
                {
                    var temp= splitbound(results.bounds);
                          for(var i=0;i<4;i++){
                              local.searchInBounds(keywords[kindex],temp[i])
                          }
                }else {
                    runTips(jindu);
                    jindu++;
                    showretangal(results.bounds);

                            for (var i = 0; i < results.getCurrentNumPois() ; i++) {
                                var str =results.getPoi(i).province+ ", "+ results.getPoi(i).city + ", " + results.getPoi(i).title + ", " + results.getPoi(i).point.lng + ", " +results.getPoi(i).point.lat+ ", " +results.getPoi(i).address + ", " + results.getPoi(i).phoneNumber+ ", " + results.getPoi(i).tags+ ", " + results.keyword;
                                rs[i] = str;
                            }
                                $.ajax({
                                    type: "post",
                                     url: "/saveResults",
             	                     data: rs,
                                    dataType: "json",
                                    success: function(data){

                                    }
                                });

                    if (results.getPageIndex() < results.getNumPages() - 1) {
                        local.gotoPage(results.getPageIndex() + 1);
                    }else{}


                }
            }else
                {
                   // showerrangal(results.bounds);
                      index++;console.log(index,"失败------------------------------------------------------------")
                }
        }
    };



    $("#shezhi").on("click",function(){
        var e=$("#jibie").val();
      //  console.log(e)
        midu=parseInt(e)
        alert("密度已设为"+e)
    })

    //对每个矩形进行渲染
    function showretangal(bounds){
        var pStart=bounds.getSouthWest();
        var pEnd=bounds.getNorthEast();
        var polygon = new BMap.Polygon([
            new BMap.Point(pStart.lng, pStart.lat),
            new BMap.Point(pEnd.lng, pStart.lat),
            new BMap.Point(pEnd.lng, pEnd.lat),
            new BMap.Point(pStart.lng, pEnd.lat)
        ], { strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5 });
        map.addOverlay(polygon);
    }

    function showerrangal(bounds){
        var pStart=bounds.getSouthWest();
        var pEnd=bounds.getNorthEast();
        var polygon = new BMap.Polygon([
            new BMap.Point(pStart.lng, pStart.lat),
            new BMap.Point(pEnd.lng, pStart.lat),
            new BMap.Point(pEnd.lng, pEnd.lat),
            new BMap.Point(pStart.lng, pEnd.lat)
        ], { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });
        map.addOverlay(polygon);
    }

    //对矩形进行四分
    function splitbound(bound){
        var bs=[];
        var sw = bound.getSouthWest();
        var ne = bound.getNorthEast();
       // console.log(sw,ne);
        x1=sw.lng;
        y1=sw.lat;
        x2=ne.lng;
        y2=ne.lat;
       bs.push(new BMap.Bounds(new BMap.Point(x1, (y1+y2)/2), new BMap.Point((x1+x2)/2 , y2)))
        bs.push(new BMap.Bounds(new BMap.Point((x1+x2)/2, (y1+y2)/2), new BMap.Point(x2 , y2)))
        bs.push( new BMap.Bounds(new BMap.Point(x1, y1), new BMap.Point((x1+x2)/2, (y1+y2)/2)))
        bs.push( new BMap.Bounds(new BMap.Point((x1+x2)/2, y1), new BMap.Point(x2, (y1+y2)/2)));
        return bs;
    }

    function getbound(bound) {

        var sw = bound.getSouthWest();
        var ne = bound.getNorthEast();
        var bounds = [];
        for (var y = sw.lat; y < ne.lat; y += midu) {
            for (var x = sw.lng; x < ne.lng; x += midu) {
                bounds.push(new BMap.Bounds(new BMap.Point(x, y), new BMap.Point(x + midu , y + midu)));
            }
        }
        return bounds;
    }

    //判断矩形是否在行政区内

    function runTips(message) {
        document.getElementById("tips").innerHTML=message+"/"+BL.length;
    }


    function  getparam(){
        $.post("/getparam",
            function(data){
                var arr=data.split("/")
                var arr1=arr[0].split(",")
                var arr2=arr[1].split(",")
                //console.log(arr1,arr2)
                addchoose("city",arr1)
                
                addchoose("keyword",arr2)
                //console.log("Data: " , data );
            });
    }



    //
    //异步加载百度api
    //
    function initialize() {

       map = new BMap.Map("allmap");            // 创建Map实例
        map.centerAndZoom(new BMap.Point(112.968386, 22.52185), 11);
        map.enableScrollWheelZoom();           //启用滚轮放大缩小

    }

    function loadScript() {
        var script = document.createElement("script");
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=Hmv50bRYfqK7lGvHQEk4bj4cI6nbdbGS&callback=initialize";
        document.body.appendChild(script);
    }

    window.onload = loadScript;



    function addchoose(_id, _fieldchossed)
    {
        for (var i = 0; i < _fieldchossed.length; i++) { $("#"+_id).append("<label><input type=\"checkbox\" name=\"choose\" value=" + _fieldchossed[i] + ">" + _fieldchossed[i] + "<a></a>") };
    }


    function querychoose(_id) {
        var fieldchossed=[];
        var $checkbox = $("#"+_id+" input[name=\"choose\"]:checked")
        $checkbox.each(function () {
            fieldchossed.push($(this).val())
        })
        return fieldchossed;
    }

    function getBoundary(name){

        var bdary = new BMap.Boundary();

        bdary.get(name, function(rs){       //获取行政区域

            var count = rs.boundaries.length; //行政区域的点有多少个

            var bounds = [];//先清空region数组
            for(var i = 0; i < count; i++){
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                bounds[i] = ply.getBounds();
                map.addOverlay(ply);
            }
//            var pStart=bounds[0].getSouthWest();
//            var pEnd=bounds[0].getNorthEast();
//            var polygon = new BMap.Polygon([
//                new BMap.Point(pStart.lng, pStart.lat),
//                new BMap.Point(pEnd.lng, pStart.lat),
//                new BMap.Point(pEnd.lng, pEnd.lat),
//                new BMap.Point(pStart.lng, pEnd.lat)
//            ], { strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5 });
//

            local = new BMap.LocalSearch(citys[cindex], options); //设置local的初始化设置

            local.setPageCapacity(50);

            local.setLocation(citys[cindex]);

            local.searchInBounds(keywords[kindex],bounds[0]);

            runTips(jindu);
        });
    }

    $(document).ready(function () {
        //  getparam();
        $("#click").on("click", function () {

            // var tempC=querychoose("city")
            var tempC=["广州市"]
            citys=tempC

            // var tempK=querychoose("keyword");
            var tempK=["餐饮","超市","餐饮","大学","菜市场","餐饮"]

            keywords=tempK;

            getBoundary(citys[cindex])

        })
    })
