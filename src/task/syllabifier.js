import SyllabificationFeedback from '@/model/session/syllabificationFeedback.js';

import DataUtils from '@/utils/data-utils.js';
import loggerFactory from '@/utils/logger.js';

// ts-check-only
import WordFocus from './wordFocus.js';
import { SyllabOptions } from '@/model/session/feedbacks.js';

const logger = loggerFactory( 'syllabifier' );

const RESTORE_INTERVAL = 3000;
const LONG_WORD_MIN_LENGTH = 7;
const EXTRA_THRESHOLD_FOR_CHAR = 0.05;

export default class Syllabifier {

  /**
   * @param {SyllabOptions} options 
   */
  constructor( options ) {
    /** @type {SyllabOptions} */
    this._options = { ...options };
    this._options.threshold.factor = 4;

    /** @type {string} */
    this._hyphen = Syllabifier.MODES[ 'hyphen' ];

    /** @type {string} */
    this._hyphenHtml = `<span class="hyphen">${this._hyphen}</span>`;

    /** @type {function( string, string ): string} */
    this._rule = rules[ DataUtils.convertLegacy( this._options.language ) ];

    /** @type {object} */
    this._exceptions = {};
    for ( let word in this._options.exceptions ) {
      this._exceptions[ word.toLowerCase() ] = this._options.exceptions[ word ].replace( / /g, this._hyphen ).toLowerCase();
    }

    logger.info( 'created', options );
  }

  /** @returns {{hyphen: string, colors: string[]}} */
  static get MODES() {
    return {
      hyphen: String.fromCharCode( 0x00B7 ), // DOTS: 00B7 2010 2022 2043 LINES: 2758 22EE 205E 237F
      colors: [ 'black', 'red' ], //, '#0af'
    };
  }

  /** @returns {string[]} */
  static get LANGS() {
    return Object.keys( rules );
  }

  /**
   * @param {string} word 
   * @param {string} hyphen
   * @returns {string[]} - 2 values 
   */
  static getPrefixAndSuffix( word, hyphen ) {
    const chars = Array.from( word );
    const prefix = [];
    const postfix = [];

    let i = 0;
    while ( i < chars.length && chars[i++] === hyphen ) { prefix.push( hyphen ); }
    i = chars.length - 1;
    while ( i >= 0 && chars[i--] === hyphen ) { postfix.push( hyphen ); }

    return [ prefix.join( '' ), postfix.join( '' ) ];
  }

  /** @returns {boolean} */
  get enabled() {
    return !!this._rule;
  }

  /** @returns {SyllabificationFeedback} */
  get setup() {
    return new SyllabificationFeedback( { ...this._options, hyphen: this._hyphen, enabled: !!this._rule } );
  }

  /**
   * @param {string} word
   * @returns {string} 
   */
  prepareWord( word ) {
    if ( !word || !this._rule || this._options.mode !== 'hyphen' ) {
      return word;
    }

    logger.info( 'preparing' );

    const syllabifiedWord = this.syllabifyWord( word, this._hyphen );
    const hyphenCount = syllabifiedWord.length - word.length;
    const halfHyphenCount = Math.round( hyphenCount / 2 );

    return '<span class="hyphens">' +
                      ( Array( halfHyphenCount + 1 ).join( this._hyphen ) ) +
                  '</span>' +
                  word +
                  '<span class="hyphens">' +
                      ( Array( hyphenCount - halfHyphenCount + 1 ).join( this._hyphen ) ) +
                  '</span>';
  };

  /**
   * @param {string[]} text
   * @returns {string[]} 
   */
  prepareText( text ) {
    if ( !this._rule || this._options.mode !== 'hyphen' ) {
      return text;
    }

    return text.map( line => {
      const words = line.split( ' ' ).map( word => word.toLowerCase() );
      return words.map( this.prepareWord ).join( ' ' );
    } );
  }

  /**
   * @param {string} text 
   * @returns {string}
   */
  unprepare( text ) {
    return text.replace( new RegExp( this._hyphen, 'g' ), '' );
  }

