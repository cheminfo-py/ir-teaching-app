'use strict';define(["jquery","modules/default/defaultview","jsgraph","json-chart","src/util/api","src/util/color","src/util/debug","src/util/util"],function(a,b,c,d,e,f,g,h){"use strict";function i(){}function j(a,b){if(Array.isArray(a)){var c,d,e,f=1/0,g=-Infinity,h=20;if("number"==typeof a[0]){if(a.length<2*h-1)return"discrete";for(d=0,e=a.length-2;d<e;d+=2)c=a[d+2]-a[d],c>g&&(g=c),c<f&&(f=c)}else if(Array.isArray(a[0])&&2===a.length){if("automass"===b)return l({x:a[0],y:a[1]})?"continuous":"discrete";if(a[0].length<h)return"discrete";for(let b=0;b<a[0].length-1;b++)c=a[0][b+1]-a[0][b],c>g&&(g=c),c<f&&(f=c)}else{if(a.length<h)return"discrete";for(d=0,e=a.length-1;d<e;d++)c=a[d+1][0]-a[d][0],c>g&&(g=c),c<f&&(f=c)}return .9>Math.abs(f/g)?"discrete":"continuous"}}function k(a){let b=a[0];for(let c of a)c>b&&(b=c);return b}function l(a,b={}){const{minLength:c=100,maxDeltaRatio:d=3,relativeHeightThreshold:e=.001}=b;let f=a.x,g=a.y;if(f.length<c)return!1;else{const a=k(g)*e;let b=f[1]-f[0],c=0,h=0;for(let e=0;e<f.length-1;e++){if(g[e]<a||g[e+1]<a){b=0;continue}let i=f[e+1]-f[e];if(b){let a=i/b;if((.1<Math.abs(i)||a<1/d||a>1*d)&&0!==g[e]&&0!==g[e+1]){h++;break}else c++}b=i}if(10>c/h)return!1}return!0}const m={shape:"circle",cx:0,cy:0,r:3,height:"5px",width:"5px",stroke:"transparent",fill:"black"},n={x:"xAxis",y:"yAxis",xy:"both"};return a.extend(!0,i.prototype,b,{init(){this.series={},this.seriesDrawn={},this.annotations={},this.dom=a("<div />"),this.module.getDomContent().html(this.dom),this.seriesActions=[],this.colorId=0,this.colors=["red","blue","green","black"],this.onchanges={},this.highlightOptions=Object.assign({fill:"black"},h.evalOptions(this.module.getConfiguration("highlightOptions"))),this.serieHiddenState=new Map},inDom(){var b=new Promise(b=>{var d=this.module.getConfiguration,e=this.module.getConfigurationCheckbox,f=d("graphurl");if(f)a.getJSON(f,{},a=>{a.options.onMouseMoveData=(a,b)=>{this.module.controller.sendAction("mousetrack",b)},b(new c(this.dom.get(0),a.options,a.axis))});else{var g={close:{top:!1,right:!1,bottom:!1,left:!1},plugins:{},mouseActions:[]};g.plugins.drag={},g.mouseActions.push({plugin:"drag",shift:!0,ctrl:!1});var h=d("zoom");let a;if(a="x"===h?"gradualX":"y"===h?"gradualY":"gradualXY",g.plugins.zoom={},g.mouseActions.push({plugin:"zoom",type:"dblclick",options:{mode:"total"}}),g.mouseActions.push({plugin:"zoom",type:"dblclick",shift:!0,options:{mode:a}}),g.plugins.peakPicking={},h&&"none"!==h){var i={};i.zoomMode="x"===h?"x":"y"===h?"y":"xy",e("independantYZoom","yes")&&(i.axes="serieSelected"),g.plugins.zoom=i,g.mouseActions.push({plugin:"zoom",shift:!1,ctrl:!1})}var j=d("wheelAction");if(j&&"none"!==j){var k={baseline:"zoomYMousePos"==j?"mousePosition":d("wheelbaseline",0)};k.direction="zoomX"===j?"x":"y",g.mouseActions.push({plugin:"zoom",type:"mousewheel",options:k})}g.mouseActions.push({callback:(a,b)=>{this.module.controller.sendActionFromEvent("onMouseWheel","mouseEvent",b),this.module.controller.sendActionFromEvent("onMouseWheel","wheelDelta",a)},type:"mousewheel"}),g.mouseActions.push({callback:(a,b)=>{this.module.controller.sendActionFromEvent("onMouseWheelShift","mouseEvent",b),this.module.controller.sendActionFromEvent("onMouseWheelShift","wheelDelta",a)},shift:!0,type:"mousewheel"});const f=e("mouseTracking","track");f&&(g.mouseMoveData=!0,g.mouseMoveDataOptions={useAxis:d("trackingAxis")});const s=e("selectScatter","yes");s&&(g.plugins.selectScatter={},g.mouseActions.push({plugin:"selectScatter",alt:!0}));var l={nbTicksPrimary:d("xnbTicksPrimary",5)};"timestamptotime"==d("xaxismodification")?l.type="time":"valtotime"==d("xaxismodification")?l.unitModification="time":"valtotime:min.sec"==d("xaxismodification")&&(l.unitModification="time:min.sec"),g.mouseMoveDataOptions={useAxis:d("trackingAxis")};var m=new c(this.dom.get(0),g,{bottom:[l]});this.graph=m;var n=m.getXAxis(0,l);this.xAxis=n,n.flip(d("flipX",!1)).setPrimaryGrid(d("vertGridMain",!1)).setSecondaryGrid(d("vertGridSec",!1)).setPrimaryGridColor("#DADADA").setSecondaryGridColor("#F0F0F0").setGridLinesStyle().setLabel(d("xLabel","")).forceMin(d("minX",!1)).forceMax(d("maxX",!1)).setAxisDataSpacing(d("xLeftSpacing",0),d("xRightSpacing",0)),d("displayXAxis",!0)||n.hide();const t=([a,b])=>{this.module.model.setXBoundaries(a,b)};n.on("zoom",t),n.on("zoomOutFull",t),e("FitYToAxisOnFromTo","rescale")&&n.on("zoom",function(){o.scaleToFitAxis(this)}),this.numberOfYAxes=0;var o=this.getYAxis(0);this.yAxis=o;var p=d("legend","none");if("none"!==p){var q=m.makeLegend({backgroundColor:"rgba( 255, 255, 255, 0.8 )",frame:!0,frameWidth:"1",frameColor:"rgba( 100, 100, 100, 0.5 )",movable:e("legendOptions","movable"),isSerieHideable:e("legendOptions","isSerieHideable"),isSerieSelectable:e("legendOptions","isSerieSelectable")});q.setAutoPosition(p)}if(f){const a={useAxis:d("trackingAxis"),mode:"individual"},b=e("mouseTracking","legend");b&&Object.assign(a,{legend:!0,legendType:"common"}),m.trackingLine(a),m.on("mouseMoveData",(a,b)=>{this.module.model.trackData=b,this.module.controller.sendActionFromEvent("onTrackMouse","trackData",b),this.module.controller.sendActionFromEvent("onTrackMouse","mouseEvent",a),this.module.controller.sendActionFromEvent("onTrackMouse","dataAndEvent",{data:b,event:a}),this.module.controller.createDataFromEvent("onTrackMouse","trackData",b)}),m.on("click",a=>{this.module.model.trackData&&(this.module.controller.sendActionFromEvent("onTrackClick","trackData",this.module.model.trackData),this.module.controller.sendActionFromEvent("onTrackClick","mouseEvent",a[3]),this.module.controller.sendActionFromEvent("onTrackClick","dataAndEvent",{data:this.module.model.trackData,event:a[3]}),this.module.controller.createDataFromEvent("onTrackClick","trackData",this.module.model.trackData))})}if(s){var r=m.getPlugin("selectScatter");r.on("selectionEnd",a=>{const b=r.options.serie;var c=[],d=b.infos;d&&(c=a.map(a=>d[a])),this.module.controller.onScatterSelection(c)})}m.draw(!0),b(m)}});b.then(a=>{this.graph=a,this.xAxis=a.getXAxis(0),this.yAxis=a.getYAxis(0),a.on("shapeMouseOver",a=>{this.module.controller.createDataFromEvent("onMouseOverShape","shapeProperties",a.getProperties()),this.module.controller.createDataFromEvent("onMouseOverShape","shapeInfos",a.getData()),e.highlight(a.getData(),1)}),a.on("shapeMouseOut",a=>{e.highlight(a.getData(),0)}),a.on("shapeResized",a=>{this.module.model.dataTriggerChange(a.getData())}),a.on("shapeMoved",a=>{this.module.model.dataTriggerChange(a.getData())}),a.on("shapeClicked",a=>{this.module.controller.createDataFromEvent("onShapeClick","shapeProperties",a.getProperties()),this.module.controller.createDataFromEvent("onShapeClick","shapeInfos",a.getData()),this.module.controller.sendActionFromEvent("onShapeClick","shapeInfos",a.getData()),this.module.controller.sendActionFromEvent("onShapeClick","dataAndEvent",{data:a.getData(),event:event})}),a.on("shapeSelected",a=>{this.module.controller.sendActionFromEvent("onShapeSelect","selectedShape",a.getData())}),a.on("shapeUnselected",a=>{this.module.controller.sendActionFromEvent("onShapeUnselect","shapeInfos",a.getData())}),this.onResize(),this.resolveReady()}).catch(a=>{g.error("Error loading the graph",a)})},getYAxis(a){if(this.numberOfYAxes>a)return this.graph.getYAxis(a);for(var b,c,d=this.module.getConfiguration,e=this.numberOfYAxes;e<=a;e++){if(c={nbTicksPrimary:d("ynbTicksPrimary",5)},b=this.graph.getYAxis(e,c),0===e){b.setPrimaryGrid(d("horGridMain",!1)).setSecondaryGrid(d("horGridSec",!1)).setPrimaryGridColor("#DADADA").setSecondaryGridColor("#F0F0F0").setGridLinesStyle().setLabel(d("yLabel","")),d("displayYAxis",!0)||b.hide();const a=([a,b])=>{this.module.model.setYBoundaries(a,b)};b.on("zoom",a),b.on("zoomOutFull",a)}else b.setPrimaryGrid(!1).setSecondaryGrid(!1).setGridLinesStyle().hide();b.flip(d("flipY",!1)).forceMin(d("minY",!1)).forceMax(d("maxY",!1)).setAxisDataSpacing(d("yBottomSpacing",0),d("yTopSpacing",0)),this.numberOfYAxes++}return b},onResize(){this.graph&&(this.graph.resize(this.width,this.height),this.graph.updateLegend())},shouldAutoscale(a){return!this.seriesDrawn[a]&&(this.seriesDrawn[a]=!0,!0)},redraw(a,b){var c;a?c="both":(c=this.module.getConfiguration("fullOut"),b&&"once"===c&&(this.shouldAutoscale(b)?c="both":c="none")),this.fullOut(c)},fullOut(a){"both"===a?this.graph.autoscaleAxes():"xAxis"===a?this.xAxis.setMinMaxToFitSeries():"yAxis"===a?this.yAxis.setMinMaxToFitSeries():void 0,this.graph.draw(),this.graph.updateLegend();var b=this.xAxis.getCurrentMin(),c=this.xAxis.getCurrentMax(),d=this.yAxis.getCurrentMin(),e=this.yAxis.getCurrentMax();this.module.model.setXBoundaries(b,c),this.module.model.setYBoundaries(d,e)},getSerieOptions(a,b,c){let d=this.module.getConfiguration("plotinfos"),f={},g={trackMouse:!0};if(b=b||[],d)for(var h=0,k=d.length;h<k;h++)if(a==d[h].variable){var l=d[h].plotcontinuous;l.startsWith("auto")&&(l=j(c,l)),d[h].markers[0]&&(g.markersIndependent=!1),g.lineToZero="discrete"==l,g.strokeWidth=parseInt(d[h].strokewidth,10);var m=d[h].peakpicking[0];m&&(f.peakPicking=!0)}return g.onMouseOverMarker=(a,c,d)=>{e.highlightId(b[a],1),this.module.controller.onMouseOverMarker(d,c)},g.onMouseOutMarker=(a,c,d)=>{e.highlightId(b[a],0),this.module.controller.onMouseOutMarker(d,c)},g.onToggleMarker=(a,b,c)=>{this.module.controller.onClickMarker(a,b,c)},g.overflowY=this.module.getConfigurationCheckbox("overflow","overflowY"),g.overflowX=this.module.getConfigurationCheckbox("overflow","overflowX"),{options:g,others:f}},setSerieParameters(a,b,c={}){const{highlight:d,style:g={},styles:h={unselected:{},selected:{}}}=c;var j=this.module.getConfiguration("plotinfos");const k=this.module.getConfiguration("stackVerticalSpacing");var m=!1;a.autoAxis(),a.hidden=!!this.serieHiddenState.get(b);let n={};if(j){const c=new Set;for(var o of j)c.add(o.axis?+o.axis:0);const d=Math.min(...c),e=c.size||1;for(var p=0,q=j.length;p<q;p++)if(b==j[p].variable){m=!0;const b=(j[p].axis?+j[p].axis:0)-d;var l=this.getYAxis(b);if(l.setSpan(b*k||0,1-k*(e-1-b)),a.setYAxis(l),j[p].adaptTo&&"none"!==j[p].adaptTo+""){var r=this.getYAxis(+j[p].adaptTo);l.adaptTo(r,0,0)}n.lineColor=f.getColor(j[p].plotcolor);var s=parseFloat(j[p].strokewidth);if(isNaN(s)&&(s=1),a.setLineWidth(s),n.lineStyle=parseInt(j[p].strokestyle)||1,j[p].markers[0]&&a.showMarkers){var t=g.lineColor||j[p].plotcolor;a.showMarkers(),a.setMarkers([{type:parseInt(j[p].markerShape,10),zoom:j[p].markerSize,strokeColor:f.getColor(t),fillColor:f.getColor(t),points:"all"}])}j[p].degrade&&a.degrade(j[p].degrade),j[p].tracking&&"yes"===j[p].tracking[0]&&a.allowTrackingLine({useAxis:this.module.getConfiguration("trackingAxis")})}}let u=Object.assign({},a.getStyle(),n,g,h.unselected);a.setStyle(u,"unselected");let v=Object.assign({},a.getStyle(),n,g,h.selected);a.setStyle(v,"selected"),m||a.setYAxis(this.getYAxis(0)),d&&e.listenHighlight({_highlight:d},(b,c)=>{for(var e,f=0,g=c.length;f<g;f++){e=c[f];for(var h,l=0,m=d.length;l<m;l++)if(h=d[l],Array.isArray(h))for(var n=0;n<h.length;n++)h[n]==e&&a.toggleMarker(l,!!b,!0);else h==e&&a.toggleMarker(l,!!b,!0)}},!1,this.module.getId())},registerSerieEvents(a,b){a.on("hide",()=>{this.serieHiddenState.set(b,!0)}),a.on("show",()=>{this.serieHiddenState.set(b,!1)})},blank:{xyArray(a){this.removeSerie(a)},xArray(a){this.removeSerie(a)},series_xy1d(a){this.removeSerie(a)},jcamp(a){this.removeSerie(a)},chart(a){this.removeAnnotations(a),this.removeSerie(a)},annotations(a){this.removeAnnotations(a)}},update:{chart(a,b){function e(a,b){b.label&&a.setLabel(b.label),b.units&&a.setUnit(b.units),b.unit&&a.setUnit(b.unit),b.flipped&&a.flip(b.flipped),a.setUnitWrapper(void 0===b.unitWrapperBefore?"(":b.unitWrapperBefore,void 0===b.unitWrapperAfter?")":b.unitWrapperAfter),!1===b.display&&a.hide(),!0===b.display&&a.show(),!0===b.logScale&&a.setLogScale(!0)}this.annotations[b]=[],this.series[b]=this.series[b]||[],this.removeSerie(b),a=d.check(a.get());var g=new Set;a.series&&(a.data=convertSeries(a.series));let h=a.data;if(a.annotations)for(const c of a.annotations){let a=this.graph.newShape(c.type+"",c,!1,c.properties);a&&(a.draw(),this.annotations[b].push(a))}a.axes&&(a.axes.x&&e(this.xAxis,a.axes.x),a.axes.y&&e(this.yAxis,a.axes.y));for(let d=0;d<h.length;d++){var k=h[d];0==d&&a.axis&&(a.axis[k.xAxis]&&this.xAxis.setLabel(a.axis[k.xAxis].label),a.axis[k.yAxis]&&this.yAxis.setLabel(a.axis[k.yAxis].label));var n=k.defaultStyle||{},o=k.defaultStyles||{},p=b;g.has(p)&&(p+=`-${d}`),g.add(p);var q=k.label||p,r=[],s=[],t=[];switch(k.type+""){case"zone":if(k.yMin&&k.yMax)for(var u=0,i=k.yMax.length;u<i;u++)r.push(k.x?k.x[u]:u),r.push(k.yMin[u],k.yMax[u]);break;case"contour":r=k.contourLines;break;default:if(k.y)for(var u=0,i=k.y.length;u<i;u++)s.push(k.x?k.x[u]:u),t.push(k.y[u]);}var v=(k.type||"line")+"";"color"==v&&(v="line.color");var w=!1;Array.isArray(k.color)&&(w=!0,v="line.color");let e=this.getSerieOptions(b,k._highlight,[s,t]);var x=this.graph.newSerie(p,e.options,v);if(this.registerSerieEvents(x,p),e.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(x),!x)throw new Error(`The serie of type ${v} was not created !`);if(x.setLabel(q),"line"==v||null==v||"scatter"==v||"line.color"==v){var y=c.newWaveform();y.setData(t,s),this.normalize(y,b),e.useSlots&&y.aggregate(),x.setWaveform(y);for(let a of["selected","unselected"]){let b=Object.assign({lineWidth:"selected"===a?2:1,lineColor:"black",lineStyle:0},"unselected"===a?n:void 0,(o||{})[a],"unselected"===a?k.style:void 0,(k.styles||{})[a]);x.setStyle(b,a)}}else x.setData(r);if(w){let a=k.color;if(!Array.isArray(a))throw new Error("Serie colors must be an array");x.setColors(a)}if(k.info&&(x.infos=k.info),x.autoAxis(),"scatter"==v){let a=[];Array.isArray(k.styles)?a=k.styles:"object"==typeof k.styles&&(a=k.styles);let b=new Set(Object.keys(o).concat(Object.keys(a)));for(const c of b)x.setMarkerStyle(Object.assign({},m,n,o[c]||{}),a[c]||[],c);if(this.module.getConfigurationCheckbox("selectScatter","yes")){var z=this.graph.getPlugin("selectScatter");z.setSerie(x)}}else if(k.styles&&k.styles instanceof Object)this.setSerieParameters(x,b,{styles:k.styles});else if(k.style)this.setSerieParameters(x,b,{style:k.style});else{var A=n.lineColor||(1<h.length?f.getNextColorRGB(d,h.length):null);let a={};A&&(a.lineColor=f.getColor(A)),this.setSerieParameters(x,b,{highlight:k._highlight,style:a})}if(k.annotations)for(const a of k.annotations){let c=this.graph.newShape(a.type+"",a,!1,a.properties);c&&(c.draw(),this.annotations[b].push(c))}this.series[b].push(x)}this.redraw(!1,b)},xyArray(a,b){if(this.series[b]=this.series[b]||[],this.removeSerie(b),!!a){let f=a.get(),g=this.getSerieOptions(b,null,f),h=this.graph.newSerie(b,g.options);this.registerSerieEvents(h,b),g.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(h);let i=[],j=[],k=c.newWaveform();for(var d=0,e=f.length;d<e;d+=2)i.push(f[d]),j.push(f[d+1]);k.setData(j,i),this.normalize(k,b),g.useSlots&&k.aggregate(),h.setWaveform(k),this.setSerieParameters(h,b),this.series[b].push(h),this.redraw(!1,b)}},xArray(a,b){var d=a.get();this.series[b]=this.series[b]||[],this.removeSerie(b);var e=this.module.getConfiguration("minX",0),f=this.module.getConfiguration("maxX",d.length-1),g=(f-e)/(d.length-1),h=c.newWaveform();h.setData(d),h.rescaleX(e,(f-e)/(d.length-1));let i=this.getSerieOptions(b,null,[null,[d]]);var j=this.graph.newSerie(b,i.options);this.registerSerieEvents(j,b),i.others.peakPicking&&this.graph.getPlugin("peakPicking").setSerie(j),this.normalize(h,b),i.useSlots&&h.aggregate(),j.setWaveform(h),this.setSerieParameters(j,b),this.series[b].push(j),this.redraw(!1,b)},annotations(a,b){this.annotations[b]=this.annotations[b]||[];const c=a.get();for(let d,f=0;f<c.length;f++){d=c[f],d.selectOnClick=!0;let a=this.graph.newShape(d.type+"",d,!1,d.properties);if(!a)return;this.annotations[b][f]=a,a.autoAxes(),e.listenHighlight(d,b=>{b?a.highlight(this.highlightOptions):a.unHighlight()},!1,this.module.getId()+b),this.module.model.dataListenChange(c.traceSync([f]),()=>{a.redraw()},"annotations"),a.draw(),a.redraw()}},jcamp(a,b){function d(a){if(f.series[b]=f.series[b]||[],f.series[b]=[],a.flatten&&a.flatten[0]&&(a=a.flatten[0]),a.contourLines)e=f.graph.newSerie(b,f.getSerieOptions(b).options,"contour"),f.registerSerieEvents(e,b),e.setData(a.contourLines),f.setSerieParameters(e,b),f.series[b].push(e);else{if(a.spectra&&(a=a.spectra),!Array.isArray(a))return;for(let g of a){let a=g.data,h=f.getSerieOptions(b,null,a);e=f.graph.newSerie(b,h.options),f.registerSerieEvents(e,b),h.others.peakPicking&&f.graph.getPlugin("peakPicking").setSerie(e);var d=c.newWaveform();d.setData(a.Y||a.y,a.X||a.x),f.normalize(d,b),h.useSlots&&d.aggregate(),e.setWaveform(d),f.setSerieParameters(e,b),f.series[b].push(e);break}}f.redraw(!1,b)}var e,f=this;if(this.graph){var g=a._options||{},h=a.get(),i=DataObject.getType(h);"string"===i?require(["jcampconverter"],a=>{let b=a.convert(h+"",g).flatten.filter(a=>a.spectra&&0<a.spectra.length||a.contourLines)[0];d(b)}):d(h)}},series_xy1d(a,b){require(["src/util/color"],c=>{for(var d=c.getDistinctColors(a.length),e=0,f=a.length;e<f;e++){var g=this.getSerieOptions(b,null,a[e].data),h=this.graph.newSerie(a[e].name,g.options);this.graph.registerSerieEvents(h,a[e].name),h.autoAxis(),this.series[b].push(h),a[e].data&&h.setData(a[e].data),h.setLineWidth(a[e].lineWidth||g.strokeWidth||1),h.setLineColor(a[e].lineColor||`rgb(${d[e].join()})`,!1,!0),h.setLineWidth(3,"selected"),h.extendStyles()}this.redraw()})}},setOnChange(a,b,c){this.onchanges[b]&&this.onchanges[b].obj.unbindChange(this.onchanges[b].id),this.onchanges[b]={obj:c,id:a}},removeAnnotations(a){if(e.killHighlight(this.module.getId()+a),this.annotations[a])for(var b=0;b<this.annotations[a].length;b++)this.annotations[a][b]&&this.annotations[a][b].kill();this.annotations[a]=[]},removeSerie(a){if(this.series[a])for(var b=0;b<this.series[a].length;b++)this.series[a][b].kill(!0);this.series[a]=[]},makeSerie(a,b,c){var d=this.graph.newSerie(a.name);this.registerSerieEvents(d,a.name),a.onChange(()=>{d.setData(a.data),this.graph.draw()}),this.onActionReceive.removeSerieByName.call(this,a.name||{}),d.setData(a.data),this.seriesActions.push([b,d,a.name]),this.setSerieParameters(d,c),a.lineColor&&d.setLineColor(a.lineColor,!1,!0),a.lineWidth&&d.setLineWidth(a.lineWidth),this.redraw()},onActionReceive:{fromToX(a){this.xAxis.zoom(a.from,a.to),this.graph.draw()},fromToY(a){this.yAxis.zoom(a.from,a.to),this.graph.draw()},addSerie(a){if(this.colorId++,a.name)this.makeSerie(a,a,a.name);else for(var b in a)this.makeSerie(a[b],a)},removeSerie(a){for(var b=0,c=this.seriesActions.length;b<c;b++)this.seriesActions[b][0]==a&&(this.seriesActions[b][1].kill(),this.seriesActions.splice(b,1))},removeSerieByName(a){for(var b=0;b<this.seriesActions.length;b++)this.seriesActions[b][2]==a&&(this.seriesActions[b][1].kill(),this.seriesActions.splice(b,1),b--)},selectSerie(a){const b=this.graph.getSerie(a.valueOf());b&&b.select("selected")},unselectSerie(a){const b=this.graph.getSerie(a.valueOf());b&&b.unselect()},toggleGrid(){let a=!this.xAxis.options.primaryGrid;this.xAxis.setPrimaryGrid(a),this.xAxis.setSecondaryGrid(a),this.yAxis.setPrimaryGrid(a),this.yAxis.setSecondaryGrid(a),this.graph.redraw()},fullOut(a){this.fullOut(n[a+""])},exportSVG(){this.doSVGExport()}},doSVGExport(){const a=this.getSVGString();a&&this.module.controller.exportSVG(a)},getSVGElement(){const a=this.dom.find("svg");return a[0]},getSVGString(){const a=new XMLSerializer,b=this.getSVGElement();return b?"<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"+a.serializeToString(b):void 0},normalize(a,b){var c,d,e=this.module.getConfiguration("plotinfos");if(e){var f="";for(c=0,d=e.length;c<d;c++)b==e[c].variable&&(f=e[c].normalize);f&&a.normalize(f)}}}),i});function convertSeries(a){let b=[];for(let c of a)b.push({x:c.data.x,y:c.data.y,color:c.data.color,styles:convertStyle(c.style),label:c.name,annotations:c.annotations});return b}function convertStyle(a){Array.isArray(a)||(a=[{name:"unselected",style:a}]);let b={};for(let c of a){let a={};c.style&&c.style.line&&(a.lineStyle=c.style.line.dash,a.lineWidth=c.style.line.width,a.lineColor=c.style.line.color),b[c.name||"unselected"]=a}return!b.selected&&b.unselected&&(b.selected=Object.assign({},b.unselected,{lineWidth:3})),b}