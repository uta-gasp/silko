<template lang="pug">
  #task-editor
    .field
      .columns

        .column
          p.control
            label.label(v-show="showLabels") Name
            input.input(type="text" placeholder="Name" :disabled="!isNameEditable" v-model="name")
          p.control
            label.label(v-show="showLabels").is-pulled-left Text
            .is-pulled-right.has-text-right
              .text-format-instruction Empty line to separate pages
              .text-format-instruction "\" after a word and "|" after a line to apply a style to them
              .text-format-instruction Styles: "b" - black, "n" - navy, "g" - light-grey
          p.control
            textarea.textarea.text(placeholder="Text" v-model="text")

        .column.is-narrow
          .field
            p.control
              label.label(v-show="showLabels") Introduction
              span.select
                select(v-model="intro")
                  option(value="") none
                  option(v-for="item in intros" :value="item.id") {{ item.name }}
          feedback-editor(header="Speech" :value="speech")
          feedback-editor(header="Syllabification" :value="syllab")
          p.control
            div Exceptions
            i.text-format-instruction Example: kaupunki=kau pun ki
            textarea.textarea(:disabled="!syllab.language" placeholder="Syllabifications" v-model="syllabExceptions")

      p.control
        button.button.is-primary(:disabled="!canSave" @click="save") {{ action }}
        button.button.is-primary.is-pulled-right(@click="preview") Preview

    .fullscreen(ref="fullscreen")
      task-preview(v-if="inPreview" :task="currentTask" @close="closePreview")
</template>

<script>
  import Task from '@/model/task.js';

  import FeedbackEditor from '@/components/widgets/feedbackEditor';
  import TaskPreview from '@/components/widgets/taskPreview';

  export default {
    name: 'task-editor',

    data() {
      return {
        name: this.task ? this.task.name : '',
        text: this.task ? Task.pagesToText( this.task.pages ) : '',
        intro: this.task ? this.task.intro : '',
        syllab: this.task ? this.task.syllab : Task.defaultSyllab,
        speech: this.task ? this.task.speech : Task.defaultSpeech,
        syllabExceptions: this.task ? Task.syllabsToText( this.task.syllab.exceptions ) : '',

        inPreview: false,
      };
    },

    props: {
      action: {
        type: String,
        default: 'Create'
      },
      showLabels: {
        type: Boolean,
        default: false
      },
      task: {
        type: Object,
        default: () => { return {}; }
      },
      intros: {
        type: Array,
        default: () => []
      }
    },

    components: {
      'feedback-editor': FeedbackEditor,
      'task-preview': TaskPreview,
    },

    computed: {

      isNameEditable() {
        return !this.task;
      },

      isNameValid() {
        return this.name.length > 1;
      },

      isTextValid() {
        return this.text.length > 14;
      },

      canSave() {
        return this.isNameValid &&
          this.isTextValid;
      },

      currentTask() {
        let result = new Task();
        result = Object.assign( result, {
          name: this.name.trim(),
          type: 'text',
          pages: Task.textToPages( this.text ),
          syllab: Object.assign( {}, this.syllab ),
          speech: Object.assign( {}, this.speech ),
        });

        result.syllab.exceptions = Task.textToSyllabs( this.syllabExceptions );
        return result;
      }
    },

    methods: {

      preview( e ) {
        this.inPreview = true;
        this.makeFullscreen( this.$refs.fullscreen );
      },

      closePreview( e ) {
        this.inPreview = false;
        this.closeFullscreen();
      },

      save() {
        this.syllab.exceptions = this.syllabExceptions;

        this.$emit( 'save', {
          name: this.name.trim(),
          text: this.text,
          intro: this.intro,
          syllab: this.syllab,
          speech: this.speech,
        });
      },

      makeFullscreen( element ) {
        if(element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      },

      closeFullscreen() {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if(document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      },
    }
  }
</script>

<style lang="less" scoped>

  #task-editor {
    width: 840px;
  }

  select:invalid {
    color: #999;
  }

  select {
    padding-left: 5px;
  }

  option {
    color: #222;
  }

  .label > i {
    display: block;
    font-size: 12px;
    font-weight: 400;
  }

  .text-format-instruction {
    display: block;
    font-size: 12px;
    font-weight: 400;
  }

  .label:not(:last-child) {
    margin-bottom: 0;
  }

  .text {
    min-height: 350px;
    font-size: 15px;
    line-height: 1.25em;
  }

  .fullscreen {
    background-color: #fff;
  }
</style>