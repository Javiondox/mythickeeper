<template>
  <q-card class="my-card" :style="style">
    <q-card-section :horizontal="!$q.platform.is.mobile">
      <q-img v-if="Image" :src="ImgSrc" basic v-on:click.stop="openSelf()">
        <!-- Si tiene imagen --->
        <template v-if="$q.platform.is.mobile">
          <!-- Y es movil -->
          <q-btn
            :ripple="false"
            round
            padding="sm sm"
            class="absolute-top-right q-ma-xs"
            text-color="white"
            unelevated
            icon="more_vert"
            size="20px"
            style="background:rgba(0, 0, 0, 0.47);"
          >
            <q-menu anchor="center right" self="center left">
              <q-list bordered style="min-width: 100px">
                <q-item
                  v-if="Type === 'Sheet'"
                  clickable
                  v-close-popup
                  v-ripple
                  @click="editSelf()"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" color="blue"></q-icon>
                  </q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="renameSelf()">
                  <q-item-section avatar>
                    <q-icon name="badge" color="green"></q-icon>
                  </q-item-section>
                  <q-item-section>Renombrar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="modifySelf()">
                  <q-item-section avatar>
                    <q-icon name="settings_suggest" color="secondary"></q-icon>
                  </q-item-section>
                  <q-item-section>Modificar ajustes</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="exportSelf()">
                  <q-item-section avatar>
                    <q-icon name="publish" color="purple"></q-icon>
                  </q-item-section>
                  <q-item-section>Exportar</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup v-ripple>
                  <q-item-section avatar>
                    <q-icon
                      name="delete"
                      color="red"
                      @click.stop="deleteSelf()"
                    ></q-icon>
                  </q-item-section>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ Name }}
        </div>
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            Cannot load image
          </div>
        </template>
      </q-img>
      <!-- Fin "Si tiene imagen" -->
      <q-avatar
        v-if="!Image"
        :icon="Icon"
        size="200px"
        :color="Color"
        :text-color="getWhiteIfColored"
        style="padding: 0 0; margin:0;"
        square
        v-on:click.stop="openSelf()"
      >
        <!-- Si no tiene imagen --->
        <template v-if="$q.platform.is.mobile">
          <!-- Y es movil -->
          <q-btn
            :ripple="false"
            round
            padding="sm sm"
            class="absolute-top-right"
            :text-color="reverseDarkModeColor"
            unelevated
            icon="more_vert"
            size="20px"
            style="background:rgba(0, 0, 0, 0.47);"
          >
            <q-menu anchor="center right" self="center left">
              <q-list bordered style="min-width: 100px">
                <q-item
                  v-if="Type === 'Sheet'"
                  clickable
                  v-close-popup
                  v-ripple
                  @click="editSelf()"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" color="blue"></q-icon>
                  </q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="renameSelf()">
                  <q-item-section avatar>
                    <q-icon name="badge" color="green"></q-icon>
                  </q-item-section>
                  <q-item-section>Renombrar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="modifySelf()">
                  <q-item-section avatar>
                    <q-icon name="settings_suggest" color="secondary"></q-icon>
                  </q-item-section>
                  <q-item-section>Modificar ajustes</q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-ripple @click="exportSelf()">
                  <q-item-section avatar>
                    <q-icon name="publish" color="purple"></q-icon>
                  </q-item-section>
                  <q-item-section>Exportar</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  v-ripple
                  @click.stop="deleteSelf()"
                >
                  <q-item-section avatar>
                    <q-icon name="delete" color="red"></q-icon>
                  </q-item-section>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <div class="absolute-bottom text-subtitle2 text-center">{{ Name }}</div>
      </q-avatar>
      <template v-if="!$q.platform.is.mobile">
        <!-- Si no es movil --->
        <q-btn
          :ripple="false"
          round
          padding="xs xs"
          class="absolute-top-right q-mr-xl q-mt-xs"
          :text-color="reverseDarkModeColor"
          unelevated
          icon="more_vert"
          size="20px"
          style="background:rgba(0, 0, 0, 0.47);margin-right:55px"
        >
          <q-menu anchor="center right" self="center left">
            <q-list style="min-width: 100px">
              <q-item
                v-if="Type == 'Folder'"
                clickable
                v-close-popup
                v-ripple
                @click="importSelf()"
              >
                <q-item-section avatar>
                  <q-icon name="get_app" color="orange"></q-icon>
                </q-item-section>
                <q-item-section>Importar</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-ripple @click="exportSelf()">
                <q-item-section avatar>
                  <q-icon name="publish" color="purple"></q-icon>
                </q-item-section>
                <q-item-section>Exportar</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-card-actions
          vertical
          class="justify-around q-pa-xs"
          :style="getDarkModeBackground"
        >
          <q-btn
            v-if="Type === 'Sheet'"
            flat
            round
            icon="edit"
            color="blue"
            @click="editSelf()"
          />
          <q-btn flat round icon="badge" color="green" @click="renameSelf()" />
          <q-btn
            flat
            round
            icon="settings_suggest"
            color="secondary"
            @click="modifySelf()"
          />
          <q-separator />
          <q-btn
            flat
            round
            icon="delete"
            color="red"
            @click.stop="deleteSelf()"
          />
        </q-card-actions>
      </template>
    </q-card-section>
    <ModifyContentDialog
      :oname="Name"
      :oicon="Icon"
      :ocolor="Color"
      :visible="mcdialog"
    ></ModifyContentDialog>
  </q-card>
