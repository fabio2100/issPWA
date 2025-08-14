<template>
  <div class="map-wrapper">
    <div class="info-panel">
      <h3>Estación Espacial Internacional</h3>
      <div v-if="issData" class="iss-info">
        <p><strong>Latitud:</strong> {{ issData.iss_position.latitude }}°</p>
        <p><strong>Longitud:</strong> {{ issData.iss_position.longitude }}°</p>
        <p><strong>Última actualización:</strong> {{ formatTimestamp(issData.timestamp) }}</p>
        <p class="status" :class="{ online: isOnline, offline: !isOnline }">
          {{ isOnline ? '🟢 Conectado' : '🔴 Desconectado' }}
        </p>
      </div>
      <div v-else class="loading">
        <p>Cargando datos de la ISS...</p>
      </div>
    </div>
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'

// Estado reactivo
const issData = ref(null)
const isOnline = ref(false)

// Variables para el mapa y marcadores
let map = null
let issMarker = null
let issTrail = []
let trailPolyline = null
let intervalId = null

// Icono por defecto de Leaflet (marcador original)
const issIcon = L.icon({
  iconUrl: 'assets/satellite256.svg',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [50, 82],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Función para obtener datos de la ISS
const fetchISSData = async () => {
  try {
    // Usar el proxy configurado en Vite o la URL directa
    const apiUrl = import.meta.env.DEV 
      ? '/api/iss-now.json' 
      : 'https://api.open-notify.org/iss-now.json'
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    if (data.message === 'success') {
      issData.value = data
      isOnline.value = true
      updateISSPosition(data.iss_position)
    }
  } catch (error) {
    console.error('Error al obtener datos de la ISS:', error)
    isOnline.value = false
  }
}

// Función para actualizar la posición de la ISS en el mapa
const updateISSPosition = (position) => {
  const lat = parseFloat(position.latitude)
  const lng = parseFloat(position.longitude)
  
  // Si es la primera vez, crear el marcador
  if (!issMarker) {
    issMarker = L.marker([lat, lng], { icon: issIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <strong>🛰️ Estación Espacial Internacional</strong><br>
          <small>Lat: ${lat.toFixed(4)}°<br>Lng: ${lng.toFixed(4)}°</small>
        </div>
      `)
    
    // Centrar el mapa en la ISS la primera vez con un zoom apropiado
    map.setView([lat, lng], 6)
  } else {
    // Actualizar la posición del marcador existente
    issMarker.setLatLng([lat, lng])
    issMarker.getPopup().setContent(`
      <div style="text-align: center;">
        <strong>🛰️ Estación Espacial Internacional</strong><br>
        <small>Lat: ${lat.toFixed(4)}°<br>Lng: ${lng.toFixed(4)}°</small>
      </div>
    `)
  }
  
  // Siempre centrar el mapa en la posición actual de la ISS
  map.setView([lat, lng], map.getZoom())
  
  // Agregar punto al rastro (máximo 50 puntos)
  issTrail.push([lat, lng])
  if (issTrail.length > 50) {
    issTrail.shift() // Remover el punto más antiguo
  }
  
  // Actualizar la línea del rastro
  if (trailPolyline) {
    map.removeLayer(trailPolyline)
  }
  
  if (issTrail.length > 1) {
    trailPolyline = L.polyline(issTrail, {
      color: '#ff6b6b',
      weight: 2,
      opacity: 0.7,
      dashArray: '5, 5'
    }).addTo(map)
  }
}

// Función para formatear timestamp
const formatTimestamp = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('es-ES')
}

onMounted(() => {
  // Crear el mapa
  map = L.map('map', {
    worldCopyJump: true,
    maxBounds: [[-90, -180], [90, 180]]
  }).setView([0, 0], 10)

  // Agregar capa de tiles de OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Obtener datos iniciales
  fetchISSData()
  
  // Configurar intervalo para actualizaciones cada 5 segundos
  intervalId = setInterval(fetchISSData, 5000)
})

onUnmounted(() => {
  // Limpiar intervalo
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  // Limpiar mapa
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.map-wrapper {
  display: flex;
  gap: 1rem;
  height: 500px;
}

.info-panel {
  flex: 0 0 250px;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  text-align: center;
}

.iss-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.status {
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  margin-top: 1rem;
}

.status.online {
  background-color: #d4edda;
  color: #155724;
}

.status.offline {
  background-color: #f8d7da;
  color: #721c24;
}

.loading {
  text-align: center;
  color: #6c757d;
}

.map-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Estilos para el mapa */
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .map-wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .info-panel {
    flex: none;
    order: 2;
  }
  
  .map-container {
    height: 400px;
    order: 1;
  }
}
</style>
