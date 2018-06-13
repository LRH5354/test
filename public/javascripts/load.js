$(document).ready(function() {

    var pointsdata;
    var pointcolecion;


   

     $('.main .sidebar .aream').on('click',function(){
        alert('面积测量')
    })
       $('.main .sidebar .cejuli').on('click',function(){
        alert('距离测量')
    })

    $('.main .sidebar .showpoint').on('click', function(e) {

        $.get('/test/querydb', function(result, stuts) {
            makepointcolecion(result, pointcolecion);
        });

    })


    $('.main .sidebar .makeheatmap').on('click', function() {
        $.get('/test/querydb', function(result, stuts) {
            pointsdata = [];
            for (var i = result.length - 1; i >= 0; i--) {
                pointsdata.push({ 'lng': result[i].lng, 'lat': result[i].lat, 'count': 10 });
            }
            heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({ data: pointsdata, max: 100 });

        });
    })

    $('.main .sidebar .dianjuhe').on('click', function() {
        var markers = [];
        var point;
        var marker;
        $.get('/test/querydb', function(result, stuts) {
            for (var i = 0; i < result.length - 1; i++) {
                point = new BMap.Point(result[i].lng, result[i].lat);

                marker = new BMap.Marker(point);

                var label = new BMap.Label(result[i].jobname, {
                    offset: new BMap.Size(15, -25)
                });
                label.setStyle({
                    width: "120px",
                    color: '#fff',
                    background: 'red',
                    border: '1px solid "#ff8355"',
                    borderRadius: "5px",
                    textAlign: "center",
                    height: "26px",
                    lineHeight: "26px"
                });
                marker.attr = {
                    id: result[i].id,
                    gcname: result[i].gcname,
                    addres: result[i].address,
                    city: result[i].jobid,
                    jobname: result[i].jobname,
                    gognzi: result[i].gongzi
                };
                marker.setLabel(label);
                marker.addEventListener('click', function(e) {

                    var point = new BMap.Point(e.point.lng, e.point.lat);
                    var opts = {
                        width: 360, // 信息窗口宽度
                        height: 120, // 信息窗口高度
                        title: '<b>' + this.attr.jobname + '</b>', // 信息窗口标题
                        enableMessage: true, //设置允许信息窗发送短息
                        // enableCloseOnClick:false,
                    }
                    var infowindow = new BMap.InfoWindow("<hr style='height:2px;border:none;border-top:2px dotted #185598;'/><storageArea>名称:</storageArea>" + this.attr.gcname + "<br/>地址:" + this.attr.addres + "<br/>工资:" + this.attr.gognzi, opts);
                    map.openInfoWindow(infowindow, point);
                })
                markers.push(marker)
            }

            var markerClusterer = new BMapLib.MarkerClusterer(map, {
                markers: markers
            });
            alert('<p>完成</p>')
        });
    })


})




//全局函数
function makepointcolecion(result, pointcolecion) {
    // body... 
    var options = {
        size: BMAP_POINT_SIZE_SMALL,
        //  shape: BMAP_POINT_SHAPE_WATERDROP,
        color: '#d31615'
    };
    var marker;
    var points = [];
    for (var i = result.length - 1; i >= 0; i--) {
        var point = new BMap.Point(result[i].lng, result[i].lat);
        point.attr = {
            id: result[i].id,
            gcname: result[i].gcname,
            addres: result[i].address,
            city: result[i].jobid,
            jobname: result[i].jobname,
            gognzi: result[i].gongzi
        };
        points.push(point);
    }

    if (!!pointcolecion) {
        map.removeOverlay(pointcolecion)
    }

    pointcolecion = new BMap.PointCollection(points, options);


    // 添加Overlay   
    map.addOverlay(pointcolecion);

    // alert('数据加载完成')
    pointcolecion.addEventListener('mouseover', function(e) {
        marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        map.addOverlay(marker);
    })

    pointcolecion.addEventListener('mouseout', function() {
        if (!!marker) {
            map.removeOverlay(marker)
        }
    })
    //添事件爱你出发处理函数
    pointcolecion.addEventListener('click', function(e) {

        var point = new BMap.Point(e.point.lng, e.point.lat);
        var opts = {
            width: 360, // 信息窗口宽度
            height: 120, // 信息窗口高度
            title: '<b>' + e.point.attr.jobname + '</b>', // 信息窗口标题
            enableMessage: true, //设置允许信息窗发送短息
            enableCloseOnClick: false,
        }
        var infowindow = new BMap.InfoWindow("<hr style='height:2px;border:none;border-top:2px dotted #185598;'/><storageArea>名称:</storageArea>" + e.point.attr.gcname + "<br/>地址:" + e.point.attr.addres + "<br/>工资:" + e.point.attr.gognzi, opts);
        map.openInfoWindow(infowindow, point);
        console.log(map.getOverlays())
    });
}