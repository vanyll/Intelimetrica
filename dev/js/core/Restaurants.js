/**
 * Clase modelo que contiene la información de los restaurantes
 * así como métodos para manipular esta información.
 * Se agrega tambien un método para obtener los datos del servicio.
 * @param {String}   dataUrl  Cadena con la ruta del servicio de donde se obtienen los datos
 * @param {String}   order    Tipo de ordenamiento . ('acb' | 'rat')
 * @param {Function} callback Funcion a ejeccutarse una vez devueltos los datos
 */
var Restaurants = function(dataUrl, order, callback){
  /**
   * Todos los datos obtenidos del servicio
   * @type {Array}
   */
  this._allData=[];
  /**
   * Datos que se muestran actualmente (luego de los filtros)
   * @type {Array}
   */
  this._data=[];
  /**
   * Radio de búsqueda
   * @type {Number}
   */
  this._radio=1;
  /**
   * Tipo de ordenamiento
   * @type {String}
   */
  this._order=order;
  /**
   * Cadena con la ruta del servicio del que se obtienen los datos
   * @type  {String} 
   */
  if (typeof dataUrl != 'undefined') {
    this._dataUrl=dataUrl;
  }
  /**
   * Función a ejecutar luego de obtener los datos del servicio
   * @type  {function}
   */
  if (typeof callback == 'function') {
    this._callback=callback;
  }
  this._getAllData();
}
Restaurants.prototype = {
  /**
   * Obtiene los datos del servicio
   * @return {void} 
   */
  _getAllData: function(){
    var that, request;
    that = this;
    request = new XMLHttpRequest();
    request.open("GET", this._dataUrl, true);
    request.send(null);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if(request.status == 200) {
          that._allData = JSON.parse(request.responseText);
          that._callback(that);
        }
      }
    };
  },
  _getRad : function(long) {
    return long * Math.PI / 180;
  },
  _getDistance : function(point1, point2) {
    var R = 6378139.7;
    var distLat = this._getRad(point2.lat - point1.lat);
    var distLong = this._getRad(point2.lng - point1.lng);
    var a = Math.sin(distLat / 2) * Math.sin(distLat / 2) +
      Math.cos(this._getRad(point1.lat)) * Math.cos(this._getRad(point2.lat)) *
      Math.sin(distLong / 2) * Math.sin(distLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  },
  /**
   * Actualiza los datos que deben estar visibles segun los filtros
   * @param  {object}   location Posicion actual del centro del mapa
   * @param  {Number}   radio    Radio de visualizacion 
   * @return {Array} this._data Arreglo con los resultados del filtrado
   */
  uptadeData : function(location, radio){
    this._data=[];
    //filtro
    for(var i = 0 ; i < this._allData.length ; i++){
      if (this._getDistance(location, this._allData[i].address.location) < radio) {
        this._data.push(this._allData[i]);
      }
    }
    //orden
    if (this._order=="abc") {
      this._data=this._data.sort(function(i, j) {
        return (i.name.toLowerCase() < j.name.toLowerCase()) ? -1 : (i.name.toLowerCase() > j.name.toLowerCase()) ? 1 : 0;
      });
    }
    else if (this._order=="rat"){
      this._data=this._data.sort(function(i, j) {
        return (parseInt(i.rating) < parseInt(j.rating)) ? 1 : (parseInt(i.rating) > parseInt(j.rating)) ? -1 : 0;
      });
    }
    return this._data;

  },
  /**
   * Cambia la propiedad order.
   * @param {String} order Tipo de ordenamiento
   */
  setOrder: function(order){
    if (typeof order != 'undefined') {
      this._order=order;
    }
  }
}
Restaurants.prototype.constructor = Restaurants;