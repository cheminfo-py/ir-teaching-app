'use strict';define(["modules/default/defaultmodel","src/util/datatraversing"],function(a,b){"use strict";function c(){}return $.extend(!0,c.prototype,a,{getjPath:function(){var a=[],c=this.module.view.dataElements;return c&&(c=c.get(0)),b.getJPathsFromElement(c,a),a}}),c});
