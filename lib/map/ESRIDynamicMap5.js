//本例详细地展示了ESRI集中图层的加载方式，包括
//1.dynamcicMapLayer,其实可以设置属性
//2.tiledMapLayer
//3.featureLayer及其过滤器
Ext.define('Ext.ux.LeafletMapView5', {
	extend : 'Ext.Panel',
	alias : 'widget.leafletmapview5',
	config : {
		map : null
	},
	afterRender : function(t, eOpts) {
		this.callParent(arguments);

		var leafletRef = window.L;
		if (leafletRef == null) {
			this.update('No leaflet library loaded');
		} else {
			var map2 = L.map(this.getId());
			map2.setView([42, -74], 5);
			map2.on('contextmenu', function(e) {
			});
			this.setMap(map2);
			var layer2 = L.esri.basemapLayer("Oceans").addTo(map2);
			url = "http://services.arcgis.com/DO4gTjwJVIJ7O9Ca/arcgis/rest/services/Usagi_Warning16/FeatureServer";
			dynLayer = L.esri.dynamicMapLayer("http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer", {
				opacity : 1,
				layers : [0, 1],
			});

			map2.addLayer(dynLayer);

			function style() {
				return {
					fillColor : '#BD0026',
					weight : 2,
					opacity : 0.3,
					color : 'white',
					dashArray : '3',
					fillOpacity : 0.2
				};
			}

			/**
			L.esri.tiledMapLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer", {
				opacity : 0.25,
				zIndex : 2
			}).addTo(map2);
			**/

			layerFS = L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0', {
				filter : function(geojson, layer) {
					return geojson.properties.direction == 'West';
				},
				onEachFeature : function(geojson, layer) {
					if (geojson.properties) {
						var popupText = "<div style='overflow-y:scroll; max-height:200px;'>";
						for (prop in geojson.properties) {
							var val = geojson.properties[prop];
							if (val) {
								popupText += "<b>" + prop + "</b>: " + val + "<br>";
							}
						}
						popupText += "</div>";
						layer.bindPopup(popupText);
					}
				}
			}).addTo(map2);

			map2.on("click", function(e) {
				dynLayer.identify(e.latlng, function(data) {
					if (data.results.length > 0) {
						//Popup text should be in html format.  Showing the Storm Name with the type
						popupText = "<center><b>" + data.results[0].attributes.STORMNAME + "</b><br>" + data.results[0].attributes.STORMTYPE + "</center>";

						//Add Popup to the map when the mouse was clicked at
						var popup = L.popup().setLatLng(e.latlng).setContent(popupText).openOn(map2);
					}
				});
			});
		}
	},
	onResize : function(w, h, oW, oH) {
		this.callParent(arguments);
		var map2 = this.getMap();
		if (map2) {
			map2.invalidateSize();
		}
	}
});
