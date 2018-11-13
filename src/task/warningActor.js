import WarningFeedback from '@/model/session/warningFeedback.js';
import Speaker from '@/task/speaker.js';

import { WarningOptions, Threshold } from '@/model/session/feedbacks.js';

const LONG_WORD_MIN_LENGTH = 7;
const EXTRA_THRESHOLD_FOR_CHAR = 0.05;

const MAX_UNATTENDED_TEXT = 5000;

export default class WarningActor {

  /**
   * @param {WarningOptions} options 
   */
  constructor( options ) {
    /** @type {WarningOptions} */
    this._options = { ...options };

    /** @type {HTMLElement} */
    this.lastFocusedWord = null;

    this.textLeftTime = 0;

    this.warningSpeaker = options.language ? new Speaker({
      language: options.language,
      threshold: new Threshold(options.threshold.value),
    }) : null;
  }

  /** @returns {boolean} */
  get enabled() {
    return !!this._options.language;
  }

  /** @returns {WarningFeedback} */
  get setup() {
    return new WarningFeedback( { ...this._options, enabled: !!this._options.language } );
  }

  /**
   * @param {HTMLElement} el
   * @returns {boolean} - true if the word was highlighted
   */
  inspect( el ) {
    if ( !this.enabled ) {
      return false;
    }

    if (el) {
      this.textLeftTime = 0;
      this.lastFocusedWord = el;
      return false;
    }

    if (this.lastFocusedWord && !el) {
      this.textLeftTime = performance.now();
    }

    this.lastFocusedWord = el;

    if (!this.textLeftTime) {
      return false;
    }

    const threshold = this._options.threshold.value;
    const duration = performance.now() - this.textLeftTime;
    if (duration < threshold) {
      return false;
    }

    this.warningSpeaker.say('Jatka lukemista!');
    this.textLeftTime = 0;
    return true;
  }

};
