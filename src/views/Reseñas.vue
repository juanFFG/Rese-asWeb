<template>
  <div>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h1 align="center" class="text-center">Reseñas</h1>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" md="10">
          <!-- Formulario de Búsqueda -->
          <v-form @submit.prevent="filtrarResenas">
            <v-row align="center" justify="center">
              <v-col cols="12" md="5">
                <v-text-field v-model="filtroProducto" label="Nombre del Producto"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select 
                  v-model="filtroCalificacion"
                  :items="[1, 2, 3, 4, 5]"
                  label="Calificación"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn type="submit" color="primary">Buscar</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="(categoria, index) in reviews.data" :key="index" class="py-4" style="margin-bottom: 16px">
          <v-expansion-panel-header>
            <h1 :style="{ marginBottom: '16px' }">{{ categoria.categoria }}s</h1>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col v-for="(review, index) in categoria.reviews" :key="index" class="py-4" cols="12" lg="4" v-if="review.estado == true">
                <v-hover v-slot:default="{ hover }" close-delay="50" open-delay="50">
                  <div> 
                    <v-card :color="hover ? 'white' : 'transparent'" :elevation="hover ? 12 : 0" flat hover>
                      <v-card-text>
                          <v-btn color="accent">Calificación: {{ review.rating }} ★</v-btn>
                      </v-card-text>
                      <v-card-text>
                        <div class="text-h5 font-weight-bold primary--text">
                          {{ review.Producto.nombre }}
                        </div>
                        <div class="text-h5 font-weight-bold primary--text">
                          {{ review.titulo }}
                        </div>
                        <div class="text-body-1 py-4 mt-4">
                          {{ truncateText(review.contenido) }}
                        </div>
                        <div class="d-flex align-center">
                          <v-avatar color="accent" size="36">
                            <v-icon dark>mdi-feather</v-icon>
                          </v-avatar>
                          <div class="pl-2">{{ review.User.username }} · {{ review.createdAt }}</div>
                        </div>
                      </v-card-text>
                      <v-btn text color="primary" @click="IrAComentarios(review.id)" :style="{ margin: '16px' }">Comentarios</v-btn>
                      <v-btn text color="error" @click="reportarReseña(review.id)" :style="{ margin: '16px' }">Reportar</v-btn>
                    </v-card>
                  </div>
                </v-hover>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-dialog v-model="noResultsDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Sin Resultados</v-card-title>
          <v-card-text>
            No se encontraron reseñas para los filtros seleccionados.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="noResultsDialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :timeout="5000" :color="snackbarColor">
        {{ snackbarMessage }}
        <v-btn text @click="snackbar = false">Cerrar</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reviews: {},
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      filtroProducto: '',
      filtroCalificacion: null,
      noResultsDialog: false
    };
  },
  mounted() {
    this.traerResenas();
  },
  methods: {
    traerResenas() {
      axios.get('http://localhost:4001/api/resenas/resenas')
        .then(response => {
          this.reviews = response.data;
        })
        .catch(error => {
          console.error('Error al obtener la información:', error);
        });
    },
    filtrarResenas() {
      const params = {
        producto: this.filtroProducto,
        calificacion: this.filtroCalificacion,
      };
      axios.get('http://localhost:4001/api/resenas/filtrar', { params })
        .then(response => {
          this.reviews = response.data;
          if (!this.reviews.data || this.reviews.data.length === 0) {
            this.noResultsDialog = true;
          } else {
            this.noResultsDialog = false;
          }
        })
        .catch(error => {
          console.error('Error al obtener la información filtrada:', error);
        });
    },
    truncateText(text, expanded) {
      const limit = 100; // Límite de caracteres para mostrar
      if (expanded) {
        return text;
      }
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    },
    IrAComentarios(id) {
      this.$router.push({ name: 'Comentarios', params: { id: id } });
    },
    reportarReseña(reseñaId) {
      axios.post(`http://localhost:4001/api/resenas/reportar`, { reseñaId })
        .then(response => {
          this.snackbarMessage = 'Reseña reportada con éxito';
          this.snackbarColor = 'success';
          this.snackbar = true;
        })
        .catch(error => {
          console.error('Error al reportar la reseña:', error);
          this.snackbarMessage = 'Error al reportar la reseña';
          this.snackbarColor = 'error';
          this.snackbar = true;
        });
    }
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
</style>
