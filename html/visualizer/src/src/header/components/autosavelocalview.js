'use strict';define(["jquery","src/header/components/default","src/util/versioning","src/util/util"],function(a,b,c,d){"use strict";function e(){}return d.inherits(e,b,{initImpl:function(){this.viewHandler=c.getViewHandler()},_onClick:function(){this._open?this.open():this.close()},open:function(){var a=this;this.interval=window.setInterval(function(){var b=c.getView();"head"!==a.viewHandler.currentPath[3]&&a.viewHandler.serverCopy(b),a.viewHandler._localSave(b,"head",b._name),a.$_dom.css({color:"#BCF2BB"})},1e3),this.$_dom.addClass("toggledOn")},close:function(){window.clearTimeout(this.interval),this.$_dom.css({color:""}),this.$_dom.removeClass("toggledOn")}}),e});
