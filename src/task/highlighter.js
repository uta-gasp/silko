import HighlightFeedback from '@/model/session/highlightFeedback.js';

// ts-check-only
import WordFocus from './wordFocus.js';
import { HighlightOptions } from '@/model/session/feedbacks.js';

const LONG_WORD_MIN_LENGTH = 7;
const EXTRA_THRESHOLD_FOR_CHAR = 0.05;

export default class Highlighter {

  /**
   * @param {HighlightOptions} options 
   */
  constructor( options ) {
    /** @type {HighlightOptions} */
    this._options = { ...options };
    this._options.threshold.factor = 4;
  }

  /** @returns {boolean} */
  get enabled() {
    return !!this._options.language;
  }

  /** @returns {HighlightFeedback} */
  get setup() {
    return new HighlightFeedback( { ...this._options, enabled: !!this._options.language } );
  }

  /**
   * @param {HTMLElement} el
   * @param {WordFocus} wordFocus
   * @returns {boolean} - true if the word was highlighted
   */
  inspect( el, wordFocus ) {
    if ( !this.enabled ) {
      return false;
    }

    let threshold = this._options.threshold.value;
    if ( this._options.threshold.adjustForWordLength ) {
      threshold *= Math.max( 1, 1 + ( wordFocus.word.length - LONG_WORD_MIN_LENGTH ) * EXTRA_THRESHOLD_FOR_CHAR );
    }

    const mustHighlight =
            !wordFocus.highlighted &&
            wordFocus.accumulatedTime > threshold;

    if ( !mustHighlight ) {
      return false;
    }

    wordFocus.highlighted = true;

    //el.style.cssText = `color: ${this._options.color} !important`;
    //el.style.color = `${this._options.color} !important`;
    el.setAttribute( 'style', `color: ${this._options.color} !important` );
    
    console.log('highlighted with', this._options.color);

    return true;
  }

  /**
   * @param {number} wordReadingDuration 
   */
  setAvgWordReadingDuration( wordReadingDuration ) {
    if ( !this._options.threshold.smart || !wordReadingDuration ) {
      return;
    }

    const threshold = this._options.threshold;
    threshold.value = Math.max( threshold.min, Math.min( threshold.max, wordReadingDuration * threshold.factor ) );
  }

};
