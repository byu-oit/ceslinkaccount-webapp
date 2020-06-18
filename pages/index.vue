<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Hello {{username}}!</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'root/username'
      ])
    }
  }

</script>
