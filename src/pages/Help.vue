<template>
  <q-page padding class="flex flex-center">
    <div class="text-h5" style="width:100%;text-align:center;">
      Ayuda
    </div>
    <div style="margin: 0 auto; min-width:80%">
      <q-list bordered class="rounded-borders">
		  <q-expansion-item
          expand-separator
          icon="mdi-notebook"
          label="Editor"
          caption="Ayuda sobre el funcionamiento del editor"
          v-model="expanded1"
        >
        <q-item clickable v-ripple @click.native="toMarkDownGuide()">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="mdi-language-markdown" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
				Guía de Markdown
			  <q-icon class="q-ml-xs" name="link" size="xs"/>
			  </q-item-label>
            <q-item-label caption>Muestra la guía de markdown markdownguide.org</q-item-label>
          </q-item-section>
        </q-item>
		<q-item clickable v-ripple @click.native="toQMarkDownGuide()">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="mdi-file-document-multiple-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
				Documentación del editor
				<q-icon class="q-ml-xs" name="link" size="xs"/>
				</q-item-label>
            <q-item-label caption>Muestra ejemplos de uso de QMarkdown</q-item-label>
          </q-item-section>
        </q-item>
		  </q-expansion-item>
		  <q-item clickable v-ripple to="/guide">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="stroller" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
				Mostrar la guía de inicio
				</q-item-label>
            <q-item-label caption>Mostrar guía de inicio de nuevo</q-item-label>
          </q-item-section>
        </q-item>
		</q-item>
		  </q-expansion-item>
		  <q-item clickable v-ripple @click.native="about()">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
				Acerca de
				</q-item-label>
            <q-item-label caption>Muestra información sobre la aplicación</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar';
import {Version} from 'src/App'
export default {
  data() {
    return {
	expanded1: !this.$q.platform.is.mobile,
      expanded2: !this.$q.platform.is.mobile,
      markdownGuide: 'https://www.markdownguide.org/',
	  qmarkdownGuide: 'https://quasarframework.github.io/quasar-ui-qmarkdown/examples'
    };
  },
  methods: {
    toMarkDownGuide: function() {
      openURL(this.markdownGuide);
    },
	toQMarkDownGuide: function() {
      openURL(this.qmarkdownGuide);
    },
	about() {
		this.$q.dialog({
        title: 'Acerca de',
		html: true,
        message: `<b>${Version}.</b> `+ "Por José Javier Sánchez Piedras.<br><hr>"+
		
		"Una aplicación Quasar utilizando Vue.js, Electron y Cordova.<br> Hecha como proyecto de fin de curso 2019-2021 en IES Serra Perenxisa.<br><br>"+
		
		"Todos los derechos reservados."
		})
	}
  }
};
</script>