<template>
  <div>
    <Cardpeliculas :movies="movies" @delete-movie="confirmDelete" />

    <div>
      <b-button @click="openModal">Registrar película</b-button>
      <b-button @click="openDeleteModal" variant="danger">Eliminar película</b-button>


      <b-modal id="modal-1" title="Registro de películas" v-model="showModal">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="input-group-1" label="Nombre de película:" label-for="input-1"
            description="Registra el nombre latinoamericano.">
            <b-form-input id="input-1" v-model="form.name" type="text" placeholder="Ingresa el nombre de la película."
              required></b-form-input>
          </b-form-group>

          <b-form-input id="input-2" v-model="form.year" type="number" required
            placeholder="Ingresa el año de la película"></b-form-input>

          <b-form-group id="input-group-4" label="Género" label-for="input-3">
            <b-form-select v-model="form.genre" :options="genres" required>
              <template v-slot:first>
                <option :value="0">Selecciona un género</option>
              </template>
            </b-form-select>
            <div v-if="genres.length === 0">Loading genres...</div>
          </b-form-group>

          <b-form-group id="input-group-5" label="Imagen" label-for="input-4">
            <b-form-file id="input-4" v-model="form.image" accept="image/*"></b-form-file>
          </b-form-group>

          <b-button type="submit" variant="primary">Registrar</b-button>
          
        </b-form>
      </b-modal>
    </div>
    <b-modal ref="deleteModal" id="deleteModal" title="Eliminar Película">
      <p>Ingrese el nombre de la película que desea eliminar:</p>
      <b-form-input v-model="deleteMovieName"></b-form-input>
      <b-button @click="confirmDelete" variant="danger">Eliminar</b-button>
      <b-button @click="cancelDelete">Cancelar</b-button>
    </b-modal>
  </div>
</template>
  
<script>
import axios from 'axios';
import Cardpeliculas from './cardpeliculas.vue'; // Si es necesario
export default {
  components: { Cardpeliculas },
  data() {
    return {
      form: {
        name: '',
        genre: '',
        year: '',
        image: null // Nueva propiedad para almacenar la imagen
      },
      genres: [],
      genresToSend: [],
      movies: [], // Arreglo para almacenar las películas
      showModal: false,
      deleteMovieName: '', // Nombre de la película a eliminar
      selectedMovie: null // Película seleccionada para eliminar
    };
  },
  mounted() {
    this.fetchGenres();
    this.fetchMovies(); // Llamar a la función para obtener las películas al cargar el componente
    this.form.genre = 0;
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    openDeleteModal() {
      this.$refs.deleteModal.show();
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.registerMovie();
    },
    onReset(evt) {
      this.form.name = '';
      this.form.genre = '';
      this.form.year = '';
      this.form.image = null; // Limpiar el campo de imagen al restablecer el formulario
      this.showModal = false;
    },
    async fetchGenres() {
      try {
        const response = await axios.get('http://localhost:8080/api/movies/genres');
        this.genres = response.data.map(genre => ({ text: genre.name, value: genre.id }));
        this.genresToSend = response.data;
      } catch (error) {
        console.error('Error al obtener los géneros:', error);
      }
    },
    async fetchMovies() {
      try {
        const response = await axios.get('http://localhost:8080/api/movies/movies');
        this.movies = response.data; // Actualizar el arreglo de películas con los datos recibidos
      } catch (error) {
        console.error('Error al obtener las películas:', error);
      }
    },
    async registerMovie() {
      try {
        // Leer la imagen como una cadena Base64
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.form.image);
        fileReader.onload = async () => {
          const base64Image = fileReader.result.split(',')[1];

          this.form.genre = this.genresToSend.find(genre => genre.id === this.form.genre);

          // Enviar los datos al servidor
          await axios.post('http://localhost:8080/api/movies/registermovies', {
            name: this.form.name,
            genre: this.form.genre,
            year: this.form.year,
            image: base64Image // Enviar la imagen como cadena Base64
          });

          alert('¡Película registrada con éxito!');
          this.onReset(); // Limpiar el formulario después de registrar la película
          this.fetchMovies(); // Recargar las películas después de registrar una nueva
        };
      } catch (error) {
        console.error('Error al registrar la película:', error);
      }
    },
    async confirmDelete() {
      try {
        // Buscar la película por nombre
        const movieToDelete = this.movies.find(movie => movie.name === this.deleteMovieName);
        if (!movieToDelete) {
          alert('No se encontró ninguna película con ese nombre.');
          return;
        }

        await axios.delete(`http://localhost:8080/api/movies/${movieToDelete.id}`);
        // Recargar las películas después de eliminar una
        this.fetchMovies();
        this.$refs.deleteModal.hide();
        alert('¡Película eliminada exitosamente!');
      } catch (error) {
        console.error('Error al eliminar la película:', error);
      }
    },
    // Función para cancelar la eliminación de la película
    cancelDelete() {
      this.deleteMovieName = '';
      this.$refs.deleteModal.hide();
    }
  }
};
</script>
