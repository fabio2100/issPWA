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
    radianes:0,
    centigrados: 0,
    deltaLongi:0,
    deltaLati:0,
    pendiente:0,
    direccion:'',
    cardinal: 0,
    direccionPrecisa:'',
    iss: [],
    spineActive: true,
    mapaCreado: [],
    centro: [],
    pushpin: [],
    posicionAnterior: [],
  },
  methods: {
    obtienePosicion: function () {
      var self = this;
      axios
        .get("https://bus9ijilni.execute-api.us-east-1.amazonaws.com/latest/iss")
        .then(function (response) {
          self.posicionAnterior = {lat:self.iss[0].lat,longi:self.iss[0].longi};
          self.deltaLati=response.data.iss_position.latitude-self.posicionAnterior.lat;
          self.deltaLongi=response.data.iss_position.longitude-self.posicionAnterior.longi;
          self.pendiente = self.deltaLati/self.deltaLongi;
          self.radianes = Math.atan(self.pendiente);
          self.centigrados = self.radianes*180/(Math.PI);
          self.cardinal = self.centigrados < 90 ? 90 - self.centigrados : 450 - self.centigrados;
          if(self.deltaLongi > 0){
            if(self.pendiente < 1 && self.pendiente > -1){
              self.direccion = 'ESTE'
            }else if(self.pendiente > 1){
              self.direccion = 'NORTE'
            }else if(self.pendiente < -1){
              self.direccion = 'SUR'
            }
          }else{
            self.direccion = 'AVANZANDO HACIA EL OESTE'
          }
          //DIRECCIÓN PRECISA
          if(self.deltaLongi > 0){

          }else{
            self.direccionPrecisa = 'AVANZANDO HACIA EL OESTE'
          }
          self.iss.pop();
          self.iss.push({
            lat: response.data.iss_position.latitude,
            longi: response.data.iss_position.longitude,
          });
          self.mapaCreado.setView({
            center: new Microsoft.Maps.Location(
              response.data.iss_position.latitude,
              response.data.iss_position.longitude
            ),
          });
          self.center = self.mapaCreado.getCenter();
          self.pushpin.setLocation(self.center);
          var coor = [
            self.center,
            new Microsoft.Maps.Location(
              self.posicionAnterior.lat,
              self.posicionAnterior.longi
            ),
            
          ];
          var line = new Microsoft.Maps.Polyline(coor, {
            strokeColor: "red",
            strokeThickness: 5,
            strokeDashArray: [4, 4]
          });
          self.mapaCreado.entities.push(line);
        });
    },
    creaMapa: async function () {
      var self = this;
      this.mapaCreado = new Microsoft.Maps.Map("#myMap", {
        credentials:
          "Auy5v8ublpzBYNHJHWATcR9iRYo8xlBc-t3lAb-hTQ2u2pycKtsiU_9ZrX6_TY-a",
        center: new Microsoft.Maps.Location(-32.906, -68.844),
        zoom: 11,
      });
      this.mapaCreado.setView({
        center: new Microsoft.Maps.Location(self.iss[0].lat, self.iss[0].longi),
      });
      this.centro = this.mapaCreado.getCenter();
      this.pushpin = new Microsoft.Maps.Pushpin(self.centro, {
        icon: "satelite.svg",
      });
      this.mapaCreado.entities.push(self.pushpin);
    },
  },
});
