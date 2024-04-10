<template>
  <div>
    <v-row>
      <div>
        <div class="pt-16">
            <h2 class="text-h4 font-weight-bold">Reseñas</h2>
            <div>
              <v-row v-for="(review, index) in reviews.data" :key="index" class="py-4">
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

                      <div class="pl-2">{{ review.user }} · {{ review.createdAt }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

      </div>
      <v-col>
        
      </v-col>
    </v-row>
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
      reviews: {}
    };
  },
  mounted() {
    axios.get('http://localhost:4001/api/resenas/resenas')
      .then(response => {
        this.reviews = response.data;
      })
      .catch(error => {
        console.error('Error al obtener la información:', error);
      });
  }
};

</script>