  /**
   * @param {HTMLElement} el
   * @param {WordFocus} wordFocus
   * @returns {boolean} true if the word was syllabified
   */
  inspect( el, wordFocus ) {
    if ( !this._rule ) {
      return false;
    }

    // We consider the common threshold as the threshold for relatively short words
    // For long words, each addition character increases the threhold
    let threshold = this._options.threshold.value;
    if ( this._options.threshold.adjustForWordLength ) {
      threshold *= Math.max( 1, 1 + ( wordFocus.word.length - LONG_WORD_MIN_LENGTH ) * EXTRA_THRESHOLD_FOR_CHAR );
    }

    const mustSyllabify =
            !wordFocus.syllabified &&
            //wordFocus.entries === 1 &&
            wordFocus.accumulatedTime > threshold;

    if ( !mustSyllabify ) {
      return false;
    }

    wordFocus.syllabified = true;

    el.innerHTML = this.syllabifyWord( wordFocus.word, this._hyphenHtml );

    if ( this._options.temporary ) {
      setTimeout( () => {
        this._restore( el );
      }, RESTORE_INTERVAL );
    }

    return true;
  }

  /**
   * @param {HTMLElement} el
   * @param {string} word
   * @returns {boolean} true if the word was syllabified
   */
  syllabifyElementText( el, word ) {
    if ( !this._rule ) {
      return false;
    }

    el.innerHTML = this.syllabifyWord( word, this._hyphenHtml );

    return true;
  }

  /** @param {number} wordReadingDuration */
  setAvgWordReadingDuration( wordReadingDuration ) {
    if ( !this._options.threshold.smart || !wordReadingDuration ) {
      return;
    }

    this._options.threshold.value =
            Math.max( this._options.threshold.min,
              Math.min( this._options.threshold.max,
                wordReadingDuration * this._options.threshold.factor
              ) );
  }

  /**
   * @param {string} word 
   * @param {string} hyphen 
   * @returns {string}
   */
  syllabifyWord( word, hyphen ) {
    logger.info( 'syllabifying', word );

    if ( this._options.mode === 'colors' ) {
      hyphen = this._hyphen;
    }

    let result;
    const exception = Object.keys( this._exceptions ).find( exception => this._isException( word, exception ) );
    if ( exception ) {
      logger.info( 'is exception' );
      result = this._formatException( word, exception, this._exceptions[ exception ], hyphen );
    }
    else {
      result = this._rule( word, hyphen );
    }

    if ( this._options.mode === 'colors' ) {
      const syllabs = result.split( this._hyphen );
      result = this._colorize( syllabs );
    }

    return result;
  }

  /**
   * @param {string | string[]} text 
   * @returns {number}
   */
  getSyllabCount( text ) {
    if ( !this._rule ) {
      return 0;
    }

    logger.info( 'counting syllab' );

    const countWordSyllabs = /** @param {number} acc; @param {string} word */ ( acc, word ) => {
      if ( !word ) {
        return acc;
      }

      let result;
      const exception = Object.keys( this._exceptions ).find( exception => this._isException( word, exception ) );
      if ( exception ) {
        result = this._exceptions[ exception ];
      }
      else {
        result = this._rule( word, ' ' );
      }

      return acc + result.split( ' ' ).length;
    };

    if ( text instanceof Array ) {
      return text.reduce( ( acc, line ) => {
        const words = line.split( ' ' ).map( word => word.toLowerCase() );
        return words.reduce( countWordSyllabs, acc );
      }, 0 );
    }
    else {
      return text.split( ' ' ).reduce( countWordSyllabs, 0 );
    }
  }

  /**
   * @param {HTMLElement} el 
   */
  _restore( el ) {
    let text = null;
    try {
      text = el.textContent;
    }
    catch ( e ) {
      logger.error( 'restoring: element do not exist' );
    }

    logger.info( 'restoring', text );

    if ( text ) {
      const syllabs = text.split( this._hyphen );
      el.innerHTML = syllabs.join( '' );
    }
  }

  /**
   * @param {string} word 
   * @param {string} exception 
   * @returns {boolean}
   */
  _isException( word, exception ) {
    return word.toLowerCase().indexOf( exception ) >= 0;
  }

