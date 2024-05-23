<template>
  <v-container fluid>
    <!-- Validación para mostrar mensaje si no hay reseñas -->

    <template v-if="sesionIniciada == true">

      <div>
        <h1>Mis reseñas</h1>
        <v-row v-for="(review, index) in reseñas.data" :key="index" class="py-4">
          <v-col cols="12" md="4">
            <v-card flat height="100%">
              <!--:src= "review.linkImagen"-->
              <!--"https://cdn.pixabay.com/photo/2021/01/27/06/54/nova-scotia-duck-tolling-retriever-5953883_1280.jpg"-->
              <v-img :aspect-ratio="16 / 9" height="100%"
                src="https://cdn.pixabay.com/photo/2021/01/27/06/54/nova-scotia-duck-tolling-retriever-5953883_1280.jpg"></v-img>
            </v-card>
          </v-col>
          <v-col>
            <div>
              <v-btn color="accent" depressed>{{ review.Producto.categoria }}</v-btn>
              <v-btn color="accent" depressed>Calificacion: {{ review.rating }} ★</v-btn>
              <h3 class="text-h4 font-weight-bold pt-3">
                {{ review.Producto.nombre }}
              </h3>
              <h3 class="text-h4 font-weight-bold pt-3">
                {{ review.titulo }}
              </h3>

              <p class="text-h6 font-weight-regular pt-3 text--secondary">
                {{ review.contenido }}
              </p>

              <div class="d-flex align-center">
                <v-avatar color="accent" size="36">
                  <v-icon dark>mdi-feather</v-icon>
                </v-avatar>

                <div class="pl-2"> {{ review.createdAt }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>


    </template>
    <template v-else>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-icon size="56" color="grey lighten-1" class="mb-4">mdi-comment-alert-outline</v-icon>
          <div>
            <h3 style="color: #5C6BC0;">Tienes que iniciar sesión primero para realizar tu primera reseña</h3>
          </div>
        </v-col>
      </v-row>
    </template>
    <!-- Botón para abrir el diálogo del formulario de nueva reseña -->
    <v-btn color="primary" dark fixed bottom right class="btn-reseñar" @click="dialog = true">
      <v-icon left>mdi-pencil</v-icon>
      Reseñar
    </v-btn>

    <!-- Diálogo modificado para incluir el formulario de reseña -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Nueva Reseña</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitReview">
            <v-select v-model="categoria" :items="categorias" label="Categoría" outlined required></v-select>

            <!-- Campos adicionales que aparecen basados en la selección de categoría -->
            <template v-if="categoria === 'Película' || categoria === 'Videojuego'">
              <v-text-field v-model="genero" label="Género" outlined required></v-text-field>
            </template>
            <template v-if="categoria === 'Producto' || categoria === 'Videojuego'">
              <v-text-field v-model="precio" label="Precio (opcional)" type="number" outlined></v-text-field>
            </template>

            <v-text-field v-model="nombreElemento" label="Nombre del elemento" outlined required></v-text-field>
            <v-text-field v-model="titulo" label="Titulo" outlined required></v-text-field>
            <v-text-field v-model="calificacion" label="Calificación general" type="number" min="1" max="5" outlined
              required></v-text-field>

            <v-textarea v-model="reseña" label="Reseña" outlined required rows="5"></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="primary" dark type="submit">Enviar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      dialog: false,
      reseñas: [],
      categorias: ['Película', 'Videojuego', 'Producto'],
      titulo: '',
      categoria: null,
      genero: '',
      precio: 0,
      nombreElemento: '',
      calificacion: 0,
      reseña: '',
      sesionIniciada: false,
      userId: '',
      prueba: localStorage.getItem('usuario'),
      error: ''
    };
  },

  created() {
    const usuarioLocal = localStorage.getItem('usuario');
    if (usuarioLocal) {
      this.sesionIniciada = true;
      const usuario = JSON.parse(usuarioLocal);
      this.userId = usuario.id;
    } else {
      this.sesionIniciada = false;
    }
    console.log(this.userId);
    axios.get(`http://localhost:4001/api/resenas/mis_resenas/${this.userId}`)
      .then(response => {
        this.reseñas = response.data;
      }
      ).catch(error => {
        this.error = error;
      });
  },
  methods: {
    async submitReview() {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        this.sesionIniciada = true;
        const usuario = JSON.parse(usuarioLocal);
        this.userId = usuario.id;
      }
      const response = await axios.post('http://localhost:4001/api/resenas/crear_resena', {
        titulo: this.titulo,
        nombre: this.nombreElemento,
        contenido: this.reseña,
        categoria: this.categoria,
        rating: this.calificacion,
        usuarioID: this.userId,
        precio: this.precio
      });
      if (response.data.msg == 'Se añadio correctamente') this.$router.push('/misresenas');
      else this.error = response.data.msg;
      // Aquí puedes agregar la reseña a `reseñas` o enviarla a un servidor
      this.dialog = false; // Cierra el diálogo después de enviar
    },
  }
};
</script>

<style scoped>
.contenedor-centrado {
  height: 100vh;
  display: flex;
  justify-content: center;
  /* Centra horizontalmente */
  align-items: center;
  /* Centra verticalmente */
}

.mensaje-sin-reseñas {
  font-size: 40px;
  /* Ajusta el tamaño según sea necesario */
  text-align: center;
  /* Asegura que el texto dentro del span también esté centrado */
  margin-top: 70px;
  /* Ajusta esto para mover el texto hacia abajo */
}

.btn-reseñar {
  border-radius: 25px;
  /* Ajusta para una forma más redondeada */
  padding: 20px 40px;
  /* Ajusta el padding para dar más espacio alrededor del texto e ícono */
}
</style>
