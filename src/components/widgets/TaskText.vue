<template lang="pug">
  #task-text
    .text.median(ref="text" :style="textStyle")
</template>

<script>
export default {
  name: 'task-text',

  data() {
    return {
      textStyle: {
        'color': '#333',
        'font-family': `${this.fontname ? this.fontname : 'Calibri'}, Arial, sans-serif`,
        'font-size': '20pt',
        'font-style': 'normal',
        'font-weight': 'bold',
      },
    };
  },

  props: {
    fontname: {
      type: String,
      default: 'Calibri',
    },
  },
};
</script>

<style lang="less" scoped>

  @margin: 15;  // percentage

  #task-text {
    position: relative;
    height: unit(100 - 2 * @margin, vh);
    margin: unit(@margin, vh) unit(@margin, vw);
    background-color: #fff;
  }

  .text {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    text-align: center;

    &.alignLeft {
      text-align: left;
    }

    &.x-large {
      line-height: (100vh - 2 * unit(@margin, vh)) / 4;
    }
    &.large {
      line-height: (100vh - 2 * unit(@margin, vh)) / 5;
    }
    &.median {
      line-height: (100vh - 2 * unit(@margin, vh)) / 6;
    }
    &.small {
      line-height: (100vh - 2 * unit(@margin, vh)) / 7;
    }
    &.x-small {
      line-height: (100vh - 2 * unit(@margin, vh)) / 8;
    }

    // &:hover .word {
    //   outline: 2px solid #ccf;
    // }
  }
</style>

<style lang="less">

  .line {
    display: block;

    // custom styles to be supported by TextPresenter

    .light {
      color: lighten(#333, 50%) !important;
    }

    .dark {
      color: darken(#333, 25%) !important;
    }
  }

  .currentWord {
    color: #c00;
  }

  .word {
    /* nothing is needed, just the class declaration */
  }

  .hyphens {
    color: #fff;
  }

  .hyphen {
    color: #ffa0a0;
  }

</style>
