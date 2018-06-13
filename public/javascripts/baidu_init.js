var map = new BMap.Map("map"); // 创建Map实例
map.centerAndZoom(new BMap.Point(113.273279, 23.186874), 8); //初始化时，即可设置中心点和地图缩放级别。
map.enableDragging(true); //禁止拖拽
 //开启鼠标滚轮缩放
map.enableScrollWheelZoom();

map.setMapStyle({ style: 'bluish' }); //设置地图样式

//map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT })); // 左上角，添加比例尺       
//map.addControl(new BMap.NavigationControl()); //左上角，添加默认缩放平移控件   
map.addControl(new BMap.MapTypeControl({ abchor: BMAP_ANCHOR_TOP_LEFT }));
map.addControl(new BMap.OverviewMapControl());
map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));

//监控map变化事件
