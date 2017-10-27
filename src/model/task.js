import Recordable from './commons/recordable.js';

import TextPage from './task/textPage.js';
import { TextPageImage } from './task/textPageImage.js';
import { Threshold, SyllabOptions, SpeechOptions } from './session/feedbacks.js';

import Intro from './intro.js';

import db from '@/db/db.js';

// ts-check-only
import Question from './session/question.js';

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
    /** @type {string} ID */
    this.intro = '';
    /** @type {TextPage[]} */
    this.pages = [];
    /** @type {SyllabOptions} */
    this.syllab = Task.defaultSyllab;
    /** @type {SpeechOptions} */
    this.speech = Task.defaultSpeech;
    /** @type {Question[]} */
    this.questionnaire = [];
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
   * @param {TextPage[]} pages 
   * @returns {string}
   */
  static pagesToText( pages ) {
    return pages.map( page => {
      const lines = page.lines; // || page;   // backward compatibility with format where Task.pages=[[String]]
      return lines.join( '\n' );
    } ).join( '\n\n' );
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
   * @typedef TaskSource
   * @implements {Task}
   * @property {string} text
   * @property {TextPageImage[]} images
   */
  /**
   * @param {TaskSource} task 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  update( task, cb ) {
    const _task = {
      alignment: task.alignment,
      intro: task.intro,
      pages: Task.textToPages( task.text ),
      syllab: task.syllab,
      speech: task.speech,
      questionnaire: task.questionnaire,
    };

    Task.embedImagesIntoPages( _task.pages, task.images );

    _task.syllab.exceptions = Task.textToSyllabs( task.syllab.exceptions );

    return db.updateFields( this, _task, cb );
  }

  /**
   * @param {Callback} cb 
   * @returns 
   */
  getIntro( cb ) {
    if ( this.intro ) {
      return db.get( Intro, this.intro, cb );
    }
    else {
      Promise.resolve( cb() );
    }
  }

  /**
   * 
   * @param {File} file 
   * @param {object} meta 
   * @param {function} progressHandler 
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
    return db.deleteFile( image.src, cb );
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  deleteAllImages( cb ) {
    const promises = [];

    this.pages.forEach( page => {
      page.images.forEach( image => {
        promises.push( db.deleteFile( image.src, _ => {} ) );
      } );
    } );

    return Promise.all( promises ).then( _ => {
      cb();
    } );
  }

}

Recordable.apply( Task );
