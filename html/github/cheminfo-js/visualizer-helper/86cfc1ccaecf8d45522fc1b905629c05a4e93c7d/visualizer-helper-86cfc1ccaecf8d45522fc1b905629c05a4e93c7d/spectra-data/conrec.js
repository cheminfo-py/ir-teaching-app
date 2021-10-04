"use strict";

define(["exports"], function (exports) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  Object.defineProperty(exports, '__esModule', {
    value: true
  }); // https://github.com/jasondavies/conrec.js

  /**
   * Copyright (c) 2010, Jason Davies.
   *
   * All rights reserved.  This code is based on Bradley White's Java version,
   * which is in turn based on Nicholas Yue's C++ version, which in turn is based
   * on Paul D. Bourke's original Fortran version.  See below for the respective
   * copyright notices.
   *
   * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
   * paper by Paul D. Bourke.
   *
   * The vector conversion code is based on http://apptree.net/conrec.htm by
   * Graham Cox.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *     * Redistributions of source code must retain the above copyright
   *       notice, this list of conditions and the following disclaimer.
   *     * Redistributions in binary form must reproduce the above copyright
   *       notice, this list of conditions and the following disclaimer in the
   *       documentation and/or other materials provided with the distribution.
   *     * Neither the name of the <organization> nor the
   *       names of its contributors may be used to endorse or promote products
   *       derived from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
   * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
   * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  /*
   * Copyright (c) 1996-1997 Nicholas Yue
   *
   * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
   * Bourke's CONREC.F routine.
   *
   * The authors hereby grant permission to use, copy, and distribute this
   * software and its documentation for any purpose, provided that existing
   * copyright notices are retained in all copies and that this notice is
   * included verbatim in any distributions. Additionally, the authors grant
   * permission to modify this software and its documentation for any purpose,
   * provided that such modifications are not distributed without the explicit
   * consent of the authors and that existing copyright notices are retained in
   * all copies. Some of the algorithms implemented by this software are
   * patented, observe all applicable patent law.
   *
   * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
   * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
   * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
   * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
   * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
   * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
   * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
   * MODIFICATIONS.
   */

  var EPSILON = Number.EPSILON;
  var MINUSEPSILON = 0 - EPSILON;
  /**
   * Implements CONREC.
   * @private
   * @param {function} drawContour function for drawing contour.  Defaults to a
   *                               custom "contour builder", which populates the
   *                               contours property.
   */

  var ConrecLib = function () {
    function ConrecLib(drawContour, timeout) {
      _classCallCheck(this, ConrecLib);

      this.drawContour = drawContour;
      this.h = new Array(5);
      this.sh = new Array(5);
      this.xh = new Array(5);
      this.yh = new Array(5);
      this.timeout = timeout;
    }
    /**
     * contour is a contouring subroutine for rectangularily spaced data
     *
     * It emits calls to a line drawing subroutine supplied by the user which
     * draws a contour map corresponding to real*4data on a randomly spaced
     * rectangular grid. The coordinates emitted are in the same units given in
     * the x() and y() arrays.
     *
     * Any number of contour levels may be specified but they must be in order of
     * increasing value.
     *
     * @private
     * @param {number[][]} d - matrix of data to contour
     * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
     *
     *             The following two, one dimensional arrays (x and y) contain
     *             the horizontal and vertical coordinates of each sample points.
     * @param {number[]} x  - data matrix column coordinates
     * @param {number[]} y  - data matrix row coordinates
     * @param {number} nc   - number of contour levels
     * @param {number[]} z  - contour levels in increasing order.
     */


    _createClass(ConrecLib, [{
      key: "contour",
      value: function contour(d, ilb, iub, jlb, jub, x, y, nc, z) {
        var h = this.h;
        var sh = this.sh;
        var xh = this.xh;
        var yh = this.yh;
        var drawContour = this.drawContour;
        var timeout = this.timeout;
        var start = Date.now();
        /** private */

        function xsect(p1, p2) {
          return (h[p2] * xh[p1] - h[p1] * xh[p2]) / (h[p2] - h[p1]);
        }

        function ysect(p1, p2) {
          return (h[p2] * yh[p1] - h[p1] * yh[p2]) / (h[p2] - h[p1]);
        }

        var m1;
        var m2;
        var m3;
        var caseValue;
        var dmin;
        var dmax;
        var x1 = 0.0;
        var x2 = 0.0;
        var y1 = 0.0;
        var y2 = 0.0; // The indexing of im and jm should be noted as it has to start from zero
        // unlike the fortran counter part

        var im = [0, 1, 1, 0];
        var jm = [0, 0, 1, 1]; // Note that castab is arranged differently from the FORTRAN code because
        // Fortran and C/C++ arrays are transposed of each other, in this case
        // it is more tricky as castab is in 3 dimensions

        var castab = [[[0, 0, 8], [0, 2, 5], [7, 6, 9]], [[0, 3, 4], [1, 3, 1], [4, 3, 0]], [[9, 6, 7], [5, 2, 0], [8, 0, 0]]];

        for (var j = jub - 1; j >= jlb; j--) {
          if (timeout && Date.now() - start > timeout) {
            throw new Error("timeout: contour generation could not finish in less than ".concat(timeout, "ms"));
          }

          for (var i = ilb; i <= iub - 1; i++) {
            var temp1, temp2;
            temp1 = Math.min(d[i][j], d[i][j + 1]);
            temp2 = Math.min(d[i + 1][j], d[i + 1][j + 1]);
            dmin = Math.min(temp1, temp2);
            temp1 = Math.max(d[i][j], d[i][j + 1]);
            temp2 = Math.max(d[i + 1][j], d[i + 1][j + 1]);
            dmax = Math.max(temp1, temp2);

            if (dmax >= z[0] && dmin <= z[nc - 1]) {
              for (var k = 0; k < nc; k++) {
                if (z[k] >= dmin && z[k] <= dmax) {
                  for (var m = 4; m >= 0; m--) {
                    if (m > 0) {
                      // The indexing of im and jm should be noted as it has to
                      // start from zero
                      h[m] = d[i + im[m - 1]][j + jm[m - 1]] - z[k];
                      xh[m] = x[i + im[m - 1]];
                      yh[m] = y[j + jm[m - 1]];
                    } else {
                      h[0] = 0.25 * (h[1] + h[2] + h[3] + h[4]);
                      xh[0] = 0.5 * (x[i] + x[i + 1]);
                      yh[0] = 0.5 * (y[j] + y[j + 1]);
                    }

                    if (h[m] > EPSILON) {
                      sh[m] = 1;
                    } else if (h[m] < MINUSEPSILON) {
                      sh[m] = -1;
                    } else {
                      sh[m] = 0;
                    }
                  } //
                  // Note: at this stage the relative heights of the corners and the
                  // centre are in the h array, and the corresponding coordinates are
                  // in the xh and yh arrays. The centre of the box is indexed by 0
                  // and the 4 corners by 1 to 4 as shown below.
                  // Each triangle is then indexed by the parameter m, and the 3
                  // vertices of each triangle are indexed by parameters m1,m2,and
                  // m3.
                  // It is assumed that the centre of the box is always vertex 2
                  // though this isimportant only when all 3 vertices lie exactly on
                  // the same contour level, in which case only the side of the box
                  // is drawn.
                  //
                  //
                  //      vertex 4 +-------------------+ vertex 3
                  //               | \               / |
                  //               |   \    m-3    /   |
                  //               |     \       /     |
                  //               |       \   /       |
                  //               |  m=2    X   m=2   |       the centre is vertex 0
                  //               |       /   \       |
                  //               |     /       \     |
                  //               |   /    m=1    \   |
                  //               | /               \ |
                  //      vertex 1 +-------------------+ vertex 2
                  //
                  //
                  //
                  //               Scan each triangle in the box
                  //


                  for (m = 1; m <= 4; m++) {
                    m1 = m;
                    m2 = 0;

                    if (m !== 4) {
                      m3 = m + 1;
                    } else {
                      m3 = 1;
                    }

                    caseValue = castab[sh[m1] + 1][sh[m2] + 1][sh[m3] + 1];

                    if (caseValue !== 0) {
                      switch (caseValue) {
                        case 1:
                          // Line between vertices 1 and 2
                          x1 = xh[m1];
                          y1 = yh[m1];
                          x2 = xh[m2];
                          y2 = yh[m2];
                          break;

                        case 2:
                          // Line between vertices 2 and 3
                          x1 = xh[m2];
                          y1 = yh[m2];
                          x2 = xh[m3];
                          y2 = yh[m3];
                          break;

                        case 3:
                          // Line between vertices 3 and 1
                          x1 = xh[m3];
                          y1 = yh[m3];
                          x2 = xh[m1];
                          y2 = yh[m1];
                          break;

                        case 4:
                          // Line between vertex 1 and side 2-3
                          x1 = xh[m1];
                          y1 = yh[m1];
                          x2 = xsect(m2, m3);
                          y2 = ysect(m2, m3);
                          break;

                        case 5:
                          // Line between vertex 2 and side 3-1
                          x1 = xh[m2];
                          y1 = yh[m2];
                          x2 = xsect(m3, m1);
                          y2 = ysect(m3, m1);
                          break;

                        case 6:
                          //  Line between vertex 3 and side 1-2
                          x1 = xh[m3];
                          y1 = yh[m3];
                          x2 = xsect(m1, m2);
                          y2 = ysect(m1, m2);
                          break;

                        case 7:
                          // Line between sides 1-2 and 2-3
                          x1 = xsect(m1, m2);
                          y1 = ysect(m1, m2);
                          x2 = xsect(m2, m3);
                          y2 = ysect(m2, m3);
                          break;

                        case 8:
                          // Line between sides 2-3 and 3-1
                          x1 = xsect(m2, m3);
                          y1 = ysect(m2, m3);
                          x2 = xsect(m3, m1);
                          y2 = ysect(m3, m1);
                          break;

                        case 9:
                          // Line between sides 3-1 and 1-2
                          x1 = xsect(m3, m1);
                          y1 = ysect(m3, m1);
                          x2 = xsect(m1, m2);
                          y2 = ysect(m1, m2);
                          break;

                        default:
                          break;
                      } // Put your processing code here and comment out the printf
                      // printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);


                      drawContour(x1, y1, x2, y2, z[k], k);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }]);

    return ConrecLib;
  }();

  var BasicContourDrawer = function () {
    function BasicContourDrawer(levels, swapAxes) {
      _classCallCheck(this, BasicContourDrawer);

      this.contour = new Array(levels.length);

      for (var i = 0; i < levels.length; i++) {
        this.contour[i] = {
          zValue: levels[i],
          lines: []
        };
      }

      this.swapAxes = swapAxes;
    }

    _createClass(BasicContourDrawer, [{
      key: "drawContour",
      value: function drawContour(x1, y1, x2, y2, z, k) {
        if (!this.swapAxes) {
          this.contour[k].lines.push(y1, x1, y2, x2);
        } else {
          this.contour[k].lines.push(x1, y1, x2, y2);
        }
      }
    }, {
      key: "getContour",
      value: function getContour() {
        return this.contour;
      }
    }]);

    return BasicContourDrawer;
  }();

  var ContourBuilder = function () {
    function ContourBuilder(level) {
      _classCallCheck(this, ContourBuilder);

      this.level = level;
      this.s = null;
      this.count = 0;
    }

    _createClass(ContourBuilder, [{
      key: "removeSeq",
      value: function removeSeq(list) {
        // if list is the first item, static ptr s is updated
        if (list.prev) {
          list.prev.next = list.next;
        } else {
          this.s = list.next;
        }

        if (list.next) {
          list.next.prev = list.prev;
        }

        --this.count;
      }
    }, {
      key: "addSegment",
      value: function addSegment(a, b) {
        var ss = this.s;
        var ma = null;
        var mb = null;
        var prependA = false;
        var prependB = false;

        while (ss) {
          if (ma === null) {
            // no match for a yet
            if (pointsEqual(a, ss.head.p)) {
              ma = ss;
              prependA = true;
            } else if (pointsEqual(a, ss.tail.p)) {
              ma = ss;
            }
          }

          if (mb === null) {
            // no match for b yet
            if (pointsEqual(b, ss.head.p)) {
              mb = ss;
              prependB = true;
            } else if (pointsEqual(b, ss.tail.p)) {
              mb = ss;
            }
          } // if we matched both no need to continue searching


          if (mb !== null && ma !== null) {
            break;
          } else {
            ss = ss.next;
          }
        } // c is the case selector based on which of ma and/or mb are set


        var c = (ma !== null ? 1 : 0) | (mb !== null ? 2 : 0);
        var pp;

        switch (c) {
          case 0:
            {
              // both unmatched, add as new sequence
              var aa = {
                p: a,
                prev: null
              };
              var bb = {
                p: b,
                next: null
              };
              aa.next = bb;
              bb.prev = aa; // create sequence element and push onto head of main list. The order
              // of items in this list is unimportant

              ma = {
                head: aa,
                tail: bb,
                next: this.s,
                prev: null,
                closed: false
              };

              if (this.s) {
                this.s.prev = ma;
              }

              this.s = ma;
              ++this.count; // not essential - tracks number of unmerged sequences

              break;
            }

          case 1:
            {
              // a matched, b did not - thus b extends sequence ma
              pp = {
                p: b
              };

              if (prependA) {
                pp.next = ma.head;
                pp.prev = null;
                ma.head.prev = pp;
                ma.head = pp;
              } else {
                pp.next = null;
                pp.prev = ma.tail;
                ma.tail.next = pp;
                ma.tail = pp;
              }

              break;
            }

          case 2:
            {
              // b matched, a did not - thus a extends sequence mb
              pp = {
                p: a
              };

              if (prependB) {
                pp.next = mb.head;
                pp.prev = null;
                mb.head.prev = pp;
                mb.head = pp;
              } else {
                pp.next = null;
                pp.prev = mb.tail;
                mb.tail.next = pp;
                mb.tail = pp;
              }

              break;
            }

          case 3:
            {
              // both matched, can merge sequences
              // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)
              if (ma === mb) {
                pp = {
                  p: ma.tail.p,
                  next: ma.head,
                  prev: null
                };
                ma.head.prev = pp;
                ma.head = pp;
                ma.closed = true;
                break;
              } // there are 4 ways the sequence pair can be joined. The current setting of prependA and
              // prependB will tell us which type of join is needed. For head/head and tail/tail joins
              // one sequence needs to be reversed


              switch ((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
                case 0:
                  // tail-tail
                  // reverse ma and append to mb
                  reverseList(ma);
                // fall through to head/tail case

                case 1:
                  // head-tail
                  // ma is appended to mb and ma discarded
                  mb.tail.next = ma.head;
                  ma.head.prev = mb.tail;
                  mb.tail = ma.tail; // discard ma sequence record

                  this.removeSeq(ma);
                  break;

                case 3:
                  // head-head
                  // reverse ma and append mb to it
                  reverseList(ma);
                // fall through to tail/head case

                case 2:
                  // tail-head
                  // mb is appended to ma and mb is discarded
                  ma.tail.next = mb.head;
                  mb.head.prev = ma.tail;
                  ma.tail = mb.tail; // discard mb sequence record

                  this.removeSeq(mb);
                  break;

                default:
                  throw new Error('UNREACHABLE');
              }

              break;
            }

          default:
            throw new Error('UNREACHABLE');
        }
      }
    }]);

    return ContourBuilder;
  }();

  function pointsEqual(a, b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return x * x + y * y < Number.EPSILON;
  }

  function reverseList(list) {
    var pp = list.head;
    var temp;

    while (pp) {
      // swap prev/next pointers
      temp = pp.next;
      pp.next = pp.prev;
      pp.prev = temp; // continue through the list

      pp = temp;
    } // swap head/tail pointers


    temp = list.head;
    list.head = list.tail;
    list.tail = temp;
  } // Based on the code from https://github.com/jasondavies/conrec.js


  var ShapeContourDrawer = function () {
    function ShapeContourDrawer(levels, swapAxes) {
      _classCallCheck(this, ShapeContourDrawer);

      this.contours = new Array(levels.length);

      for (var i = 0; i < levels.length; i++) {
        this.contours[i] = new ContourBuilder(levels[i]);
      }

      this.swapAxes = swapAxes;
    }

    _createClass(ShapeContourDrawer, [{
      key: "drawContour",
      value: function drawContour(x1, y1, x2, y2, z, k) {
        if (!this.swapAxes) {
          this.contours[k].addSegment({
            x: y1,
            y: x1
          }, {
            x: y2,
            y: x2
          });
        } else {
          this.contours[k].addSegment({
            x: x1,
            y: y1
          }, {
            x: x2,
            y: y2
          });
        }
      }
    }, {
      key: "getContour",
      value: function getContour() {
        var l = [];
        var a = this.contours;

        for (var k = 0; k < a.length; k++) {
          var s = a[k].s;
          var level = a[k].level;

          while (s) {
            var h = s.head;
            var l2 = [];
            l2.level = level;
            l2.k = k;

            while (h && h.p) {
              l2.push(h.p);
              h = h.next;
            }

            l.push(l2);
            s = s.next;
          }
        }

        return l;
      }
    }]);

    return ShapeContourDrawer;
  }();

  var defaultOptions = {
    nbLevels: 10,
    timeout: 0
  };
  /**
   *
   * @class Conrec
   * @param {number[][]} matrix
   * @param {number[]} [options.xs]
   * @param {number[]} [options.ys]
   * @param {boolean} [options.swapAxes]
   */

  var Conrec = function () {
    function Conrec(matrix) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Conrec);

      var _options$swapAxes = options.swapAxes,
          swapAxes = _options$swapAxes === void 0 ? false : _options$swapAxes;
      this.matrix = matrix;
      this.rows = matrix.length;
      this.columns = matrix[0].length;
      var optionsHasXs = options.xs !== undefined;
      var optionsHasYs = options.ys !== undefined;

      if (swapAxes) {
        // We swap axes, which means xs are in the rows direction. This is the normal
        // way for the conrec library.
        this.xs = optionsHasXs ? options.xs : range(0, this.rows, 1);
        this.ys = optionsHasYs ? options.ys : range(0, this.columns, 1);
      } else {
        // We do not swap axes, so if the user provided xs or ys, we must swap the
        // internal values so the algorithm can still work.
        this.xs = optionsHasYs ? options.ys : range(0, this.rows, 1);
        this.ys = optionsHasXs ? options.xs : range(0, this.columns, 1);
      }

      this.swapAxes = swapAxes;
      this.hasMinMax = false;
    }
    /**
     *
     * @param {number[]} [options.levels]
     * @param {number} [options.nbLevels=10]
     * @param {string} [options.contourDrawer='basic'] - 'basic' or 'shape'
     * @param {number} [options.timeout=0]
     * @return {any}
     */


    _createClass(Conrec, [{
      key: "drawContour",
      value: function drawContour(options) {
        options = Object.assign({}, defaultOptions, options);
        var levels;

        if (options.levels) {
          levels = options.levels.slice();
        } else {
          this._computeMinMax();

          var interval = (this.max - this.min) / (options.nbLevels - 1);
          levels = range(this.min, this.max + interval, interval);
        }

        levels.sort(function (a, b) {
          return a - b;
        });
        var contourDrawer = options.contourDrawer || 'basic';

        if (typeof contourDrawer === 'string') {
          if (contourDrawer === 'basic') {
            contourDrawer = new BasicContourDrawer(levels, this.swapAxes);
          } else if (contourDrawer === 'shape') {
            contourDrawer = new ShapeContourDrawer(levels, this.swapAxes);
          } else {
            throw new Error("unknown contour drawer: ".concat(contourDrawer));
          }
        } else {
          throw new TypeError('contourDrawer must be a string');
        }

        var conrec = new ConrecLib(contourDrawer.drawContour.bind(contourDrawer), options.timeout);
        conrec.contour(this.matrix, 0, this.rows - 1, 0, this.columns - 1, this.xs, this.ys, levels.length, levels);
        return contourDrawer.getContour();
      }
    }, {
      key: "_computeMinMax",
      value: function _computeMinMax() {
        if (!this.hasMinMax) {
          var r = minMax(this.matrix);
          this.min = r.min;
          this.max = r.max;
          this.hasMinMax = true;
        }
      }
    }]);

    return Conrec;
  }();

  function range(from, to, step) {
    var result = [];

    for (var i = from; i < to; i += step) {
      result.push(i);
    }

    return result;
  }

  function minMax(matrix) {
    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;

    for (var i = 0; i < matrix.length; i++) {
      var row = matrix[i];

      for (var j = 0; j < row.length; j++) {
        if (row[j] < min) min = row[j];
        if (row[j] > max) max = row[j];
      }
    }

    return {
      min: min,
      max: max
    };
  }

  exports.Conrec = Conrec;
});