  /**
   * @param {string} word 
   * @param {string} exception 
   * @param {string} syllabified 
   * @param {string} hyphen 
   * @returns {string}
   */
  _formatException( word, exception, syllabified, hyphen ) {
    logger.info( 'params:', word, exception, syllabified, hyphen );
    const start = word.toLowerCase().indexOf( exception );
    const length = exception.length;
    const prefix = word.substr( 0, start );
    const postfix = word.substr( start + length );
    const chars = Array.from( syllabified );
    logger.info( 'info:', start, length, prefix, postfix );

    for ( let i = start, j = 0; i < start + length; i++ ) {
      let c = word.charAt( i );
      if ( c === c.toUpperCase() ) {    // this is not a letter
        chars[j] = c;
      }

      while ( chars[ ++j ] === this._hyphen ) { }    // just copy hyphens
    }

    let result = chars.join( '' );
    if ( this._hyphen !== hyphen ) {
      const re = new RegExp( this._hyphen, 'g' );
      result = result.replace( re, hyphen );
    }

    return prefix + result + postfix;
  }

  /**
   * @param {string[]} syllabs 
   * @returns {string}
   */
  _colorize( syllabs ) {
    const colors = Syllabifier.MODES[ 'colors' ];
    let colorIndex = 0;

    const colorizedSyllabs = syllabs.map( syllab => {
      const result = `<span style="color: ${colors[ colorIndex ]}">${syllab}</span>`;
      if ( ++colorIndex === colors.length ) {
        colorIndex = 0;
      }
      return result;
    } );

    return colorizedSyllabs.join( '' );
  }

};

const rules = {

  /**
   * @param {string} word 
   * @param {string} hyphen 
   * @returns {string}
   */
  Suomi( word, hyphen ) {
    const vowels = [ 'a', 'o', 'u', 'i', 'e', 'ä', 'ö', 'y' ];
    const consonants = [ 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
      'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z' ];
    const diftongs = [ 'ai', 'ei', 'oi', 'ui', 'yi', 'äi', 'öi', 'au', 'eu',
      'iu', 'ou', 'ey', 'iy', 'äy', 'öy', 'ie', 'uo', 'yö' ];

    const getType = /** @param {string} c */ c => vowels.includes( c ) ? 'V' : ( consonants.includes( c ) ? 'C' : '_' );

    const result = [];

    let hasVowel = false;
    let vowelsInRow = 0;

    for ( let i = word.length - 1; i >= 0; i-- ) {
      let separate = false;
      const char = word[i];
      const type = getType( char );
      const charNext = i > 0 ? word[i - 1] : null;
      const typeNext = charNext ? getType( charNext ) : '_';

      if ( type === 'V' ) {
        hasVowel = true;
        vowelsInRow++;

        if ( i < word.length - 1 ) {
          const charPrevious = word[ i + 1 ];
          const typePrevious = getType( charPrevious );
          if ( charPrevious !== char &&
                typePrevious === type &&
                !diftongs.includes( char + charPrevious ) ) {
            result.unshift( hyphen );
            vowelsInRow = 0;
          }
          else if ( char === 'i' && result[0] === 'e' && result[1] === 'n' ) { // handle '-ien' ending
            result.unshift( hyphen );
            vowelsInRow = 0;
          }
          else if ( vowelsInRow === 3 ) { // this is a compound word... split as "V-VV" (incorrect for eg maailma)
            result.unshift( hyphen );
            vowelsInRow = 0;
          }
        }
      }
      else if ( type === 'C' && hasVowel ) {
        vowelsInRow = 0;

        separate = i > 0;
        if ( i === 1 ) {  // prevent the two leading consonants to separate (eg. 'kreikka' )
          // const charNext = word[i - 1];
          // const typeNext = getType( charNext );
          if ( typeNext === type ) {
            separate = false;
          }
        }
      }

      result.unshift( char );

      if ( separate ) {
        if ( type !== '_' && typeNext !== '_' ) {
          result.unshift( hyphen );
        }
        hasVowel = false;
      }
    }

    return result.join( '' );
  },
};
