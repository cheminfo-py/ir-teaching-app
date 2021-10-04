'use strict';define(["modules/default/defaultcontroller","src/util/util"],function(a,b){"use strict";function c(){}return $.extend(!0,c.prototype,a),c.prototype.moduleInformation={name:"Sticky note",description:"Displays a sticky note",author:"Norman Pellet",date:"24.12.2013",license:"MIT",cssClass:"postit",hidden:!0},c.prototype.references={value:{label:"Sticky note value",type:"string"}},c.prototype.events={onChange:{label:"Value is changed",refVariable:["value"]}},c.prototype.configurationStructure=function(){var a=b.getWebsafeFonts();return a.push({title:"Post-it",key:"Post_IT"}),{groups:{group:{options:{type:"list"},fields:{fontfamily:{type:"combo",title:"Font-family",default:"Post_IT",options:a},editable:{type:"checkbox",title:"Is Editable",options:{isEditable:"Yes"},default:["isEditable"]}}}}}},c.prototype.configAliases={fontfamily:["groups","group",0,"fontfamily",0],editable:["groups","group",0,"editable",0]},c});
