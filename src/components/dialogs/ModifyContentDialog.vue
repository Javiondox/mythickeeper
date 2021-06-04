<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section class="flex column items-center">
        <div>
          <q-avatar
            :icon="dynamicIcon"
            :color="dynamicColor"
            :style="ColorPreview"
            text-color="white"
          />
          <span class="q-ml-sm">Modificar contenido</span>
        </div>
        <div class="q-mx-xl q-mt-md">
          <q-form
            action="https://some-url.com"
            method="post"
            class="q-gutter-md"
          >
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
              <q-input v-model="selectedIcon" label="Icono" clearable>
                <template v-slot:append>
                  <q-icon name="extension" class="cursor-pointer">
                    <q-popup-proxy v-model="showIconPicker">
                      <q-icon-picker
                        v-model="selectedIcon"
                        :filter="selectedIcon"
                        icon-set="mdi-v5"
                        tooltips
                        :pagination.sync="pagination"
                        style="height: 300px; width: 300px; background-color: white;"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          v-close-popup
          v-on:click="enableReEdit()"
        />
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
          label="Modificar"
          v-on:click="modifyContent()"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from 'quasar';
import { Component as QIconPicker } from '@quasar/quasar-ui-qiconpicker';
import { EventBus } from 'src/js/vue-bus';
import { FolderContent } from 'src/js/Content.ts';
let UserPrefs = require('src/js/UserPrefs.js');
export default {
  data() {
    return {
      iconimgtoggle: false,
      SelectedColor: this.ocolor,
      ColorPreview: `background: ${this.ocolor} !important`,
      SelectedImage: '',
      selectedIcon: '',
      showIconPicker: false,
      pagination: {
        itemsPerPage: 35,
        page: 0
      }
    };
  },
  methods: {
    modifyContent: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
      const path = UserPrefs.TemporalStorage.getItem('sRealPath');
      const modifypath = path + '/' + this.oname + '.json';
      if (mode == '') {
        //Si Electron
        console.log(modifypath);
        let data = JSON.parse(await fm.loadFile(modifypath));
        data.icon = this.selectedIcon;
        data.color = this.SelectedColor;
        await fm.writeFile(modifypath, JSON.stringify(data));
        EventBus.$emit('enableReEdit');
        this.reRenderContent();
      } else {
        //Si Capacitor
      }
    },
    resetField: function() {
      this.selectedIcon = this.oicon;
      this.SelectedImage = '';
      this.SelectedColor = this.ocolor;
      this.ColorPreview = `background: ${this.ocolor} !important`;
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
      this.SelectedColor = newColor;
      this.ColorPreview = `background: ${newColor} !important`;
    },
    reRenderContent: function() {
      EventBus.$emit('reRenderContent');
    },
    enableReEdit: function() {
      EventBus.$emit('enableReEdit');
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
    },
    dynamicIcon: function() {
      if (this.selectedIcon == '' || undefined) {
        this.selectedIcon = this.oicon;
        return this.oicon;
      } else {
        return this.selectedIcon;
      }
    },
    dynamicColor: function() {
      if (this.ColorPreview == '' || undefined) {
        this.ColorPreview = `background ${this.ocolor} !important`;
        this.SelectedColor = this.ocolor;
        return this.ocolor;
      } else {
        return this.ColorPreview;
      }
    }
  },
  components: {
    QIconPicker
  },
  props: {
    visible: { Type: Boolean, default: false },
    oicon: { Type: String, default: 'error' },
    ocolor: { Type: String, default: 'primary' },
    oname: { Type: String, default: 'Error' },
    epath: { Type: String }
  }
};
</script>
