'use strict';define(["modules/default/defaultmodel","src/util/datatraversing"],function(a,b){"use strict";function c(){}return $.extend(!0,c.prototype,a,{getjPath:function(a){var c;switch(a){case"item":c=this.module.data;break;default:return[];}var d=[];return b.getJPathsFromElement(c,d),d}}),c});
