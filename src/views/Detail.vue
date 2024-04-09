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
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="reseña in reseñas" :key="reseña.id">
          <v-card class="ma-3">
            <v-card-title class="headline">{{ reseña.titulo }}</v-card-title>
            <v-card-subtitle>{{ reseña.fecha }}</v-card-subtitle>
            <v-card-text>{{ reseña.descripcion }}</v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="editarReseña(reseña.id)">Editar</v-btn>
              <v-btn text color="red" @click="eliminarReseña(reseña.id)">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
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
    };
  },
  methods: {
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

