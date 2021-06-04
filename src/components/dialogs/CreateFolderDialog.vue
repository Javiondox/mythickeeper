<template>
  <q-btn
    icon="create_new_folder"
    unelevated
    @click="
      cfdialog = true;
      foldername = '';
    "
  >
    <q-dialog v-model="cfdialog">
      <q-card>
        <q-card-section class="flex column items-center">
          <div>
            <q-avatar
              icon="folder"
              :color="DColor"
              :style="ColorPreview"
              text-color="white"
            />
            <span class="q-ml-sm">Crear una carpeta</span>
          </div>
          <div class="q-mx-xl q-mt-md">
            <q-form
              action="https://some-url.com"
              method="post"
              class="q-gutter-md"
            >
              <q-input
                name="firstname"
                filled
                v-model="foldername"
                label="Nombre"
                hint="Nombre que tendrá la carpeta"
                lazy-rules
                :rules="[
                  val => val.length > 0 || 'Por favor introduce algo',
                  val =>
                    val != 'media' ||
                    'No puedes introducir nombres utilizados por el sistema',
                  val =>
                    val != 'mythickeeper.dat' ||
                    'No puedes introducir nombres utilizados por el sistema'
                ]"
                autofocus
                @keyup.enter.native="
                  createFolder();
                  cfdialog = !cfdialog;
                "
              />
              <q-btn-toggle
                v-model="iconimgtoggle"
                spread
                style="border: 1px solid"
                no-caps
                rounded
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                  { label: 'Icono', value: false },
                  { label: 'Imagen', value: true }
                ]"
              />
              <template v-if="iconimgtoggle == false">
                <!--Si icono-->
                <q-color
                  v-model="SelectedColor"
                  default-value="#c62219"
                  style="max-width: 250px"
                  format-model="hex"
                  @change="onColorChange"
                />
              </template>
              <template v-else>
                <!--Si imagen-->
                <q-file
                  filled
                  v-model="SelectedImage"
                  accept=".jpg, image/*"
                  label="Seleccione una imagen"
                  @rejected="onRejected"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                  </template>
                </q-file>
              </template>
              <!--IMPLEMENTAR IMAGEN.-->
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Reiniciar"
            type="reset"
            color="primary"
            class="q-ml-sm"
            v-on:click="resetField"
          />
          <q-btn
            flat
            label="Crear"
            v-on:click="createFolder"
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
import { FolderContent } from 'src/js/Content.ts';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  data() {
    return {
      cfdialog: false,
      foldername: '',
      iconimgtoggle: false,
      DColor: 'primary',
      SelectedColor: '#c62219',
      ColorPreview: 'primary',
      SelectedImage: ''
    };
  },
  methods: {
    createFolder: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      console.log(this.ColorPreview);
      if (mode == '') {
        //Si Electron
        if (this.foldername != '') {
          let endPath =
            UserPrefs.TemporalStorage.getItem('sRealPath') +
            '/' +
            this.foldername;
          if (this.iconimgtoggle == false) {
            //Sin imagen
            fm.createFolder(endPath);
            let newFolder = new FolderContent(
              this.foldername,
              'Folder',
              {},
              this.endPath,
              'folder',
              this.iconimgtoggle,
              this.SelectedColor,
              'Grid'
            );
            fm.writeFile(endPath + '.json', JSON.stringify(newFolder));
            this.reRenderContent();
          } else {
            //Con imagen
            if (SelectedImage != '') {
              //Con imagen seleccionada
              fm.createFolder(endPath);
              let newFolder = new FolderContent(
                this.foldername,
                'Folder',
                {},
                endPath,
                'folder',
                this.iconimgtoggle,
                this.ColorPreview,
                'Grid'
              );
              fm.writeFile(endPath + '.json', JSON.stringify(newFolder));
              this.reRenderContent();
            } else {
              this.$q.notify({
                type: 'negative',
                message: `Seleccione una imagen`
              });
            }
            this.$q.notify({
              type: 'positive',
              message: `Carpeta "${this.foldername}" creada.`
            });
          }
        } else {
          this.$q.notify({
            type: 'negative',
            message: `El nombre no puede estar vacio`
          });
        }
      } else {
        //Si Capacitor
      }
    },
    resetField: function() {
      this.foldername = '';
      this.SelectedColor = '';
      this.SelectedImage = '';
      this.ColorPreview = 'background: #c62219 !important';
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} los archivos no fueron validados.`
      });
    },
    onColorChange(newColor) {
      console.log(newColor);
      this.SelectedColor = newColor;
      this.ColorPreview = `background: ${newColor} !important`;
    },
    reRenderContent: function() {
      EventBus.$emit('reRenderContent');
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
