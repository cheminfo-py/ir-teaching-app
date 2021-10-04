'use strict';define(["modules/default/defaultcontroller"],function(a){"use strict";function b(){}return $.extend(!0,b.prototype,a),b.prototype.moduleInformation={name:"Score plot",description:"Display a score plot",author:"Norman Pellet",date:"24.12.2013",license:"MIT",cssClass:"loading_plot"},b.prototype.references={loading:{label:"Loading variable",type:["loading","object"]},preferences:{label:"Preferences",type:"object"},element:{label:"Selected element",type:"object"},zoom:{label:"Zoom",type:"string"},center:{label:"Coordinates of the center",type:"array"},viewport:{label:"Viewport",type:"object"}},b.prototype.events={onHover:{label:"Hovers an element",refVariable:["element"]},onMove:{label:"Move the map",refVariable:["center","zoom","viewport"]},onZoomChange:{label:"Change the zoom",refVariable:["center","zoom","viewport"]},onViewPortChange:{label:"Viewport has changed",refVariable:["center","zoom","viewport"]}},b.prototype.variablesIn=["loading"],b.prototype.actionsIn={addElement:"Add an element"},b.prototype.configurationStructure=function(){var a=this.module.getDataFromRel("loading"),b=[];if(a&&a.value)for(var c=0;c<a.value.series.length;c++)b.push({title:a.value.series[c].label,key:a.value.series[c].category});return{groups:{general:{options:{type:"list",multiple:!1},fields:{navigation:{title:"Navigation",type:"checkbox",options:{navigation:"Navigation only"}}}}},sections:{module_layers:{options:{multiple:!0,title:"Layers"},groups:{group:{options:{type:"list"},fields:{el:{type:"combo",title:"Layer",options:b},type:{type:"combo",title:"Display as",options:[{key:"ellipse",title:"Ellipse / Circle"},{key:"pie",title:"Pie chart"},{key:"img",title:"Image"}]},color:{type:"color",title:"Color (default)"},labels:{type:"checkbox",title:"Labels",options:{display_labels:"Display",forcefield:"Activate force field",blackstroke:"Add a black stroke around label",scalelabel:"Scale label with zoom"}},labelsize:{type:"text",title:"Label size"},labelzoomthreshold:{type:"text",title:"Zoom above which labels are displayed"},highlightmag:{type:"text",title:"Highlight magnification"},highlighteffect:{type:"checkbox",title:"Highlight effect",options:{stroke:"Thick yellow stroke"}}}}}}}}},b.prototype.configAliases={navigation:["groups","general",0,"navigation"],layers:["sections","module_layers"]},b.prototype.hover=function(a){this.createDataFromEvent("onHover","element",a)},b.prototype.onZoomChange=function(a){this.createDataFromEvent("onZoomChange","zoom",a)},b.prototype.onMove=function(a,b){this.createDataFromEvent("onMove","center",[a,b])},b.prototype.onChangeViewport=function(a){this.createDataFromEvent("onChangeViewport","viewport",a)},b});
