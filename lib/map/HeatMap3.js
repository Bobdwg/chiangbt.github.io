
//本例实现了热力图绘制
Ext.define('Ext.ux.LeafletMapView3', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview3',
	config : {
		map : null
	},
	afterRender : function(t, eOpts) {
		this.callParent(arguments);

		var leafletRef = window.L;
		if (leafletRef == null) {
			this.update('No leaflet library loaded');
		} else {
			var map = L.map(this.getId());
			map.setView([41.893588, 12.488022], 5);
			//让地图右键菜单无效
			map.on('contextmenu', function(e) {
			});
			this.setMap(map);

			Ext.Ajax.request({
				//访问node.js从MongoDB中获取的GeoJSON数据
				url : 'http://127.0.0.1:3000/pois/',
				method : 'GET',
				success : function(resp, opts) {
					var respText = Ext.JSON.decode(resp.responseText);
					//采用google底图
					map.tileLayer = L.tileLayer('https://mts{s}.google.com/vt/lyrs=m@203000000&hl=zh&src=app&x={x}&y={y}&z={z}&s=Galile', {
						subdomains : '0123'
					}).addTo(map);
					//热力图类heatMap
					var heatmapLayer = L.TileLayer.heatMap({
						radius : 8,
						// radius could be absolute or relative
						// absolute: radius in meters, relative: radius in pixels
						//radius: { value: 15000, absolute: true },
						opacity : 0.8,
						gradient : {
							0.35 : "rgb(255,0,255)",
							0.45 : "rgb(0,0,255)",
							0.55 : "rgb(0,255,255)",
							0.65 : "rgb(0,255,0)",
							0.95 : "yellow",
							1.0 : "rgb(255,0,0)"
						},
						legend : {
							position : 'bl',
							title : 'legend'
						}
					});
					heatmapLayer.addData(respText.data);
					heatmapLayer.addTo(map);
					// 点聚类
					var markers = new L.MarkerClusterGroup({
						spiderfyOnMaxZoom : false,
						disableClusteringAtZoom : 9
					});
					for (var i = 0; i < respText.data.length; i++) {
						var a = respText.data[i];
						var m = new L.Marker(new L.LatLng(a["lat"], a["lng"]), {
							value : a["count"]
						});
						m.bindPopup(a["count"].toString());
						markers.addLayer(m);
					}
					markers.addTo(map);
				},
				failure : function(resp, opts) {
					//alert(resp.responseText);
				}
			});
		}
	},
	onResize : function(w, h, oW, oH) {
		this.callParent(arguments);
		var map = this.getMap();
		if (map) {
			map.invalidateSize();
		}
	}
});
