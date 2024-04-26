<template>
  <v-container fluid>
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

    <v-btn color="primary" dark fixed bottom right class="btn-reseñar" @click="dialog = true">
      <v-icon left>mdi-pencil</v-icon>
      Crear Reseña
    </v-btn>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Nueva Reseña</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitReview">
            <v-select v-model="categoria" :items="categorias" label="Categoría" outlined required></v-select>

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
import data from '@/data.js'

export default {
  data() {
    return {
      dialog: false,
      reseñas: data.reseñas,
      categorias: ['Película', 'Videojuego', 'Producto'],
      categoria: null,
      genero: '',
      precio: null,
      nombreElemento: '',
      calificacion: null,
      reseña: '',
      idReseñaAEditar: null,  
    };
  },
  methods: {
    submitReview() {
      const nuevaReseña = {
        id: this.reseñas.length + 1,
        titulo: this.nombreElemento,
        fecha: new Date().toISOString().substring(0, 10),
        descripcion: this.reseña
      };

      if (this.idReseñaAEditar) {
        const index = this.reseñas.findIndex(reseña => reseña.id === this.idReseñaAEditar);
        this.reseñas.splice(index, 1, nuevaReseña);
        this.idReseñaAEditar = null;
      } else {
        this.reseñas.push(nuevaReseña);
      }

      this.dialog = false;
    },
    eliminarReseña(id) {
      this.reseñas = this.reseñas.filter(reseña => reseña.id !== id);
    },
    editarReseña(id) {
      const reseñaAEditar = this.reseñas.find(reseña => reseña.id === id);
      this.nombreElemento = reseñaAEditar.titulo;
      this.reseña = reseñaAEditar.descripcion;
      this.idReseñaAEditar = id;
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.contenedor-centrado {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mensaje-sin-reseñas {
  font-size: 40px;
  text-align: center;
  margin-top: 70px;
}

.btn-reseñar {
  border-radius: 25px;
  padding: 20px 40px;
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
}
</style>
