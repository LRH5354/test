   // 百度地图API功能 该页面已经成功 动态分页
   var map;
   var midu = 0.01;
   var kindex = 0;
   var cindex = 0;
   var index = 0;
   var jindu = 0;
   var BL = [];
   var rs = {};
   var local;
   var citys;
   var keywords;
   var options = {
       onSearchComplete: function(results) {

           if (local.getStatus() == BMAP_STATUS_SUCCESS) {
               if (results.getNumPois() >= 760) {
                   var temp = splitbound(results.bounds);
                   for (var i = 0; i < 4; i++) {
                       local.searchInBounds(keywords[kindex], temp[i])
                   }
               } else {
                   runTips(jindu);
                   jindu++;
                   showretangal(results.bounds);

                   for (var i = 0; i < results.getCurrentNumPois(); i++) {
                       var str = results.getPoi(i).province + ", " + results.getPoi(i).city + ", " + results.getPoi(i).title + ", " + results.getPoi(i).point.lng + ", " + results.getPoi(i).point.lat + ", " + results.getPoi(i).address + ", " + results.getPoi(i).phoneNumber + ", " + results.getPoi(i).tags + ", " + results.keyword;
                       rs[i] = str;
                   }
                 //  console.log(rs)
                   $.ajax({
                       type: "post",
                       url: "/saveResults",
                       data: rs,
                       dataType: "json",
                       success: function(data) {

                       }
                   });

                   if (results.getPageIndex() < results.getNumPages() - 1) {
                       local.gotoPage(results.getPageIndex() + 1);
                   } else {}


               }
            } else {
               // showerrangal(results.bounds);
               index++;
               console.log(index, "失败------------------------------------------------------------")
           }
       }
   };



   $("#shezhi").on("click", function() {
       var e = $("#jibie").val();
       //  console.log(e)
       midu = parseInt(e)
       alert("密度已设为" + e)
   })

   //对每个矩形进行渲染
   function showretangal(bounds) {
       var pStart = bounds.getSouthWest();
       var pEnd = bounds.getNorthEast();
       var polygon = new BMap.Polygon([
           new BMap.Point(pStart.lng, pStart.lat),
           new BMap.Point(pEnd.lng, pStart.lat),
           new BMap.Point(pEnd.lng, pEnd.lat),
           new BMap.Point(pStart.lng, pEnd.lat)
       ], { strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5 });
       map.addOverlay(polygon);
   }

   function showerrangal(bounds) {
       var pStart = bounds.getSouthWest();
       var pEnd = bounds.getNorthEast();
       var polygon = new BMap.Polygon([
           new BMap.Point(pStart.lng, pStart.lat),
           new BMap.Point(pEnd.lng, pStart.lat),
           new BMap.Point(pEnd.lng, pEnd.lat),
           new BMap.Point(pStart.lng, pEnd.lat)
       ], { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });
       map.addOverlay(polygon);
   }

   //对矩形进行四分
   function splitbound(bound) {
       var bs = [];
       var sw = bound.getSouthWest();
       var ne = bound.getNorthEast();
   
       x1 = sw.lng;
       y1 = sw.lat;
       x2 = ne.lng;
       y2 = ne.lat;
       bs.push(new BMap.Bounds(new BMap.Point(x1, (y1 + y2) / 2), new BMap.Point((x1 + x2) / 2, y2)))
       bs.push(new BMap.Bounds(new BMap.Point((x1 + x2) / 2, (y1 + y2) / 2), new BMap.Point(x2, y2)))
       bs.push(new BMap.Bounds(new BMap.Point(x1, y1), new BMap.Point((x1 + x2) / 2, (y1 + y2) / 2)))
       bs.push(new BMap.Bounds(new BMap.Point((x1 + x2) / 2, y1), new BMap.Point(x2, (y1 + y2) / 2)));
       return bs;
   }

   function getbound(bound) {

       var sw = bound.getSouthWest();
       var ne = bound.getNorthEast();
       var bounds = [];
       for (var y = sw.lat; y < ne.lat; y += midu) {
           for (var x = sw.lng; x < ne.lng; x += midu) {
               bounds.push(new BMap.Bounds(new BMap.Point(x, y), new BMap.Point(x + midu, y + midu)));
           }
       }
       return bounds;
   }

   //判断矩形是否在行政区内

   function runTips(message) {
       document.getElementById("tips").innerHTML = message + "/" + BL.length;
   }



   var city_name = {
       zhixiashi_city_name: '北京、上海、天津、重庆',
       guangxi_city_name: '南宁、柳州、桂林、梧州、北海、崇左、来宾、贺州、玉林、百色、河池、钦州、防城港、贵港',
       guangdong_city_name: '广州、深圳、汕头、惠州、珠海、揭阳、佛山、河源、阳江、茂名、湛江、梅州、肇庆、韶关、潮州、东莞、中山、清远、江门、汕尾、云浮',
       hebei_city_name: '石家庄、唐山、邯郸、秦皇岛、保定、张家口、承德、廊坊、沧州、衡水、邢台',
       shangdong_city_name: '济南、青岛、淄博、枣庄、东营、烟台、潍坊、济宁、泰安、威海、日照、莱芜、临沂、德州、聊城、菏泽、滨州',
       anhui_city_name: '合肥、蚌埠、芜湖、淮南、亳州、阜阳、淮北、宿州、滁州、安庆、巢湖、马鞍山、宣城、黄山、池州、铜陵',
       zhejiang_city_name: '杭州、嘉兴、湖州、宁波、金华、温州、丽水、绍兴、衢州、舟山、台州'
   }

   function addParam() {
       for (var i in city_name) {
            addchoose('city',city_name[i].split('、')) 
       }

       var arr=['饮食','电影院','酒吧','车站' ,"大学", "菜市场",'超市'];

       addchoose('keyword',arr)
   }





   //
   //异步加载百度api
   //
   function initialize() {

       map = new BMap.Map("allmap"); // 创建Map实例
       map.centerAndZoom(new BMap.Point(112.968386, 22.52185), 11);
       map.enableScrollWheelZoom(); //启用滚轮放大缩小

   }

   function loadScript() {
       var script = document.createElement("script");
       script.src = "http://api.map.baidu.com/api?v=2.0&ak=Hmv50bRYfqK7lGvHQEk4bj4cI6nbdbGS&callback=initialize";
       document.body.appendChild(script);
   }




   function addchoose(_id, _fieldchossed) {
       for (var i = 0; i < _fieldchossed.length; i++) { $("#" + _id).append("<label><input type=\"checkbox\" name=\"choose\" value=" + _fieldchossed[i] + ">" + _fieldchossed[i] + "<a></a>") };
   }


   function querychoose(_id) {
       var fieldchossed = [];
       var $checkbox = $("#" + _id + " input[name=\"choose\"]:checked")
       $checkbox.each(function() {
           fieldchossed.push($(this).val())
       })
       return fieldchossed;
   }

   function getBoundary(name) {

       var bdary = new BMap.Boundary();

       bdary.get(name, function(rs) { //获取行政区域

           var count = rs.boundaries.length; //行政区域的点有多少个

           var bounds = []; //先清空region数组
           for (var i = 0; i < count; i++) {
               var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
               bounds[i] = ply.getBounds();
               map.addOverlay(ply);
           }

           local = new BMap.LocalSearch(citys[cindex], options); //设置local的初始化设置

           local.setPageCapacity(50);

           local.setLocation(citys[cindex]);

           local.searchInBounds(keywords[kindex], bounds[0]);

           runTips(jindu);
       });
   }
  
   window.onload = loadScript;

   $(document).ready(function() {
      addParam();

       $("#click").on("click", function() {

          var tempC=querychoose("city")
         
           citys = tempC

           var tempK=querychoose("keyword");
        

           keywords = tempK;

           getBoundary(citys[cindex])

       })
   })