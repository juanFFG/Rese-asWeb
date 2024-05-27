<template>
  <v-container fluid>
    <h1 :style="{ margin: '30px' }" align="center">Mis reseñas</h1>
    <div v-if="sesionIniciada == true">
      <div v-if="hayReseñas">
        <v-expansion-panels>
          <v-expansion-panel v-for="(categoria, index) in reseñas.data" :key="index" class="py-4"
            style="margin-bottom: 16px" >
            <v-expansion-panel-header>
              <h1 :style="{ marginBottom: '16px' }">{{ categoria.categoria }}</h1>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col v-for="(review, index) in categoria.reviews" :key="index" class="py-4" cols="12" lg="4" v-if="review.estado == true">
                  
                    <v-hover v-slot:default="{ hover }" close-delay="50" open-delay="50">
                      <div>
                        <v-card :color="hover ? 'white' : 'transparent'" :elevation="hover ? 12 : 0" flat hover>

                          <v-card-text>
                            <v-card-text>
                              <v-btn color="accent">Calificación: {{ review.rating }} ★</v-btn>
                            </v-card-text>
                            <div class="text-h5 font-weight-bold primary--text">
                              {{ review.Producto.nombre }}
                            </div>
                            <div class="text-h5 font-weight-bold primary--text">
                              {{ review.titulo }}
                            </div>
                            <div class="text-body-1 py-4 mt-4">
                              {{ review.contenido }}
                            </div>

                            <div class="d-flex align-center">
                              <v-avatar color="accent" size="36">
                                <v-icon dark>mdi-feather</v-icon>
                              </v-avatar>

                              <div class="pl-2">{{ review.createdAt }}</div>
                            </div>
                          </v-card-text>
                          <center>
                            <v-btn text color="primary" @click="mostrarReseña(review.id)"
                              :style="{ margin: '1px', marginBottom: '10px' }">Editar</v-btn>
                            <v-btn text color="red" @click="deleteReview(review.id)"
                              :style="{ margin: '1px' }">Eliminar</v-btn>
                            <v-btn text color="primary" @click="IrAComentarios(review.id)" 
                              :style="{ margin: '1px' }">Comentarios</v-btn>
                          </center>
                        </v-card>
                      </div>
                    </v-hover>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-else>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <v-icon size="56" color="black lighten-1" class="mb-4">mdi-comment-alert-outline</v-icon>
            <div>
              <h3 style="color: #5C6BC0;">Aún no has realizado ninguna reseña</h3>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Botón para abrir el diálogo del formulario de nueva reseña -->
      <v-btn color="primary" dark fixed bottom right class="btn-reseñar" @click="dialog = true">
        <v-icon left>mdi-pencil</v-icon>
        Reseñar
      </v-btn>

    </div>
    <div v-else>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-icon size="56" color="black lighten-1" class="mb-4">mdi-comment-alert-outline</v-icon>
          <div>
            <h3 style="color: #5C6BC0;">Tienes que iniciar sesión primero para realizar tu primera reseña</h3>
          </div>
        </v-col>
      </v-row>
    </div>

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

            <template v-if="categoria === 'Producto' || categoria === 'Videojuego'">
              <v-text-field v-model="precio" label="Precio (opcional)" type="number" outlined></v-text-field>
            </template>

            <v-text-field v-model="nombreElemento" label="Nombre del elemento" outlined required></v-text-field>
            <v-text-field v-model="titulo" label="Titulo" outlined required></v-text-field>
            <v-text-field v-model="calificacion" label="Calificación general" type="number" min="1" max="5" outlined
              required></v-text-field>

            <v-textarea v-model="reseña" label="Reseña" outlined required rows="5"></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
              <v-btn v-if="añadir" color="primary" dark type="submit">Enviar</v-btn>
              <v-btn v-if="!añadir" @click="editarReseña(idReseñaAEditar)" color="primary" dark>Actualizar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      dialog: false,
      reseñas: [],
      categorias: ['Película', 'Videojuego', 'Producto', 'Servicio'],
      titulo: '',
      categoria: null,
      genero: '',
      precio: 0,
      nombreElemento: '',
      calificacion: 0,
      reseña: '',
      sesionIniciada: false,
      userId: '',
      prueba: localStorage.getItem('usuario'),
      error: '',
      idReseñaAEditar: 0,
      añadir: true,
      hayReseñas: false,
    };
  },

  async mounted() {
    await this.traerReseñas();
  },
  methods: {
    async traerReseñas() {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        this.sesionIniciada = true;
        const usuario = JSON.parse(usuarioLocal);
        this.userId = usuario.id;
        axios.get(`http://localhost:4001/api/resenas/mis_resenas/${this.userId}`)
          .then(response => {
            if(response.data.message == 'No se encontraron reseñas.'){
              this.hayReseñas = false;
            } else {
              this.hayReseñas = true;
              this.reseñas = response.data;
            }
            
          }
          ).catch(error => {
            this.error = error;
          });
      } else {
        this.sesionIniciada = false;
      }
    },
    async submitReview() {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        this.sesionIniciada = true;
        const usuario = JSON.parse(usuarioLocal);
        this.userId = usuario.id;
      }
      const response = await axios.post('http://localhost:4001/api/resenas/crear_resena', {
        titulo: this.titulo,
        nombre: this.nombreElemento,
        contenido: this.reseña,
        categoria: this.categoria,
        rating: this.calificacion,
        usuarioID: this.userId,
        precio: this.precio
      });
      if (response.data.msg == 'Se añadio correctamente') this.$router.push('/misresenas');
      else this.error = response.data.msg;
      // Aquí puedes agregar la reseña a `reseñas` o enviarla a un servidor
      this.dialog = false; // Cierra el diálogo después de enviar
      this.traerReseñas();
    },
    async deleteReview(id) {
      const token = localStorage.getItem('token'); // Aquí obtienes el token
      await axios.delete('http://localhost:4001/api/resenas/eliminar/' + id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.traerReseñas();
    },
    async mostrarReseña(id) {
      this.añadir = false;
      const response = await axios.get('http://localhost:4001/api/resenas/resena/' + id);
      //const reseñaAEditar = (this.reseñas).data.reviews.find(reseña => reseña.id == id);
      const reseñaAEditar = response.data.reseña;
      this.nombreElemento = reseñaAEditar.Producto.nombre;
      this.titulo = reseñaAEditar.titulo;
      this.reseña = reseñaAEditar.contenido;
      this.categoria = reseñaAEditar.Producto.categoria;
      this.precio = reseñaAEditar.Producto.precio;
      this.calificacion = reseñaAEditar.rating;
      this.idReseñaAEditar = reseñaAEditar.id;
      this.dialog = true;
      this.traerReseñas();
    },
    async editarReseña(id) {
      const response = await axios.put('http://localhost:4001/api/resenas/editar_resena/' + id, {
        titulo: this.titulo,
        contenido: this.reseña,
        rating: this.calificacion
      });
      if (response.data.message == 'Reseña actualizada') {
        this.nombreElemento = '';
        this.titulo = '';
        this.reseña = '';
        this.categoria = '';
        this.precio = '';
        this.calificacion = 0;
        this.idReseñaAEditar = 0;
        this.dialog = false;
        this.traerReseñas();
      }
    },
    IrAComentarios(id) {
      this.$router.push({ name: 'Comentarios', params: { id: id } });
    },
  }
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

.mt-4{
  font-size: 16px;
  color: black;
}
</style>
