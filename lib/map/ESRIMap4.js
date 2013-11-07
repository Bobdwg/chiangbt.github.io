
var map, layer;
Ext.define('Ext.ux.LeafletMapView4', {
	extend : 'Ext.Panel',
	alias : 'widget.leafletmapview4',
	config : {
		map : null
	},
	afterRender : function(t, eOpts) {
		this.callParent(arguments);

		var leafletRef = window.L;
		if (leafletRef == null) {
			this.update('No leaflet library loaded');
		} else {
			map = L.map(this.getId());
			map.on('contextmenu', function(e) {
			});
			map.setView([52.0, -11.0], 2);
			this.setMap(map);
			layer = L.esri.basemapLayer("Streets").addTo(map);

			//使用Leaflet PolylineDecorator
			// --- Arrow, with animation to demonstrate the use of setPatterns ---
			var pathPattern = L.polylineDecorator([[51.3, 0.1], [41.8, 12.5], [55.45, 37.37],[38.38, 68.51],[43.76667, 87.68333], [39.92, 116.46]], {
				patterns : [{
					offset : 12,
					repeat : 25,
					symbol : new L.Symbol.Dash({
						pixelSize : 10,
						pathOptions : {
							color : '#f00',
							weight : 2
						}
					})
				}, {
					offset : 0,
					repeat : 25,
					symbol : new L.Symbol.Dash({
						pixelSize : 0
					})
				}]
			}).addTo(map);
			var arrow = L.polyline([[51.3, 0.1], [41.8, 12.5], [55.45, 37.37],[38.38, 68.51], [43.76667, 87.68333], [39.92, 116.46]], {
				patterns : [{
					offset : 0,
					repeat : 10,
					symbol : new L.Symbol.Dash({
						pixelSize : 5,
						pathOptions : {
							color : 'red',
							weight : 1,
							opacity : 0.6
						}
					})
				}]
			});
			var arrowHead = L.polylineDecorator(arrow).addTo(map);

			var arrowOffset = 0;
			var anim = window.setInterval(function() {
				arrowHead.setPatterns([{
					offset : arrowOffset + '%',
					repeat : 0,
					symbol : new L.Symbol.Marker({
						rotate : true,
						markerOptions : {
							icon : L.icon({
								iconUrl : '../css/img/icon_plane.png',
								iconAnchor : [16, 16]
							})
						}
					})
					/**
					 symbol : new L.Symbol.ArrowHead({
					 pixelSize : 15,
					 polygon : false,
					 pathOptions : {
					 stroke : true
					 }
					 })
					 **/
				}]);
				if (++arrowOffset > 100)
					arrowOffset = 0;
			}, 100);

			// --- Polygon ---
			var polygon = L.polygon([[54, -6], [55, -7], [56, -2], [55, 1], [53, 0], [54, -6]], {
				color : "#ff7800",
				weight : 1
			}).addTo(map);
			var pd = L.polylineDecorator(polygon, {
				patterns : [{
					offset : 0,
					repeat : 10,
					symbol : new L.Symbol.Dash({
						pixelSize : 0
					})
				}]
			}).addTo(map);

			// --- Multi-pattern without Polyline ---
			var pathPattern = L.polylineDecorator([[49.543519, -12.469833], [49.808981, -12.895285], [50.056511, -13.555761], [50.217431, -14.758789], [50.476537, -15.226512], [50.377111, -15.706069], [50.200275, -16.000263], [49.860606, -15.414253], [49.672607, -15.710152], [49.863344, -16.451037], [49.774564, -16.875042], [49.498612, -17.106036], [49.435619, -17.953064], [49.041792, -19.118781], [48.548541, -20.496888], [47.930749, -22.391501], [47.547723, -23.781959], [47.095761, -24.941630], [46.282478, -25.178463], [45.409508, -25.601434], [44.833574, -25.346101], [44.039720, -24.988345]], {
				patterns : [{
					offset : 12,
					repeat : 25,
					symbol : new L.Symbol.Dash({
						pixelSize : 10,
						pathOptions : {
							color : '#f00',
							weight : 2
						}
					})
				}, {
					offset : 0,
					repeat : 25,
					symbol : new L.Symbol.Dash({
						pixelSize : 0
					})
				}]
			}).addTo(map);

			// --- Markers proportionnaly located ---
			var markerLine = L.polyline([[58.44773, -28.65234], [52.9354, -23.33496], [53.01478, -14.32617], [58.1707, -10.37109], [59.68993, -0.65918]], {}).addTo(map);
			var markerPatterns = L.polylineDecorator(markerLine, {
				patterns : [{
					offset : '5%',
					repeat : '10%',
					symbol : new L.Symbol.Marker({
						rotate : true,
						markerOptions : {
							icon : L.icon({
								iconUrl : '../css/img/icon_plane.png',
								iconAnchor : [16, 16]
							})
						}
					})
				}]
			}).addTo(map);
		}
	},
	onResize : function(w, h, oW, oH) {
		this.callParent(arguments);
		var map = this.getMap();
		if (map) {
			map.invalidateSize();
		}
	},
	bbar : [{
		tooltip : 'Topographic',
		iconCls : 'topo',
		handler : function() {
			map.removeLayer(layer);
			layer = L.esri.basemapLayer('Topographic');
			map.addLayer(layer);
		}
	}, {
		tooltip : 'Streets',
		iconCls : 'street',
		handler : function() {
			map.removeLayer(layer);
			layer = L.esri.basemapLayer('Streets');
			map.addLayer(layer);
		}
	}, {
		tooltip : 'Imagery',
		iconCls : 'imagery',
		handler : function() {
			map.removeLayer(layer);
			layer = L.esri.basemapLayer('Imagery');
			map.addLayer(layer);
		}
	}, {
		tooltip : 'Geographic',
		iconCls : 'geo',
		handler : function() {
			map.removeLayer(layer);
			layer = L.esri.basemapLayer('NationalGeographic');
			map.addLayer(layer);
		}
	}]
});
