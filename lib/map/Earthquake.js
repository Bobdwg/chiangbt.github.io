Ext.define('Ext.ux.EarthquakeView', {
	extend : 'Ext.Component',
	alias : 'widget.earthquakeview',
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
			map.setView([0.0, 0.0], 2);
			map.on('contextmenu', function(e) {
			});
			this.setMap(map);

			var baseLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {
				attribution : 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; CC-BY-SA',
				maxZoom : 17,
				minZoom : 2
			});
			baseLayer.addTo(map);

			//热力图类heatMap
			var heatmapLayer = L.TileLayer.heatMap({
				radius : 8,
				opacity : 0.8,
				gradient : {
					0.35 : "black",
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

			console.log(heatmapLayer.calRadius(map, 60000, heatmapLayer.options));
			heatmapLayer.addTo(map);

			var markers = new L.MarkerClusterGroup({
				spiderfyOnMaxZoom : false,
				disableClusteringAtZoom : 7
			});
			map.addLayer(markers);

			//draw和edit编辑工具栏
			var drawnItems = new L.FeatureGroup();
			map.addLayer(drawnItems);

			var drawControl = new L.Control.Draw({
				draw : {
					position : 'topleft',
					polygon : {
						title : 'Draw a sexy polygon!',
						allowIntersection : false,
						drawError : {
							color : '#b00b00',
							timeout : 1000
						},
						shapeOptions : {
							color : '#bada55'
						},
						showArea : true
					},
					polyline : {
						metric : true
					},
					circle : {
						shapeOptions : {
							color : '#662d91'
						}
					}
				},
				edit : {
					featureGroup : drawnItems
				}
			});
			map.addControl(drawControl);

			map.on('draw:created', function(e) {
				var type = e.layerType, layer = e.layer;

				if (type === 'marker') {
					layer.bindPopup('A popup!');
				}

				drawnItems.addLayer(layer);
			});

			Ext.Ajax.request({
				//访问node.js从MongoDB中获取的GeoJSON数据，但这种数据已经被清洗过
				//如果要访问原生的geojson数据，可以查看nzheatmap
				url : 'http://127.0.0.1:3000/localearthquake/',
				method : 'GET',
				success : function(resp, opts) {
					var respText = Ext.JSON.decode(resp.responseText);

					heatmapLayer.addData(respText.features);
					heatmapLayer.redraw();

					// 点聚类
					var ms = [];
					for (var i = 0; i < respText.features.length; i++) {
						var a = respText.features[i];
						var m = new L.Marker(new L.LatLng(a["lat"], a["lng"]), {
							value : 1
						});
						var popupText = "<div style=' max-height:250px;'>";
						popupText += "<b>区域</b>: " + a.region + "<br>";
						popupText += "<b>震级</b>: " + a.magnitude + "<br>";
						popupText += "<b>深度</b>: " + a.depth + "<br>";
						popupText += "<b>时间</b>: " + a.timedate + "<br>";
						popupText += "</div>";
						m.bindPopup(popupText);
						ms.push(m);
						//markers.addLayer(m);
					}
					markers.addLayers(ms);

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
