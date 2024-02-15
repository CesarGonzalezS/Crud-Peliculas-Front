<template>
  <div>
    <b-card
      v-for="(movie, index) in movies"
      :key="index"
      :title="movie.name"
      :img-src="getImgSrc(movie)"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem; margin-bottom: 1rem;"
    >
    <b-button @click="deleteMovie(movie)">Eliminar</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  props: ['movies'],
  methods: {
    getImgSrc(movie) {
      return 'data:image/jpeg;base64,' + movie.imageBase64;
    },
    deleteMovie(movie) {
  if (movie) {
    this.$emit('delete-movie', movie);
  } else {
    console.error('Error: Intentando eliminar una película nula.');
  }
}

  }
};
</script>

<style scoped>
/* Estilos adicionales según sea necesario */
</style>
