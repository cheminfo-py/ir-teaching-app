"use strict";

define(['https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.js'], function () {
  var initialized = false;

  function init(options) {
    if (initialized) return;
    initialized = true;
    options = options || {};
    var state = {
      a: 1
    };
    var channel; // Establish a channel only if this application is embedded in an iframe.
    // This will let the parent window communicate with this application using
    // RPC and bypass SOP restrictions.

    if (window.parent !== window) {
      channel = self.Channel.build({
        window: window.parent,
        origin: '*',
        scope: 'JSInput'
      });
      channel.bind('getGrade', options.getGrade || getGrade);
      channel.bind('getState', options.getState || getState);
      channel.bind('setState', options.setState || setState);
    }

    function getGrade() {
      // The following return value may or may not be used to grade
      // server-side.
      // If getState and setState are used, then the Python grader also gets
      // access to the return value of getState and can choose it instead to
      // grade.
      return false;
    }

    function getState() {
      return JSON.stringify(state.a === 2);
    } // This function will be called with 1 argument when JSChannel is not used,
    // 2 otherwise. In the latter case, the first argument is a transaction
    // object that will not be used here
    // (see http://mozilla.github.io/jschannel/docs/)


    function setState() {
      var stateStr = arguments.length === 1 ? arguments.length <= 0 ? undefined : arguments[0] : arguments.length <= 1 ? undefined : arguments[1];
      state = JSON.parse(stateStr);
    }
  }

  return init;
});