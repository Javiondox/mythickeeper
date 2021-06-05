<!--Tendrá la interfaz e incluirá CardGrid o CardList-->
<template>
  <q-page class="flex column content-start" v-if="contents == true">
    <div class="flex row content-start">
      <div v-for="folder in contentfolders" v-bind:key="folder.id">
        <transition
          appear
          enter-active-class="animated backInLeft"
          leave-active-class="animated backOutRight"
        >
          <CardGrid
            :Id="folder.id"
            :Name="folder.name"
            :Icon="folder.icon"
            :Color="folder.color"
            :Image="folder.image"
            Type="Folder"
            class="q-ma-sm"
          ></CardGrid>
        </transition>
      </div>
    </div>
      <q-separator
	  v-if="contentfolders.length > 0"
        class="q-ma-lg"
        style="display:in-line-block;min-width:96%"
      />
    <div class="flex row content-start">
      <div v-for="sheet in contentsheets" v-bind:key="sheet.id">
        <transition
          appear
          enter-active-class="animated backInLeft"
          leave-active-class="animated backOutRight"
        >
          <CardGrid
            :Id="sheet.id"
            :Name="sheet.name"
            :Icon="sheet.icon"
            :Color="sheet.color"
            :Image="sheet.image"
            Type="Sheet"
            class="q-ma-sm"
          ></CardGrid>
        </transition>
      </div>
    </div>
	<transition
	appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
	  >
	<div class="q-mt-lg" v-if="isEmpty"><p class="text-center text-h3">Vacío...</p><p class="text-center text-h5">¡Prueba a crear algunos elementos!</p></div>
  </transition>
  </q-page>
  <q-page v-else>
    <div class="q-ma-auto col-md-4 absolute-center">
      <p class="text-h3" style="text-align:center;">
        Vacío.
      </p>
      <p class="text-h5">
        Añade contenido pulsando <q-icon name="create_new_folder"></q-icon>.
      </p>
    </div>
  </q-page>
</template>
<script>
import CardGrid from '../components/CardGrid';
import { EventBus } from '../js/vue-bus';
import { FolderContent } from '../js/Content';
import { rootPath } from 'src/js/GlobalStaticVariables';
let UserPrefs = require('src/js/UserPrefs.js');
UserPrefs.TemporalStorage.set('sLastView', 'Grid');
export default {
  name: 'CardGridNavegation',
  data: function() {
    return {
      contents: true,
      contentfolders: [],
      contentsheets: [],
	  isEmpty: false
    };
  },
  components: {
    CardGrid
  },
  props: {},
  methods: {
    loadContents: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const contentPath = UserPrefs.TemporalStorage.getItem('sRealPath');
      //if (mode == '') {
        //Si Electron
        //CARPETAS
        let contentJSONsArray = Array.from(
          await fm.getValidFolders(contentPath)
        );
        let tempData = [];
        for (let i = 0; i < contentJSONsArray[0].length; i++) {
          let contentdata = await fm.loadFile(
            contentPath + '/' + contentJSONsArray[0][i]
          );
          if (tempData.length == 0) {
            tempData = [JSON.parse(contentdata)];
          } else {
            tempData.push(JSON.parse(contentdata));
          }
        }
        this.contentfolders = tempData;
        //ARCHIVOS
        contentJSONsArray = Array.from(await fm.getValidSheets(contentPath));
        tempData = [];
        for (let i = 0; i < contentJSONsArray[0].length; i++) {
          let contentdata = await fm.loadFile(
            contentPath + '/' + contentJSONsArray[0][i]
          );
          if (tempData.length == 0) {
            tempData = [JSON.parse(contentdata)];
          } else {
            tempData.push(JSON.parse(contentdata));
          }
        }
        this.contentsheets = tempData;

		if(this.contentfolders.length + this.contentsheets.length == 0){
			this.isEmpty = true;
		}
      //} else {
        //TODO CAPACITOR
      //}
    },
    async update() {
      await this.loadContents();
      this.$forceUpdate();
    },
    routeFixer() {}
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', true);
    EventBus.$emit('fastButtons', 'creation');
    let rootpath = UserPrefs.get('kMainFolderLocation');
    let variablepath = UserPrefs.TemporalStorage.getItem('sRealPath');
    let colorPreference = UserPrefs.get('kDynamicTitle');
    if (colorPreference == true) {
      if (rootpath != variablepath) {
        EventBus.$emit(
          'changeTitle',
          'MythicKeeper',
          undefined,
          UserPrefs.TemporalStorage.getItem('sLastFolderColor')
        );
      } else {
        EventBus.$emit('changeTitle');
      }
    } else {
      EventBus.$emit('changeTitle');
    }
    this.loadContents();
  },
  created() {
    EventBus.$on('reRenderContent', this.update);
  },
  beforeDestroy() {
    EventBus.$off('reRenderContent', this.update);
  }
};
</script>
