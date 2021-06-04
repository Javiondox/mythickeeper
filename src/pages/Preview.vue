<template
  ><q-page
    class="row q-pa-sm q-pt-md"
    style="padding-bottom:0px"
    :style="style2"
  >
    <div class="col-1 col-md-2 col-lg-3 print-hide"></div>
    <transition
      appear
      enter-active-class="animated backInUp"
      leave-active-class="animated backOutDown"
    >
      <div
        class="col-10 col-md-8 col-lg-6 shadow-5 q-px-md q-pt-lg"
        :style="style + ';user-select: text'"
      >
        <p
          class="text-h3 text-center q-mb-lg"
          style="text-decoration:underline"
        >
          {{ title }}
        </p>
        <q-markdown
          class="text-justify"
          :src="markdown"
          :no-line-numbers="true"
          :no-heading-anchor-links="true"
        ></q-markdown>
      </div>
    </transition>
    <div class="col-1 col-md-2 col-lg-3 print-hide"></div>
  </q-page>
</template>
<script>
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  name: 'CardGridNavegation',
  data: function() {
    return {
      title: `Error`,
      markdown: `Error`
    };
  },
  methods: {
    loadContent: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      this.title = UserPrefs.TemporalStorage.getItem('sEditName');
      let editpath = UserPrefs.TemporalStorage.getItem('sEditPath');
      if (mode == '') {
        //Si Electron
        this.markdown = await fm.loadFile(editpath);
      } else {
        //TODO CAPACITOR
      }
    }
  },
  computed: {
    style: function() {
      let finalstyle = '';
      if (this.$q.dark.isActive) {
        finalstyle = 'background:#252525;';
      } else {
        finalstyle = 'background:white;';
      }
      return finalstyle;
    },
    style2: function() {
      let finalstyle = '';
      if (!this.$q.dark.isActive) {
        finalstyle = 'background: #cacaca;';
      }
      return finalstyle;
    }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'preview');
    //Titulo dinamico
    if (UserPrefs.get('kDynamicTitle')) {
      EventBus.$emit(
        'changeTitle',
        UserPrefs.TemporalStorage.getItem('sEditName'),
        UserPrefs.TemporalStorage.getItem('sEditIcon'),
        UserPrefs.TemporalStorage.getItem('sLastSheetColor')
      );
    } else {
      EventBus.$emit(
        'changeTitle',
        'default',
        UserPrefs.TemporalStorage.getItem('sEditIcon')
      );
    }
    this.loadContent();
  }
};
</script>
