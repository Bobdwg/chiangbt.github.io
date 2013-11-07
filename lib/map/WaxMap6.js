Ext.define('Ext.ux.LeafletMapView6', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview6',
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
			map.setView([53.796, -1.551], 14);
			map.on('contextmenu', function(e) {
			});
			this.setMap(map);

			L.tileLayer('http://{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png', {
				maxZoom : 18
			}).addTo(map);

			Ext.Ajax.request({
				url : 'http://localhost:3000/house',
				method : 'GET',
				success : function(resp, opts) {
					var respText = Ext.JSON.decode(resp.responseText);
					//---------------------------------------------
					function getColor(d) {
						var color = "#334DCC";
						var colormap = {
							"hospital" : "#CC3399",
							"residential" : "#FF33CC",
							"house" : "#CCB333",
							"school" : "#99CC33",
							"retail" : "#D864B1",
							"commercial" : "#006600",
							"null" : color
						};

						color = colormap[d] || color;
						return (color);
					}

					function style(feature) {
						return {
							fillColor : getColor(feature.properties.type),
							weight : 2,
							opacity : 1,
							color : 'white',
							dashArray : '3',
							fillOpacity : 0.5
						};
					}

					function highlightFeature(e) {
						var layer = e.target;
						layer.setStyle({
							weight : 3,
							color : 'red',
							dashArray : '',
							fillOpacity : 0.5
						});

						if (!L.Browser.ie && !L.Browser.opera) {
							layer.bringToFront();
						}
						info.update(layer.feature.properties);
					}

					function resetHighlight(e) {
						geojson.resetStyle(e.target);
						info.update();
					}

					//---------------------------------------------
					var geojson;
					function zoomToFeature(e) {
						map.fitBounds(e.target.getBounds());
					}

					function onEachFeature(feature, layer) {
						layer.on({
							mouseover : highlightFeature,
							mouseout : resetHighlight,
							click : zoomToFeature
						});
					}

					geojson = L.geoJson(respText, {
						style : style,
						onEachFeature : onEachFeature
					}).addTo(map);

					var info = L.control();
					info.onAdd = function(map) {
						this._div = L.DomUtil.create('div', 'info');
						this.update();
						return this._div;
					};

					info.update = function(props) {
						this._div.innerHTML = '<h4>房地产信息</h4>' + ( props ? '<b>不动产类型： ' + props.type + '</b><br />不动产名称： ' + props.name : '无');
					};
					info.addTo(map);

					var legend = L.control({
						position : 'bottomright'
					});
					legend.onAdd = function(map) {
						var div = L.DomUtil.create('div', 'info legend'), grades = ["hospital", "residential", "house", "school", "retail", "commercial", "null"], labels = [];
						for (var i = 0; i < grades.length; i++) {
							div.innerHTML += '<i style="background:' + getColor(grades[i]) + '"></i> ' + grades[i] + '<br>';
						}
						return div;
					};

					legend.addTo(map);

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
