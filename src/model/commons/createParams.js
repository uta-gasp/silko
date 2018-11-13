// ts-check-only
import { SyllabOptions, SpeechOptions, HighlightOptions } from '@/model/session/feedbacks.js';
import { TextPageImage } from '@/model/task/textPageImage.js';

export class TaskCreateParams {

  constructor() {
    /** @type {string} */
    this.name = '';
    /** @type {string} */
    this.alignment = '';
    /** @type {string} */
    this.fontname = '';
    /** @type {string} */
    this.intro = '';
    /** @type {string} */
    this.text = '';
    /** @type {SyllabOptions} */
    this.syllab = null;
    /** @type {SpeechOptions} */
    this.speech = null;
    /** @type {HighlightOptions} */
    this.highlight = null;
    /** @type {object[]} */
    this.questionnaire = null;
    /** @type {string} */
    this.syllabExceptions = null;
    /** @type {TextPageImage[]} */
    this.images = null;
    /** @type {boolean} */
    this.useTimeout = false;
    /** @type {number} */
    this.timeout = 5;
    /** @type {boolean} */
    this.recordAudio = false;
  }

}

export class StudentCreateParams {

  constructor() {
    /** @type {string} */
    this.name = '';
    /** @type {string} */
    this.email = '';
    /** @type {string} */
    this.password = '';
    /** @type {string} */
    this.grade = '';
  }

}

export class IntroCreateParams {

  constructor() {
    /** @type {string} */
    this.calibInstruction = '';
    /** @type {string} */
    this.startInstruction = '';
    /** @type {string} */
    this.firstPage = '';
  }

}
