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
            Mientras mantiene todas tus locas ideas guardadas en la nube (con tu
            permiso).
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <q-icon name="folder" size="56px" />
          <div class="q-mt-md text-center">
            Puedes mantenerlas organizadas en Carpesanos, Carpetas y Hojas. Los
            carpesanos son carpetas de alto nivel, destinadas para englobar
            temas grandes como distintos libros o campañas que estes
            produciendo. Y las hojas son entradas donde puedes escribir.
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="map" class="column no-wrap flex-center">
          <q-icon name="settings_suggest" size="56px" />
          <div class="q-mt-md text-center">
            Disfruta de la aplicación. Puedes modificar ajustes de la misma en
            Ajustes en el menú lateral. Del mismo modo, añadir un servicio de
            sincronización.
          </div>
          <q-btn
            v-on:click="trashGuide"
            class="q-mt-xl q-px-xl"
            color=""
            text-color="white"
            unelevated
            label="Listo"
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
	  if(UserPrefs.get('kMainFolderLocation') == '' || undefined){
		  this.$router.push("/landing")
	  } else {
		  this.$router.push("/help")
	  }
    }
  },
  created(){
	UserPrefs.set('kFirstTime',true)
    UserPrefs.set('kStarted',false)
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
