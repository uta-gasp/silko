<template lang="pug">
  #task-page

    task-text(
      ref="container"
      :fontname="task.fontname"
    )

    task-images(
      v-show="images"
      :images="images"
      :fixation="fixation"
      @show="onImageShow"
      @hide="onImageHide")

    .is-bottom-right
      a.button.is-primary.is-large(v-show="hasNextPage" :disabled="isWaitingToFinilizePage" @click="next")
        span {{ tokens[ 'btn_next' ] }}
      a.button.is-primary.is-large(v-show="isLastPage" :disabled="isWaitingToFinilizePage" @click="finish")
        span {{ tokens[ 'btn_finish' ] }}

</template>

<script>
import TaskText from '@/components/widgets/TaskText.vue';
import TaskImages from '@/components/widgets/TaskImages.vue';

import Intro from '@/model/intro.js';
import Task from '@/model/task.js';
import Student from '@/model/student.js';

import TextPresenter from '@/task/textPresenter.js';
import FeedbackProvider from '@/task/feedbackProvider.js';
import DataCollector from '@/task/dataCollector.js';
import AudioRecorder from '@/task/audioRecorder.js';

import { i10n } from '@/utils/i10n.js';
import gazeTracking from '@/utils/gazeTracking.js';

import Font from '@/model/session/font.js';
import { TextPageImage, Word } from '@/model/task/textPageImage.js';

import db from '@/db/db.js';

// ts-check-only
import DataImage from '@/model/data/image.js';
import Vue from 'vue';

const FIX_UPDATE_INTERVAL = 25;

/**
 * @fires finished
 * @fires saved
 */
