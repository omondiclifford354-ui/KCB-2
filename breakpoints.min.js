/* breakpoints.js v1.1 | Customized for KCB Website | MIT licensed */
var breakpoints = (function () {
  "use strict";

  function e(e) {
    t.init(e);
  }

  var t = {
    list: null,
    media: {},
    events: [],
    init: function (e) {
      t.list = e;
      window.addEventListener("resize", t.poll);
      window.addEventListener("orientationchange", t.poll);
      window.addEventListener("load", t.poll);
      window.addEventListener("fullscreenchange", t.poll);
    },
    active: function (e) {
      if (!(e in t.media)) {
        var query = t.list[e];
        t.media[e] = query ? "screen and " + query : false;
      }
      return t.media