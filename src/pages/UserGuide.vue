<template>
  <q-page class="flex flex-center column">
    <template v-if="this.$q.platform.is.mobile">
      <q-img
        class="q-mx-lg q-mt-xl"
        style="width:90%"
        v-if="isDark"
        src="~assets/logodarkbig.png"
      ></q-img>
      <q-img
        class="q-mx-lg q-mt-xl"
        style="width:90%"
        v-else
        src="~assets/logolightbig.png"
      ></q-img
    ></template>
    <template v-else>
      <q-img
        class="q-mx-lg q-mt-xl"
        style="width:40%"
        v-if="isDark"
        src="~assets/logodarkbig.png"
      ></q-img>
      <q-img
        class="q-mx-lg q-mt-xl"
        style="width:40%"
        v-else
        src="~assets/logolightbig.png"
      ></q-img
    ></template>
    <p class="text-center text-h4 q-mt-xs q-mb-lg">Guía de Usuario</p>
	<div class="center" style="width:70%">
    <q-markdown
      :src="markdown"
	  class="text-justify"
    ></q-markdown>
	</div>
  </q-page>
</template>

<script>
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');

export default {
  name: 'userGuide',
  data() {
    return { markdown: ''  };
  },
  computed: {
    isDark: function() {
      if (this.$q.dark.isActive) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods:{ 
	  loadContents: async function() {
      const mode = this.$q.platform.is.mobile ? 'Mobile' : '';
      const fm = require(`src/js/FileManager${mode}.js`);
	  if(mode == ''){
		  this.markdown = await fm.loadFile("src/assets/userguide.md");
	  }
	}
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
    EventBus.$emit('changeTitle', 'Guía de usuario');
	this.loadContents();
  }
};
</script>
