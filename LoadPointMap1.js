

Ext.define('Ext.ux.LeafletMapView', {
    extend: 'Ext.Component',
    alias: 'widget.leafletmapview',
    config: {
        map: null
    },
    afterRender: function (t, eOpts) {
        this.callParent(arguments);

        var leafletRef = window.L;
        if (leafletRef == null) {
            this.update('No leaflet library loaded');
        } else {
            var map = L.map(this.getId());
            map.setView([40.02997, 116.29832], 14);
            map.on('contextmenu', function (e) {
            });
            this.setMap(map);
            lc = L.control.locate({
                follow: true,
                stopFollowingOnDrag: true
            }).addTo(map);
            //加载google底图
            map.tileLayer = L.tileLayer('http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                subdomains: '0123'
            }).addTo(map);
            //-----------------------------------
            //热力图类heatMap
            var heatmapLayer = L.TileLayer.heatMap({
                radius: 14,
                // radius could be absolute or relative
                // absolute: radius in meters, relative: radius in pixels
                //radius: { value: 15000, absolute: true },
                opacity: 0.8,
                gradient: {
                    0.35: "rgb(255,0,255)",
                    0.45: "rgb(0,0,255)",
                    0.55: "rgb(0,255,255)",
                    0.65: "rgb(0,255,0)",
                    0.95: "yellow",
                    1.0: "rgb(255,0,0)"
                },
                legend: {
                    position: 'bl',
                    title: 'legend'
                }
            });
            heatmapLayer.addData(dp);
            heatmapLayer.addTo(map);
            //新建一个点聚类Group
            var markers = L.markerClusterGroup({
                spiderfyOnMaxZoom: false,
                disableClusteringAtZoom: 16,
                polygonOptions: {
                    color: "#2d84c8",
                    weight: 4,
                    opacity: 1,
                    fillOpacity: 0.5
                },
                //设置不同层级圆环的样式，它是根据数字位数来确定css的
                iconCreateFunction: function (cluster) {
                    // get the number of items in the cluster
                    var count = cluster.getChildCount();
                    var digits = (count + "").length;
                    return new L.DivIcon({
                        html: count,
                        className: "cluster digits-" + digits,
                        iconSize: null
                    });
                }
            });
            //采用了awesome插件的多符号Marker
            var colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple'];
            var awesomeIcons = ['font', 'cloud-download', 'medkit', 'github-alt', 'coffee', 'food', 'bell-alt', 'question-sign', 'star'];
            for (var i = 0; i < dp.length; i++) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                //var awesomeIcon = awesomeIcons[Math.floor(Math.random() * awesomeIcons.length)];
                var awesomeIcon = awesomeIcons[5];
                var a = dp[i];
                var title = a['BusinessName'];
                //这里的icon没有采用原生的baseballIcon而是换成了L.AwesomeMarkers.icon对象
                var marker = L.marker(new L.LatLng(a['lat'], a['lng']), {
                    value: parseInt(a['Stars']['All']),
                    title: title,
                    icon: L.AwesomeMarkers.icon({
                        icon: awesomeIcon,
                        color: color
                    })
                });
                //绑定tooltip
                var tooltip = a['BusinessName'] + '<br>总星数' + a['Stars']['All'] + ': 1星数' + a['Stars']['1s'] +
                    ' 2星数' + a['Stars']['2s'] + ' 3星数' + a['Stars']['3s'] + '<br>地址：' + a['Address'] + '<br>点评:<br>1.'
                marker.bindPopup(tooltip);
                markers.addLayer(marker);
            }
            map.addLayer(markers);
        }
    },
    onResize: function (w, h, oW, oH) {
        this.callParent(arguments);
        var map = this.getMap();
        if (map) {
            map.invalidateSize();
        }
    }
});
