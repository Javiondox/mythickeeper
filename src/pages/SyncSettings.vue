<template>
  <q-page padding class="flex row q-gutter-md">
    <q-card class="sync-card">
      <q-card-section>
        <div class="text-h6 q-mb-xs">Google Drive</div>
      </q-card-section>

      <q-img class="q-my-sm" src="~assets/gdrive.png" />
      <q-separator></q-separator>
      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          Utilizar los servicios de Google significa aceptar los terminos y
          condiciones de servicio de Google Inc.
        </div>
        <div class="text-subtitle1">Sesión: {{ GoogleStatus }}</div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm">
        <q-btn
          color="orange"
          class="full-width"
          label="Iniciar sesión"
          @click="gAuth()"
        />
        <q-btn color="orange" class="full-width" label="Cerrar sesión" />
      </q-card-actions>
      <q-ribbon
        class="qribbon-bottom bg-color-red"
        position="bottom-right"
        type="corner"
        >No Implementado</q-ribbon
      >
    </q-card>
    <q-card class="sync-card">
      <q-card-section>
        <div class="text-h6 q-mb-xs">Dropbox</div>
      </q-card-section>

      <q-img class="q-my-sm" src="~assets/dropbox.png" />
      <q-separator></q-separator>
      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          Utilizar los servicios de Dropbox significa aceptar los terminos y
          condiciones de servicio de Dropbox Inc.
        </div>
        <div class="text-subtitle1">Sesión: {{ DropboxStatus }}</div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm">
        <q-btn color="blue" class="full-width" label="Iniciar sesión" />
        <q-btn color="blue" class="full-width" label="Cerrar sesión" />
      </q-card-actions>
      <q-ribbon
        class="qribbon-bottom bg-color-red"
        position="bottom-right"
        type="corner"
        >No Implementado</q-ribbon
      >
    </q-card>
  </q-page>
</template>
<script>
import { handleAuthClick, handleSignoutClick } from 'src/js/GoogleAuth.js';
import { EventBus } from '../js/vue-bus';
export default {
  name: 'MainLayout',
  components: {},
  data() {
    return {
      DropboxStatus: 'No iniciada',
      GoogleStatus: 'No iniciada'
    };
  },
  methods: {
    doGoogleAuth() {
      let gapi = window.gapi;
      let clientId =
        '42406693624-nvctjcnj7ojfe4kh91v7p723b5q0n2il.apps.googleusercontent.com';
      let apiKey = 'rEqv2Ou8f7sMTrbDjH67sAui';
      let discoveryDocs = [
        'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
      ];
      let scope = 'https://www.googleapis.com/auth/userinfo.profile';

      gapi.load('client:auth2', () => {
        gapi.client
          .init({
            apiKey,
            clientId,
            discoveryDocs,
            scope
          })
          .then(() => {
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              this.googleUserProfile = gapi.auth2
                .getAuthInstance()
                .currentUser.get();
              this.loginApiCall(this.googleUserProfile);
            } else {
              gapi.auth2
                .getAuthInstance()
                .signIn()
                .then(() => {
                  this.googleUserProfile = gapi.auth2
                    .getAuthInstance()
                    .currentUser.get();
                  this.loginApiCall(this.googleUserProfile);
                })
                .catch(err => {
                  alert(`Google auth error: ${err}`);
                });
            }
          });
      });
    },
    gAuth() {
      handleAuthClick();
    }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
    EventBus.$emit('changeTitle', 'default');
  },
  created() {}
};
</script>
<style>
.sync-card {
  width: 300px;
  max-height: 380px;
  padding: 10px;
}
</style>
