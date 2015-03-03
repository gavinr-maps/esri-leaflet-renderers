/*! esri-leaflet-renderers - v0.0.1-beta.2 - 2015-03-02
*   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */


var EsriLeafletRenderers={VERSION:"0.0.1-beta.2"};if("undefined"!=typeof window&&window.L&&window.L.esri&&(window.L.esri.Renderers=EsriLeafletRenderers),!Esri)var Esri=window.L.esri;EsriLeafletRenderers.Symbol=L.Class.extend({initialize:function(a){this._symbolJson=a,this.val=null,this._styles={}},pixelValue:function(a){return 1.3333333333333*a},colorValue:function(a){return"rgb("+a[0]+","+a[1]+","+a[2]+")"},alphaValue:function(a){return a[3]/255}}),EsriLeafletRenderers.PointSymbol=EsriLeafletRenderers.Symbol.extend({statics:{MARKERTYPES:["esriSMSCircle","esriSMSCross","esriSMSDiamond","esriSMSSquare","esriSMSX","esriPMS"]},initialize:function(a,b){EsriLeafletRenderers.Symbol.prototype.initialize.call(this,a),b&&(this.serviceUrl=b.url),a&&("esriPMS"===a.type?this._createIcon():this._fillStyles())},_fillStyles:function(){this._symbolJson.outline&&this._symbolJson.size>0?(this._styles.stroke=!0,this._styles.weight=this.pixelValue(this._symbolJson.outline.width),this._styles.color=this.colorValue(this._symbolJson.outline.color),this._styles.opacity=this.alphaValue(this._symbolJson.outline.color)):this._styles.stroke=!1,this._symbolJson.color&&(this._styles.fillColor=this.colorValue(this._symbolJson.color),this._styles.fillOpacity=this.alphaValue(this._symbolJson.color)),"esriSMSCircle"===this._symbolJson.style&&(this._styles.radius=this.pixelValue(this._symbolJson.size)/2)},_createIcon:function(){var a=this.pixelValue(this._symbolJson.height),b=this.pixelValue(this._symbolJson.width),c=b/2+this.pixelValue(this._symbolJson.xoffset),d=a/2+this.pixelValue(this._symbolJson.yoffset),e=this.serviceUrl+"images/"+this._symbolJson.url;this.icon=L.icon({iconUrl:e,iconSize:[b,a],iconAnchor:[c,d]})},pointToLayer:function(a,b){if("esriPMS"===this._symbolJson.type)return L.marker(b,{icon:this.icon});var c=this.pixelValue(this._symbolJson.size);switch(this._symbolJson.style){case"esriSMSSquare":return EsriLeafletRenderers.squareMarker(b,c,this._styles);case"esriSMSDiamond":return EsriLeafletRenderers.diamondMarker(b,c,this._styles);case"esriSMSCross":return EsriLeafletRenderers.crossMarker(b,c,this._styles);case"esriSMSX":return EsriLeafletRenderers.xMarker(b,c,this._styles)}return L.circleMarker(b,this._styles)}}),EsriLeafletRenderers.pointSymbol=function(a,b){return new EsriLeafletRenderers.PointSymbol(a,b)},EsriLeafletRenderers.LineSymbol=EsriLeafletRenderers.Symbol.extend({statics:{LINETYPES:["esriSLSDash","esriSLSDot","esriSLSDashDotDot","esriSLSDashDot","esriSLSSolid"]},initialize:function(a){EsriLeafletRenderers.Symbol.prototype.initialize.call(this,a),this._fillStyles()},_fillStyles:function(){if(this._styles.lineCap="butt",this._styles.lineJoin="miter",this._symbolJson)switch(this._symbolJson.width&&(this._styles.weight=this.pixelValue(this._symbolJson.width)),this._symbolJson.color&&(this._styles.color=this.colorValue(this._symbolJson.color),this._styles.opacity=this.alphaValue(this._symbolJson.color)),this._symbolJson.style){case"esriSLSDash":this._styles.dashArray="5,4";break;case"esriSLSDot":this._styles.dashArray="1,4";break;case"esriSLSDashDot":this._styles.dashArray="11,4,1,4";break;case"esriSLSDashDotDot":this._styles.dashArray="11,4,1,4,1,4"}},style:function(){return this._styles}}),EsriLeafletRenderers.lineSymbol=function(a){return new EsriLeafletRenderers.LineSymbol(a)},EsriLeafletRenderers.PolygonSymbol=EsriLeafletRenderers.Symbol.extend({statics:{POLYGONTYPES:["esriSFSSolid"]},initialize:function(a){EsriLeafletRenderers.Symbol.prototype.initialize.call(this,a),a&&(this._lineStyles=EsriLeafletRenderers.lineSymbol(a.outline).style(),this._fillStyles())},_fillStyles:function(){if(this._symbolJson&&this._symbolJson.color&&(this._styles.fillColor=this.colorValue(this._symbolJson.color),this._styles.fillOpacity=this.alphaValue(this._symbolJson.color)),this._lineStyles)if(0===this._lineStyles.weight)this._styles.stroke=!1;else for(var a in this._lineStyles)this._styles[a]=this._lineStyles[a]},style:function(){return this._styles}}),EsriLeafletRenderers.polygonSymbol=function(a){return new EsriLeafletRenderers.PolygonSymbol(a)},EsriLeafletRenderers.Renderer=L.Class.extend({options:{proportionalPolygon:!1,clickable:!0},initialize:function(a,b){this._rendererJson=a,this._pointSymbols=!1,this._symbols=[],L.Util.setOptions(this,b)},_createDefaultSymbol:function(){this._rendererJson.defaultSymbol&&(this._defaultSymbol=this._newSymbol(this._rendererJson.defaultSymbol))},_newSymbol:function(a){return"esriSMS"===a.type||"esriPMS"===a.type?(this._pointSymbols=!0,EsriLeafletRenderers.pointSymbol(a,this.options)):"esriSLS"===a.type?EsriLeafletRenderers.lineSymbol(a):"esriSFS"===a.type?EsriLeafletRenderers.polygonSymbol(a):void 0},_getSymbol:function(){},attachStylesToLayer:function(a){this._pointSymbols?a.options.pointToLayer=L.Util.bind(this.pointToLayer,this):a.options.style=L.Util.bind(this.style,this)},pointToLayer:function(a,b){var c=this._getSymbol(a);return c?c.pointToLayer(a,b):L.circleMarker(b,{radius:0})},style:function(a){var b=this._getSymbol(a);return b?b.style(a):{opacity:0,fillOpacity:0}}}),EsriLeafletRenderers.SimpleRenderer=EsriLeafletRenderers.Renderer.extend({initialize:function(a,b){EsriLeafletRenderers.Renderer.prototype.initialize.call(this,a,b),this._createSymbol()},_createSymbol:function(){this._rendererJson.symbol&&this._symbols.push(this._newSymbol(this._rendererJson.symbol))},_getSymbol:function(){return this._symbols[0]}}),EsriLeafletRenderers.simpleRenderer=function(a,b){return new EsriLeafletRenderers.SimpleRenderer(a,b)},EsriLeafletRenderers.ClassBreaksRenderer=EsriLeafletRenderers.Renderer.extend({initialize:function(a,b){EsriLeafletRenderers.Renderer.prototype.initialize.call(this,a,b),this._field=this._rendererJson.field,this._createSymbols()},_createSymbols:function(){var a,b=this._rendererJson.classBreakInfos;this._symbols=[];for(var c=b.length-1;c>=0;c--)a=this._newSymbol(this.options.proportionalPolygon&&this._rendererJson.backgroundFillSymbol?this._rendererJson.backgroundFillSymbol:b[c].symbol),a.val=b[c].classMaxValue,this._symbols.push(a);this._symbols.sort(function(a,b){return a.val>b.val?1:-1}),this._createDefaultSymbol(),this._maxValue=this._symbols[this._symbols.length-1].val},_getSymbol:function(a){var b=a.properties[this._field];if(b>this._maxValue)return this._defaultSymbol;for(var c=this._symbols[0],d=this._symbols.length-1;d>=0&&!(b>this._symbols[d].val);d--)c=this._symbols[d];return c}}),EsriLeafletRenderers.classBreaksRenderer=function(a,b){return new EsriLeafletRenderers.ClassBreaksRenderer(a,b)},EsriLeafletRenderers.UniqueValueRenderer=EsriLeafletRenderers.Renderer.extend({initialize:function(a,b){EsriLeafletRenderers.Renderer.prototype.initialize.call(this,a,b),this._field=this._rendererJson.field1,this._createSymbols()},_createSymbols:function(){for(var a,b=this._rendererJson.uniqueValueInfos,c=b.length-1;c>=0;c--)a=this._newSymbol(b[c].symbol),a.val=b[c].value,this._symbols.push(a);this._createDefaultSymbol()},_getSymbol:function(a){for(var b=a.properties[this._field],c=this._defaultSymbol,d=this._symbols.length-1;d>=0;d--)this._symbols[d].val==b&&(c=this._symbols[d]);return c}}),EsriLeafletRenderers.uniqueValueRenderer=function(a,b){return new EsriLeafletRenderers.UniqueValueRenderer(a,b)},EsriLeafletRenderers.SquareMarker=L.Path.extend({options:{fill:!0},initialize:function(a,b,c){L.Path.prototype.initialize.call(this,c),this._size=b,this._center=a},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._center)},getPathString:function(){if(!this._map)return"";var a=this._point,b=this._size/2;L.Path.VML&&(a._round(),b=Math.round(b));var c="M"+(a.x+b)+","+(a.y+b)+"L"+(a.x-b)+","+(a.y+b)+"L"+(a.x-b)+","+(a.y-b)+"L"+(a.x+b)+","+(a.y-b);return c+(L.Browser.svg?"z":"x")},setLatLng:function(a){return this._center=a,this.redraw()},getLatLng:function(){return L.latLng(this._center)},getSize:function(){return this._size},setSize:function(a){return this._size=a,this.redraw()}}),EsriLeafletRenderers.squareMarker=function(a,b,c){return new EsriLeafletRenderers.SquareMarker(a,b,c)},EsriLeafletRenderers.DiamondMarker=L.Path.extend({options:{fill:!0},initialize:function(a,b,c){L.Path.prototype.initialize.call(this,c),this._size=b,this._center=a},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._center)},getPathString:function(){if(!this._map)return"";var a=this._point,b=this._size/2;L.Path.VML&&(a._round(),b=Math.round(b));var c="M"+a.x+","+(a.y+b)+"L"+(a.x-b)+","+a.y+"L"+a.x+","+(a.y-b)+"L"+(a.x+b)+","+a.y;return c+(L.Browser.svg?"z":"x")},setLatLng:function(a){return this._center=a,this.redraw()},getLatLng:function(){return L.latLng(this._center)},getSize:function(){return this._size},setSize:function(a){return this._size=a,this.redraw()}}),EsriLeafletRenderers.diamondMarker=function(a,b,c){return new EsriLeafletRenderers.DiamondMarker(a,b,c)},EsriLeafletRenderers.CrossMarker=L.Path.extend({initialize:function(a,b,c){L.Path.prototype.initialize.call(this,c),this._size=b,this._center=a},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._center)},getPathString:function(){if(!this._map)return"";var a=this._point,b=this._size/2;return L.Path.VML&&(a._round(),b=Math.round(b)),"M"+a.x+","+(a.y+b)+"L"+a.x+","+(a.y-b)+"M"+(a.x-b)+","+a.y+"L"+(a.x+b)+","+a.y},setLatLng:function(a){return this._center=a,this.redraw()},getLatLng:function(){return L.latLng(this._center)},getSize:function(){return this._size},setSize:function(a){return this._size=a,this.redraw()}}),EsriLeafletRenderers.crossMarker=function(a,b,c){return new EsriLeafletRenderers.CrossMarker(a,b,c)},EsriLeafletRenderers.XMarker=L.Path.extend({initialize:function(a,b,c){L.Path.prototype.initialize.call(this,c),this._size=b,this._center=a},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._center)},getPathString:function(){if(!this._map)return"";var a=this._point,b=this._size/2;return L.Path.VML&&(a._round(),b=Math.round(b)),"M"+(a.x+b)+","+(a.y+b)+"L"+(a.x-b)+","+(a.y-b)+"M"+(a.x-b)+","+(a.y+b)+"L"+(a.x+b)+","+(a.y-b)},setLatLng:function(a){return this._center=a,this.redraw()},getLatLng:function(){return L.latLng(this._center)},getSize:function(){return this._size},setSize:function(a){return this._size=a,this.redraw()}}),EsriLeafletRenderers.xMarker=function(a,b,c){return new EsriLeafletRenderers.XMarker(a,b,c)},Esri.FeatureLayer.addInitHook(function(){var a=L.Util.bind(this.onAdd,this),b=L.Util.bind(this.unbindPopup,this),c=L.Util.bind(this.onRemove,this);L.Util.bind(this.createNewLayer,this),this.metadata(function(b,c){c&&c.drawingInfo&&!this.options.style&&this._setRenderers(c),this._metadataLoaded=!0,this._loadedMap&&(a(this._loadedMap),this._addPointLayer(this._loadedMap))},this),this.onAdd=function(b){this._loadedMap=b,this._metadataLoaded&&(a(this._loadedMap),this._addPointLayer(this._loadedMap))},this.onRemove=function(a){if(c(a),this._pointLayer){var b=this._pointLayer.getLayers();for(var d in b)a.removeLayer(b[d])}},this.unbindPopup=function(){if(b(),this._pointLayer){var a=this._pointLayer.getLayers();for(var c in a)a[c].unbindPopup()}},this._addPointLayer=function(a){this._pointLayer&&(this._pointLayer.addTo(a),this._pointLayer.bringToFront())},this._createPointLayer=function(){if(!this._pointLayer&&(this._pointLayer=L.geoJson(),this._popup)){var a=function(a,b){b.bindPopup(this._popup(a,b),this._popupOptions)};this._pointLayer.options.onEachFeature=L.Util.bind(a,this)}},this.createNewLayer=function(a){var b=L.GeoJSON.geometryToLayer(a,this.options.pointToLayer,L.GeoJSON.coordsToLatLng,this.options);if(this._hasProportionalSymbols){var c=this.getPolygonCentroid(a.geometry.coordinates);if(!isNaN(c[0])&&!isNaN(c[0])){this._createPointLayer();var d=this.getPointJson(a,c);this._pointLayer.addData(d),this._pointLayer.bringToFront()}}return b},this.getPolygonCentroid=function(a){var b=a[0][0];2===b.length&&(b=a[0]);for(var c,d,e,f=0,g=0,h=0,i=b.length,j=0,k=i-1;i>j;k=j++)c=b[j],d=b[k],f+=c[0]*d[1],f-=c[1]*d[0],e=c[0]*d[1]-d[0]*c[1],g+=(c[0]+d[0])*e,h+=(c[1]+d[1])*e;return e=3*f,[g/e,h/e]},this.getPointJson=function(a,b){return{type:"Feature",properties:a.properties,id:a.id,geometry:{type:"Point",coordinates:[b[0],b[1]]}}},this._checkForProportionalSymbols=function(a,b){if(this._hasProportionalSymbols=!1,"esriGeometryPolygon"===a&&(b.backgroundFillSymbol&&(this._hasProportionalSymbols=!0),b.classBreakInfos&&b.classBreakInfos.length)){var c=b.classBreakInfos[0].symbol;!c||"esriSMS"!==c.type&&"esriPMS"!==c.type||(this._hasProportionalSymbols=!0)}},this._setRenderers=function(a){var b,c=a.drawingInfo.renderer,d={url:this.url?this.url:this._service.options.url};switch(c.type){case"classBreaks":if(this._checkForProportionalSymbols(a.geometryType,c),this._hasProportionalSymbols){this._createPointLayer();var e=EsriLeafletRenderers.classBreaksRenderer(c,d);e.attachStylesToLayer(this._pointLayer),d.proportionalPolygon=!0}b=EsriLeafletRenderers.classBreaksRenderer(c,d);break;case"uniqueValue":b=EsriLeafletRenderers.uniqueValueRenderer(c,d);break;default:b=EsriLeafletRenderers.simpleRenderer(c,d)}b.attachStylesToLayer(this)}});
//# sourceMappingURL=esri-leaflet-renderers.js.map