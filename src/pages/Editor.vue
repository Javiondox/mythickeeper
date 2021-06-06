<template>
  <q-page style="overflow-y: hidden;">
    <div class="fit absolute-top-left">
      <q-card
        class="full-width flex fixed-above row"
        style="z-index:1"
        @click="saveCursorPositions()"
        v-if="this.$q.platform.is.desktop"
      >
        <q-card-actions>
          <q-btn flat icon="mdi-format-bold" v-on:click="addBold()"></q-btn>
          <q-btn flat icon="mdi-format-italic" v-on:click="addItalic()"></q-btn>
          <q-btn
            flat
            icon="mdi-format-strikethrough-variant"
            v-on:click="addStrike()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-color-highlight"
            v-on:click="addHighlight()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-superscript"
            v-on:click="addSuper()"
          ></q-btn>
          <q-btn flat icon="mdi-format-subscript" v-on:click="addSub()"></q-btn>
          <q-btn flat icon="mdi-format-size">
            <q-menu anchor="top middle" self="bottom middle" class="q-pa-none">
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-6"
                  v-on:click="addTitle(6)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-5"
                  v-on:click="addTitle(5)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-4"
                  v-on:click="addTitle(4)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-3"
                  v-on:click="addTitle(3)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-2"
                  v-on:click="addTitle(2)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-1"
                  v-on:click="addTitle(1)"
                ></q-btn>
              </q-item>
            </q-menu>
          </q-btn>
          <q-btn
            flat
            icon="mdi-format-quote-close"
            v-on:click="addQuote()"
          ></q-btn>
          <!--No funciona en la versión actual debidamente
          <q-btn flat icon="mdi-format-textbox">
            <q-menu anchor="top middle" self="bottom middle" class="q-pa-none">
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-5"
                  v-on:click="addContainer('important')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-4"
                  v-on:click="addContainer('warning')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-lightbulb"
                  v-on:click="addContainer('tip')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-information"
                  v-on:click="addContainer('info')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-form-textarea"
                  v-on:click="addContainer('user')"
                ></q-btn>
              </q-item>
            </q-menu>
          </q-btn>-->
          <q-btn flat icon="mdi-link" v-on:click="addLink()"></q-btn>
          <q-btn flat icon="mdi-minus" v-on:click="addHRule()"></q-btn>
          <q-btn
            flat
            icon="mdi-format-font"
            v-on:click="addPreFormat()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-code-brackets"
            v-on:click="addPreFormatBlock()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-indent-increase"
            v-on:click="addDefList()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-list-bulleted-square"
            v-on:click="addNNList()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-list-numbered"
            v-on:click="addNList()"
          ></q-btn>
          <q-btn flat icon="mdi-image-plus" v-on:click="addExtImg()"></q-btn>
        </q-card-actions>
      </q-card>
      <template v-if="$q.platform.is.desktop">
        <q-splitter v-model="splitterModel" class="q-mb-xl" style="height:80vh">
          <template v-slot:separator>
            <q-avatar
              :color="sheetColor"
              text-color="white"
              size="28px"
              v-bind:icon="splitterIcon"
            />
          </template>

          <template v-slot:before>
            <div class="q-pa-md" style="height:80vh">
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
              <q-scroll-area style="height:76vh">
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
      <q-card
        class="full-width flex fixed-bottom row"
        style="z-index:1"
        @click="saveCursorPositions()"
        v-if="this.$q.platform.is.mobile"
      >
        <q-card-actions>
          <q-btn flat icon="mdi-format-bold" v-on:click="addBold()"></q-btn>
          <q-btn flat icon="mdi-format-italic" v-on:click="addItalic()"></q-btn>
          <q-btn
            flat
            icon="mdi-format-strikethrough-variant"
            v-on:click="addStrike()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-color-highlight"
            v-on:click="addHighlight()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-superscript"
            v-on:click="addSuper()"
          ></q-btn>
          <q-btn flat icon="mdi-format-subscript" v-on:click="addSub()"></q-btn>
          <q-btn flat icon="mdi-format-size">
            <q-menu anchor="top middle" self="bottom middle" class="q-pa-none">
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-6"
                  v-on:click="addTitle(6)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-5"
                  v-on:click="addTitle(5)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-4"
                  v-on:click="addTitle(4)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-3"
                  v-on:click="addTitle(3)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-2"
                  v-on:click="addTitle(2)"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-1"
                  v-on:click="addTitle(1)"
                ></q-btn>
              </q-item>
            </q-menu>
          </q-btn>
          <q-btn
            flat
            icon="mdi-format-quote-close"
            v-on:click="addQuote()"
          ></q-btn>
          <!--No funciona en la versión actual debidamente
          <q-btn flat icon="mdi-format-textbox">
            <q-menu anchor="top middle" self="bottom middle" class="q-pa-none">
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-5"
                  v-on:click="addContainer('important')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-format-header-4"
                  v-on:click="addContainer('warning')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-lightbulb"
                  v-on:click="addContainer('tip')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-information"
                  v-on:click="addContainer('info')"
                ></q-btn>
              </q-item>
              <q-item class="q-pa-none">
                <q-btn
                  flat
                  icon="mdi-form-textarea"
                  v-on:click="addContainer('user')"
                ></q-btn>
              </q-item>
            </q-menu>
          </q-btn>-->
          <q-btn flat icon="mdi-link" v-on:click="addLink()"></q-btn>
          <q-btn flat icon="mdi-minus" v-on:click="addHRule()"></q-btn>
          <q-btn
            flat
            icon="mdi-format-font"
            v-on:click="addPreFormat()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-code-brackets"
            v-on:click="addPreFormatBlock()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-indent-increase"
            v-on:click="addDefList()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-list-bulleted-square"
            v-on:click="addNNList()"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-format-list-numbered"
            v-on:click="addNList()"
          ></q-btn>
          <q-btn flat icon="mdi-image-plus" v-on:click="addExtImg()"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');
