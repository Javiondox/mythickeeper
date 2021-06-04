<template>
  <q-page class="flex flex-center">
    <div class="text-h4" style="width:100%;text-align:center;">
      ¡Bienvenido a MythicKeeper!
    </div>

    <div class="text-h1" style="margin: 0 auto;">{LOGO}</div>

    <div class="text-h6" style="text-align:center;">
      MythicKeeper es una herramienta que permite a escritores anotar
      rápidamente sus ideas independientemente de la plataforma utilizando
      Markdown y servicios de sincronización.
      <!---<div class="q-pa-md row items-start q-gutter-md">
        <CardGrid Type="Folder"></CardGrid>
        <CardGrid
          Name="Paella"
          ImgSrc="https://astelus.com/wp-content/viajes/La-paella-valenciana-y-su-receta-original.jpg"
          Type="Sheet"
          Image
        ></CardGrid>
        <CardGrid
          Name='"Paella"'
          ImgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Paella_de_marisco_01.jpg/1200px-Paella_de_marisco_01.jpg"
          Type="Shit"
          Icon="mood_bad"
          Color="pink"
          Image
        ></CardGrid>
      </div>
      <div class="q-pa-md column items-start q-gutter-md">
        <ItemList Type="Folder" />
        <ItemList
          Name="Paella"
          ImgSrc="https://astelus.com/wp-content/viajes/La-paella-valenciana-y-su-receta-original.jpg"
          Type="Sheet"
          Image
        ></ItemList>
        <ItemList
          Name='"Paella"'
          ImgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Paella_de_marisco_01.jpg/1200px-Paella_de_marisco_01.jpg"
          Type="Shit"
          Icon="mood_bad"
          Color="pink"
          Image="true"
        ></ItemList>
      </div>-->
    </div>
    <div class="flex flex-center q-mx-xl">
      <transition appear enter-active-class="animated heartBeat">
        <CreateOrLoadRootDialog v-model="colrdialog" />
      </transition>
      <q-btn
        class="q-mt-xl"
        color=""
        text-color="primary"
        unelevated
        to="/guide"
        label="Ayuda"
        no-caps
      />
    </div>
    <!--DEBUG-->
    <q-btn
      class="q-mt-xl"
      color=""
      icon="handyman"
      text-color="yellow"
      unelevated
      to="/preview"
      label="PREVIEW"
      no-caps
    />
    <q-btn
      class="q-mt-xl"
      color=""
      icon="handyman"
      text-color="yellow"
      unelevated
      to="/gridExplorer"
      label="GRIDEXPLORER"
      no-caps
    />
  </q-page>
</template>

<script>
import CreateOrLoadRootDialog from '../components/dialogs/CreateOrLoadRootDialog';
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');

export default {
  name: 'PageIndex',
  data() {
    return {
      colrdialog: true
    };
  },
  components: {
    CreateOrLoadRootDialog
  },
  created() {
    if (
      //Si son nuevos,
      UserPrefs.get('kFirstTime') == true &&
      UserPrefs.get('kStarted') == false
    ) {
      this.$router.push('/guide'); //Guia
    } else if (UserPrefs.get('kStarted') == true) {
      //Si ya entraron, habiendo visto el tutorial y crearon/buscaron la carpeta
      UserPrefs.TemporalStorage.set(
        'sRealPath',
        UserPrefs.get('kMainFolderLocation')
      );
      UserPrefs.TemporalStorage.set('sPath', '');
      if (UserPrefs.get('kMainFolderView') == 'Item') {
        this.$router.push('/itemExplorer');
      } else {
        this.$router.push('/gridExplorer');
      }
    }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
  }
};
</script>
