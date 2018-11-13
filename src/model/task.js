import Recordable from './commons/recordable.js';

import TextPage from './task/textPage.js';
import { TextPageImage } from './task/textPageImage.js';
import { Threshold, SyllabOptions, SpeechOptions, HighlightOptions, WarningOptions } from './session/feedbacks.js';

import Intro from './intro.js';

import db from '@/db/db.js';

// ts-check-only
import { Question } from './session/question.js';

export default class Task extends Recordable {

  /**
   * @param {string} [id]
   */
  constructor( id ) {
    super( id );

    /** @type {string} */
    this.name = '';
    /** @type {string} teacher ID */
    this.owner = '';
    /** @type {string} ID */
    this.cls = '';
    /** @type {string} 'text' */
    this.type = '';
    /** @type {string} 'left' | 'right' */
    this.alignment = '';
    /** @type {string} */
    this.fontname = 'Calibri';
    /** @type {string} ID */
    this.intro = '';
    /** @type {TextPage[]} */
    this.pages = [];
    /** @type {SyllabOptions} */
    this.syllab = Task.defaultSyllab;
    /** @type {SpeechOptions} */
    this.speech = Task.defaultSpeech;
    /** @type {HighlightOptions} */
    this.highlight = Task.defaultHighlight;
    /** @type {WarningOptions} */
    this.warning = Task.defaultWarning;
    /** @type {Question[]} */
    this.questionnaire = [];
    /** @type {boolean} */
    this.useTimeout = false;
    /** @type {number} */
    this.timeout = 5;
    /** @type {boolean} */
    this.recordAudio = false;
  }

  /** @return {string} */
  static get db() {
    return 'tasks';
  }

  /**
   * @param {string} id 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  static get( id, cb ) {
    return db.get( Task, id, cb );
  }

  /** @returns {string} */
  static get wordSyllabSeparator() {
    return '=';
  }

  /** @returns {string} */
  static get syllabSeparator() {
    return ' ';
  }

  /** @returns {SyllabOptions} */
  static get defaultSyllab() {
    return {
      language: '',
      exceptions: {},
      mode: 'colors',
      temporary: false,
      threshold: new Threshold( 3000, false, 1500, 3000, false ),
    };
  }

  /** @returns {SpeechOptions} */
  static get defaultSpeech() {
    return {
      language: '',
      threshold: new Threshold( 4000, false, 3000, 4000, false ),
    };
  }

  /** @returns {HighlightOptions} */
  static get defaultHighlight() {
    return {
      language: '',
      color: '#1050A0',
      threshold: new Threshold( 4000, false, 3000, 4000, false ),
    };
  }

  /** @returns {WarningOptions} */
  static get defaultWarning() {
    return {
      language: '',
      phrase: 'Jatka lukemista!',
      threshold: new Threshold( 5000 ),
    };
  }

  /**
   * @param {string} text 
   * @returns {TextPage[]}
   */
  static textToPages( text ) {
    if ( !text ) {
      return [];
    }

    let pageIndex = 0;
    let page = new TextPage( pageIndex );

    const pages = [ page ];
    const lines = text.split( '\n' );

    lines.forEach( line => {
      line = line.trim();

      if ( !line ) {
        if ( page.lines.length > 0 ) {
          page = new TextPage( ++pageIndex );
          pages.push( page );
        }
        return;
      }

      page.lines.push( line );
    } );

    if ( !page.lines.length ) {
      pages.pop();
    }

    return pages;
  }

  /**
   * @param {(TextPage | string[])[]} pages 
   * @returns {string}
   */
  static pagesToText( pages ) {
    if (!pages.length) {
      return '';
    }

    /** @type {string[]} */
    let result;
    if ('lines' in pages[0]) {
      const source = /** @type {TextPage[]} */ (pages);
      result = source.map( page => page.lines.join( '\n' ) );
    }
    else {   // backward compatibility with format where Task.pages=[[String]]
      const source = /** @type {string[][]} */ (pages);
      result = source.map( page => page.join( '\n' ) );
    }

    return result.join( '\n\n' );
  }

