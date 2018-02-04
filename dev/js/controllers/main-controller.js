/**
 * Controlador principal
 * @return {void} 
 */
(function(){
  /**
   * Configuracion inicial del controlador
   * @type {Object}
   */
  var _INITIAL_CONFIG = {
    MAP_SELECTOR : '.map',
    CENTER : {
      LAT : 19.440057053713137,
      LNG : -99.12704709742486
    },
    MAP_TYPE : 'local',
    RESTAURANTS_CONFIG : {
      DATA_URL : 'https://s3-us-west-2.amazonaws.com/lgoveabucket/data_melp.json',
      RADIO : 150,
      ORDER_BY : "abc",
    }
  }
  /**
   * Objeto que tiene la informacion de los restaurantes 
   * @type {Object}
   */
  var _dataRestaurants = {};
  /**
   * Referencia al objeto map principal
   * @type {Object}
   */
  var _mainMap = {}
  /**
   * Objeto que tiene los resultados de busqueda
   * @type {Object}
   */
  var _listResults = {}
  /**
   * Evento que se ejecuta cuando se coloca el cursor
   * sobre un elemento de la lista de resultados
   * @param  {string} identifier Identificador del elemento
   * @return {void}            
   */
  var eventHoverResults = function(identifier){
    _mainMap.markers.forEach(function(elem){
      if (elem.id == identifier) {
        if (elem.getAnimation()==google.maps.Animation.BOUNCE) {
          elem.setAnimation(null);
        }
        else{
          elem.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    });
    
  }
  /**
   * Evento que se ejecuta cuando se hace click
   * sobre un elemento de la lista de resultados
   * @param  {string} identifier Identificador del elemento
   * @return {void}            
   */
  var eventClickResults = function(identifier){
    _mainMap.markers.forEach(function(elem){
      if (elem.id == identifier) {
        _mainMap.map.panTo(elem.getPosition());
        new google.maps.event.trigger( elem, 'click' );
      }
    });
  }
  /**
   * Inicializa el mapa y los eventos de los marcadores
   * @return {void} 
   */
  var initMap = function(){
    var center;
    center = {lat:_INITIAL_CONFIG.CENTER.LAT, lng:_INITIAL_CONFIG.CENTER.LNG};
    _dataRestaurants = new Restaurants(_INITIAL_CONFIG.RESTAURANTS_CONFIG.DATA_URL, _INITIAL_CONFIG.RESTAURANTS_CONFIG.ORDER_BY, function(e){
      var data=e.uptadeData(center , _INITIAL_CONFIG.RESTAURANTS_CONFIG.RADIO);
      _mainMap = new map(center, _INITIAL_CONFIG.MAP_SELECTOR, _INITIAL_CONFIG.MAP_TYPE, data, function(marker){
        //Mostrar contenido para compartir en redes sociales para cada
        //marcador. La variable "marker" tiene la información del marcador
        //que fue cliqueado.
      });
      initListeners();
    });
  }
  /**
   * Inicializa los eventos ligados a la interacción entre
   * el mapa, el formulario de búsqueda y la lista de
   * resultados
   * @return {void} 
   */
  var initListeners = function(){
    var map, resultsList, mainForm, order, radio ;
    map = document.querySelector('.map');
    resultsList = document.querySelector('.result-list');
    mainForm = document.querySelector('.main-form');
    order = document.getElementById('order');
    radio = document.getElementById('radio');
    //Evento del formulario principal.
    mainForm.addEventListener('submit', function(event){
      event.preventDefault();
      //Aqui iría llamada a _dataRestaurants._getAllData para actualizar los datos.
      //Como los datos siempre son los mismos, solo se llama a _dataRestaurants.uptadeData
      //para actualizar los elementos que se ven en el mapa
      var updatedData;
      updatedData = _dataRestaurants.uptadeData({lat:_mainMap.map.getCenter().lat(), lng: _mainMap.map.getCenter().lng()} , document.getElementById("radio").value);
      _listResults = new results();
      _listResults.build(updatedData, function(id){eventHoverResults(id)}, function(id){eventClickResults(id)});
      map.classList.add('active');
    });
    //Evento del select de Ordenamiento.
    order.addEventListener('change', function(){
      var data;
      _dataRestaurants.setOrder(document.getElementById("order").value);
      data = _dataRestaurants.uptadeData({lat:_mainMap.map.getCenter().lat(), lng: _mainMap.map.getCenter().lng()} , document.getElementById("radio").value);
      _listResults.build(data, function(id){eventHoverResults(id)}, function(id){eventClickResults(id)}); 
    });
    //Evento del select de Radio.
    radio.addEventListener('change', function(){
      var data;
      data=_dataRestaurants.uptadeData({lat:_mainMap.map.getCenter().lat(), lng: _mainMap.map.getCenter().lng()} , document.getElementById("radio").value);
      _listResults.build(data, function(id){eventHoverResults(id)}, function(id){eventClickResults(id)}); 
      _mainMap.updateMarkers(data);
    });
    //Evento "cambio de centro en el mapa"
    _mainMap.map.addListener('center_changed', function() {
      var data = _dataRestaurants.uptadeData({lat:_mainMap.map.getCenter().lat(), lng: _mainMap.map.getCenter().lng()} , document.getElementById("radio").value);
      _listResults.build(data, function(id){eventHoverResults(id)}, function(id){eventClickResults(id)}); 
      _mainMap.updateMarkers(data);
    });
  }
  var init = function(){
    initMap();
  }
  init();
})()





