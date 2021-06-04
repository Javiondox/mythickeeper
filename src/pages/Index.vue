<template>
  <q-page class="flex flex-center">
    <div class="text-h4" style="width:100%;text-align:center;">
      ¡Bienvenido a MythicKeeper!
    </div>

    <div class="text-h1" style="margin: 0 auto;">
		<q-img v-if="isDark" src="~assets/logolightbig.png"></q-img>
		<q-img v-else src="~assets/logodarkbig.png"></q-img>
	</div>

    <div class="text-h6" style="text-align:center;">
      MythicKeeper es una herramienta que permite a escritores anotar
      rápidamente sus ideas independientemente de la plataforma utilizando
      Markdown y servicios de sincronización.
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
  computed: {
	  isDark: function (){
		  if(this.$q.dark.isActive){
			  return true
		  } else {
			  return false
		  }
	  }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
  }
};
</script>
