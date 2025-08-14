# 🛰️ ISS Tracker v2.0.0

Aplicación web para el seguimiento en tiempo real de la Estación Espacial Internacional (ISS) construida con Vue 3 y Leaflet.js.

## ✨ Características

- 📡 **Seguimiento en tiempo real** de la ISS con actualizaciones cada 5 segundos
- 🗺️ **Mapa interactivo** con Leaflet.js
- 📍 **Centrado automático** en la posición actual de la ISS
- 🛤️ **Rastro orbital** que muestra las últimas 50 posiciones
- 📊 **Panel de información** con coordenadas y estado de conexión
- 📱 **Diseño responsive** adaptado para móviles y escritorio
- 🎯 **Marcador personalizable** para la ISS

## 🚀 Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Leaflet.js** - Biblioteca de mapas interactivos
- **OpenStreetMap** - Tiles de mapa gratuitos
- **ISS Open Notify API** - API pública para datos de la ISS

## 📦 Instalación

```sh
# Clonar el repositorio
git clone https://github.com/fabio2100/issPWA.git
cd issPWA

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Scripts Disponibles

```sh
# Desarrollo con hot-reload
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview
```

## 🌐 API

Este proyecto utiliza la API gratuita de [Open Notify](http://open-notify.org/):
- **Endpoint**: `http://api.open-notify.org/iss-now.json`
- **Frecuencia**: Cada 5 segundos
- **Datos**: Latitud, longitud y timestamp de la ISS

## 📱 PWA Ready

La aplicación está preparada para funcionar como Progressive Web App (PWA) con:
- Capacidades offline
- Instalación en dispositivos móviles
- Experiencia nativa

## 🎯 Características v2.0.0

### Nuevas funcionalidades:
- ✅ Seguimiento automático con centrado en la ISS
- ✅ Panel de información lateral
- ✅ Rastro orbital visual
- ✅ Indicador de estado de conexión
- ✅ Diseño responsive mejorado
- ✅ Configuración de proxy para CORS
- ✅ Iconos personalizables

### Mejoras técnicas:
- ✅ Optimización de rendimiento
- ✅ Manejo robusto de errores
- ✅ Limpieza automática de recursos
- ✅ Código modular y mantenible

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- [ISS Open Notify API](http://open-notify.org/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)

---

Desarrollado con ❤️ para el seguimiento espacial
