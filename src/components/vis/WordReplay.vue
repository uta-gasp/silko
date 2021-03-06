<template lang="pug">
  #word-replay
    .list(ref="root")
      table(ref="table")
        thead
          tr
            th
            th(v-for="record in data.records") {{ record.student.name }}

        tbody
          tr(v-for="word in words" :key="word.key")
            td.word {{ word.text }}
            td.duration(:class="{ 'is-danger': hasNoData( index ) }" v-for="(duration, index) in word.durations")

        tfoot
          tr
            td
            td(v-for="track in tracks")
              span(:class="{ hidden: track.pointer }") {{ track.doneMessage }}

    control-panel(
      :title="title"
      :feedback="null"
      :text-length="textLength"
      :initial-page-index="initialPageIndex"
      :options="options"
      :show-player="true"
      :is-player-paused="isPlayerPaused"
      @page-changed="setPage"
      @show-options="showOptions"
      @restart-player="restartPlayer"
      @toggle-player="togglePlayer"
      @close="close"
    )
    options(v-show="isOptionsDisplayed" :values="options" @close="closeOptions" @apply="applyOptions")

</template>

<script>
import Vue from 'vue';

import { i10n } from '@/utils/i10n.js';

import { OptionsCreator, OptionGroup, OptionItem } from '@/vis/optionsCreator.js';
import sgwmController from '@/vis/sgwmController.js';
import { WordTrack, ReplayWord } from '@/vis/wordTrack.js';

import ControlPanel from '@/components/vis/controlPanel.vue';
import Options from '@/components/vis/Options.vue';

// ts-check-pnly
import Data from '@/vis/data/data.js';

sgwmController.initializeSettings();

const UI = {
  levelDuration: 500,
};

/**
 * @fires close
 */
export default {
  name: 'word-replay',

  components: {
    'control-panel': ControlPanel,
    'options': Options,
  },

  data() {
    return {
      pageIndex: -1,
      isOptionsDisplayed: false,
      isPlayerPaused: false,

      defaultText: this.data.records[0].data.pages.map( page => page.text ),
      defaultFeedback: this.data.records[0].session.feedbacks,

      /** @type {{text: string, durations: number[], key: number}[]} */
      words: [],
      /** @type {WordTrack[]} */
      tracks: null,

      // options representation for editor, defined in created()
      options: null,

      tokens: i10n( 'vis_word_replay' ),
    };
  },

  props: {
    data: {   // vis/Data
      type: Data,
      required: true,
    },
  },

  computed: {
    /** @returns {number} */
    textLength() {
      return this.defaultText.length;
    },

    /** @returns {number} */
    initialPageIndex() {
      return this.data.records[0].data.pages[0].isIntro ? 1 : 0;
    },

    /** @returns {string} */
    title() {
      const r = this.data.records[0];
      return this.tokens[ 'hdr_word_replay' ]( this.data.params.student, r.task.name );
    },
  },

  methods: {
    /** @param {{index: number}} e */
    setPage( e ) {
      if ( this.tracks ) {
        this.stopAll();
      }

      this.pageIndex = e.index;
      this.makeList();

      Vue.nextTick( () => {
        this.start();
      } );
    },

    /** @param {Event} e */
    showOptions( e ) {
      this.isOptionsDisplayed = true;
    },

    /** @param {Event} e */
    close( e ) {
      this.$emit( 'close' );
    },

    /** @param {Event} e */
    applyOptions( e ) {
      sgwmController.save();

      const rows = (/** @type {Element} */ (this.$refs.table)).querySelectorAll( 'tr' );
      this.tracks.forEach( track => {
        track.words.forEach( word => {
          this.colorizeCell( rows[ word.id + 1 ].cells[ track.id + 1 ], word.totalDuration );
        } );
      } );
    },

    /** @param {Event} e */
    closeOptions( e ) {
      this.isOptionsDisplayed = false;
    },

    /** @param {Event} e */
    restartPlayer( e ) {
      this.stopAll();
      this.makeList();

      Vue.nextTick( () => {
        this.start();
      } );
    },

    /** @param {Event} e */
    togglePlayer( e ) {
      this.isPlayerPaused = !this.isPlayerPaused;
      this.tracks.forEach( track => track.togglePause() );
    },

    makeList() {
      if ( !this.tracks ) {
        this.createTracks();
      }

      const hyphenRegExp = new RegExp( `${this.defaultFeedback.syllabification.hyphen}`, 'g' );

      const words = this.defaultText[ this.pageIndex ].map( word => {
        return {
          text: word.text.replace( hyphenRegExp, '' ),
          durations: this.tracks.map( _ => 0 ),
          key: Math.random(),
        };
      } );

      this.words = words;
    },

    createTracks() {
      this.tracks = this.data.records.map( ( record, index ) => {
        return new WordTrack( /** @type {Element} */ (this.$refs.root), record.student.name, record.data.pages, index );
      } );
    },

    start() {
      this.isPlayerPaused = false;

      const rows = (/** @type {Element} */ (this.$refs.table)).querySelectorAll( 'tr' );

      this.tracks.forEach( track => {
        const words = track.session[ this.pageIndex ].text;
        const mappingResult = sgwmController.map( track.session[ this.pageIndex ] );

        track.start(
          mappingResult ? mappingResult.fixations : null,
          words,
          this.onWordFixated( track, rows ),
          this.onTrackCompleted( /*track, rows[ words.length + 1 ]*/ ),
        );
      } );

      (/** @type {Element} */ (this.$refs.root)).scrollTop = 0;
    },

    stopAll() {
      this.tracks.forEach( track => track.stop() );
    },

    /**
     * @param {HTMLElement} cell
     * @param {number} duration
     */
    colorizeCell( cell, duration ) {
      const levels = ( duration ? 1 : 0 ) + Math.floor( duration / UI.levelDuration );
      const tone = 255 - 24 * Math.min( 10, levels );
      const rgb = `rgb(${tone},${tone},${tone})`;
      cell.style.backgroundColor = rgb;
    },

    /**
     * @param {number} trackIndex
     * @returns {boolean}
     */
    hasNoData( trackIndex ) {
      return !this.tracks[ trackIndex ].hasData;
    },

    /**
     * @param {WordTrack} track
     * @param {NodeListOf<HTMLTableRowElement>} rows
     * @returns {Function}
     */
    onWordFixated( track, rows ) {
      return /** @param {ReplayWord} word; @param {number} duration */ ( word, duration ) => {
        const rawWord = track.words[ word.id ];
        rawWord.totalDuration = rawWord.totalDuration + duration;

        const cell = rows[ word.id + 1 ].cells[ track.id + 1 ];
        this.colorizeCell( cell, rawWord.totalDuration );

        track.pointer.setAttribute('style', `left: ${cell.offsetLeft + ( cell.offsetWidth - track.pointerSize ) / 2}px; top: ${cell.offsetTop + ( cell.offsetHeight - track.pointerSize ) / 2}px` );
      };
    },

    onTrackCompleted( /* track, row */ ) {
      return () => {
        // const cell = row.cells[ track.id + 1 ];
        // cell.classList.remove( 'hidden' );
      };
    },
  },

  created() {
    this.options = {
      wordReplay: new OptionGroup({
        id: 'wordReplay',
        title: this.tokens[ 'hdr_options' ],
        options: OptionsCreator.createOptions( {
          levelDuration: new OptionItem({ 
            type: Number, 
            step: 50, 
            label: this.tokens[ 'lbl_level_dur' ] + ', ms' 
          }),
        }, UI ),
        defaults: OptionsCreator.createDefaults( UI ),
      }),
      _sgwm: sgwmController.createOptions(),
    };
  },

  mounted() {
    console.log( 'Word replay created' );

    this.setPage( { index: this.initialPageIndex } );
  },

  beforeDestroy() {
    this.stopAll();
  },
};
</script>

