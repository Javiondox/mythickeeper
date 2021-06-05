<template>
  <q-btn
    label="Empezar"
    color="primary"
    text-color="white"
    unelevated
    @click="colrdialog = true"
    no-caps
  >
    <q-dialog v-model="colrdialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="travel_explore" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ message }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
            @click="closeSelf()"
          />
          <q-btn
            flat
            label="Buscar"
            v-if="this.$q.platform.is.desktop"
            v-on:click="searchRootFolder"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            label="Crear"
            v-on:click="createRootFolder"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
import { Notify } from 'quasar';
import { EventBus } from 'src/js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  data() {
    return {
      colrdialog: false
    };
  },
  methods: {
    //Función de creación de carpetas
    createRootFolder: async function() {
      if (UserPrefs.get('kMainFolderLocation') == '') {
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
          let isEmptyDirectory = false;
          let tries = 0;
          while (isEmptyDirectory == false) {
            if (tries > 0) {
              await ipcRenderer.sendSync(
                'showSelectEmptyOnlyMSG',
                'Selecciona una carpeta vacía.'
              );
            }
            let selection = ipcRenderer.sendSync('showDirectoryGetter');
            console.log(selection);
            isEmptyDirectory = await fm.checkIfEmpty(selection.filePaths[0]);
            DirectoryPath = selection.filePaths[0];
            tries++;
          }
          fm.createRootFolder(DirectoryPath);
          //Almacenamiento
          UserPrefs.TemporalStorage.set('sRealPath', DirectoryPath);
          UserPrefs.TemporalStorage.set('sPath', '');
          UserPrefs.set('kMainFolderLocation', DirectoryPath);
          UserPrefs.set('kStarted', true);
          this.$router.push('/gridExplorer'); //Llevar al explorador
          EventBus.$emit('replaceFirstIndexRoute', this.replaceFirstIndexRoute);
        } else {
          //Si Cordova
          let DirectoryPath =
            cordova.file.externalRootDirectory + 'MythicKeeper/';
          console.log(DirectoryPath);
          fm.writeFile('test.txt', 'CACA');
          //fm.createFolder(DirectoryPath);
          /*DirectoryPath = fm.getDocumentsURI(DirectoryPath);
          console.log(DirectoryPath);
          UserPrefs.TemporalStorage.set('sRealPath', DirectoryPath);
          UserPrefs.TemporalStorage.set('sPath', '');
          UserPrefs.set('kMainFolderLocation', DirectoryPath);
          UserPrefs.set('kStarted', true);
          this.$router.push('/gridExplorer'); //Llevar al explorador
          EventBus.$emit('replaceFirstIndexRoute', this.replaceFirstIndexRoute);*/
        }
      } else {
        //Si ya existe la carpeta, llevarlo a la vista, por si acaso
        if (UserPrefs.get('kMainFolderView') == 'Item') {
          this.$router.push('/itemExplorer');
        } else {
          this.$router.push('/gridExplorer');
        }
      }
      /*fm.setCurrentPath('/');
      fm.writeFile('/' + 'yeet.txt', 'test');
      console.log(fm.getCurrentPath);*/
    },
    searchRootFolder: async function() {
      if (UserPrefs.get('kMainFolderLocation') == '') {
        const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
        const fm = require(`src/js/FileManager${mode}.js`);
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
        //Si ya existe la carpeta, llevarlo a la vista, por si acaso
        if (UserPrefs.get('kMainFolderView') == 'Item') {
          this.$router.push('/itemExplorer');
        } else {
          this.$router.push('/gridExplorer');
        }
      }
    },
    closeSelf() {
      this.colrdialog = false;
    }
  },
  computed: {
    isdesktop: function() {
      return !this.$q.platform.is.mobile;
    },
    message: function() {
      let msg = '';
      if (!this.$q.platform.is.mobile) {
        msg =
          'No se ha podido encontrar ningun entorno de trabajo. ¿Desea buscar alguno o crear uno nuevo?';
      } else {
        msg =
          'No se ha podido encontrar la carpeta MythicKeeper en Documentos. ¿Desea crearla?';
      }
      return msg;
    }
  }
};
</script>
