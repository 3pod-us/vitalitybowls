/*
  Crear elementos de ubicación dentro de "locations" con el formato de código de país de dos letras. (Alpha Code 2): 
  //-> https://es.wikipedia.org/wiki/ISO_3166-1
  Las horas de apertura y de cierre deben estar en formatos de 24H y 12H
*/

var vitality_opening_times = {
  locations: {
    CO: { // colombia alpha code
      open_at: {
        formats: { // 8 de la mañana
          "twenty_four" : "08:00",
          "twelve": "8:00 AM"
        }
      },
      close_at: {
        formats: { // 4 de la tarde
          "twenty_four" : "16:00",
          "twelve": "4:00 PM"
        }
      },
    },
    MX: { // mexico alpha code
      open_at: {
        formats: { // 10 de la mañana
          "twenty_four" : "10:00",
          "twelve": "10:00 AM"
        }
      },
      close_at: {
        formats: { // 6 de la tarde
          "twenty_four" : "18:00",
          "twelve": "6:00 PM"
        }
      },
    },
    VE: { // venezuela alpha code
      open_at: {
        formats: { // 7 y media de la mañana
          "twenty_four" : "07:30",
          "twelve": "7:30 AM"
        }
      },
      close_at: {
        formats: { // 6 de la tarde
          "twenty_four" : "18:00",
          "twelve": "6:00 PM"
        }
      },
    },
    //... more locations
  },  
};
function parseINIString(data){
	var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}
var getOpenAndCloseTimes = {
  openCloseTimes: null,
  getLocation: function(ready){
    // obtener ubicación:
    ready = ready||function(){};
    fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(r){
        return r.text();
    }).then(function(r){
        ready(parseINIString(r))
    })
  },
  init: function(format, ready){
    var app = this;
    format = format||"twelve";
    ready = ready||function(){};
    this.getLocation(function(location){
      var currentTime = new Date().getTime();
      location = location.loc;
      app.openCloseTimes = vitality_opening_times.locations[location];
      app.open_at = app.openCloseTimes.open_at.formats[format];
      app.close_at = app.openCloseTimes.close_at.formats[format];
      
      ready(app.open_at, app.close_at);
    })
  }
}

// colocar twelve o twenty_four para cambiar el formato de hora.

// Colocar la clase CSS a los elementos que mostrarán la hora open/close
// clase para los elementos que mostrarán la hora de apertura: location_open_at_element;
// clase para los elementos que mostrarán la hora de cierre: location_close_at_element;

// ejemplo de elemento:
// <div class="location_open_at_element"></div>
// <div class="location_close_at_element"></div>


// ejecutando script:
getOpenAndCloseTimes.init("twelve", function(open_at, close_at){
  var location_open_at_elements = [...document.querySelectorAll(".location_open_at_element")]; 
  var location_close_at_elements = [...document.querySelectorAll(".location_close_at_element")]; 

  console.info(open_at, close_at);
  try{
    location_open_at_elements.map(function(node){
      node.innerText = open_at;
    });
    location_close_at_elements.map(function(node){
      node.innerText = close_at;
    });
  }catch(e){console.error(e)}
})
