<template style="height:100vh;">
  <q-page>
    <div>
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="white"
        prev-icon="arrow_left"
        next-icon="arrow_right"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        arrows
        height="100vh"
        class="bg-primary text-white shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center">
          <q-icon name="edit" size="56px" />
          <div class="q-mt-md text-center">
            Bienvenido a MythicKeeper, una aplicación de toma de apuntes para
            escritores esta guia te explicará los conceptos básicos.
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="tv" class="column no-wrap flex-center">
          <q-icon name="bookmark" size="56px" />
          <div class="q-mt-md text-center">
            MythicKeeper te permite plasmar tus ideas rápidamente sin muchas
            preocupaciones haciendo uso de
            <a href="https://es.wikipedia.org/wiki/Markdown">Markdown</a>.
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <q-icon name="folder" size="56px" />
          <div class="q-mt-md text-center">
            Puedes mantenerlas organizadas usando "Carpetas" y "Hojas". Siendo
            las "Hojas" son documentos donde puedes escribir.
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="map" class="column no-wrap flex-center">
          <q-icon name="settings_suggest" size="56px" />
          <div class="q-mt-md text-center">
            ¡Eso es todo! ¡Disfruta de la aplicación!
            <p>
              Si quieres modificar algún ajuste de la misma, pulsa opciones o
              navega al menú lateral.
            </p>
          </div>
          <q-btn
            v-on:click="trashGuide"
            class="q-mt-xl q-px-xl"
            color=""
            text-color="white"
            unelevated
            label="Listo"
            outline
          />
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page>
</template>
<script>
let UserPrefs = require('src/js/UserPrefs.js');

export default {
  name: 'GuideCarrusel',
  data() {
    return {
      slide: 'style',
      lorem:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
    };
  },
  methods: {
    trashGuide: function() {
      UserPrefs.set('kFirstTime', false);
      if (UserPrefs.get('kMainFolderLocation') == '' || undefined) {
        this.$router.push('/landing');
      } else {
        this.$router.push('/help');
      }
    }
  },
  created() {
    UserPrefs.set('kFirstTime', true);
    UserPrefs.set('kStarted', false);
  }
};
</script>
<style>
a {
  color: white;
  text-decoration: underline;
  font-weight: bolder;
}
</style>
