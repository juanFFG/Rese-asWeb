<template>
  <v-container fluid>
    <!-- Validación para mostrar mensaje si no hay reseñas -->
    <template v-if="reseñas.length === 0">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-icon size="56" color="grey lighten-1" class="mb-4">mdi-comment-alert-outline</v-icon>
          <div>
            <h3 style="color: #5C6BC0;">Parece que aún no has hecho una reseña</h3>
            <p style="color: grey;">Haz tu primera reseña para poder verla aquí.</p>
          </div>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row v-for="(review, index) in reseñas.data" :key="index" class="py-4">
                <v-col cols="12" md="4">
                  <v-card flat height="100%">
                    <!--"https://cdn.pixabay.com/photo/2021/01/27/06/54/nova-scotia-duck-tolling-retriever-5953883_1280.jpg"-->
                    <v-img
                        :aspect-ratio="16 / 9"
                        height="100%"
                        :src= "review.linkImagen"
                        
                    ></v-img>
                  </v-card>
                </v-col>

                <v-col>
                  <div>
                    <v-btn color="accent" depressed>{{ review.categoria }}</v-btn>
                    <v-btn color="accent" depressed>Calificacion: {{ review.rating }}</v-btn>
                    <h3 class="text-h4 font-weight-bold pt-3">
                      {{review.product}}
                    </h3>
                    <h3 class="text-h4 font-weight-bold pt-3">
                      {{review.titulo}}
                    </h3>

                    <p class="text-h6 font-weight-regular pt-3 text--secondary">
                      {{ review.contenido }}
                    </p>

                    <div class="d-flex align-center">
                      <v-avatar color="accent" size="36">
                        <v-icon dark>mdi-feather</v-icon>
                      </v-avatar>

                      <div class="pl-2">{{ review.userName }} · {{ review.createdAt }}</div>
                    </div>
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
      dialog: false, // Controla la visibilidad del diálogo de nueva reseña
      reseñas: [], // Aquí se almacenan las reseñas
      categorias: ['Película', 'Videojuego', 'Producto'], // Opciones para el selector de categorías
      categoria: null, // Categoría seleccionada
      genero: '', // Género, se muestra dependiendo de la categoría
      precio: null, // Precio, se muestra dependiendo de la categoría
      nombreElemento: '', // Nombre del elemento reseñado
      calificacion: null, // Calificación dada
      reseña: '', // Texto de la reseña
      sesionIniciada: false,
    };
  },
  methods: {
    mounted() {
      axios.get('http://localhost:4001/api/users/idUserIniciado')
        .then(response => {
          if(response.msg !== 'No han iniciado sesión') {
            sesionIniciada: true;
            axios.get(`http://localhost:4001/api/resenas/mis_resenas/${response.msg}`).then(response2=>{
              this.reseñas = response2.data;
            });
          }
        }
      );
    }, 
    submitReview() {
      // Lógica para procesar y enviar la reseña
      console.log("Enviando reseña...");
      // Aquí puedes agregar la reseña a `reseñas` o enviarla a un servidor
      this.dialog = false; // Cierra el diálogo después de enviar
    },
  },
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

