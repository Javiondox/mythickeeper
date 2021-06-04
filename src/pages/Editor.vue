<template>
  <q-page>
    <div class="fit absolute-top-left">
      <template v-if="$q.platform.is.desktop">
        <q-splitter v-model="splitterModel" class="q-mb-xl" style="height:85vh">
          <template v-slot:separator>
            <q-avatar
              :color="sheetColor"
              text-color="white"
              size="28px"
              v-bind:icon="splitterIcon"
            />
          </template>

          <template v-slot:before>
            <div class="q-pa-md" style="height:85vh">
              <textarea
                id="textEditor"
                v-model="markdown"
                rows="20"
                :class="{ 'text-white bg-dark': $q.dark.isActive }"
                class="fit q-pa-sm"
                style="height:100%"
              />
            </div>
          </template>

          <template v-slot:after>
            <div class="q-pa-md">
              <q-scroll-area style="height:81vh">
                <q-markdown
                  :src="markdown"
                  :no-line-numbers="true"
                  :no-heading-anchor-links="true"
                  class="fit bordered q-pa-sm"
                >
                </q-markdown>
              </q-scroll-area>
            </div>
          </template>
        </q-splitter>
      </template>
      <template v-else
        ><div class="q-pa-md" style="height:92%">
          <template v-if="!mobilePreview">
            <textarea
              id="textEditor"
              v-model="markdown"
              rows="20"
              :class="{ 'text-white bg-dark': $q.dark.isActive }"
              class="fit q-pa-sm"
          /></template>
          <template v-else
            ><q-markdown
              :src="markdown"
              :no-line-numbers="true"
              :no-heading-anchor-links="true"
              class="fit bordered q-pa-sm"
            >
            </q-markdown
          ></template></div
      ></template>
      <q-card class="full-width flex fixed-bottom row" style="z-index:1">
        <q-card-actions>
          <q-btn flat icon="mdi-format-title">
            <q-menu anchor="top middle" self="bottom middle" class="q-pa-none">
              <!-- cursorPosition = $('#myTextarea').prop("selectionStart"); -->
              <q-item class="q-pa-none">
                <q-btn flat icon="####"></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn flat icon="###"></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn flat icon="##"></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn flat icon="#"></q-btn>
              </q-item>
            </q-menu>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  name: 'PageIndex',
  data() {
    return {
      splitterModel: 45,
      markdown: '',
      markdownPrevious: '',
      mobilePreview: false,
      sheetColor: 'primary'
    };
  },
  computed: {
    splitterIcon: function() {
      let icon = '';
      if (this.$q.platform.is.mobile == true) {
        icon = 'drag_indicator';
      } else {
        icon = 'swap_horiz';
      }
      return icon;
    }
  },
  methods: {
    loadContents: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      let editpath = UserPrefs.TemporalStorage.getItem('sEditPath');
      if (mode == '') {
        //Si Electron
        this.markdown = await fm.loadFile(editpath);
        this.markdownPrevious = this.markdown; //Se usará para comprobar edits
      } else {
        //TODO CAPACITOR
      }
    },
    saveChanges: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      let editname = UserPrefs.TemporalStorage.getItem('sEditName');
      let editpath = UserPrefs.TemporalStorage.getItem('sEditPath');
      if (mode == '') {
        //Si Electron
        await fm.writeFile(editpath, this.markdown);
        this.$q.notify({
          type: 'positive',
          message: `"${editname}" ha sido guardado.`
        });
      } else {
        //TODO CAPACITOR
      }
    },
    saveFromEditor: function() {
      this.saveChanges();
    },
    changeMobileView: function() {
      this.mobilePreview = !this.mobilePreview;
    }
  },
  watch: {
    markdown: function(newMarkdown) {
      if (newMarkdown != this.markdownPrevious) {
        EventBus.$emit('saveButtonStatus', true);
      } else {
        EventBus.$emit('saveButtonStatus', false);
      }
    }
  },
  mounted() {
    this.loadContents();
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'editor');
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
    //Color del splitter
    let color = UserPrefs.TemporalStorage.getItem('sLastSheetColor');
    console.log(color);
    if (color == '' || color == undefined) {
      this.sheetColor = 'primary';
    } else {
      this.sheetColor = 'dark';
    }
  },
  created() {
    EventBus.$on('saveFromEditor', this.saveFromEditor);
    EventBus.$on('changeMobileView', this.changeMobileView);
  },
  beforeDestroy() {
    EventBus.$off('saveFromEditor', this.saveFromEditor);
    EventBus.$off('changeMobileView', this.changeMobileView);
  }
};
</script>
