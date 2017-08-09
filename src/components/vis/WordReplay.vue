<template lang="pug">
  #word-replay
    vis-title {{ data.title }}
    .list(ref="root")
      table(ref="table")
        thead
          tr
            th
            th(v-for="record in data.records") {{ record.student.name }}

        tbody
          tr(v-for="word in words" :key="word.key")
            td.word {{ word.text }}
            td.duration(v-for="duration in word.durations")

        tfoot
          tr
            td
            td(v-for="track in tracks")
              span(:class="{ hidden: track.pointer }") done

    control-panel(
      :feedback="null"
      :text-length="textLength"
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

  import OptionsCreator from '@/vis/optionsCreator.js';
  import sgwmController from '@/vis/sgwmController.js';
  import WordTrack from '@/vis/wordTrack.js';

  import ControlPanel from '@/components/vis/controlPanel';
  import Options from '@/components/vis/Options';
  import VisTitle from '@/components/vis/VisTitle';

  sgwmController.initializeSettings();

  const UI = {
    levelDuration: 500,
  };

  export default {
    name: 'word-replay',

     components: {
      'control-panel': ControlPanel,
      'options': Options,
      'vis-title': VisTitle,
    },

   data() {
      return {
        pageIndex: 0,
        isOptionsDisplayed: false,
        isPlayerPaused: false,

        defaultText: this.data.records[0].data.pages.map( page => page.text ),

        words: [],
        tracks: null,

        // options representation for editor
        options: {
          wordReplay: {
            id: 'wordReplay',
            title: 'Word replay',
            options: OptionsCreator.createOptions({
              levelDuration: { type: Number, step: 50, label: 'Level duration, ms' },
            }, UI )
          },
          _sgwm: sgwmController.createOptions(),
        },
      };
    },

    props: {
      data: {   // { name, title, records, props }
        type: Object,
        required: true,
      }
    },

    computed: {
      textLength() {
        return this.defaultText.length;
      }
    },

    methods: {
      setPage( e ) {
        if (this.tracks) {
          this.stopAll();
        }

        this.pageIndex = e.index;
        this.makeList();

        Vue.nextTick( () => {
          this.start();
        });
      },

      showOptions( e ) {
        this.isOptionsDisplayed = true;
      },

      close( e ) {
        this.$emit( 'close' );
      },

      applyOptions( e ) {
        sgwmController.save();

        const rows = this.$refs.table.querySelectorAll( 'tr' );
        this.tracks.forEach( track => {
          track.words.forEach( word => {
            this.colorizeCell( rows[ word.id + 1 ].cells[ track.id + 1 ], word.totalDuration );
          });
        });
      },

      closeOptions( e ) {
        this.isOptionsDisplayed = false;
      },

      restartPlayer( e ) {
        this.stopAll();
        this.makeList();

        Vue.nextTick( () => {
          this.start();
        });
      },

      togglePlayer( e ) {
        this.isPlayerPaused = !this.isPlayerPaused;
        this.tracks.forEach( track => track.togglePause() );
      },

      makeList() {
        if (!this.tracks) {
          this.createTracks();
        }

        const hyphenRegExp = new RegExp( `${this.data.props.syllab.hyphen}`, 'g' );

        const words = this.defaultText[ this.pageIndex ].map( word => {
          return {
            text: word.text.replace( hyphenRegExp, ''),
            durations: this.tracks.map( track => 0 ),
            key: Math.random()
          };
        });

        this.words = words;
      },

      createTracks() {
        this.tracks = this.data.records.map( (record, index) => {
          return new WordTrack( this.$refs.root, record.student.name, record.data.pages, index );
        });
      },

      start() {
        this.isPlayerPaused = false;

        const rows = this.$refs.table.querySelectorAll( 'tr' );

        this.tracks.forEach( (track, ti) => {
          const words = track.session[ this.pageIndex ].text;
          const mappingResult = sgwmController.map( track.session[ this.pageIndex ] );

          track.start(
            mappingResult.fixations,
            words,
            this.onWordFixated( track, rows ),
            this.onTrackCompleted( track, rows[ words.length + 1 ] ),
          );
        });

        this.$refs.root.scrollTop = 0;
      },

      stopAll() {
        this.tracks.forEach( track => track.stop() );
      },

      colorizeCell( cell, duration ) {
        const levels = (duration ? 1 : 0) + Math.floor( duration / UI.levelDuration );
        const tone = 255 - 24 * Math.min( 10, levels );
        const rgb = `rgb(${tone},${tone},${tone})`;
        cell.style.backgroundColor = rgb;
      },

      onWordFixated( track, rows ) {
        return (word, duration, pointer) => {
          const rawWord = track.words[ word.id ];
          rawWord.totalDuration = rawWord.totalDuration + duration;

          const cell = rows[ word.id + 1 ].cells[ track.id + 1 ];
          this.colorizeCell( cell, rawWord.totalDuration );

          track.pointer.style = `left: ${cell.offsetLeft + (cell.offsetWidth - track.pointerSize) / 2}px; top: ${cell.offsetTop + (cell.offsetHeight - track.pointerSize) / 2}px`;
        };
      },

      onTrackCompleted( track, row ) {
        return () => {
          // const cell = row.cells[ track.id + 1 ];
          // cell.classList.remove( 'hidden' );
        };
      },
    },

    mounted() {
      console.log('Word replay created');

      this.setPage( { index: 0 } );
    },

    beforeDestroy() {
      this.stopAll();
    },
  };
</script>

<style lang="less" scoped>
  #word-replay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: white;

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