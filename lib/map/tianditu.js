Ext.define('Ext.ux.LeafletMapView7', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview7',
	config : {
		map : null
	},
	afterRender : function(t, eOpts) {
		this.callParent(arguments);

		var leafletRef = window.L;
		if (leafletRef == null) {
			this.update('No leaflet library loaded');
		} else {

			lt5 = L.tileLayer("http://t0.tianditu.cn/vec_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});
			
			ter = L.tileLayer("http://t0.tianditu.cn/ter_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});
			
			img = L.tileLayer("http://t0.tianditu.cn/img_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});
			
			lt2 = L.tileLayer("http://t0.tianditu.com/cva_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});

			latlng = new L.LatLng(30.52, 114.37);
			var map = new L.Map(this.getId(), {center: latlng, zoom: 14, layers: [lt5, lt2]});
			map.on('contextmenu', function(e) {});
			this.setMap(map);

			var baseMaps = {
				"地图" : lt5,
				"地形" : ter,
				"影像" : img
			};
			var overlayMaps = {
				"标注" : lt2
			};
			layersControl = new L.Control.Layers(baseMaps, overlayMaps);
			map.addControl(layersControl);
			
			//随机点可视化
			randomPointCluster(2000, map);
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
