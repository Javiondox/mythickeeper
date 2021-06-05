<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :style="'background:' + bgColor" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-if="fastButtons != 'editor'"
        />
        <template v-if="titleicon == 'none'">
          <q-toolbar-title>
            {{ title }}
          </q-toolbar-title>
        </template>
        <template v-else>
          <q-toolbar-title>
            <q-btn
              icon="arrow_back"
              @click="goBackFromEditor()"
              class="q-mr-sm q-ml-xl"
              unelevated
              v-if="fastButtons == 'editor'"
            ></q-btn>
            <q-btn
              icon="arrow_back"
              @click="goBackFromPreview()"
              class="q-mr-sm"
              unelevated
              v-if="fastButtons == 'preview'"
            ></q-btn>
            <q-icon :name="titleicon" class="q-pr-sm" />{{ title }}
          </q-toolbar-title>
        </template>

        <!--fastButtons-->
        <div>
          <!--EditMode-->
          <template v-if="fastButtons == 'creation'">
            <CreateFolderDialog />
            <CreateSheetDialog />
          </template>
          <!--PreviewMode-->
          <template v-if="fastButtons == 'preview'">
            <q-btn icon="edit" to="/editor" unelevated></q-btn>
          </template>
          <!--EditorMode-->
          <template v-if="fastButtons == 'editor'">
            <q-btn
              icon="save"
              to="/preview"
              unelevated
              @click="saveFromEditor()"
              :disable="saveButtonDisabled"
            ></q-btn>
          </template>
        </div>
      </q-toolbar>
      <q-toolbar
        inset
        v-if="
          globalBreadCrumbs ||
            fastButtons == 'editor' ||
            fastButtons == 'creation'
        "
      >
        <q-breadcrumbs
          active-color="white"
          style="font-size: 16px"
          v-if="globalBreadCrumbs"
        >
          <q-breadcrumbs-el
            icon="home"
            label="Inicio"
            v-on:click="smartHome()"
          />
          <q-breadcrumbs-el
            v-for="folder in breadfolders"
            v-bind:key="folder.Id"
            icon="folder"
            :label="folder.Name"
            v-on:click="folder.clickEvent"
          />
        </q-breadcrumbs>
        <q-space />
        <div>
          <q-toggle
            v-if="fastButtons == 'creation'"
            :label="viewModel"
            color="white"
            icon-color="dark"
            false-value="Lista"
            true-value="Rejilla"
            checked-icon="grid_view"
            unchecked-icon="view_list"
            v-model="viewModel"
            class="q-pr-md"
          />
        </div>
        <div>
          <q-toggle
            v-if="fastButtons == 'editor' && this.$q.platform.is.mobile"
            :label="mobileModel"
            left-label
            color="white"
            icon-color="dark"
            false-value="Previsualización"
            true-value="Edición"
            checked-icon="visibility_off"
            unchecked-icon="visibility"
            v-model="mobileModel"
            class="q-pr-md"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="300"
      :breakpoint="500"
      content-class=""
      v-if="fastButtons != 'editor'"
    >
      <q-list>
        <!--Inicio-->
        <q-item clickable @click="smartHome()">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
            <q-item-label caption>
              Vuelve al inicio
            </q-item-label>
          </q-item-section>
        </q-item>
        <!--Estado-->
        <q-item clickable @click="SyncStatusInfo()">
          <q-item-section avatar>
            <q-icon name="sync_disabled" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Estado</q-item-label>
            <q-item-label caption>
              (Sincronización) Sin servicio activo
            </q-item-label>
          </q-item-section>
        </q-item>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <transition
        appear
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutRight"
      >
        <q-item-label
          header
          class="text-grey-8"
          style="position: absolute;bottom: 0px;"
        >
          {{ version }}
        </q-item-label>
      </transition>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Version } from 'src/App';
import CreateFolderDialog from 'components/dialogs/CreateFolderDialog.vue';
import CreateSheetDialog from 'components/dialogs/CreateSheetDialog.vue';
import EssentialLink from 'components/EssentialLink.vue';
let UserPrefs = require('src/js/UserPrefs.js');
import { EventBus } from '../js/vue-bus';
import { qBreadCumbsEl } from 'src/js/Content';
import { Notify } from 'quasar';

