<template lang="pug">
  #feedback-editor
    p.control
      label.label {{ header }}
      .field.is-horizontal
        .select(v-if="languages")
          select(v-model="language")
            option(value="" selected) {{ tokens[ 'item_none' ] }}
            option(v-for="lang in languages" :value="lang") {{ lang }}
        bulma-checkbox(v-else v-model="enabled" :label="tokens[ 'lbl_enabled' ]")
        slot(name="first")
      .field.is-horizontal
        .select
          select(v-model="thresholdIsSmart" :disabled="!isEnabled")
            option(:value="false") {{ tokens[ 'item_fixed' ] }}
            option(:value="true") {{ tokens[ 'item_calib' ] }}
        template(v-if="thresholdIsSmart")
          input.input(type="number" step="100" v-model.number="thresholdMin" :disabled="!canEditCalibThresholdParams" min="1000" :max="thresholdMax")
          .control-line -
          input.input(type="number" step="100" v-model.number="thresholdMax" :disabled="!canEditCalibThresholdParams" max="5000" :min="thresholdMin")
          .control-line ms
        template(v-else)
          input.input(type="number" step="100" v-model.number="thresholdValue" :disabled="!isEnabled")
          .control-line ms
        slot(name="second")
      .field.is-horizontal
        slot
</template>

<script>
import { i10n } from '@/utils/i10n.js';
import DataUtils from '@/utils/data-utils.js';

import BulmaCheckbox from '@/components/widgets/bulmaCheckbox.vue';

/**
 * @fires input
 */
export default {
  name: 'feedback-editor',

  components: {
    'bulma-checkbox': BulmaCheckbox,
  },

  data() {
    return {
      language: DataUtils.convertLegacy( this.value.language ),
      /** @type {boolean} */
      enabled: !!this.value.language,
      /** @type {boolean} */
      thresholdIsSmart: this.value.threshold.smart,
      /** @type {number} */
      thresholdMin: this.value.threshold.min,
      /** @type {number} */
      thresholdMax: this.value.threshold.max,
      /** @type {number} */
      thresholdValue: this.value.threshold.value,

      tokens: i10n( 'task_editor_feedback' ),
    };
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
      required: false,
    },
  },

  computed: {
    /** @returns {boolean} */
    canEditCalibThresholdParams() {
      return this.isEnabled && !!this.thresholdIsSmart;
    },

    /** @returns {boolean} */
    isEnabled() {
      return this.languages ? !!this.language : this.enabled;
    },

    /** @returns {{language: string, threshold: {smart: boolean, min: number, max: number, value: number}}} */
    model() {
      return {
        language: this.languages ? this.language : (this.enabled ? 'any' : ''),
        threshold: {
          smart: this.thresholdIsSmart,
          min: this.thresholdMin,
          max: this.thresholdMax,
          value: this.thresholdValue,
        },
      };
    },
  },

  watch: {
    language() { this.$emit( 'input', this.model ); },
    enabled() { this.$emit( 'input', this.model ); },
    thresholdIsSmart() { this.$emit( 'input', this.model ); },
    thresholdMin() { this.$emit( 'input', this.model ); },
    thresholdMax() { this.$emit( 'input', this.model ); },
    thresholdValue() { this.$emit( 'input', this.model ); },
  },
};

</script>

<style lang="less" scoped>
  #feedback-editor {
    font-size: 1rem;
  }

  .control {
    margin-top: 0;
  }

  .control-line {
    display: inline-block;
    margin: 0 0.2em;
    line-height: 2.25em;
    vertical-align: middle;
    white-space: nowrap;
  }

  input[type="number"] {
    width: 5em;
  }

  .field {
    margin-bottom: 3px;
  }

  input,
  select {
    margin-right: 4px;
  }
</style>
