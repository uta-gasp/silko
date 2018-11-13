/**
 * @external EventEmitter
 */

import { Feedbacks } from '@/model/session/feedbacks.js';

import Syllabifier from './syllabifier.js';
import Speaker from './speaker.js';
import Highlighter from './highlighter.js';
import WordFocus from './wordFocus.js';

// ts-check-only
import { SyllabOptions, SpeechOptions, HighlightOptions } from '@/model/session/feedbacks';

const FOCUS_THRESHOLD = 150;
const REENTRY_THRESHOLD = 1000;
const SAMPLE_DURATION = 30;

const HIGHLIGHT_CLASS = 'currentWord';

/**
 * @fires syllabified
 * @fires pronounced
 * @fires highlighted
 */
export default class FeedbackProvider {

  /**
   * @param {SyllabOptions} syllab 
   * @param {SpeechOptions} speech 
   * @param {HighlightOptions} highlight
   */
  constructor( syllab, speech, highlight ) {
    /** @type {Syllabifier} */
    this._syllabifier = new Syllabifier( syllab );
    /** @type {Speaker} */
    this._speaker = new Speaker( speech );
    /** @type {Highlighter} */
    this._highlighter = new Highlighter( highlight );

    /** @type {EventEmitter} */
    this._events = new EventEmitter();
    /** @type {NodeJS.Timer} */
    this.timer = null;
    /** @type {HTMLElement} */
    this.currentWord = null;
    /** @type {HTMLElement} */
    this.lastFocusedWord = null;

    /** @type {Map<HTMLElement,WordFocus>} {el: WordFocus} */
    this.words = null;
  }

  /** @returns {Syllabifier} */
  get syllabifier() {
    return this._syllabifier;
  }

  /** @returns {Speaker} */
  get speaker() {
    return this._speaker;
  }

  /** @returns {Highlighter} */
  get highlighter() {
    return this._highlighter;
  }

  /** @returns {EventEmitter} */
  get events() {
    return this._events;
  }

  /** @returns {Feedbacks} */
  get setup() {
    return new Feedbacks(
      this._speaker.setup,
      this._syllabifier.setup,
      this._highlighter.setup,
    );
  }

  // Resets the highlighting
  cleanup() {
    if ( this.currentWord ) {
      this.currentWord.classList.remove( HIGHLIGHT_CLASS );
      this.currentWord = null;
    }

    this.lastFocusedWord = null;

    clearTimeout( this.timer );
    this.timer = null;
    this.words = null;
  }

  init() {
    this.words = new Map();

    if ( this._syllabifier.enabled || this._speaker.enabled || this._highlighter.enabled ) {
      this.timer = setInterval( () => {
        this._tick();
      }, 30 );
    }
  }

  /**
   * @param {number} [avgWordReadingDuration]
   */
  reset( avgWordReadingDuration ) {
    if ( avgWordReadingDuration ) {
      this._syllabifier.setAvgWordReadingDuration( avgWordReadingDuration );
      this._speaker.setAvgWordReadingDuration( avgWordReadingDuration );
      this._highlighter.setAvgWordReadingDuration( avgWordReadingDuration );
    }

    this.words = new Map();
    this.currentWord = null;
    this.lastFocusedWord = null;
  }

  /**
   * Propagates / removes the highlighing
   * @param {HTMLElement} [el]
   * @returns {string}
   */
  setFocusedWord( el ) {
    if ( this.currentWord !== el ) {
      // if (this.highlightingEnabled) {
      //     if (this.currentWord) {
      //         this.currentWord.classList.remove( HIGHLIGHT_CLASS );
      //     }
      //     if (el) {
      //         el.classList.add( HIGHLIGHT_CLASS );
      //     }
      // }

      this.currentWord = el;

      if ( el ) {
        if ( !this.words.has( el ) ) {
          this.words.set( el, new WordFocus( el ) );
        }
        else {
          const wordFocus = this.words.get( el );

          if ( this.currentWord !== this.lastFocusedWord ) {
            wordFocus.focusRecorded = false;
          }

          const now = window.performance.now();
          if ( now - wordFocus.lastSample > REENTRY_THRESHOLD ) {
            wordFocus.entries++;
          }

          wordFocus.lastSample = now;
        }

        this.lastFocusedWord = el;
      }
    }

    return this.currentWord ? this.words.get( this.currentWord ).word : null;
  }

  _tick() {
    for ( let key of this.words.keys() ) {
      const wordFocus = this.words.get( key );
      wordFocus.accumulatedTime = Math.max( 0,
        wordFocus.accumulatedTime + ( key === this.currentWord ? SAMPLE_DURATION : -SAMPLE_DURATION )
      );

      if ( wordFocus.accumulatedTime > FOCUS_THRESHOLD && !wordFocus.focusRecorded ) {
        wordFocus.focusRecorded = true;
        wordFocus.focusCount++;
      }

      if ( this._syllabifier.inspect( key, wordFocus ) ) {
        this._events.emitEvent( 'syllabified', [ key ] );
      }

      if ( this._speaker.inspect( key, wordFocus ) ) {
        this._events.emitEvent( 'pronounced', [ key ] );
      }

      if ( this._highlighter.inspect( key, wordFocus ) ) {
        this._events.emitEvent( 'highlighted', [ key ] );
      }
    }
  };

};
