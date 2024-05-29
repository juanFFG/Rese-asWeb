<template>
  <div>
    <v-container>
      <!-- Sección de encabezado con imagen destacada -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-img
              :aspect-ratio="16 / 9"
              dark
              gradient="to top, rgba(25,32,72,.7), rgba(25,32,72,.0)"
              height="500px"
              src="https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg"
            >
              <v-card-text class="fill-height d-flex align-end">
                <v-row class="flex-column">
                  <v-col>
                    <v-btn color="accent">Explora</v-btn>
                  </v-col>
                  <v-col cols="12" lg="8" md="10" xl="7">
                    <h2 class="text-h3 py-3" style="line-height: 1.2">
                      Bienvenido a Nuestro Sitio de Reseñas
                    </h2>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-avatar class="elevation-4" color="accent">
                      <v-icon large>mdi-feather</v-icon>
                    </v-avatar>
                    <div class="text-h6 pl-2">Tu fuente de reseñas confiables</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de características -->
      <v-row class="pt-16">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold pb-4 text-center">Características Principales</h2>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-icon large class="mb-3">mdi-star</v-icon>
            <h3 class="text-h5 font-weight-bold">Reseñas Detalladas</h3>
            <p>Encuentra reseñas detalladas y confiables de productos y servicios.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-icon large class="mb-3">mdi-account-multiple</v-icon>
            <h3 class="text-h5 font-weight-bold">Comunidad Activa</h3>
            <p>Únete a nuestra comunidad de usuarios activos y comparte tus opiniones.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <v-icon large class="mb-3">mdi-filter</v-icon>
            <h3 class="text-h5 font-weight-bold">Filtros Personalizados</h3>
            <p>Utiliza filtros personalizados para encontrar exactamente lo que buscas.</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de reseñas recomendadas -->
      <v-row class="pt-16">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold pb-4">Recomendaciones para Ti</h2>
        </v-col>
        <v-col v-for="i in 6" :key="i" cols="12" lg="4" md="6">
          <v-hover v-slot:default="{ hover }" close-delay="50" open-delay="50">
            <div>
              <v-card :color="hover ? 'white' : 'transparent'" :elevation="hover ? 12 : 0" flat hover>
                <v-img
                  :aspect-ratio="16 / 9"
                  class="elevation-2"
                  gradient="to top, rgba(25,32,72,.4), rgba(25,32,72,.0)"
                  height="200px"
                  src="https://cdn.pixabay.com/photo/2020/12/23/14/41/forest-5855196_1280.jpg"
                  style="border-radius: 16px"
                >
                  <v-card-text>
                    <v-btn color="accent">Consejos</v-btn>
                  </v-card-text>
                </v-img>
                <v-card-text>
                  <div class="text-h5 font-weight-bold primary--text">
                    Cómo escribir una reseña increíble en 5 pasos
                  </div>
                  <div class="text-body-1 py-4">
                    Para escribir una reseña exitosa, por favor ten en cuenta los siguiente pasos:
                  </div>
                  <div class="d-flex align-center">
                    <v-avatar color="accent" size="36">
                      <v-icon dark>mdi-feather</v-icon>
                    </v-avatar>
                    <div class="pl-2">Delia Font · 22 Enero 2024</div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-hover>
        </v-col>
      </v-row>

      <!-- Sección de últimas publicaciones -->
      <v-row class="pt-16">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold">Últimas Publicaciones</h2>
        </v-col>
        <v-row v-for="i in 6" :key="i" class="py-4">
          <v-col cols="12" md="4">
            <v-card flat height="100%">
              <v-img :aspect-ratio="16 / 9" height="100%" src="https://cdn.pixabay.com/photo/2021/01/27/06/54/nova-scotia-duck-tolling-retriever-5953883_1280.jpg"></v-img>
            </v-card>
          </v-col>
          <v-col>
            <div>
              <v-btn color="accent" depressed>Entretenimiento</v-btn>
              <h3 class="text-h4 font-weight-bold pt-3">
                Las mejores películas del 2023
              </h3>
              <p class="text-h6 font-weight-regular pt-3 text--secondary">
                Lista de las 10 mejores películas del 2023 según tu género favorito.
              </p>
              <div class="d-flex align-center">
                <v-avatar color="accent" size="36">
                  <v-icon dark>mdi-feather</v-icon>
                </v-avatar>
                <div class="pl-2">Yan Lee · 30 Diciembre 2023</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Inicio",
  components: {
    siderbar: () => import("@/components/details/sidebar"),
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
</style>

