'use strict';

define(['../../fieldlistelement', './element'], function (ElementDefault, ElementImpl) {

    var Element = function () {
    };

    Element.prototype = new ElementDefault();
    Element.prototype = $.extend(Element.prototype, ElementImpl.prototype, {

        _makeDom: function () {
            this.__makeDom();
            this.checkValue();
            return this.dom;
        }

    });

    return Element;
});