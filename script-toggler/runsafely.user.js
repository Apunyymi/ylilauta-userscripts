// ==UserScript==
// @name Just a try/catch
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// ==/UserScript==

// This is registered straight into the requiring scripts namespace
function runSafely(callback) {
  try {
    callback()
  } catch (traceback) {
    console.log(traceback)
  }
}