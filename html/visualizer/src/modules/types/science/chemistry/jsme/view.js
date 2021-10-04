'use strict';define(["require","modules/default/defaultview","src/util/api","src/util/ui","src/util/debug","openchemlib/openchemlib-core"],function(a,b,c,d,e,f){"use strict";function g(){}var h={};return window.addEventListener("message",function(a){try{var b=JSON.parse(a.data)}catch(a){return}if("jsme"===b.module){var c=b.id;if(!h[c])return void e.error(`No view with ID ${c}`);var d=h[c];switch(b.type){case"ready":d.resolveReady();break;case"onChange":d.module.controller.onChange(b.message);break;case"doHighlight":d._doHighlight(b.message.mol,b.message.atom);break;case"atomHover":d.module.controller.onAtomHover(b.message);break;case"atomClicked":d.module.controller.onAtomClick(b.message);break;case"bondHover":d.module.controller.onBondHover(b.message);break;case"bondClicked":d.module.controller.onBondClick(b.message);break;default:e.error("Message type not handled: ",b.type);}}}),$.extend(!0,g.prototype,b,{init:function(){var b=this,c=this.module.getId();h[c]=this,this.dom=d.getSafeElement("iframe").attr({allowfullscreen:!0,src:a.toUrl("./jsme.html")}),this.module.getDomContent().html(this.dom),this.module.getDomContent().css("overflow","hidden"),this.dom.bind("load",function(){b.postMessage("init",{prefs:b.getPrefs(),highlightColor:b.getHighlightColor(),bondwidth:b.module.getConfiguration("bondwidth"),labelsize:b.module.getConfiguration("labelsize"),defaultaction:b.module.getConfiguration("defaultaction"),id:c})})},setJSMEOptions:function(a){a=Object.assign({},a,{prefs:a.prefs?a.prefs.map(a=>a+"").join():void 0}),this.postMessage("setOptions",a)},getPrefs:function(){return this.module.getConfiguration("prefs").join()},getHighlightColor:function(){return this.module.getConfiguration("highlightColor","3")},onResize:function(){this.dom.attr("width",this.width),this.dom.attr("height",this.height),this.postMessage("setSize",{width:this.width,height:this.height}),this.refresh()},onProgress:function(){this.dom.html("Progress. Please wait...")},blank:{mol:function(){this._currentValue=null,this._currentType=null,this.postMessage("clear","*")},jme:function(){this._currentValue=null,this._currentType=null,this.postMessage("clear","*")},smiles:function(){this._currentValue=null,this._currentType=null,this.postMessage("clear","*")}},update:{mol:function(a){if(this._currentValue=a,this._currentType="mol",!!a.get()){let b=a.get()+"";if(b.includes("V3000")){let c=this,d=f.Molecule.fromMolfile(b);c.postMessage("setMolFile",d.toMolfile()),c._initHighlight(a)}else this.postMessage("setMolFile",b),this._initHighlight(a)}},jme:function(a){this._currentValue=a,this._currentType="jme",a.get()&&(this.postMessage("setJmeFile",a.get()+""),this._initHighlight(a))},smiles:function(b){var c=this;this._currentValue=b,this._currentType="smiles",a(["openchemlib/openchemlib-core"],function(a){var d=b.get()+"",e=a.Molecule.fromSmiles(d);c.postMessage("setMolFile",e.toMolfile()),c._initHighlight(b)})}},onActionReceive:{setOptions:function(a){this.setJSMEOptions(a)}},_initHighlight:function(a){var b=this;c.killHighlight(this.module.getId()),c.listenHighlight(a,function(c,d){for(var e=[],f=0,g=d.length;f<g;f++)a._atoms[d[f]]instanceof Array||(a._atoms[d[f]]=[a._atoms[d[f]]]),e=e.concat(a._atoms[d[f]]);b.postMessage("setHighlight",{atoms:e,onOff:c})},!1,this.module.getId())},_doHighlight:function(a,b){if(this._currentValue){for(var d in this._currentValue._atoms)-1<this._currentValue._atoms[d].indexOf(this.highlightedAtom)&&c.highlightId(d,!1);for(var d in this._currentValue._atoms)0!=b&&-1<this._currentValue._atoms[d].indexOf(b-1)&&c.highlightId(d,1);this.highlightedAtom=b-1}},postMessage:function(a,b){var c=this.dom.get(0).contentWindow;c&&c.postMessage(JSON.stringify({type:a,message:b}),"*")},remove:function(a){delete h[a]}}),g});
