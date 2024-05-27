<template>
  <div>
    <div>
      <h1 :style="{ margin: '30px' }" align="center">Reseñas</h1>
      <v-expansion-panels>
        <v-expansion-panel v-for="(categoria, index) in reviews.data" :key="index" class="py-4"
          style="margin-bottom: 16px">
          <v-expansion-panel-header>
            <h1 :style="{ marginBottom: '16px' }">{{ categoria.categoria }}s</h1>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col v-for="(review, index) in categoria.reviews" :key="index" class="py-4" cols="12" 
                    lg="4" v-if="review.estado == true">
                  <v-hover v-slot:default="{ hover }" close-delay="50" open-delay="50">
                    <div>
                      <v-card :color="hover ? 'white' : 'transparent'" :elevation="hover ? 12 : 0" flat hover>
                        <v-img :aspect-ratio="16 / 9" class="elevation-2"
                          gradient="to top, rgba(25,32,72,.4), rgba(25,32,72,.0)" height="200px"
                          src="https://cdn.pixabay.com/photo/2020/12/23/14/41/forest-5855196_1280.jpg"
                          style="border-radius: 16px">
                          <v-card-text>
                            <v-btn color="accent">Calificación: {{ review.rating }} ★</v-btn>
                          </v-card-text>
                        </v-img>

                        <v-card-text>
                          <div class="text-h5 font-weight-bold primary--text">
                            {{ review.Producto.nombre }}
                          </div>
                          <div class="text-h5 font-weight-bold primary--text">
                            {{ review.titulo }}
                          </div>
                          <div class="text-body-1 py-4">
                            {{ review.contenido }}
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

      <v-snackbar v-model="snackbar" :timeout="5000" :color="snackbarColor">
      {{ snackbarMessage }}
      <v-btn text @click="snackbar = false">Cerrar</v-btn>
    </v-snackbar>

    </div>
  </div>
</template>

<script>
/*export default {
  name: "Category",
  components: {
    siderbar: () => import("@/components/details/sidebar"),
  },
};*/

import axios from 'axios';

export default {
  data() {
    return {
      reviews: {},
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
    };
  },
  mounted() {
    this.traerReseñas()
  },
  methods: {
    traerReseñas(){
      axios.get('http://localhost:4001/api/resenas/resenas')
      .then(response => {
        this.reviews = response.data;
      })
      .catch(error => {
        console.error('Error al obtener la información:', error);
      });
    },
    IrAComentarios(id){
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
