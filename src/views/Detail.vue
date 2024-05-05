<template>
  <v-container fluid>
    <template v-if="reseñas.length === 0">
      <div class="mensaje-sin-reseñas">
        No hay reseñas para mostrar.
      </div>
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
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field label="Título" v-model="nombreElemento" outlined></v-text-field>
          <v-textarea label="Reseña" v-model="reseña" outlined></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
          <v-btn color="blue darken-1" text @click="submitReview">Guardar</v-btn>
        </v-card-actions>
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
  computed: {
    dialogTitle() {
      return this.idReseñaAEditar ? 'Editar Reseña' : 'Nueva Reseña';
    },
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
    editarReseña(id) {
      const reseñaAEditar = this.reseñas.find(reseña => reseña.id === id);
      //console.log('Username del usuario actual:', this.$root.user.username); // Registro para depuración
      //console.log('Username del creador de la reseña:', reseñaAEditar.username); // Registro para depuración
      if (this.$root.user.id != reseñaAEditar.user_id) {
        alert('No tienes permiso para editar esta reseña');
        return;
      }

      this.nombreElemento = reseñaAEditar.titulo;
      this.reseña = reseñaAEditar.descripcion;
      this.idReseñaAEditar = id;
      this.dialog = true;
    },
    eliminarReseña(id) {
      const reseñaAEliminar = this.reseñas.find(reseña => reseña.id === id);
      //console.log('Username del usuario actual:', this.$root.user.username); // Registro para depuración
      //console.log('Username del creador de la reseña:', reseñaAEliminar.username); // Registro para depuración
      if (this.$root.user.id != reseñaAEliminar.user_id) {
        alert('No tienes permiso para eliminar esta reseña');
        return;
      }

      const index = this.reseñas.findIndex(reseña => reseña.id === id);
      this.reseñas.splice(index, 1);

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
