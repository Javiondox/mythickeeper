<template>
  <q-page class="flex flex-center">

	<q-img class="q-mx-lg q-my-xl" v-if="isDark" src="~assets/logodarkbig.png"></q-img>
	<q-img class="q-mx-lg q-my-xl" v-else src="~assets/logolightbig.png"></q-img>

    <div class="flex flex-center q-mx-xl row">
	<q-btn-group spread class="q-mt-xl">
    	<CreateOrLoadRootDialog v-model="colrdialog" />
			<q-btn
				color="primary"
				text-color="white"
				unelevated
				to="/settings"
				label="Opciones"
				no-caps
			/>
			<q-btn
				color="primary"
				text-color="white"
				unelevated
				to="/guide"
				label="Ayuda"
				no-caps
			/>
				</q-btn-group>
    </div>
    <!--DEBUG-->
	<q-btn-group spread>
    <q-btn
      color=""
      icon="handyman"
      text-color="yellow"
      unelevated
      to="/preview"
      label="PREVIEW"
      no-caps
    />
    <q-btn
      color=""
      icon="handyman"
      text-color="yellow"
      unelevated
      to="/gridExplorer"
      label="GRIDEXPLORER"
      no-caps
    />
	</q-btn-group>
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
