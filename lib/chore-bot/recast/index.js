'use strict';

const RecastAI = require('recastai');

const Recast = class Recast {

  /**
   * INIT
   */

  constructor() {
    this.client = new RecastAI.request(this.apiToken, this.language);
    this.onReply = (res) => {
      console.dir(res);
    };
  }

  get config() {
    return _.get(config, 'recast');
  }

  get apiToken() {
    return _.get(this.config, 'token');
  }

  get language() {
    return 'en';
  }

  setOnReply(onReply) {
    this.onReply = onReply;
  }

  /**
   * METHODS
   */
  converse(message, conversationToken) {
    return this.client.converseText(message, {
        conversationToken
      })
      .then((res) => {
        this.onReply(res);
      })
      .catch((err) => {});
  }

};
module.exports = Recast;
