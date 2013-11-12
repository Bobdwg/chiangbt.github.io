Ext.define('Ext.ux.LeafletMapView8', {
	extend : 'Ext.Component',
	alias : 'widget.leafletmapview8',
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
			
			lt2 = L.tileLayer("http://t0.tianditu.com/cva_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});
			
			var cities = L.layerGroup([lt5, lt2]);
			
			img = L.tileLayer("http://t0.tianditu.cn/img_w/wmts?"+
				"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
				"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}", {
				minZoom : 4,
				maxZoom : 18
			});

			latlng = new L.LatLng(30.52, 114.37);
			var map = new L.Map(this.getId(), {center: latlng, zoom: 14, layers: [cities, img]});
			map.on('contextmenu', function(e) {});
			this.setMap(map);
			var l_parent = getLayer(map._layers)._container, handle = document.getElementById('handle'), dragging = false;
			handle.onmousedown = function() {
				dragging = true;
				return false;
			};
			document.onmouseup = function() {
				dragging = false;
			};
			document.onmousemove = function(e) {
				if (!dragging)
					return;
				setDivide(e.x);
			};
			map.on("zoomend", function(e) {
				l_parent = getLayer(map._layers)._container;
				setDivide(parseInt(handle.style.left));
			});
			map.on("moveend", function(e) {
				l_parent = getLayer(map._layers)._container;
				setDivide(parseInt(handle.style.left));
			});
			map.on("drag", function(e) {
				l_parent = getLayer(map._layers)._container;
				setDivide(parseInt(handle.style.left));
			});
			map.on("mousemove", function(e) {
				l_parent = getLayer(map._layers)._container;
				setDivide(e.containerPoint.x);
			});

			function setDivide(x) {
				x = Math.max(0, Math.min(x, map.getSize()['x']));
				handle.style.left = (x) + 'px';
				var layerX = map.containerPointToLayerPoint(x, 0).x;
				l_parent.style.clip = 'rect(-99999px ' + layerX + 'px 999999px -99999px)';
			}

			function getLayer(obj) {
				var last;
				for (var i in obj) {
					if (obj.hasOwnProperty(i) && typeof (i) !== 'function') {
						last = obj[i];
					}
				}
				return last;
			}

			setDivide(300);
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
