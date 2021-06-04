<template>
  <q-btn
    icon="note_add"
    unelevated
    @click="
      csdialog = true;
      sheetname = '';
    "
  >
    <q-dialog v-model="csdialog">
      <q-card>
        <q-card-section class="flex column items-center">
          <div>
            <q-avatar
              icon="insert_drive_file"
              :color="DColor"
              :style="ColorPreview"
              text-color="white"
            />
            <span class="q-ml-sm">Crear una hoja</span>
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
                v-model="sheetname"
                label="Nombre"
                hint="Nombre que tendrá la hoja"
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
                  createSheet();
                  csdialog = !csdialog;
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
            v-on:click="createSheet"
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
import { SheetContent } from 'src/js/Content.ts';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  data() {
    return {
      csdialog: false,
      sheetname: '',
      iconimgtoggle: false,
      DColor: 'primary',
      SelectedColor: '#c62219',
      ColorPreview: 'primary',
      SelectedImage: ''
    };
  },
  methods: {
    createSheet: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      console.log(this.ColorPreview);
      if (mode == '') {
        //Si Electron
        if (this.sheetname != '') {
          let endPath =
            UserPrefs.TemporalStorage.getItem('sRealPath') +
            '/' +
            this.sheetname;
          if (this.iconimgtoggle == false) {
            //Sin imagen
            fm.createSheet(endPath);
            let newFile = new SheetContent(
              this.sheetname,
              'Sheet',
              {},
              this.endPath,
              'insert_drive_file',
              this.iconimgtoggle,
              this.SelectedColor
            );
            fm.writeFile(endPath + '.json', JSON.stringify(newFile));
            this.reRenderContent();
          } else {
            //Con imagen
            if (SelectedImage != '') {
              //Con imagen seleccionada
              fm.createSheet(endPath);
              let newFile = new SheetContent(
                this.sheetname,
                'Sheet',
                {},
                endPath,
                'insert_drive_file',
                this.iconimgtoggle,
                this.ColorPreview
              );
              fm.writeFile(endPath + '.json', JSON.stringify(newFile));
              this.reRenderContent();
            } else {
              this.$q.notify({
                type: 'negative',
                message: `Seleccione una imagen`
              });
            }
            this.$q.notify({
              type: 'positive',
              message: `La hoja "${this.sheetname}" creada.`
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
      this.sheetname = '';
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
