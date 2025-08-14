<script setup>
import LeafletMap from './components/LeafletMap.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>ISS Tracker</h1>
      <p>Seguimiento en tiempo real de la Estación Espacial Internacional</p>
    </div>
  </header>

  <main>
    <LeafletMap />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
}

main {
  width: 100%;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    place-items: center;
    flex-wrap: wrap;
  }
}
</style>
