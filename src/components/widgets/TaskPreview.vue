<template lang="pug">
  #task-preview
    .notification.is-info.has-text-centered.on-top
      .columns
        .column(v-if="task.syllab.language") {{ tokens[ 'lbl_syllab_word' ] }}
        .column(v-if="task.syllab.language")
          button.button.is-primary.is-small(@click="syllabifyAll") {{ tokens[ 'btn_syllab_all' ] }}
        .column(v-if="task.speech.language") {{ tokens[ 'lbl_speak_word' ] }}

    task-text(ref="container"
      @click.native.ctrl="syllabify"
      @click.native.alt="pronounce"
      @click.native="fixate")

    task-images(
      :images="images"
      :fixation="fixation")

    .columns.at-bottom
      .column.has-text-right
        button.button.is-primary(:disabled="!hasPrevPage" @click="prev")
          span &lt;
      .column.has-text-centered.is-narrow
        button.button.is-primary(@click="close")
          span {{ tokens[ 'btn_close' ] }}
      .column.has-text-left
        button.button.is-primary(:disabled="!hasNextPage" @click="next")
          span &gt;
</template>

<script>
import { i10n } from '@/utils/i10n.js';

import TaskText from '@/components/widgets/TaskText.vue';
import TaskImages from '@/components/widgets/TaskImages.vue';

import Task from '@/model/task.js';

import TextPresenter from '@/task/textPresenter.js';
import FeedbackProvider from '@/task/feedbackProvider.js';

import { TextPageImage, Word } from '@/model/task/textPageImage.js';

// ts-check-only
import Vue from 'vue';

/**
 * @fires close
 */
export default {
  name: 'task-preview',

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
      /** @type {Word} */
      fixatedWord: null,

      tokens: i10n( 'preview' ),
    };
  },

  props: {
    firstPage: {
      type: Array,
      default: null,
    },
    task: {
      type: Task,
    },
  },

  computed: {

    /** @returns {boolean} */
    hasNextPage() {
      return this.textPresenter ? this.textPresenter.hasNextPage : false;
    },

    /** @returns {boolean} */
    hasPrevPage() {
      return this.textPresenter ? this.textPresenter.hasPrevPage : false;
    },

    /** @returns {TextPageImage[]} */
    images() {
      if ( !this.textPresenter ) {
        return [];
      }

      const pageIndex = this.textPresenter.originalPageIndex;
      if ( pageIndex < 0 ) {
        return [];
      }

      return this.task.pages[ pageIndex ].images;
    },

    /** @returns {{word: Word, duration: number}} */
    fixation() {
      return { word: this.fixatedWord, duration: 900000 + Math.floor( Math.random() * 100000 ) };
    },
  },

  methods: {
    /** @param {Event} e */
    syllabifyAll( e ) {
      this.textPresenter.words.forEach( ( text, el ) => {
        this.feedbackProvider.syllabifier.syllabifyElementText( el, text );
      } );
    },

    /** @param {Event} e */
    next( e ) {
      this.fixatedWord = null;
      this.textPresenter.nextPage();
      this.feedbackProvider.reset();
    },

    /** @param {Event} e */
    prev( e ) {
      this.fixatedWord = null;
      this.textPresenter.prevPage();
      this.feedbackProvider.reset();
    },

    /** @param {Event} e */
    close( e ) {
      this.$emit( 'close' );
    },

    /** @param {Event} e */
    syllabify( e ) {
      if ( /** @type {Element} */ (e.target).classList.contains( 'word' ) ) {
        const text = this.feedbackProvider.syllabifier.unprepare( /** @type {Element} */ (e.target).textContent );
        if ( text ) {
          this.feedbackProvider.syllabifier.syllabifyElementText( /** @type {HTMLElement} */ (e.target), text );
        }
      }
    },

    /** @param {Event} e */
    pronounce( e ) {
      if ( /** @type {Element} */ (e.target).classList.contains( 'word' ) ) {
        const text = this.feedbackProvider.syllabifier.unprepare( /** @type {Element} */ (e.target).textContent );
        if ( text ) {
          this.feedbackProvider.speaker.say( text );
        }
      }
    },

    /** @param {Event} e */
    fixate( e ) {
      const el = /** @type {HTMLElement} */ (e.target);
      if ( el.classList.contains( 'word' ) ) {
        const text = this.feedbackProvider.syllabifier.unprepare( el.textContent );
        if ( text ) {
          this.fixatedWord = new Word( text, el.dataset.wordId );
        }
      }
    },
  },

  mounted() {
    this.feedbackProvider = new FeedbackProvider( this.task.syllab, this.task.speech, this.task.highlight );
    this.feedbackProvider.init();

    const textEl = /** @type {Vue} */ (this.$refs.container).$refs.text;
    this.textPresenter = new TextPresenter( this.task, this.firstPage, /** @type {HTMLElement} */ (textEl), this.feedbackProvider.syllabifier );

    this.next( null );
  },

  beforeDestroy() {
    this.feedbackProvider.cleanup();
  },
};
</script>

<style lang="less" scoped>
  .on-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .at-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
