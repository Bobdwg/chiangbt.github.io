//本例主要实现的是如何建构layerControl控件以及随机点的聚类可视化

Ext.define('Ext.ux.LeafletMapView2', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview2',
	config : {
		map : null
	},
	afterRender : function(t, eOpts) {
		this.callParent(arguments);

		var leafletRef = window.L;
		if (leafletRef == null) {
			this.update('No leaflet library loaded');
		} else {
			//加载cloudmade底图
			var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution}),
			latlng = new L.LatLng(30.52, 114.37);
			//暗色cloudmade底图
			var midnightCommander = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/999/256/{z}/{x}/{y}.png', {
				styleId : 999,
				attribution : cloudmadeAttribution
			});
			//交通cloudmade底图
			var motorways = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/46561/256/{z}/{x}/{y}.png', {
				styleId : 46561,
				attribution : cloudmadeAttribution
			});
					
			var map = new L.Map(this.getId(), {center: latlng, zoom: 15, layers: [cloudmade, motorways]});
			map.on('contextmenu', function(e){});
			var baseMaps = {
				"明色底图" : cloudmade,
				"暗色底图" : midnightCommander
			};
			var overlayMaps = {
				"交通线" : motorways
			};
			layersControl = new L.Control.Layers(baseMaps, overlayMaps);
			map.addControl(layersControl);
			this.setMap(map);

			//随机点聚类可视化
			randomPointCluster(500, map);
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
