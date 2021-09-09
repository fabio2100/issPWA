var ApiBuilder = require('claudia-api-builder');
var axios = require('axios');

api = new ApiBuilder();


api.get('/iss',function(){
  return new Promise(function(resolve,reject){
    axios.get('http://api.open-notify.org/iss-now.json')
    .then(function({data}){
      resolve(data)
    })
    .catch(function(err){
      resolve();
    })
  })
}

)

module.exports = api;