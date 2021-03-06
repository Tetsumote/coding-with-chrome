/**
 * @fileoverview Sphero Classic monitoring logic.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.protocol.sphero.v1.Monitoring');

goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.protocol.sphero.v1.Api} api
 * @struct
 * @final
 */
cwc.protocol.sphero.v1.Monitoring = function(api) {
  /** @type {!cwc.protocol.sphero.v1.Api} */
  this.api = api;

  /** @type {string} */
  this.name = 'Sphero v1 Monitoring';

  /** @type {boolean} */
  this.monitor = false;

  /** @type {number} */
  this.monitorLocationInterval = 1000; // Duration in ms.

  /** @type {goog.Timer} */
  this.monitorLocation = new goog.Timer(this.monitorLocationInterval);

  /** @type {boolean} */
  this.started = false;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

 // Monitor Events
  this.events_.listen(this.monitorLocation, goog.Timer.TICK,
    this.updateLocation.bind(this));

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Starts the monitoring.
 */
cwc.protocol.sphero.v1.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  this.log_.info('Starting...');
  this.monitorLocation.start();
  this.started = true;
};


/**
 * Stops the port monitoring.
 */
cwc.protocol.sphero.v1.Monitoring.prototype.stop = function() {
  if (!this.started) {
    return;
  }
  this.log_.info('Stopping...');
  this.monitorLocation.stop();
  this.started = false;
};


cwc.protocol.sphero.v1.Monitoring.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  this.stop();
  this.events_.clear();
};


/**
 * Updates the current location of the Sphero device.
 */
cwc.protocol.sphero.v1.Monitoring.prototype.updateLocation = function() {
  this.api.exec('getLocation');
};
