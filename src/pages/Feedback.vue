<template>
  <q-page padding class="flex flex-center">
    <div class="text-h5" style="width:100%;text-align:center;">
      Retroalimentación
    </div>
    <div style="margin: 0 auto; min-width:80%">
      <q-list bordered class="rounded-borders">
        <q-item clickable v-ripple @click.native="toGitHub()">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="mdi-github" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              >GitHub <q-icon class="q-ml-xs" name="link" size="xs"
            /></q-item-label>
            <q-item-label caption>Ver el proyecto en GitHub</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click.native="toKofi()">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="mdi-coffee" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              >Ko-Fi
              <q-icon class="q-ml-xs" name="link" size="xs" />
            </q-item-label>
            <q-item-label caption>Apoyar el proyecto en Ko-fi</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar';
export default {
  data() {
    return {
      githubLink: 'https://github.com/Javiondox/mythickeeper',
      kofiLink: 'https://ko-fi.com/javiondo'
    };
  },
  methods: {
    toGitHub: function() {
      openURL(this.githubLink);
    },
    toKofi: function() {
      openURL(this.kofiLink);
    }
  },
  mounted() {
    EventBus.$emit('globalBreadCrumbs', false);
    EventBus.$emit('fastButtons', 'none');
  }
};
</script>
