<!--Tendrá la interfaz e incluirá CardGrid o CardList-->
<template>
  <q-page class="flex column content-start" v-if="contents == true">
    <div class="flex column content-start" style="width:100%">
      <div
        v-for="folder in contentfolders"
        v-bind:key="folder.id"
        style="width:100%"
      >
        <transition
          appear
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideOutRight"
        >
          <ItemList
            :Id="folder.id"
            :Name="folder.name"
            :Icon="folder.icon"
            :Color="folder.color"
            :Image="folder.image"
            Type="Folder"
          ></ItemList>
        </transition>
      </div>
    </div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-separator class="q-ma-lg" />
    </transition>
    <div class="flex column content-start" style="width:100%">
      <div
        v-for="sheet in contentsheets"
        v-bind:key="sheet.id"
        style="width:100%"
      >
        <transition
          appear
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideOutRight"
        >
          <ItemList
            :Id="sheet.id"
            :Name="sheet.name"
            :Icon="sheet.icon"
            :Color="sheet.color"
            :Image="sheet.image"
            Type="Sheet"
          ></ItemList>
        </transition>
      </div>
    </div>
  </q-page>
</template>
<script>
import ItemList from '../components/ItemList';
import { EventBus } from '../js/vue-bus';
import { FolderContent } from '../js/Content';
import { rootPath } from 'src/js/GlobalStaticVariables';
let UserPrefs = require('src/js/UserPrefs.js');
UserPrefs.TemporalStorage.set('sLastView', 'List');
export default {
  name: 'ItemListNavegation',
  data: function() {
    return { contents: true, contentfolders: [], contentsheets: [] };
  },
  components: {
    ItemList
  },
  methods: {
    loadContents: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const contentPath = UserPrefs.TemporalStorage.getItem('sRealPath');
      if (mode == '') {
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
      } else {
        //TODO CAPACITOR
      }
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
    if (this.colorPreference == true) {
      if (rootpath != variablepath) {
        EventBus.$emit(
          'changeTitle',
          'MythicKeeper',
          undefined,
          UserPrefs.TemporalStorage.getItem('sLastFolderColor')
        );
      } else {
        EventBus.$emit('changeTitle', 'MythicKeeper');
      }
    } else {
      EventBus.$emit('changeTitle', 'MythicKeeper');
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