  /**
   * @param {string} text 
   * @returns {object} - 'original word' - 'syllabified word' pairs
   */
  static textToSyllabs( text ) {
    if ( !text ) {
      return {};
    }

    const result = {};
    const lines = text.split( '\n' );

    lines.forEach( line => {
      line = line.trim();
      const parts = line.split( Task.wordSyllabSeparator );
      if ( parts.length !== 2 ) {
        return;
      }

      const word = parts[0].trim();
      const syllabText = parts[1].trim();
      if ( !word || !syllabText || word.split( Task.syllabSeparator ).length > 1 ) {
        return;
      }

      result[ word ] = syllabText.split( Task.syllabSeparator )
        .filter( item => item.length )
        .join( Task.syllabSeparator );
    } );

    return result;
  }

  /**
   * @param {object} syllabs 
   * @returns {string}
   */
  static syllabsToText( syllabs ) {
    const result = [];
    for ( let word in syllabs ) {
      result.push( `${word}${Task.wordSyllabSeparator}${syllabs[ word ]}` );
    }
    return result.join( '\n' );
  }

  /**
   * 
   * @param {TextPage[]} pages 
   * @param {TextPageImage[]} images 
   */
  static embedImagesIntoPages( pages, images ) {
    if ( !images ) {
      return;
    }

    pages.forEach( page => { page.images = []; } );

    images.forEach( image => {
      if ( image.page < 0 ) {
        pages.forEach( page => {
          if ( !page.images.find( img => img.src === image.src ) ) {
            page.images.push( new TextPageImage( image ) );
          }
        } );
      }
      else {
        const page = pages[ image.page ];
        if ( !page ) {
          return;
        }

        page.images.push( new TextPageImage( image ) );
      }
    } );
  }

  /**
   * @typedef {Task & {text: string, images: TextPageImage[]}} TaskSource
   */

  /**
   * @param {TaskSource} task 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  update( task, cb ) {
    const _task = {
      alignment: task.alignment,
      fontname: task.fontname,
      intro: task.intro,
      pages: Task.textToPages( task.text ),
      syllab: task.syllab,
      speech: task.speech,
      highlight: task.highlight,
      warning: task.warning,
      questionnaire: task.questionnaire,
      useTimeout: task.useTimeout,
      timeout: task.timeout,
      recordAudio: task.recordAudio,
    };

    Task.embedImagesIntoPages( _task.pages, task.images );

    _task.syllab.exceptions = Task.textToSyllabs( task.syllab.exceptions );

    return db.updateFields( this, _task, cb );
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  getIntro( cb ) {
    if ( this.intro ) {
      return db.get( Intro, this.intro, cb );
    }
    else {
      return Promise.resolve( cb() );
    }
  }

  /**
   * 
   * @param {File} file 
   * @param {object} meta 
   * @param {function(number)} progressHandler 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  static uploadImage( file, meta, progressHandler, cb ) {
    const prefix = TextPageImage.generatePrefix();
    return db.uploadFile( file, prefix, meta, progressHandler, cb );
  }

  /**
   * @param {TextPageImage} image 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  static deleteImage( image, cb ) {
    const url = TextPageImage.urlFromName( image.src );
    return db.deleteFile( url, cb );
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  deleteAllImages( cb ) {
    /** @type {Promise[]} */
    const promises = [];

    this.pages.forEach( page => {
      if (!page.images) {
        return;
      }
      page.images.forEach( image => {
        const url = TextPageImage.urlFromName( image.src );
        promises.push( db.deleteFile( url, _ => {} ) );
      } );
    } );

    return Promise.all( promises ).then( _ => {
      cb();
    } );
  }

}

Recordable.apply( Task );
