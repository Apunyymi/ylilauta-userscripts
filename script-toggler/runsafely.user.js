// ==UserScript==
// @name Run jQuery functions safely
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Wait for jQuery load
// ==/UserScript==

// We really do not want to change this code as we must change every @require then
// to ensure we are not loading and running different versions of this code

// We must register our things to global namespace to ensure runSafely()'s share
// their data
if (!window.runJQueryCallbacks) {
  window.runJQueryCallbacks = [];
}

// This is registered straight into the requiring scripts namespace
function runSafely(callback) {
  if (window.jQuery) {
    callback();
  } else {
    // Push the callback to wait for execution upon jQuery init
    window.runJQueryCallbacks.push(callback);

    // Nice race condition candidate here, luckily browser JS is one-threaded
    if (!window.runJQueryChecker) {
      window.runJQueryChecker = true;

      // setTimeout() this so it does not block execution
      setTimeout(async function() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (!window.jQuery) await sleep(50);
        
        // Now jQuery is definitely loaded, let's run the callback queue
        window.runJQueryCallbacks.forEach(callback => {
          try {
            callback();
          } catch (traceback) {
            console.log(traceback);
          }
        });
      });
    }
  }
}