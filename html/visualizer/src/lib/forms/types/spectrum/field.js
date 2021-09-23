'use strict';

define([require, '../../field', 'src/util/util', 'components/farbtastic/src/farbtastic', 'components/spectrum/spectrum'], function (require, FieldDefaultConstructor, Util, spectrum) {

    var felement = null;

    function FieldConstructor(name) {
        var self = this;

        Util.loadCss('./components/spectrum/spectrum.css');
        this.name = name;
        this.domExpander = $('<div></div>');
        this.domExpander.append('<div><input type="text" /></div>');
        $(this.domExpander).children('div').css('float', 'left').addClass('form-spectrum');
        this.$spectrum = $(self.domExpander).find('input').spectrum({
            color: felement && felement.value ? 'rgba(' + felement.value.join(',') + ')' : undefined,
            preferredFormat: 'rgba',
            cancelText: '',
            showInitial: true,
            showInput: true,
            clickoutFiresChange: false,
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: true,
            palette: [[
                'rgba(152,  0,  0, 1)',
                'rgba(255,  0,  0, 1)',
                'rgba(255,  153,  0, 1)',
                'rgba(255,  255,  0, 1)',
                'rgba(0,  255,  0, 1)',
                'rgba(0,  255,  255, 1)',
                'rgba(74,  134,  232, 1)',
                'rgba(0,  0,  255, 1)',
                'rgba(153,  0,  255, 1)',
                'rgba(255,  0,  255, 1)'
            ],
                [
                    'rgba(230,  184,  175, 1)',
                    'rgba(244,  204,  204, 1)',
                    'rgba(252,  229,  205, 1)',
                    'rgba(255,  242,  204, 1)',
                    'rgba(217,  234,  211, 1)',
                    'rgba(208,  224,  227, 1)',
                    'rgba(201,  218,  248, 1)',
                    'rgba(207,  226,  243, 1)',
                    'rgba(217,  210,  233, 1)',
                    'rgba(234,  209,  220, 1)'
                ],
                [
                    'rgba(221,  126,  107, 1)',
                    'rgba(234,  153,  153, 1)',
                    'rgba(249,  203,  156, 1)',
                    'rgba(255,  229,  153, 1)',
                    'rgba(182,  215,  168, 1)',
                    'rgba(162,  196,  201, 1)',
                    'rgba(164,  194,  244, 1)',
                    'rgba(159,  197,  232, 1)',
                    'rgba(180,  167,  214, 1)',
                    'rgba(213,  166,  189, 1)'
                ],
                [
                    'rgba(204,  65,  37, 1)',
                    'rgba(224,  102,  102, 1)',
                    'rgba(246,  178,  107, 1)',
                    'rgba(255,  217,  102, 1)',
                    'rgba(147,  196,  125, 1)',
                    'rgba(118,  165,  175, 1)',
                    'rgba(109,  158,  235, 1)',
                    'rgba(111,  168,  220, 1)',
                    'rgba(142,  124,  195, 1)',
                    'rgba(194,  123,  160, 1)'
                ],
                [
                    'rgba(166,  28,  0, 1)',
                    'rgba(204,  0,  0, 1)',
                    'rgba(230,  145,  56, 1)',
                    'rgba(241,  194,  50, 1)',
                    'rgba(106,  168,  79, 1)',
                    'rgba(69,  129,  142, 1)',
                    'rgba(60,  120,  216, 1)',
                    'rgba(61,  133,  198, 1)',
                    'rgba(103,  78,  167, 1)',
                    'rgba(166,  77,  121, 1)'
                ],
                [
                    'rgba(133,  32,  12, 1)',
                    'rgba(153,  0,  0, 1)',
                    'rgba(180,  95,  6, 1)',
                    'rgba(191,  144,  0, 1)',
                    'rgba(56,  118,  29, 1)',
                    'rgba(19,  79,  92, 1)',
                    'rgba(17,  85,  204, 1)',
                    'rgba(11,  83,  148, 1)',
                    'rgba(53,  28,  117, 1)',
                    'rgba(116,  27,  71, 1)'
                ],
                [
                    'rgba(91,  15,  0, 1)',
                    'rgba(102,  0,  0, 1)',
                    'rgba(120,  63,  4, 1)',
                    'rgba(127,  96,  0, 1)',
                    'rgba(39,  78,  19, 1)',
                    'rgba(12,  52,  61, 1)',
                    'rgba(28,  69,  135, 1)',
                    'rgba(7,  55,  99, 1)',
                    'rgba(32,  18,  77, 1)',
                    'rgba(76,  17,  48, 1)'
                ]],
            localStorageKey: 'visualizer-spectrum',
            change: function (color) {
                var rgb = color.toRgb();
                self.getElementExpanded().value = felement.value = [rgb['r'], rgb['g'], rgb['b'], rgb['a']];
                // self.form.hideExpander();
                felement.toggleSelect();
                self.$spectrum.spectrum('hide');
            }
        });

        $('<div />').addClass('clear').appendTo(this.domExpander);
    }

    FieldConstructor.prototype = new FieldDefaultConstructor();

    FieldConstructor.prototype.getOptions = function (fieldElement) {

        return fieldElement.getOptions() || this.options.options
    };

    FieldConstructor.prototype.showExpander = function (fieldElement) {
        felement = fieldElement;
        this._showExpander(fieldElement);
        var value = fieldElement.value || [0, 0, 0, 1];
        //this.domExpander.find('.form-spectrum').spectrum('set', 'rgba(' + value.join(',') + ')');
        this.$spectrum.next().click();
    };

    return FieldConstructor;

});