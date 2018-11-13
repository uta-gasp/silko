<template lang="pug">
  #task-editor-feedback
    .columns.is-paddingless.is-marginless
      .column.is-paddingless.is-marginless.is-narrow
        feedback-editor(:header="tokens[ 'lbl_speech' ]" v-model="speech" :languages="speechLangs")
          .field
            .field.is-horizontal
              bulma-checkbox(v-model="speechAdjustForWordLength" :label="tokens[ 'lbl_word' ]" :disabled="!speech.language")
        feedback-editor(:header="tokens[ 'lbl_syllab' ]" v-model="syllab" :languages="syllabLangs")
          .field
            .field.is-horizontal
              span.select()
                select(v-model="syllabMode" :disabled="!syllab.language")
                  option(v-for="mode in syllabModes" :value="mode") {{ tokens[ `item_${mode}` ] }}
            .field.is-horizontal
              bulma-checkbox(v-model="syllabTemporary" :label="tokens[ 'lbl_temp' ]" :disabled="!syllab.language")
            .field.is-horizontal
              bulma-checkbox(v-model="syllabAdjustForWordLength" :label="tokens[ 'lbl_word' ]" :disabled="!syllab.language")
        feedback-editor(:header="tokens[ 'lbl_highlight' ]" v-model="highlight")
          .field
            .field.is-horizontal
              bulma-checkbox(v-model="highlightAdjustForWordLength" :label="tokens[ 'lbl_word' ]" :disabled="!highlight.language")
        feedback-editor(:header="tokens[ 'lbl_warning' ]" v-model="warning" :languages="speechLangs")
          .field
            .field.is-horizontal
              .control-line {{ tokens[ 'lbl_phrase' ] }}
              input.input(type="text" v-model="warningPhrase" :disabled="!warning.language")
      .column.is-paddingless.is-marginless
        .columns.is-paddingless.is-marginless
          .column.is-paddingless.is-marginless.is-narrow
            label.label {{ tokens[ 'lbl_exceptions' ] }}
          .column.has-text-right.is-paddingless.is-marginless
            i.instruction {{ tokens[ 'lbl_example' ] }} 
        textarea.textarea.exceptions(:disabled="!syllab.language" :placeholder="tokens[ 'lbl_syllabs' ]" v-model="syllabExceptions")
</template>

<script>
import { i10n } from '@/utils/i10n.js';

import Task from '@/model/task.js';

import Syllabifier from '@/task/syllabifier.js';
import Speaker from '@/task/speaker.js';
import Highlighter from '@/task/highlighter.js';
import WarningActor from '@/task/warningActor.js';

import FeedbackEditor from '@/components/widgets/feedbackEditor.vue';
import BulmaCheckbox from '@/components/widgets/bulmaCheckbox.vue';

// ts-check-only
import { SyllabOptions, SpeechOptions, HighlightOptions, WarningOptions } from '@/model/session/feedbacks.js';

/**
 * @fires input
 */
export default {
  name: 'task-editor-feedback',

  components: {
    'feedback-editor': FeedbackEditor,
    'bulma-checkbox': BulmaCheckbox,
  },

  data() {
    return {
      speech: this.task ? this.task.speech : Task.defaultSpeech,
      speechAdjustForWordLength: this.task ? this.task.speech.threshold.adjustForWordLength : Task.defaultSpeech.threshold.adjustForWordLength,
      speechLangs: Speaker.LANGS,

      syllab: this.task ? this.task.syllab : Task.defaultSyllab,
      syllabExceptions: this.task ? Task.syllabsToText( this.task.syllab.exceptions ) : '',
      syllabMode: this.task ? this.task.syllab.mode : Task.defaultSyllab.mode,
      syllabTemporary: this.task ? this.task.syllab.temporary : Task.defaultSyllab.temporary,
      syllabAdjustForWordLength: this.task ? this.task.syllab.threshold.adjustForWordLength : Task.defaultSyllab.threshold.adjustForWordLength,

      syllabModes: Object.keys( Syllabifier.MODES ),
      syllabLangs: Syllabifier.LANGS,

      highlight: this.task ? this.task.highlight : Task.defaultHighlight,
      highlightColor: this.task ? this.task.highlight.color : Task.defaultHighlight.color,
      highlightAdjustForWordLength: this.task ? this.task.highlight.threshold.adjustForWordLength : Task.defaultHighlight.threshold.adjustForWordLength,

      warning: this.task ? this.task.warning : Task.defaultWarning,
      warningPhrase: this.task ? this.task.warning.phrase : Task.defaultWarning.phrase,

      tokens: i10n( 'task_editor_feedback' ),
    };
  },

  props: {
    task: {
      type: Task,
      default: null,
    },
  },

  computed: {
    /** @returns {{syllab: SyllabOptions, speech: SpeechOptions, syllabExceptions: string, highlight: HighlightOptions, warning: WarningOptions}} */
    model() {
      const result = {
        syllab: this.syllab,
        speech: this.speech,
        syllabExceptions: this.syllabExceptions,
        highlight: this.highlight,
        warning: this.warning,
      };

      result.syllab.mode = this.syllabMode;
      result.syllab.temporary = this.syllabTemporary;
      result.syllab.threshold.adjustForWordLength = this.syllabAdjustForWordLength;
      result.speech.threshold.adjustForWordLength = this.speechAdjustForWordLength;
      
      result.highlight.color = this.highlightColor;
      result.highlight.threshold.adjustForWordLength = this.highlightAdjustForWordLength;

      result.warning.phrase = this.warningPhrase;

      return result;
    },
  },

  watch: {
    speech() { this.$emit( 'input', this.model ); },
    speechAdjustForWordLength() { this.$emit( 'input', this.model ); },
    syllab() { this.$emit( 'input', this.model ); },
    syllabExceptions() { this.$emit( 'input', this.model ); },
    syllabMode() { this.$emit( 'input', this.model ); },
    syllabTemporary() { this.$emit( 'input', this.model ); },
    syllabAdjustForWordLength() { this.$emit( 'input', this.model ); },
    highlight() { this.$emit( 'input', this.model ); },
    highlightColor() { this.$emit( 'input', this.model ); },
    highlightAdjustForWordLength() { this.$emit( 'input', this.model ); },
    warning() { this.$emit( 'input', this.model ); },
    warningPhrase() { this.$emit( 'input', this.model ); },
  },
};
</script>

<style lang="less" scoped>

  .label:not(:last-child) {
    margin-bottom: 0;
  }

  .exceptions {
    min-height: 334px;
  }

  .instruction {
    line-height: 1.75em;
    font-size: 0.9em;
  }

  .control-line {
    display: inline-block;
    margin: 0 0.5em 0 0;
    line-height: 2.25em;
    vertical-align: middle;
    white-space: nowrap;
  }

</style>
