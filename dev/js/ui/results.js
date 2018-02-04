/**
 * Script que maneja la vista de la lista de resultados 
 * @return {void} 
 */
var results = function(){
  /**
   * Informacion actual de la lista de resultados
   * @type {Object}
   */
  this._data = {};
  /**
   * Numero total actual de resultados
   * @type {Number}
   */
  this._restaurantsCount = 0;
  /**
   * Desviacion estandar actual
   * @type {Number}
   */
  this._deviationRating = 0;
  /**
   * Promedio actual
   * @type {Number}
   */
  this._averageRating = 0;
}
results.prototype = {
  /**
   * Construye la vista de los resultados en el html 
   * @param  {Array} dataResults           Arreglo con la informacion a mostrar
   * @param  {Function} eventHoverListElement Funcion a ejecutar al hacer hover en cada elemento
   * @param  {Function} eventClickListElement Funcion a ejecutar al hacer click en cada elemento
   * @return {void}                       
   */
  build: function(dataResults, eventHoverListElement, eventClickListElement){
    var ul,container;
    this._data=dataResults;
    ul = document.querySelector(".results-list");
    container = document.querySelector(".list-container");
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
    }
    for(var i = 0 ; i < this._data.length ; i++){
      var li, name, rating, address, site, phone;
      li = document.createElement("li");
      name = document.createElement("h3");
      rating = document.createElement("span");
      address = document.createElement("p");
      site = document.createElement("a");
      phone = document.createElement("p");
      name.id = this._data[i].id;
      name.innerText = this._data[i].name;
      rating.innerText = this._data[i].rating + " " ;
      address.innerText = this._data[i].address.street;
      site.innerText = this._data[i].contact.site;
      site.href = this._data[i].contact.site;
      site.target = "_blank";
      phone.innerText = this._data[i].contact.phone;
      li.classList.add('results-list-element');
      for(var j = 0 ; j < 5 ; j++){
        var star=document.createElement("span");
        star.innerText='\u2605';
        if (j < this._data[i].rating) {
          star.classList.add('active');
        }
        rating.classList.add('rating');
        rating.appendChild(star);
      }
      (function(id){
        name.addEventListener('mouseenter', function(){
          eventHoverListElement(id);
        })
        name.addEventListener('mouseout', function(){
          eventHoverListElement(id);
        })
        name.addEventListener('click', function(){
          eventClickListElement(id);
        })
      })(this._data[i].id);
      li.appendChild(name);
      li.appendChild(rating);
      li.appendChild(address);
      li.appendChild(site);
      li.appendChild(phone);
      ul.appendChild(li);
    }
    container.classList.add('active');
    this._metrics();
  },
  /**
   * Calcula el promedio 
   * @param  {Array} elements Arreglo con las cantidades a promediar
   * @return {Number}          Porcentaje promediado
   */
  _calcAverage: function(elements){
    elements = elements.length > 0 ? elements : [0];
    var sum = elements.reduce(function(i, j){
      return i + j
    })
    return sum/elements.length;
  },
  /**
   * Calcula la desviación estándar
   * @param  {Array} elements Arreglo con las cantidades a promediar
   * @return {Number}          Desviación estándar
   */
  _calcDeviation : function(elements){
    var average, distances;
    average = this._calcAverage(elements);
    distances = 0;
    elements.forEach(function(elem, i){
      distances += Math.pow((elem - average), 2);
    });
    return Math.sqrt(distances/this._restaurantsCount).toFixed(4);
  },
  /**
   * Construye las metricas de los resultados
   * @return {void} 
   */
  _metrics : function(){
    this._restaurantsCount = this._data.length;
    document.querySelector(".metrics p:nth-child(1)").innerText="Encontrados: "+this._restaurantsCount;
    var tempRating = [];
    this._data.forEach(function(elem){
      tempRating.push(elem.rating);
    });
    document.querySelector(".metrics p:nth-child(2)").innerText="Rating promedio: "+this._calcAverage(tempRating);
    document.querySelector(".metrics p:nth-child(3)").innerText="Desviación estándar: "+this._calcDeviation(tempRating);
  }
}
results.prototype.constructor = results;