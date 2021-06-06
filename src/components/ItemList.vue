<template
  ><!--Mover Q-List--->
  <q-list bordered separator>
    <q-item clickable v-ripple v-on:click.self="openSelf()">
      <!--Imagen-->
      <template v-if="Image">
        <q-item-section avatar v-on:click="openSelf()">
          <q-avatar>
            <q-img :src="ImgSrc"></q-img>
          </q-avatar>
        </q-item-section>
      </template>
      <!--Icono-->
      <template v-else>
        <q-item-section avatar v-on:click="openSelf()">
          <q-avatar
            :icon="Icon"
            text-color="white"
            :style="style"
            square
          ></q-avatar>
        </q-item-section>
      </template>
      <q-item-section v-on:click="openSelf()">
        <q-item-label>{{ Name }}</q-item-label>
        <q-item-label caption>{{ TranslatedType }}</q-item-label>
      </q-item-section>
      <q-item-section side class="q-ml-xl">
        <!--Escritorio--->
        <template v-if="!$q.platform.is.mobile">
          <div>
            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              text-color="blue"
              unelevated
              icon="edit"
              size="20px"
              v-if="Type == 'Sheet'"
              @click="editSelf()"
            />
            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              text-color="green"
              unelevated
              icon="badge"
              size="20px"
              @click="renameSelf()"
            />
            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              text-color="secondary"
              unelevated
              icon="settings_suggest"
              size="20px"
              @click="modifySelf()"
            />

            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              text-color="red"
              unelevated
              icon="delete"
              size="20px"
              @click.stop="deleteSelf()"
            />

            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              unelevated
              icon="more_vert"
              size="20px"
            >
              <q-menu anchor="center right" self="center left" @click.stop="">
                <q-list style="min-width: 100px">
                  <q-item
                    v-if="Type == 'Folder'"
                    clickable
                    v-close-popup
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-icon name="get_app" color="orange"></q-icon>
                    </q-item-section>
                    <q-item-section>Importar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-ripple>
                    <q-item-section avatar>
                      <q-icon name="publish" color="purple"></q-icon>
                    </q-item-section>
                    <q-item-section>Exportar</q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </template>
        <!--Movil-->
        <template v-if="$q.platform.is.mobile">
          <div>
            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              text-color="blue"
              unelevated
              icon="edit"
              size="20px"
              v-if="Type == 'Sheet'"
              @click="editSelf()"
            />
            <q-btn
              :ripple="false"
              round
              padding="sm sm"
              class="absolute-top-right"
              text-color="white"
              unelevated
              icon="more_vert"
              size="20px"
            >
              <q-menu anchor="center right" self="center left">
                <q-list bordered style="min-width: 100px">
                  <q-item
                    clickable
                    v-close-popup
                    v-ripple
                    @click="renameSelf()"
                  >
                    <q-item-section avatar>
                      <q-icon name="badge" color="green"></q-icon>
                    </q-item-section>
                    <q-item-section>Renombrar</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-ripple
                    @click="modifySelf()"
                  >
                    <q-item-section avatar>
                      <q-icon
                        name="settings_suggest"
                        color="secondary"
                      ></q-icon>
                    </q-item-section>
                    <q-item-section>Modificar ajustes</q-item-section>
                  </q-item>
                  <q-item
                    v-if="Type == 'Folder'"
                    clickable
                    v-close-popup
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-icon name="get_app" color="orange"></q-icon>
                    </q-item-section>
                    <q-item-section>Importar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-ripple>
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
          </div>
        </template>
      </q-item-section>
    </q-item>
    <ModifyContentDialog
      :oname="Name"
      :oicon="Icon"
      :ocolor="Color"
      :visible="mcdialog"
    ></ModifyContentDialog>
  </q-list>
</template>
<script>
import { qBreadCumbsEl } from 'src/js/Content';
import { EventBus } from 'src/js/vue-bus';
import ModifyContentDialog from 'components/dialogs/ModifyContentDialog';
import { searchStringInArray } from 'src/js/ValidationHelpers';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  name: 'ItemList',
  data: function() {
    return { mcdialog: false };
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
  components: { ModifyContentDialog },
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
        UserPrefs.TemporalStorage.set('sLastView', 'List');
        this.$router.push('/preview');
      }
    },
    modifySelf() {
      this.mcdialog = true;
    },
    enableReEdit() {
      this.mcdialog = false;
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
    },
    TranslatedType: function() {
      if (this.Type == 'Folder') {
        return 'Carpeta';
      } else {
        return 'Hoja';
      }
    }
  },
  created() {
    EventBus.$on('enableReEdit', this.enableReEdit);
  },
  beforeDestroy() {
    EventBus.$off('enableReEdit', this.enableReEdit);
  }
};
</script>
