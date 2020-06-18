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
export default {
  computed: {
    username () {
      return this.$store.getters['root/username'] || 'World'
    }
  }
}
</script>
