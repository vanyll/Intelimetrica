/**
 * Script que maneja el mapa, sus marcadores y sus infowindows
 * @param  {Object} center          Centro del mapa a crear
 * @param  {String} container       Query selector del elemento que contendrá al mapa
 * @param  {String} closing         Tipo de acercamiento. ("local" | "global")
 * @param  {Array} dataMarkers     Marcadores iniciales del mapa
 * @param  {Function} eventInfowindow Funcion a ejecutar al dar click en un marcador
 */
var map = function(center, container, closing, dataMarkers, eventInfowindow){
  /**
   * Zoom para mapas con mucho acercamiento
   * @type {Number}
   */
  this._LOCAL_ZOOM = 19;
  /**
   * Zoom para mapas con poco acercamiento
   * @type {Number}
   */
  this._GLOBAL_ZOOM = 2;
  /**
   * Centro del mapa
   */
  if (typeof center != 'undefined') {
    this._center=center;
  }
  /**
   * Contenedor donde se pondrá el mapa
   */
  if (typeof container != 'undefined') {
    this._map_container = document.querySelector(container);
  }
  /**
   * Acercamiento que tendrá el mapa
   */
  if (typeof closing != 'undefined') {
    switch (closing) {
      case "local":
        this._zoom=this._LOCAL_ZOOM;
        break;
      case "global":
        this._zoom=this._GLOBAL_ZOOM;
        break;
      default:
        this._zoom=this._GLOBAL_ZOOM;
    }
  }
  /**
   * Marcadores del mapa
   */
  if (typeof dataMarkers != 'undefined') {
    this._dataMarkers=dataMarkers;
  }
  /**
   * Evento que se ejecutará al hacer click en
   * un marcador
   */
  if (typeof eventInfowindow != 'undefined') {
    this._event_infowindow = eventInfowindow;
  }
  this.map={};
  this.markers=[];
  this._build();
}
map.prototype = {
  /**
   * Si existe, inicializa el listener definido por el usuario
   * para el evento click sobre los marcadores
   * @param  {[Object]} marker Marcador de Google Maps al que
   * se agregará el listener
   * @return void
   */
  _markerBehavior: function(marker){
    if (this._event_infowindow) {
      var that=this;
      marker.addListener('click', function() {
        marker.infoWindow.open(that.map, marker);
        that._event_infowindow(marker);
      });
    }
  },
  /**
   * Crea un nuevo marcador de google maps y lo
   * añade al mapa
   * @param  {[object]} data Objeto con los datos que se 
   * usan para crear el marcador
   * @return void
   */
  _createMarker: function(data){
    var marker, infowindow;
    infowindow = new google.maps.InfoWindow({
      content: data.name
    });
    marker= new google.maps.Marker({
      position: {lat:data.address.location.lat, lng:data.address.location.lng},
      map: this.map,
      id: data.id,
      infoWindow: infowindow,
      title: data.title,
      icon: data.url,
    });
    this._markerBehavior(marker);
    this.markers.push(marker);
  },
  /**
   * Construye el mapa y sus marcadores
   * @return void
   */
  _build: function(){
    var config;
    config={
      zoom: this._zoom,
      center: {lat:this._center.lat,lng:this._center.lng}
    }
    this.map = new google.maps.Map(this._map_container, config);
    for (var i = 0; i < this._dataMarkers.length ; i++){
      this._createMarker(this._dataMarkers[i]);
    }
    
  },
  /**
   * Quita todos los marcadores del mapa
   * @return {void} 
   */
  _clearMap: function(){
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers=[];
  },
  /**
   * Actualiza los marcadores del mapa
   * @param  {Array} markers Arreglo de objetos de tipo Marker
   * @return {void}         
   */
  updateMarkers: function(markers){
    this._clearMap();
    this._dataMarkers=markers;
    for (var i = 0; i < this._dataMarkers.length ; i++){
      this._createMarker(this._dataMarkers[i]);
    }
  }
}
map.prototype.constructor = map;






