<template>
  <div>
    <h1 :style="{ margin: '30px' }" align="center">Comentarios</h1>
    <div>
      <v-row class="py-4">
        <v-col>
          <div>
            <v-btn color="accent" depressed>{{ categoria }}</v-btn>
            <v-btn color="accent" depressed>Calificacion: {{ calificacion }} ★</v-btn>
            <h3 class="text-h4 font-weight-bold pt-3">
              {{ nombreProducto }}
            </h3>
            <h3 class="text-h4 font-weight-bold pt-3">
              {{ titulo }}
            </h3>

            <p class="text-h6 font-weight-regular pt-3 text--secondary">
              {{ contenido }}
            </p>

            <div class="d-flex align-center">
              <v-avatar color="accent" size="36">
                <v-icon dark>mdi-feather</v-icon>
              </v-avatar>

              <div class="pl-2">{{ nombreUsuario }} · {{ fecha }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div>
      <v-card class="mt-4">
      <v-card-text>
        <v-form @submit.prevent="añadirComentario">
          <v-textarea
            v-model="contenidoComentario"
            label="Añadir un comentario"
            auto-grow
            rows="3"
            outlined
          ></v-textarea>
          <v-text-field v-model="calificacionComentario" label="Calificación general" 
            type="number" min="1" max="5" outlined required>
          </v-text-field>
          <v-btn type="submit" color="primary" class="mt-4">Enviar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    </div>
    <div v-if="hayComentarios">

    </div>
    <div v-else>
      <h2>No hay comentarios</h2>
    </div>
  </div>

</template>

<script>

import axios from 'axios';
export default {
  props: ['id'],
  data() {
    return {
      titulo: '',
      calificacion: 0,
      nombreProducto: '',
      categoria: '',
      contenido: '',
      fecha: null,
      nombreUsuario: '',
      comentarios: [],
      hayComentarios: false,
      calificacionComentario: 0,
      contenidoComentario: '',
      usuarioID: 0
    }
  },
  async mounted() {
    await this.traerReseña();
    await this.traerComentarios();
  },
  methods: {
    async traerReseña() {
      const response = await axios.get('http://localhost:4001/api/resenas/resena/' + this.id);
      const reseña = response.data.reseña;
      this.titulo = reseña.titulo;
      this.calificacion = reseña.rating;
      this.contenido = reseña.contenido;
      this.nombreProducto = reseña.Producto.nombre;
      this.categoria = reseña.Producto.categoria;
      this.fecha = reseña.createdAt;
      this.nombreUsuario = reseña.User.username;
    },
    async traerComentarios(){
      const response = await axios.get('http://localhost:4001/api/comentarios/comentarios/' + this.id);
      if(response.data.data == 'No hay comentarios'){
        this.hayComentarios = false;
      } else {
        this.hayComentarios = true;
        this.comentarios = response.data;
      }
    },
    async añadirComentario(){
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        this.sesionIniciada = true;
        const usuario = JSON.parse(usuarioLocal);
        this.usuarioID = usuario.id;
      }
      const response = await axios.post('http://localhost:4001/api/comentarios/crear_comentario'+this.id, {
        usuarioID: this.usuarioID,
        contenido: this.contenidoComentario,
        calificacion: this.calificacionComentario,
      });
      if (response.data.msg == 'Se añadio correctamente') {
        this.traerComentarios();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.authors {
  position: relative;
  top: -50px;
  margin-bottom: -50px;
}
</style>