const linksData = [
  /*{
    title: 'Inicio',
    caption: 'Vuelve al inicio',
    icon: 'home',
    link: '/landing'
  },*/
  /*{ Sustituido por una función más generalista
    title: 'Carpesanos',
    caption: 'Administra tus carpesanos',
    icon: 'public',
    link: '/Error404'
  },
  {
    title: 'Sincronización', //Movido a ajustes
    caption: 'Ajustes de sincronización',
    icon: 'sync_alt',
    link: '/syncsettings'
  },
  {
    title: 'Importar', //Movido a ajustes
    caption: 'Importa contenido',
    icon: 'get_app',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Exportar', //Movido a ajustes
    caption: 'Exporta contenido',
    icon: 'publish',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Estado',
    caption: '(Sincronización) Sin servicio activo',
    icon: 'sync_disabled',
    link: '/editor'
  },*/
  {
    title: 'Ajustes',
    caption: 'Modifica el comportamiento',
    icon: 'settings',
    link: '/settings'
  },
  {
    title: 'Retroalimentación',
    caption: 'Dejanos saber sobre errores o dona',
    icon: 'favorite',
    link: '/feedback'
  },
  {
    title: 'Ayuda',
    caption: 'Ayuda, consejos y recursos útiles',
    icon: 'help',
    link: '/help'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink, CreateFolderDialog, CreateSheetDialog },
  data() {
    return {
      leftDrawerOpen: !this.$q.platform.is.mobile,
      miniState: true,
      essentialLinks: linksData,
      fastButtons: 'none', //Opciones Validas: 'creation', 'preview'
      title: 'MythicKeeper',
      titleicon: 'none',
      bgColor: '#c62219',
      globalBreadCrumbs: false,
      breadfolders: [],
      saveButtonDisabled: true,
      mobilePreview: false,
      mobileModel: 'Edición',
      viewModel: 'Rejilla',
      version: Version
    };
  },
  watch: {
    viewModel: function(newValue) {
      let translation = newValue == 'Rejilla' ? 'Grid' : 'Item';
      let realpath = UserPrefs.TemporalStorage.getItem('sRealPath');
      let rootpath = UserPrefs.get('kMainFolderLocation');
      if (
        translation == 'Grid' &&
        this.$router.currentRoute.name == 'itemExplorer'
      ) {
        this.$router.push('/gridExplorer');
        if (realpath == rootpath) {
          UserPrefs.set('kMainFolderView', 'Grid');
        }
      } else {
        this.$router.push('/itemExplorer');
        if (realpath == rootpath) {
          UserPrefs.set('kMainFolderView', 'List');
        }
      }
    },
    mobileModel: function() {
      EventBus.$emit('changeMobileView');
    }
  },
  methods: {
    goBackFromEditor: function() {
      if (!this.saveButtonDisabled) {
        this.$q
          .dialog({
            title: 'Cambios sin guardar',
            message: `Tienes cambios sin guardar. ¿Estás seguro de que quieres abandonar?`,
            cancel: true
          })
          .onOk(() => {
            EventBus.$emit('changeTitle');
            if (UserPrefs.TemporalStorage.getItem('sLastView') == 'List') {
              this.$router.push('/itemExplorer');
            } else {
              this.$router.push('/gridExplorer');
            }
            EventBus.$emit('reRenderContent');
          });
      } else {
        EventBus.$emit('changeTitle', 'MythicKeeper');
        if (UserPrefs.TemporalStorage.getItem('sLastView') == 'List') {
          this.$router.push('/itemExplorer');
        } else {
          this.$router.push('/gridExplorer');
        }
        EventBus.$emit('reRenderContent');
      }
    },
    goBackFromPreview: function() {
      EventBus.$emit('changeTitle', 'MythicKeeper');
      if (UserPrefs.TemporalStorage.getItem('sLastView') == 'List') {
        this.$router.push('/itemExplorer');
      } else {
        this.$router.push('/gridExplorer');
      }
      EventBus.$emit('reRenderContent');
    },
    saveFromEditor() {
      EventBus.$emit('saveFromEditor');
    },
    setTitleBar(data = 'default', icon = 'none', color = 'none') {
      if (data != 'default') {
        this.title = data;
      } else {
        this.title = 'MythicKeeper';
      }
      if (icon == 'none') {
        this.titleicon = 'none';
      } else {
        this.titleicon = icon;
      }
      if (color == 'none') {
        this.bgColor = '#c62219';
      } else {
        this.bgColor = color;
      }
    },
    setFastButtons(data) {
      this.fastButtons = data;
    },
    setGlobalBreadCrumbs(data) {
      this.globalBreadCrumbs = data;
    },
    setSaveButtonStatus(data) {
      this.saveButtonDisabled = !data;
    },
    smartHome() {
      if (UserPrefs.get('kMainFolderLocation') != '' || undefined) {
        let rootpath = UserPrefs.get('kMainFolderLocation');
        let rootview = UserPrefs.get('kMainFolderView');
        this.breadfolders = [];
        UserPrefs.TemporalStorage.set('sRealPath', rootpath);
        EventBus.$emit('changeTitle', 'default');
        if (rootview == 'Grid') {
          UserPrefs.TemporalStorage.set('sRealPath', rootpath);
          UserPrefs.TemporalStorage.set('sPath', '');
          if (this.$router.currentRoute.name != 'gridExplorer') {
            this.$router.push('/gridExplorer');
          }
          EventBus.$emit('reRenderContent');
        } else {
          UserPrefs.TemporalStorage.set('sRealPath', rootpath);
          UserPrefs.TemporalStorage.set('sPath', '');
          if (this.$router.currentRoute.name != 'listExplorer') {
            this.$router.push('/itemExplorer');
          }
          EventBus.$emit('reRenderContent');
        }
      } else {
        this.$router.push('/landing');
      }
    },
    pushBreadFolder(breadfolder = new qBreadCumbsEl('Error')) {
      const Name = breadfolder.getLabel();
      const Icon = breadfolder.getIcon();
      const assosiatedPath = UserPrefs.TemporalStorage.getItem('sRealPath');
      const folderindex = this.breadfolders.length + 1;
      const clickEvent = () => {
        UserPrefs.TemporalStorage.set('sRealPath', assosiatedPath);
        EventBus.$emit('reRenderContent');
        this.breadfolders.splice(folderindex, this.breadfolders.length);
        EventBus.$emit('changeTitle', 'MythicKeeper', undefined, '#c62219');
      };
      if (this.breadfolders == undefined) {
        this.breadfolders = [{ Name, Icon, clickEvent, folderindex }];
      } else {
        this.breadfolders.push({ Name, Icon, clickEvent, folderindex });
      }
    }
  },
  mounted() {
    this.$q.dark.set(this.$q.localStorage.getItem('kDarkMode'));
  },
  created() {
    EventBus.$on('globalBreadCrumbs', this.setGlobalBreadCrumbs);
    EventBus.$on('fastButtons', this.setFastButtons);
    EventBus.$on('changeTitle', this.setTitleBar);
    EventBus.$on('saveButtonStatus', this.setSaveButtonStatus);
    EventBus.$on('replaceFirstIndexRoute', this.replaceFirstIndexRoute);
    EventBus.$on('pushBread', this.pushBreadFolder);
  },
  beforeDestroy() {
    EventBus.$off('globalBreadCrumbs', this.setGlobalBreadCrumbs);
    EventBus.$off('fastButtons', this.setFastButtons);
    EventBus.$off('changeTitle', this.setTitleBar);
    EventBus.$off('saveButtonStatus', this.setSaveButtonStatus);
    EventBus.$off('replaceFirstIndexRoute', this.replaceFirstIndexRoute);
    EventBus.$off('pushBread', this.pushBreadFolder);
  }
};
</script>
