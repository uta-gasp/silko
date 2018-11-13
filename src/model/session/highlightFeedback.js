import { Feedback, FeedbackOptions } from './feedback.js';

export default class HighlightFeedback extends Feedback {

  /* eslint-disable no-useless-constructor */
  /**
   * @param {object} options 
   */
  constructor( options ) {
    super( options );

    /** @type {string} */
    this.color = options.color;
  }

}
