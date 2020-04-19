var nDia = 0 ;
var nPeriodo = 0 ;
var id = 28079; // 28079 - Madrid | 28047 - Villalba https://www.ine.es/daco/daco42/codmun/codmunmapa.htm
const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZXN1cy5tYXJ0aW5lei5ydWFub0B1cG0uZXMiLCJqdGkiOiJiZGVhMDkxMy1jMjdmLTQ0NjYtYTM2NC0xMjBiMDgzZTQwNmUiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTU4NTM5MTA2OSwidXNlcklkIjoiYmRlYTA5MTMtYzI3Zi00NDY2LWEzNjQtMTIwYjA4M2U0MDZlIiwicm9sZSI6IiJ9.6MRrWDgHVOszo-EprMzTCPWOhJhvOyX_WMT5W7kgBfI";
url1='https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/'+id+'?api_key='+apiKey  // previa devuelve url definitiva JSON
var JSONData = {};



function getSeason(d) {
          
    d = d || new Date();                           
    var day = d.getDate();                 
    prod = (30*(d.getMonth())+day); //d.getMonth -> indexado desde 0             
    if (prod >= 1 && prod < 80) { return "invierno" } // buscamos desde 1 de Enero
    else if (prod >= 80 && prod < 172) { return "primavera" }
    else if (prod >= 172 && prod < 264) { return "verano" }
    else if (prod >= 264 && prod < 354) { return "otoño" }
    else { return "xmas"} // desde el 21/12 has 31/12  japi niu lliar
  }

  

function cambiaFondo() {    
    let estacion = getSeason();    
    setInterval(function(){ 
       

            let season= getSeason();
            
            
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "script/test5.php?season="+season, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 || this.status === 200){ 
                    //console.log(this.responseText); // echo from php
                    var video = document.getElementById('videoBackground');
                    video.src = this.responseText;
                }       
            };
            xmlhttp.send(id);
               


        


        
     }, 10000);     
};



function getData() {
    
    $.getJSON(url1, function(previa) {        
        url=previa.datos;        
    })    
    .then(_datosJSON => {
        $.getJSON(url,async function(datosJSON) {
            JSONData = datosJSON;               
            document.getElementById("local").innerHTML = datosJSON[0].nombre;   // unico valor fijo a mostrar            
            //console.log(datosJSON)
            let mDatosDia = JSONData[0].prediccion.dia;
            let nDatosDia = mDatosDia.length;
            while(1) {                                                          // entramos en buckler XDDD
                for (i=nDia;i<nDatosDia;i++) {
                    nDia=i;                    
                    let mDatosPeriodo = mDatosDia[i];
                    let nDatosPeriodo = mDatosDia[i].probPrecipitacion.length;  //  esquema de periodo genérico
                    let startPeriodo = Math.floor((nDatosPeriodo/2.2));                    
                    for (j=startPeriodo;j<nDatosPeriodo;j++) {
                        nPeriodo=j;
                        document.getElementById("svg-object").setAttribute("data","icons/"+mDatosPeriodo.estadoCielo[j].value+".svg");                        
                        document.getElementById("local").innerHTML = JSONData[0].nombre;
                        jQuery("#local").fitText(0.66, { minFontSize: '72px', maxFontSize: '144px' }); // Ajustamos texto                        
                        var formatDate= (new Intl.DateTimeFormat('es-ES', { weekday:'short',month: 'short', day: '2-digit'}).format(new Date(mDatosDia[i].fecha))).replace(/ /g,'/');
                        formatDate = formatDate.replace(/[.,]/g, '');           // quitar puntos y comas
                        let vPeriodoEC ="h"                                     // periodo estado cielo cuando dia [4,5,6] periodo es undefined deberia ser 00-24
                        if( mDatosPeriodo.estadoCielo[j].periodo == undefined ) {vPeriodoEC = "00-24h" } else  { vPeriodoEC=mDatosPeriodo.estadoCielo[j].periodo+"h"}; // si periodo undefined poner 00-24 y/o la h
                        document.getElementById("fecha").innerHTML = `${formatDate}<br/> ${vPeriodoEC }` ;  // diasem/dia/mes hh-mm
                        if( mDatosPeriodo.estadoCielo[j].descripcion.length < 1 ) { j++ ; continue } else  { document.getElementById("desc").innerHTML =`${mDatosPeriodo.estadoCielo[j].descripcion}`}; // si descripción vacia -> saltar al siguiente periodo
                        document.getElementById("tmax").innerHTML =`${mDatosPeriodo.temperatura.maxima}\u00B0C`;
                        document.getElementById("tmin").innerHTML =`${mDatosPeriodo.temperatura.minima}\u00B0C`;                        
                        document.getElementById("prep").innerHTML =`Lluvia\n ${mDatosPeriodo.probPrecipitacion[j].value}%`;
                        document.getElementById("viento").innerHTML =`Viento <br/> ${mDatosPeriodo.viento[j].direccion} - ${mDatosPeriodo.viento[j].velocidad} Km/h`;
                        await sleep(3000);
                    }                
                }
                if(nDia==6) {
                    nDia=0;
                }
            }
        })
    })
}

function sleep(ms) {    
    return new Promise(resolve => setTimeout(resolve, ms));
}

cambiaFondo()
getData()