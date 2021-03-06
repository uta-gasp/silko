<template lang="pug">
  #vis-plot(ref="root")
    canvas(ref="canvas")
    task-images(
      :images="visibleImages"
      :fixation="fixation"
      :viewport="defaultSession.screen"
    )

    .message.is-danger.below-title(v-if="isWarningMessageVisible")
      .message-header {{ tokens[ 'hdr_missing_data' ] }}
      .message-body {{ tokens[ 'msg_missing_data' ] }}

    control-panel(
      :title="title"
      :feedback="feedback"
      :questionnaire="data.records.length === 1 ? defaultQuestionnaire : null"
      :text-length="textLength"
      :initial-page-index="initialPageIndex"
      :options="options"
      :show-player="data.name.indexOf('Replay') >= 0"
      :is-player-paused="isPlayerPaused"
      @page-changed="setPage"
      @show-options="showOptions"
      @restart-player="restartPlayer"
      @toggle-player="togglePlayer"
      @close="close"
    )
    options(v-show="isOptionsDisplayed" :values="options" @close="closeOptions" @apply="applyOptions")

    audio-player.audio-player(
      v-if="audioPlayerProps.visible" 
      :duration="audioPlayerProps.duration"
      :playing="audioPlayerProps.playing"
      :time="audioPlayerProps.time"
      @toggled="audioPlayerProps.toggled($event)",
      @slided="audioPlayerProps.slided($event)")

    slot
</template>

<script>
import { i10n } from '@/utils/i10n.js';

import { OptionsCreator, OptionGroup, OptionItem } from '@/vis/optionsCreator.js';
import sgwmController from '@/vis/sgwmController.js';
import { Feedbacks } from '@/model/session/feedbacks';

import ControlPanel from '@/components/vis/controlPanel.vue';
import Options from '@/components/vis/Options.vue';
import TaskImages from '@/components/widgets/TaskImages.vue';
import AudioPlayer from '@/components/widgets/AudioPlayer.vue';

// ts-check-only
import DataPage from '@/model/data/dataPage.js';
import DataImage from '@/model/data/image.js';
import Data from '@/vis/data/data.js';
import { TextPageImage } from '@/model/task/textPageImage.js';

const COMMON_UI = {
  wordColor: '#666',
  wordHighlightColor: '#606',
  wordRectColor: '#f44',
  drawWordFrame: true,
};

sgwmController.initializeSettings();

// to be implemented by descendants:
// - changePage
// - redraw

/**
 * @fires close
 */
export default {
  components: {
    'control-panel': ControlPanel,
    'options': Options,
    'task-images': TaskImages,
    'audio-player': AudioPlayer,
  },

  data() {
    return {
      isOptionsDisplayed: false,
      options: {},

      commonUI: COMMON_UI,

      pageIndex: -1,
      /** @type {DataPage[]} */
      currentPages: [],
      defaultSession: this.data.records[0].session,
      defaultPages: this.data.records[0].data.pages,
      defaultFeedback: this.data.records[0].session.feedbacks,
      defaultQuestionnaire: this.data.records[0].data.questionnaire,

      isPlayerPaused: false,
      isWarningMessageVisible: false,

      audioPlayerProps: {
        visible: false,
        duration: 0,
        playing: false,
        time: 0,
        toggled( e ) { },
        slided( e ) { },
      },

      /** @type {DataImage[]} */
      currentImages: [],
      /** @type {TextPageImage[]} */
      visibleImages: [],
      fixation: null,

      tokens: i10n( 'vis' ),
    };
  },

  props: {
    data: {   // vis/Data
      type: Data,
      required: true,
    },
  },

  computed: {
    /** @returns {number} pages count */
    textLength() {
      return this.defaultPages.length;
    },

    /** @returns {number} */
    initialPageIndex() {
      return this.defaultPages[0].isIntro ? 1 : 0;
    },

    /** @returns {string} */
    title() {
      return '';
    },

    feedback() {
      return new Feedbacks( this.defaultFeedback.speech, this.defaultFeedback.syllabification );
    },
  },

  methods: {
    // to be implemented
    changePage() { },
    redraw() { },

    /** @returns {OptionGroup} */
    createCommonOptions() {
      return new OptionGroup({
        id: '_common',
        title: this.tokens[ 'hdr_commons' ],
        options: OptionsCreator.createOptions( {
          wordColor: new OptionItem({ 
            type: '#', 
            label: this.tokens[ 'lbl_text_color' ],
          }),
          wordHighlightColor: new OptionItem({ 
            type: '#', 
            label: this.tokens[ 'lbl_hl_color' ],
          }),
          wordRectColor: new OptionItem({ 
            type: '#', 
            label: this.tokens[ 'lbl_frame_color' ],
          }),
          drawWordFrame: new OptionItem({ 
            type: Boolean, 
            label: this.tokens[ 'lbl_draw_frame' ], 
          }),
        }, COMMON_UI ),
        defaults: OptionsCreator.createDefaults( COMMON_UI ),
      });
    },

    /** @param {{index: number}} e */
    setPage( e ) {
      this.pageIndex = e.index;
      this.currentPages = this.data.records.map( record => record.data.pages[ e.index ] );
      this.currentImages = this.currentPages[0].images || [];
      this.changePage();
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
      this.redraw();
    },

    /** @param {Event} e */
    closeOptions( e ) {
      this.isOptionsDisplayed = false;
    },

    /** @param {Event} e */
    restartPlayer( e ) {

    },

    /** @param {Event} e */
    togglePlayer( e ) {

    },

    /** 
     * @param {DataPage} page 
     * @returns {{fixations: any[], words: any[]}} {{fixations: SGWMFixation[], words: SGWMWord[]}}
     * */
    map( page ) {
      return sgwmController.map( page );
    },
  },

  created() {
    this.options["_common"] = this.createCommonOptions();
    this.options["_sgwm"] = sgwmController.createOptions();
  },

  mounted() {
    this.setPage( { index: this.initialPageIndex } );
  },
};
</script>

<style lang="less" scoped>
  @import "../../styles/visualization.less";

  #vis-plot {
    .visualization();

    text-align: center;

    canvas {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 1;
      background-color: rgba(255, 255, 255, 1);
    }

    .below-title {
      position: fixed;
      top: 3.5em;
      right: 4px;
    }

    .audio-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
