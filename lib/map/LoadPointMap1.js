

//这是第一个tab例子，它实现了以下功能
//1.使用L.tileLayer加载cloudmade底图
//2.使用L.Google加载Google底图
//3.使用titleLayer加载Google瓦片数据
//4.加载GeoJSON图层数据可视化
//5.点聚类可视化

Ext.define('Ext.ux.LeafletMapView', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview',
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
			map.setView([-37.82, 175.22], 13);
			map.on('contextmenu', function(e) {
			});
			this.setMap(map);
			lc = L.control.locate({
				follow : true,
				stopFollowingOnDrag : true
			}).addTo(map);
			//加载cloudmade瓦片底图
			var cloudLayer = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
				key : 'BC9A493B41014CAABB98F0471D759707',
				styleId : 997,
				maxZoom : 19
			});
			//加载google底图
			//var googleLayer = new L.Google('ROADMAP');
			//用户可自选底图
			//map.addLayer(googleLayer);
			map.tileLayer = L.tileLayer('https://mts{s}.google.com/vt/lyrs=m@203000000&hl=zh&src=app&x={x}&y={y}&z={z}&s=Galile', {
				subdomains : '0123'
			}).addTo(map);
			//-----------------------------------
			// 多边形的geojson数据的可视化，代码在lib/leaflet/app/pointcluster.js中
			geoJSONbyNumeric(statesData, map);
			//-----------------------------------
			// 点的聚类可视化
			// 数据在data/realworld.388.js中
			pointCluster(addressPoints, map);
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
