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

              <div class="pl-2">{{ username }} · {{ fecha }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
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
      nombreUsuario: ''
    }
  },
  async mounted() {
    await this.traerReseña();
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
