<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import '@quasar/quasar-ui-qiconpicker/dist/icon-set/mdi-v5.umd.js';
export default {
  name: 'App',
  mounted() {
    let UserPrefs = require('src/js/UserPrefs.js');
    UserPrefs.load();
    //https://vuejs.org/v2/guide/computed.html - Debounce para la API de GOOGLE
  }
};

export const Version = 'MythicKeeper 1.0';
</script>
