new Vue({
  el: "#app",
  created: function () {
    var self = this;
    axios
      .get("https://bus9ijilni.execute-api.us-east-1.amazonaws.com/latest/iss")
      .then(function (response) {
        self.iss.push(response.data);
      });
    setTimeout(() => (this.spineActive = false), 6000);
    setTimeout(() => this.creaMapa(), 7000);
    setInterval(this.obtienePosicion, 1500);
  },
  data: {
    radianes: 0,
    centigrados: 0,
    deltaLongi: 0,
    deltaLati: 0,
    pendiente: 0,
    direccion: '',
    cardinal: 0,
    direccionPrecisa: '',
    iss: [],
    spineActive: true,
    mapaCreado: null,
    centro: [],
    pushpin: null,
    posicionAnterior: [],
    trayectoria: []
  },
  methods: {
    obtienePosicion: function () {
      var self = this;
      axios
        .get("https://bus9ijilni.execute-api.us-east-1.amazonaws.com/latest/iss")
        .then(function (response) {
          self.posicionAnterior = { lat: self.iss[0].lat, longi: self.iss[0].longi };
          self.deltaLati = response.data.iss_position.latitude - self.posicionAnterior.lat;
          self.deltaLongi = response.data.iss_position.longitude - self.posicionAnterior.longi;
          self.pendiente = self.deltaLati / self.deltaLongi;
          self.radianes = Math.atan(self.pendiente);
          self.centigrados = self.radianes * 180 / (Math.PI);
          self.cardinal = self.centigrados < 90 ? 90 - self.centigrados : 450 - self.centigrados;

          if (self.deltaLongi > 0) {
            if (self.pendiente < 1 && self.pendiente > -1) {
              self.direccion = 'ESTE'
            } else if (self.pendiente > 1) {
              self.direccion = 'NORTE'
            } else if (self.pendiente < -1) {
              self.direccion = 'SUR'
            }
          } else {
            self.direccion = 'AVANZANDO HACIA EL OESTE'
          }

          self.iss.pop();
          self.iss.push({
            lat: response.data.iss_position.latitude,
            longi: response.data.iss_position.longitude,
          });

          // Actualizar la posición del mapa y el marcador
          self.mapaCreado.setView([response.data.iss_position.latitude, response.data.iss_position.longitude]);
          self.pushpin.setLatLng([response.data.iss_position.latitude, response.data.iss_position.longitude]);

          // Dibujar la línea de trayectoria
          var nuevaLinea = L.polyline([
            [self.posicionAnterior.lat, self.posicionAnterior.longi],
            [response.data.iss_position.latitude, response.data.iss_position.longitude]
          ], {
            color: 'red',
            weight: 5,
            dashArray: '4, 4'
          }).addTo(self.mapaCreado);

          // Opcional: mantener un registro de las líneas para poder eliminarlas después si es necesario
          self.trayectoria.push(nuevaLinea);

          // Opcional: limitar el número de líneas mostradas para mejorar el rendimiento
          if (self.trayectoria.length > 50) {
            self.mapaCreado.removeLayer(self.trayectoria.shift());
          }
        });
    },
    creaMapa: async function () {
      var self = this;
      
      // Inicializar el mapa de Leaflet
      this.mapaCreado = L.map('myMap').setView([-32.906, -68.844], 11);
      
      // Añadir la capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.mapaCreado);

      // Crear un icono personalizado para el satélite
      var sateliteIcon = L.icon({
        iconUrl: 'satelite.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Crear y añadir el marcador
      this.pushpin = L.marker([self.iss[0].lat, self.iss[0].longi], {
        icon: sateliteIcon
      }).addTo(this.mapaCreado);

      // Inicializar el array para la trayectoria
      this.trayectoria = [];
    }
  }
});
