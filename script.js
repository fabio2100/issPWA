if('serviceWorker' in navigator){
  navigator.serviceWorker.register("./sw.js")
  .then(reg => console.log("Registro de sw",reg))
  .catch(error => console.log(error))
}