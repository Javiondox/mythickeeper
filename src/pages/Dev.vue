<template>
  <q-page class="flex flex-center column">
    <template v-if="this.$q.platform.is.mobile">
      <q-img
        class="q-mx-lg q-my-xl"
        style="width:90%"
        v-if="isDark"
        src="~assets/logodarkbig.png"
      ></q-img>
      <q-img
        class="q-mx-lg q-my-xl"
        style="width:90%"
        v-else
        src="~assets/logolightbig.png"
      ></q-img
    ></template>
    <template v-else>
      <q-img
        class="q-mx-lg q-my-xl"
        style="width:40%"
        v-if="isDark"
        src="~assets/logodarkbig.png"
      ></q-img>
      <q-img
        class="q-mx-lg q-my-xl"
        style="width:40%"
        v-else
        src="~assets/logolightbig.png"
      ></q-img
    ></template>
    <div v-if="this.$q.platform.is.mobile" class="q-my-xl"></div>
    <div v-if="this.$q.platform.is.mobile" class="q-my-xl"></div>
    <q-btn-group spread>
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/landing"
        label="LANDING"
        no-caps
      />
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/preview"
        label="PREVIEW"
        no-caps
      />
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/editor"
        label="EDITOR"
        no-caps
      />
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/gridExplorer"
        label="GRIDEXPLORER"
        no-caps
      />
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/listExplorer"
        label="LISTEXPLORER"
        no-caps
      />
      <q-btn
        color="secondary"
        icon="handyman"
        unelevated
        to="/Error404"
        label="ERROR 404"
        no-caps
      />
    </q-btn-group>
    <div class="flex row q-mt-sm text-center">
      <div>
        <p>LocalStorage</p>
        <textarea style="width:550px;height:400px">
        {{ DStorage }}
      </textarea
        >
      </div>
      <div>
        <p>SessionStorage</p>
        <textarea style="width:550px;height:400px">
        {{ TStorage }}
      </textarea
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import CreateOrLoadRootDialog from '../components/dialogs/CreateOrLoadRootDialog';
import { EventBus } from '../js/vue-bus';
let UserPrefs = require('src/js/UserPrefs.js');

export default {
  name: 'dev',
  data() {
    return {
      colrdialog: true,
      DStorage: '',
      TStorage: ''
    };
  },
  components: {
    CreateOrLoadRootDialog
  },
  created() {},
  computed: {
    isDark: function() {
      if (this.$q.dark.isActive) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    combineKeyWithValue(item, index) {
      if (item.charAt(0) == 'k') {
        //DefinitiveStorage
        let value = UserPrefs.get(item);
        this.DStorage += item + ': ' + value + '\n';
      } else {
        //TemporalStorage
        let value = UserPrefs.TemporalStorage.getItem(item);
        this.TStorage += item + ': ' + value + '\n';
      }
    },
    getDStorage: function() {
      return UserPrefs.DefinitiveStorage.getAllKeys().forEach(
        this.combineKeyWithValue
      );
    },
    getTStorage: function() {
      return UserPrefs.TemporalStorage.getAllKeys().forEach(
        this.combineKeyWithValue
      );
    }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
    EventBus.$emit('changeTitle', 'Herramientas de desarrollador');
    this.getDStorage();
    this.getTStorage();
  }
};
</script>