</template>
<script>
import { qBreadCumbsEl } from 'src/js/Content';
import { EventBus } from 'src/js/vue-bus';
import ModifyContentDialog from 'components/dialogs/ModifyContentDialog';
import { searchStringInArray } from 'src/js/ValidationHelpers';
let UserPrefs = require('src/js/UserPrefs.js');

export default {
  name: 'CardGrid',
  data: function() {
    return {
      mcdialog: false
    };
  },
  props: {
    Id: {
      type: String,
      default: 'Error'
    },
    Name: {
      type: String,
      default: 'Error'
    },
    Image: {
      type: Boolean,
      default: false
    },
    Type: {
      type: String,
      default: function() {
        return 'Error';
      },
      validator: function(newValue) {
        if (newValue != 'Folder' || 'Sheet') {
          newValue = 'Error';
        }
        return newValue;
      }
    },
    Icon: {
      type: String,
      default: function() {
        let icon;
        switch (this.Type) {
          case 'Folder':
            icon = 'folder';
            break;
          case 'Sheet':
            icon = 'description';
            break;
          default:
            icon = 'broken_image';
            break;
        }
        return icon;
      }
    },
    Color: {
      type: String
    },
    UsedNames: {
      type: Array,
      default: () => UserPrefs.TemporalStorage.getItem('sCurrentNames')
    }
  },
  components: {
    ModifyContentDialog
  },
  methods: {
    editSelf: function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      if (mode == '') {
        //Si Electron
        UserPrefs.TemporalStorage.set('sEditName', this.Name);
        UserPrefs.TemporalStorage.set(
          'sEditPath',
          UserPrefs.TemporalStorage.getItem('sRealPath') +
            '/' +
            this.Name +
            '.md'
        );
        UserPrefs.TemporalStorage.set('sEditIcon', this.Icon);
        UserPrefs.TemporalStorage.set('sLastSheetColor', this.Color);
        this.$router.push('/editor');
      } else {
        //TODO CAPACITOR
      }
    },
    deleteSelf: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const assosiatedPath =
        UserPrefs.TemporalStorage.getItem('sRealPath') + '/' + this.Name;
      this.$q
        .dialog({
          title: 'Confirmar',
          message: `¿Seguro que desea eliminar el elemento ${this.Name}?`,
          cancel: true
        })
        .onOk(async () => {
          if (mode == '') {
            //Si Electron
            await fm.removeFolder(assosiatedPath);
            EventBus.$emit('reRenderContent');
            this.$q.notify({
              type: 'info',
              message: `"${this.Name}" ha sido borrado.`
            });
          } else {
            //TODO CAPACITOR
          }
        });
    },
    renameSelf: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const assosiatedPath = UserPrefs.TemporalStorage.getItem('sRealPath');
      if (mode == '') {
        //Si Electron
        this.$q
          .dialog({
            title: 'Renombrar',
            message: '¿A que lo quieres renombrar?',
            prompt: {
              model: '',
              isValid: val =>
                val.length > 0 &&
                val != 'media' &&
                val != 'mythickeeper.dat' &&
                !searchStringInArray(val, this.UsedNames),
              type: 'text'
            },
            cancel: true,
            persistent: true
          })
          .onOk(async data => {
            let oldName = this.Name;
            if (this.Type == 'Folder') {
              await fm.renameFolder(
                assosiatedPath + '/' + this.Name,
                assosiatedPath + '/' + data
              );
            } else {
              await fm.renameSheet(
                assosiatedPath + '/' + this.Name,
                assosiatedPath + '/' + data
              );
            }
            EventBus.$emit('reRenderContent');
            this.$q.notify({
              type: 'info',
              message: `"${oldName}" ha sido renombrado a "${data}"`
            });
          });
      } else {
        //TODO CAPACITOR
      }
    },
    openSelf() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      UserPrefs.TemporalStorage.set('sEditName', this.Name);
      UserPrefs.TemporalStorage.set('sEditIcon', this.Icon);
      UserPrefs.TemporalStorage.set('sLastSheetColor', this.Color);
      UserPrefs.TemporalStorage.set('sLastFolderColor', this.Color);
      let realpath = UserPrefs.TemporalStorage.getItem('sRealPath');
      if (this.Type == 'Folder') {
        UserPrefs.TemporalStorage.set('sRealPath', realpath + '/' + this.Name);
        EventBus.$emit('pushBread', new qBreadCumbsEl(this.Name, this.Icon));
        EventBus.$emit('reRenderContent');
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
      } else {
        UserPrefs.TemporalStorage.set(
          'sEditPath',
          realpath + '/' + this.Name + '.md'
        );
        UserPrefs.TemporalStorage.set('sLastView', 'Grid');
        this.$router.push('/preview');
      }
    },
    modifySelf() {
      this.mcdialog = true;
    },
    enableReEdit() {
      this.mcdialog = false;
    },
    exportSelf: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      let thispath;
      if (this.Type == 'Folder') {
        thispath =
          UserPrefs.TemporalStorage.getItem('sRealPath') + '/' + this.Name;
      } else {
        thispath =
          UserPrefs.TemporalStorage.getItem('sRealPath') +
          '/' +
          this.Name +
          '.md';
      }
      if (mode == '') {
        //Si Electron
        const {
          ipcRenderer
        } = /*this.$q.platform.is.mobile //Innecesario tanto rollo?
            ? ''
            :*/ require('electron');
        let DirectoryPath = '';
        let selection = ipcRenderer.sendSync('showDirectoryGetter');
        if (selection.canceled != true) {
          //Si no ha sido cancelado
          DirectoryPath = selection.filePaths[0];
          await fm.copy(thispath, DirectoryPath + '/');
          this.$q.notify({
            type: 'positive',
            message: `Exportación completada.`
          });
        }
      } else {
        //TODO Capacitor
      }
    },
    importSelf: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const thispath =
        UserPrefs.TemporalStorage.getItem('sRealPath') + '/' + this.Name;
      if (mode == '') {
        //Si Electron
        const {
          ipcRenderer
        } = /*this.$q.platform.is.mobile //Innecesario tanto rollo?
            ? ''
            :*/ require('electron');
        let DirectoryPath = '';
        let selection = ipcRenderer.sendSync('showDirectoryGetter');
        if (selection.canceled != true) {
          //Si no ha sido cancelado
          DirectoryPath = selection.filePaths[0];
          await fm.copy(DirectoryPath, thispath);
          this.$q.notify({
            type: 'positive',
            message: `Importación completada.`
          });
        }
      } else {
        //TODO Capacitor
      }
    }
  },
  computed: {
    reverseDarkModeText: function() {
      let color = 'text-black';
      if (this.$q.dark.isActive == true) {
        color = 'text-white';
      }
      return color;
    },
    reverseDarkModeColor: function() {
      let color = 'black';
      if (this.$q.dark.isActive == true || this.Color != undefined) {
        color = 'white';
      }
      return color;
    },
    getDarkModeBackground: function() {
      let color = this.$q.dark.isActive ? '#1D1D1D' : 'white';
      color = `background:${color};`;
      return color;
    },
    getWhiteIfColored: function() {
      let color = '';
      if (this.Color != undefined) {
        color = 'white';
      }
      return color;
    },
    style: function() {
      let style = '';
      if (this.Color != undefined) {
        style = 'background: ' + this.Color + ';';
      }
      return style;
    },
    ImgSrc: function() {
      if (this.Image == true) {
        return require(UserPrefs.get('kMediaFolderLocation') + '/' + this.Id);
      } else {
        return '';
      }
    }
  },
  mounted() {},
  created() {
    EventBus.$on('enableReEdit', this.enableReEdit);
  },
  beforeDestroy() {
    EventBus.$off('enableReEdit', this.enableReEdit);
  }
};
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-height: 210px
  max-width: 250px
</style>
