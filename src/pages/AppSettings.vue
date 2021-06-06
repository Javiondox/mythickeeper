<template>
  <q-page class="flex flex-center">
    <div class="text-h5" style="width:100%;text-align:center;">
      Ajustes de MythicKeeper
    </div>
    <div style="margin: 0 auto; min-width:80%">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Interfaz"
          caption="Ajustes de interfaz"
          v-model="expanded1"
        >
          <q-item>
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="dark_mode" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Modo oscuro</q-item-label>
              <q-item-label caption
                >Activar o desactivar el modo oscuro</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="darkmode" text-color="primary" unelevated />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section top avatar>
              <q-avatar
                color="primary"
                text-color="white"
                icon="format_paint"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Barra dínamica</q-item-label>
              <q-item-label caption
                >Activar o desactivar que el nombre y color de la carpeta/hoja
                actual altere la barra superior</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="dynamictitle"
                text-color="primary"
                unelevated
              />
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="storage"
          label="Datos"
          caption="Importar/Exportar y ajustes relacionados con el manejo de datos"
          v-model="expanded2"
        >
          <q-item clickable v-ripple @click="importDialog()">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="get_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Importar contenido</q-item-label>
              <q-item-label caption
                >Importará todo el contenido de una carpeta sustituyendo
                contenido ya existente</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="exportDialog()">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="publish" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Exportar contenido</q-item-label>
              <q-item-label caption
                >Exportará todo el contenido a una ubicación
                concreta</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            v-if="this.$q.platform.is.desktop"
            @click="searchRootFolder()"
          >
            <q-item-section top avatar>
              <q-avatar
                color="primary"
                text-color="white"
                icon="find_replace"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cambiar espacio de trabajo</q-item-label>
              <q-item-label caption
                >Cambia el espacio de trabajo actual por otro</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="deleteAll()">
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Borrar contenido</q-item-label>
              <q-item-label caption
                >Borrará todo el contenido del espacio de trabajo
                actual</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item clickable v-ripple to="/syncsettings">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="sync_alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Ajustes de sincronización</q-item-label>
            <q-item-label caption
              >Muestra los ajustes de sincronización</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="restoreDefaultSettings()">
          <q-item-section top avatar>
            <q-avatar
              color="primary"
              text-color="white"
              icon="settings_backup_restore"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Restaurar ajustes de fábrica</q-item-label>
            <q-item-label caption
              >Muestra los ajustes de sincronización</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
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
      darkmode: this.$q.localStorage.getItem('kDarkMode'),
      expanded1: !this.$q.platform.is.mobile,
      expanded2: !this.$q.platform.is.mobile,
      dynamictitle: this.$q.localStorage.getItem('kDynamicTitle')
    };
  },
  watch: {
    darkmode: function() {
      this.setDarkMode();
    },
    dynamictitle: function() {
      this.setDynamicTitle();
    }
  },
  methods: {
    setDarkMode: function() {
      this.$q.localStorage.set('kDarkMode', this.darkmode);
      this.$q.dark.set(this.darkmode);
    },
    setDynamicTitle: function() {
      this.$q.localStorage.set('kDynamicTitle', this.dynamictitle);
    },
    searchRootFolder: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      if (mode == '') {
        //Si electron
        const {
          ipcRenderer
        } = /*this.$q.platform.is.mobile //Innecesario tanto rollo?
            ? ''
            :*/ require('electron');
        let DirectoryPath = '';
        let isValid = false;
        let tries = 0;
        let selection;
        while (isValid == false) {
          if (tries > 0) {
            await ipcRenderer.sendSync(
              'showSelectEmptyOnlyMSG',
              'Selecciona una carpeta compatible.'
            );
          }
          selection = ipcRenderer.sendSync('showDirectoryGetter');
          console.log(selection);
          if (selection.canceled != true) {
            //Si no ha sido cancelado
            isValid = await fm.checkIfRootFolder(selection.filePaths[0]);
            DirectoryPath = selection.filePaths[0];
            tries++;
          } else {
            isValid = true; //Unicamente para romper el loop
          }
        }
        if ((DirectoryPath != undefined || '') && selection.canceled != true) {
          fm.setRootFolder(DirectoryPath);
          //Almacenamiento
          UserPrefs.TemporalStorage.set('sRealPath', DirectoryPath);
          UserPrefs.TemporalStorage.set('sPath', '');
          UserPrefs.set('kStarted', true);
          this.$router.push('/gridExplorer'); //Llevar al explorador
        }
      } else {
        //Si capacitor
        //TODO CAPACITOR
      }
    },
    deleteAll() {
      this.$q
        .dialog({
          title: 'Borrar contenido',
          message: `¿Seguro que desea eliminar todo el contenido creado por el usuario? Esta acción eliminará también los ajustes de usuario de forma irreversible.`,
          cancel: true
        })
        .onOk(() => {
          this.$q
            .dialog({
              title: 'Borrar contenido',
              message: `¿Seguro que desea eliminar todo el contenido creado por el usuario? Esta acción eliminará también los ajustes de usuario de forma irreversible. (Doble Confirmación)`,
              cancel: true
            })
            .onOk(() => {
              //TODO DELETE ALL FUCK YEAH
              const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
              const fm = require(`src/js/FileManager${mode}.js`);
              const rootpath = UserPrefs.get('kMainFolderLocation');
              if (mode == '') {
                fm.removeContent(rootpath);
                UserPrefs.DefinitiveStorage.clear();
                UserPrefs.TemporalStorage.clear();
                UserPrefs.resetValuesToDefault();
                this.$q.notify({
                  type: 'positive',
                  message: `Contenido borrado.`
                });
                this.$router.push('/guide');
              } else {
                //TODO CAPACITOR
              }
            });
        });
    },
    restoreDefaultSettings() {
      this.$q
        .dialog({
          title: 'Restaurar ajustes de fábrica',
          message: `¿Seguro que desea restaurar los ajustes de fábrica? (Se perderán todos los ajustes personales y tendrá que volver a buscar su entorno de trabajo)`,
          cancel: true
        })
        .onOk(() => {
          UserPrefs.DefinitiveStorage.clear();
          UserPrefs.TemporalStorage.clear();
          UserPrefs.resetValuesToDefault();
          this.$router.push('/guide');
        });
    },
    async importDialog() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const rootpath = UserPrefs.get('kMainFolderLocation');
      if (mode == '') {
        //Si Electron
        const {
          ipcRenderer
        } = /*this.$q.platform.is.mobile //Innecesario tanto rollo?
            ? ''
            :*/ require('electron');
        let DirectoryPath = '';
        let selection = ipcRenderer.sendSync('showDirectoryGetter');
        console.log(selection);
        if (selection.canceled != true) {
          //Si no ha sido cancelado
          DirectoryPath = selection.filePaths[0];
          await fm.copy(DirectoryPath, rootpath);
          this.$q.notify({
            type: 'positive',
            message: `Importación completada.`
          });
        }
      } else {
        //TODO Capacitor
      }
    },
    async exportDialog() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const rootpath = UserPrefs.get('kMainFolderLocation');
      if (mode == '') {
        //Si Electron
        const {
          ipcRenderer
        } = /*this.$q.platform.is.mobile //Innecesario tanto rollo?
            ? ''
            :*/ require('electron');
        let DirectoryPath = '';
        let selection = ipcRenderer.sendSync('showDirectoryGetter');
        console.log(selection);
        if (selection.canceled != true) {
          //Si no ha sido cancelado
          DirectoryPath = selection.filePaths[0];
          await fm.copy(rootpath, DirectoryPath);
          this.$q.notify({
            type: 'positive',
            message: `Exportación completada.`
          });
        }
      } else {
        //TODO Capacitor
      }
    },
    SyncStatusInfo() {}
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
    EventBus.$emit('changeTitle', 'Ajustes');
  }
};
</script>