<style lang="less" scoped>
  @import "../../styles/visualization.less";

  #word-replay {
    .visualization();

    .list {
      position: absolute;
      left: 50%;
      top: 48px;
      bottom: 8px;
      max-width: 100vw;
      transform: translate(-50%, 0);
      padding-right: 1px;

      height: ~"calc(100vh - 48px)";
      overflow-y: auto;

      border: 1px solid #444;

      table {
        padding: 8px;
        font-family: Calibri, Arial, sans-serif;
        font-size: 16px;

        border-collapse: collapse;

        thead {
          position: sticky;
          top: 0;

          th,
          td {
            background-color: #ffc;
            border-width: 0 0 1px;
            font-weight: bold;
          }
        }

        th,
        td {
          border: 1px solid black;
          text-align: center;
          padding: 0 4px;

          .word {
            display: inline-block;
            width: 65%;
            padding-left: 0.5em;
            box-sizing: border-box;
            text-overflow: ellipsis;
          }

          .duration {
            display: inline-block;
            width: 35%;
            text-align: right;
            padding-right: 0.4em;
            box-sizing: border-box;
          }
        }

        td:first-of-type {
          color: #a00 !important;
          text-align: right;
          border-width: 0;
        }

        tfoot {
          font-weight: bold;

          td {
            border-width: 1px 0 0;

            .hidden {
              color: white;
            }
          }
        }
      }
    }
  }

  td.is-danger {
    background-color: hsl(348, 100%, 81%);
  }
</style>

<style lang="less">
  .pointer {
      position: absolute;
      height: 8px;
      width: 8px;
      background-color: #f80;
      border: 1px solid black;
      border-radius: 4px;
      opacity: 0.7;

      &.invisible {
          display: none;
      }
  }
</style>
