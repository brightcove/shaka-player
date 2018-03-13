/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('shaka.text.VTTCue');

goog.require('shaka.log');

/**
 * @namespace shaka.text.VTTCue
 *
 * @summary A cross-browser VTTCue.
 */

/**
 * @param {number} startTime
 * @param {number} endTime
 * @param {string} text
 * @return {VTTCue|TextTrackCue|Object}
 */
shaka.text.VTTCue = function(startTime, endTime, text) {
  if (window.VTTCue &&
      (/\[native code\]/).test(window.VTTCue.toString())) {
    return new window.VTTCue(startTime, endTime, text);
  }

  if (window.TextTrackCue) {
    var constructorLength = window.TextTrackCue.length;
    if (constructorLength == 3) {
      return shaka.text.VTTCue.from3ArgsTextTrackCue_(startTime, endTime, text);
    } else if (constructorLength == 6) {
      return shaka.text.VTTCue.from6ArgsTextTrackCue_(startTime, endTime, text);
    } else if (shaka.text.VTTCue.canUse3ArgsTextTrackCue_()) {
      return shaka.text.VTTCue.from3ArgsTextTrackCue_(startTime, endTime, text);
    }
  }

  shaka.log.error('VTTCue not available.');
  return {};
};


/**
 * Draft spec TextTrackCue with 3 constructor arguments.
 * See {@link https://goo.gl/ZXBWZi W3C Working Draft 25 October 2012}.
 *
 * @param {number} startTime
 * @param {number} endTime
 * @param {string} text
 * @return {TextTrackCue}
 * @private
 */
shaka.text.VTTCue.from3ArgsTextTrackCue_ = function(startTime, endTime,
    text) {
  return new window.TextTrackCue(startTime, endTime, text);
};


/**
 * Draft spec TextTrackCue with 6 constructor arguments (5th & 6th are
 * optional).
 * See {@link https://goo.gl/AYFqUh W3C Working Draft 29 March 2012}.
 * Quoting the access to the TextTrackCue object to avoid the compiler
 * complaining.
 *
 * @param {number} startTime
 * @param {number} endTime
 * @param {string} text
 * @return {TextTrackCue}
 * @private
 */
shaka.text.VTTCue.from6ArgsTextTrackCue_ = function(startTime, endTime,
    text) {
  var id = startTime + '-' + endTime + '-' + text;
  return new window['TextTrackCue'](id, startTime, endTime, text);
};


/**
 * IE10, IE11 and Edge returns TextTrackCue.length = 0 although it accepts 3
 * constructor arguments.
 *
 * @return {boolean}
 * @private
 */
shaka.text.VTTCue.canUse3ArgsTextTrackCue_ = function() {
  try {
    return !!shaka.text.VTTCue.from3ArgsTextTrackCue_(1, 2, '');
  } catch (error) {
    return false;
  }
};