let jQuery = require('src/boot/jquery-3.6.0');
export default {
  name: 'PageIndex',
  data() {
    return {
      splitterModel: 45,
      markdown: '',
      markdownPrevious: '',
      mobilePreview: false,
      sheetColor: 'primary',
      cursorStart: 0,
      cursorEnd: 0
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
    },
    saveCursorPositions: async function() {
      this.cursorStart = jQuery('#textEditor').prop('selectionStart');
      this.cursorEnd = jQuery('#textEditor').prop('selectionEnd');

      console.log(this.cursorStart + ' ' + this.cursorEnd);
    },
    addTitle: function(h) {
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = '';
      for (let i = 0; i < h; i++) {
        add += '#';
      }
      add += ' ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addHRule: async function(h) {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = '\n***\n';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addQuote: async function(h) {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = '> ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addBold: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '**';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addItalic: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = ' _';
      let add2 = '_ ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add2, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addStrike: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '~~';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addSuper: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '^';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addSub: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '~';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addHighlight: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '==';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addLink: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '[';
      let add2 = ']';
      this.$q
        .dialog({
          title: 'Añadir enlace',
          message: 'Inserte un enlace a continuación.',
          prompt: {
            model: '',
            isValid: val => val.length > 10 && val.includes('http'),
            label: 'http(s)://...',
            type: 'text'
          },
          cancel: true,
          persistent: false
        })
        .onOk(async data => {
          add2 += '(' + data + ')';
          nmk = [
            mk.slice(0, cs),
            add,
            mk.slice(cs, ce),
            add2,
            mk.slice(ce)
          ].join('');
          this.markdown = nmk;
        });
    },
    addDefList: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = ':   ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addNNList: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = '* ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addNList: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let mk = this.markdown;
      let nmk = '';
      let add = '1. ';

      nmk = [mk.slice(0, cs), add, mk.slice(cs)].join('');
      this.markdown = nmk;
    },
    addPreFormat: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '`';

      nmk = [mk.slice(0, cs), add, mk.slice(cs, ce), add, mk.slice(ce)].join(
        ''
      );
      this.markdown = nmk;
    },
    addPreFormatBlock: async function() {
      await this.saveCursorPositions();
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '```';

      nmk = [
        mk.slice(0, cs),
        add + '\n',
        mk.slice(cs, ce),
        '\n' + add,
        mk.slice(ce)
      ].join('');
      this.markdown = nmk;
    },
    addContainer: function(type) {
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = ':::';
      let add2 = '';
      if (type != 'user') {
        add2 = type;
      } else {
        this.$q
          .dialog({
            title: 'Añadir contenedor',
            message: 'Inserte un titulo al contenedor.',
            prompt: {
              model: '',
              type: 'text'
            },
            cancel: true,
            persistent: false
          })
          .onOk(async data => {
            add2 += ' ' + data + '\n';
            nmk = [
              mk.slice(0, cs),
              add + add2,
              mk.slice(cs, ce) + '\n',
              add,
              mk.slice(ce)
            ].join('');
            this.markdown = nmk;
          });
      }
    },
    addExtImg: function() {
      let cs = this.cursorStart;
      let ce = this.cursorEnd;
      let mk = this.markdown;
      let nmk = '';
      let add = '\n![](';
      let add2 = ' =200x200)\n';
      this.$q
        .dialog({
          title: 'Añadir imagen externa',
          message: 'Inserte una imagen externa',
          prompt: {
            model: '',
            type: 'text',
            isValid: val =>
              val.length > 10 &&
              val.includes('http') &&
              (val.includes('.jpg') ||
                val.includes('.png') ||
                val.includes('.webp') ||
                val.includes('.gif')),
            label: 'http(s)://...'
          },
          cancel: true,
          persistent: false
        })
        .onOk(async data => {
          nmk = [
            mk.slice(0, cs),
            add,
            mk.slice(cs, ce),
            data + add2,
            mk.slice(ce)
          ].join('');
          this.markdown = nmk;
        });
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