export default {
  name: 'task-page',

  components: {
    'task-text': TaskText,
    'task-images': TaskImages,
  },

  data() {
    return {
      /** @type {TextPresenter} */
      textPresenter: null,
      /** @type {FeedbackProvider} */
      feedbackProvider: null,
      /** @type {DataCollector} */
      collector: null,

      font: null,

      fixation: {
        word: null,
        duration: 0,
      },

      fixationUpdateTimer: 0,

      isWaitingToFinilizePage: false,
      audioRecorder: null,
      audioFiles: [],

      tokens: i10n( 'assignment' ),
    };
  },

  props: {
    texts: {
      type: Intro,
      required: true,
    },
    task: {
      type: Task,
      required: true,
    },
    student: {
      type: Student,
      required: true,
    },
    finilize: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    /** @returns {boolean} */
    hasNextPage() {
      return this.textPresenter ? this.textPresenter.hasNextPage : false;
    },

    /** @returns {boolean} */
    isLastPage() {
      return this.textPresenter ? !this.textPresenter.hasNextPage : false;
    },

    /** @returns {TextPageImage[]} */
    images() {
      if ( !this.textPresenter || 
          this.textPresenter.isInstructionPage || 
          this.textPresenter.page < 0) {
        return [];
      }

      return this.task.pages[ this.textPresenter.page ].images;
    },
  },

  methods: {

    init() {
      const container = /** @type {Vue} */ (this.$refs.container);

      this.font = Font.from( container.$data.textStyle );
      
      this.feedbackProvider = new FeedbackProvider( 
        this.task.syllab, 
        this.task.speech, 
        this.task.highlight,
        this.task.warning,
      );
      this.feedbackProvider.init();

      const textEl = /** @type {HTMLElement}*/ (container.$refs.text);
      this.textPresenter = new TextPresenter( this.task, this.texts.firstPage, textEl, this.feedbackProvider.syllabifier );

      this.collector = new DataCollector( this.task, this.student, this.font, this.feedbackProvider.setup );
      this.feedbackProvider.events.addListener( 'syllabified', /** @param {HTMLElement} el */ el => this.collector.syllabified( el ) );
      this.feedbackProvider.events.addListener( 'pronounced', /** @param {HTMLElement} el */ el => this.collector.pronounced( el ) );

      //     gazeTracking.setCallback( 'stateUpdated', 'task-page', state => {
      //       if ( state.isConnected && state.isTracking && !state.isBusy ) {
      //         this.collector.start();
      //       }
      //     } );

      gazeTracking.setCallback( 'wordFocused', 'task-page', /** @param {HTMLElement} word */ word => {
        let wordText = null;
        if ( !this.textPresenter.isInstructionPage ) {
          wordText = this.feedbackProvider.setFocusedWord( word );
        }
        this.collector.setFocusedWord( word );

        const wordID = word ? word.dataset.wordId : '';
        this.fixation = { word: wordText ? new Word( wordText, wordID ) : null, duration: 0 };
      } );

      gazeTracking.setCallback( 'wordLeft', 'task-page', _ => {
        if ( !this.textPresenter.isInstructionPage ) {
          this.feedbackProvider.setFocusedWord( null );
        }
        this.collector.setFocusedWord( null );
        this.fixation = { word: null, duration: 0 };
      } );

      gazeTracking.setCallback( 'gazePoint', 'task-page', /** @param {GTFixation} gazePoint */ gazePoint => {
        this.collector.addGazePoint( gazePoint );
      } );

      this.collector.start();
      this.fixationUpdateTimer = window.setInterval( () => {
        const word = this.collector.focusedWord;
        if ( !word ) {
          if ( this.fixation.word ) {
            this.fixation = { word: null, duration: 0 };
          }
        }
        else {
          this.fixation = { word: this.fixation.word, duration: word.duration };
        }
      }, FIX_UPDATE_INTERVAL );
    },

    /** @param {Event} e */
    next( e ) {
      if (e && this.task.recordAudio)  { // when showing a page other than first
        this.isWaitingToFinilizePage = true;

        const container = /** @type {Vue} */ (this.$refs.container);
        const textEl = /** @type {HTMLElement}*/ (container.$refs.text);
        textEl.innerHTML = '';

        this.audioRecorder.stop().then( /** @param {Blob} blob */ blob => {
          this.saveAudio( blob, /** @param {string} url */ url => {
            this.audioFiles.push( url );

            this.startPage();
            this.isWaitingToFinilizePage = false;
          } );
        });
      }
      else {
        this.startPage();
      }
    },

    /** @param {Event} e */
    finish( e ) {
      if (this.task.recordAudio) {
        this.isWaitingToFinilizePage = true;
        this.audioRecorder.stop().then( /** @param {Blob} blob */ blob => {
          this.saveAudio( blob, /** @param {string} url */ url => {
            this.audioFiles.push( url );
            this.stop();
            this.isWaitingToFinilizePage = false;
          } );
        });
      }
      else {
        this.stop();
      }
    },

    /** @param {{image: TextPageImage}} e */
    onImageShow( e ) {
      this.collector.imageShow( e.image );
    },

    /** @param {{image: TextPageImage}} e */
    onImageHide( e ) {
      this.collector.imageHide( e.image );
    },

    startPage() {
      let wordReadingDuration;
      if ( this.textPresenter.page === 0 && this.texts.firstPage && this.texts.firstPage.length ) {
        wordReadingDuration = this.collector.wordReadingDuration;
      }

      this.textPresenter.nextPage();
      this.collector.nextPage();
      if (this.task.recordAudio) {
        this.audioRecorder.start( () => {
          this.collector.updatePageTimestamp();
        });
      }

      this.feedbackProvider.reset( wordReadingDuration );

      gazeTracking.updateTargets();
    },

    stop() {
      this.$emit( 'finished', { 
        longGazedWords: this.collector.longGazedWords( this.task.syllab.threshold.value )
      } );

      if (this.task.recordAudio) {
        this.collector.setAudioFiles( this.audioFiles );
      }

      this.collector.stop( /** @param {Error} err; @param {{data: string, session: string}} keys */( err, keys ) => {
        this.$emit( 'saved', { err, keys } );
      } );

      window.clearInterval( this.fixationUpdateTimer );
      this.fixationUpdateTimer = 0;
    },

    /** @param {Blob} blob */
    saveAudio( blob, cb ) {
      const name = `${TextPageImage.generatePrefix()}-${this.textPresenter.page}`;
      db.uploadAudio( blob, name, null, /** @param {string | Error} err @param {string} url */ (err, url) => {
        if (err) {
          console.error( 'AUDIO', err );
          cb( '' );
        }
        else if (url) {
          cb( url );
        }
      });
    },
  },

  watch: {
    finilize( value ) {
      if (value) {
        this.finish( null );
      }
    },
  },

  mounted() {
    if (this.task.recordAudio) {
      AudioRecorder().then( recorder => {
        this.audioRecorder = recorder;
        this.init();

        setTimeout( () => this.next( null ), 2000 );
      });
    }
    else {
      this.init();
      this.next( null );
    }
  },

  beforeDestroy() {
    this.feedbackProvider.cleanup();

    gazeTracking.clearCallback( 'stateUpdated', 'task-page' );
    gazeTracking.clearCallback( 'wordFocused', 'task-page' );
    gazeTracking.clearCallback( 'wordLeft', 'task-page' );
    gazeTracking.clearCallback( 'gazePoint', 'task-page' );
  },
};
</script>

<style lang="less" scoped>

  .is-bottom-right {
    position: fixed;
    bottom: 1em;
    right: 1em;
  }

</style>
