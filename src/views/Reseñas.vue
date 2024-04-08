<template>
  <div>
    <v-row>
      <div>
        <div class="pt-16">
            <h2 class="text-h4 font-weight-bold">Reseñas</h2>

            <div>
              <v-row v-for="i in 2" :key="i" class="py-4">
                <v-col cols="12" md="4">
                  <v-card flat height="100%">
                    <v-img
                        :aspect-ratio="16 / 9"
                        height="100%"
                        src="https://cdn.pixabay.com/photo/2021/01/27/06/54/nova-scotia-duck-tolling-retriever-5953883_1280.jpg"
                    ></v-img>
                  </v-card>
                </v-col>

                <v-col>
                  <div>
                    <v-btn color="accent" depressed>Pelicula</v-btn>

                    <h3 class="text-h4 font-weight-bold pt-3">
                      The Godfather
                    </h3>
                    <h3 class="text-h4 font-weight-bold pt-3">
                      The Godfather
                    </h3>

                    <p class="text-h6 font-weight-regular pt-3 text--secondary">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis unde tempora consectetur, quia consequuntur repellendus doloremque amet! Quidem illum et aspernatur maiores porro unde sunt repellendus veritatis, fuga aut cupiditate?
                    </p>

                    <div class="d-flex align-center">
                      <v-avatar color="accent" size="36">
                        <v-icon dark>mdi-feather</v-icon>
                      </v-avatar>

                      <div class="pl-2">Yan Lee · 03 Jan 2019</div>
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
</script>
