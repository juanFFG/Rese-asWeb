<template>
  <div>
    <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
      <v-col cols="12" md="6">
        <v-card class="py-6">
          <v-card-title class="d-flex justify-center">
            <div class="text-h4">
              Verificación
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field
                v-model="code"
                label="Código de verificación"
                outlined
                required
            ></v-text-field>
            <div class="text-right">
              <v-btn color="primary" @click="verify">
                Verificar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      code: '', // Este es el código de verificación que el usuario ingresará
      email: localStorage.getItem('email') || '' // Recupera el correo electrónico del almacenamiento local
    };
  },
  methods: {
    async verify() {
      try {
        console.log({ email: this.email, code: this.code }); // Agregado para imprimir los datos de la solicitud

        // Hace una solicitud POST al servidor para verificar la cuenta
        const response = await axios.post('http://localhost:3000/verify', {
          email: this.email,
          code: this.code,
        });

        console.log(response.data); // Imprime la respuesta del servidor

        // Si la verificación fue exitosa, redirige al usuario a la página de inicio de sesión
        if (response.data.msg === 'Cuenta verificada con éxito') {
          this.$router.push('/login'); 
          console.log(this.$route.path); // Imprime la ruta actual después de la redirección
        } else {
          // Si hubo un error en la verificación, muestra un mensaje de error
          alert('Error de verificación: ' + response.data.msg);
        }
      } catch (error) {
        console.error('Error de verificación:', error);
      }
    },
  },
};
</script>
