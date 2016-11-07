
  var app = angular.module('myApp', ["ngRoute"]);

  app.controller("myCtrl", ['$scope', function($scope) {

    //first city is default, add as many as you like
    var cities = [
        'New York',
        'Chicago',
        'Philadelphia',
        'London',
        'Seattle',
        'Boulder'
    ];
    var citiesLen = cities.length;
    var i = 0;
    var idCounter = 0;

    $scope.cities = [];
    $scope.forecasts = [];
    $scope.currCity;
    $scope.currTempMetric = 'F' ;
    console.log('$scope.currTempMetric = '+$scope.currTempMetric);

    for( i; i < citiesLen; i++ ) {
      getTheWeather(cities[i]);
    }

    //constructs cities and forecasts scopes from cities list
    function getTheWeather (cityName) {

      var currFtemp, currFtempFixed,
          currCtemp, currCtempFixed,
          currKtemp, currKtempFixed,
          currRtemp, currRtempFixed;
      var appElement = document.querySelector('[ng-app=myApp]');
      var scope = angular.element(appElement).scope();
      var openWeatherRequest = $.get("http://api.openweathermap.org/data/2.5/weather?q==" + cityName, {
        APPID: "675427d75082581b93987c7d0cb9c941",
        units: 'imperial'
      });

      $scope.currCity = [];

      openWeatherRequest.always (function () {
        console.log("request sent");
      });

      openWeatherRequest.fail (function (error, data) {
        console.log(error);
        console.log(openWeatherRequest.status);
      });

      openWeatherRequest.done (function (data) {
        cityName = data.name;
        currFtemp = data.main.temp;
        currFtempFixed = currFtemp.toFixed(0)
        currCtemp = convert('C', currFtemp);
        currCtempFixed = currCtemp.toFixed(0)
        currKtemp = convert('K', currCtemp);
        currKtempFixed = currKtemp.toFixed(0)
        currRtemp = convert('R', currKtemp);
        currRtempFixed = currRtemp.toFixed(0)

        if( cityName == cities[0] ) {
          $scope.currCity = { cityName: cityName };
          scope.$apply(function () {
            scope.cities.push({city: cityName,
                               currTempF:currFtempFixed,
                               currTempC:currCtempFixed,
                               currTempK:currKtempFixed,
                               currTempR:currRtempFixed,
                               idCounter:idCounter});
          });
          getForecastData(cityName, currFtempFixed, data);
          idCounter += 1;
        } else {
          scope.$apply(function () {
            scope.cities.push({city: cityName,
                               currTempF:currFtempFixed,
                               currTempC:currCtempFixed,
                               currTempK:currKtempFixed,
                               currTempR:currRtempFixed,
                               idCounter:idCounter});
          });
          idCounter += 1;
        }
          console.log('done');
      });
    }

    //constructs cities and forecasts scopes from ng-click function call
    $scope.getTheWeatherClicked = function (cityName) {
      var currCity = $scope.currCity.cityName;
      var appElement = document.querySelector('[ng-app=myApp]');
      var scope = angular.element(appElement).scope();
      var cityName, currTemp, currTempFixed;
      var openWeatherRequest = $.get("http://api.openweathermap.org/data/2.5/weather?q==" + cityName, {
        APPID: "675427d75082581b93987c7d0cb9c941",
        units: 'imperial'
      });

      $scope.forecasts = [];


      if(cityName !== currCity) {
        $scope.currCity = { cityName: cityName };
      }

      openWeatherRequest.always (function () {
        console.log("request sent");
      });

      openWeatherRequest.fail (function (error, data) {
        console.log(error);
        console.log(openWeatherRequest.status);
      });

      openWeatherRequest.done (function (data) {

        cityName = data.name;
        currTemp = data.main.temp;
        currTempFixed = currTemp.toFixed(0)

        getForecastData(cityName, currTempFixed, data);

        console.log('done');
      });
    }

    function getForecastData (cityName, currTemp, data) {

      var latitude = data.coord.lat;
      var longitude = data.coord.lon;
      var appElement = document.querySelector('[ng-app=myApp]');
      var scope = angular.element(appElement).scope();
      var openForecastRequest = $.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=5", {
        APPID: "675427d75082581b93987c7d0cb9c941",
        units: "imperial"
      });

      openForecastRequest.always(function () {
	    console.log("request sent");
      });

      openForecastRequest.fail(function (data, error) {
        console.log(error);
        console.log(openWeatherRequest.status);
      });

      openForecastRequest.done(function (data) {

        for (var i = 0; i < data.list.length; i++) {
          pushForecastData(cityName, data.list[i]);
        }
        console.log('done');
      });
    }

    function pushForecastData (cityName, object) {

      var appElement = document.querySelector('[ng-app=myApp]');
      var scope = angular.element(appElement).scope();
      var minFtemp, maxFtemp, minFtempFixed, maxFtempFixed,
          minCtemp, maxCtemp, minCtempFixed, maxCtempFixed,
          minKtemp, maxKtemp, minKtempFixed, maxKtempFixed,
          minRtemp, maxRtemp, minRtempFixed, maxRtempFixed;
      var dayName = moment.unix(object.dt);
      var dayReleventName = moment().calendar(dayName);
      var dayStr;

      minFtemp = object.temp.min;
        minFtempFixed = minFtemp.toFixed(0)
      maxFtemp = object.temp.max;
        maxFtempFixed = maxFtemp.toFixed(0)

      minCtemp = convert('C', minFtemp);
        minCtempFixed = minCtemp.toFixed(0)
      maxCtemp = convert('C', maxFtemp);
        maxCtempFixed = maxCtemp.toFixed(0)

      minKtemp = convert('K', minCtemp);
        minKtempFixed = minKtemp.toFixed(0)
      maxKtemp = convert('K', maxCtemp);
        maxKtempFixed = minKtemp.toFixed(0)

      minRtemp = convert('R', minKtemp);
        minRtempFixed = minRtemp.toFixed(0)
      maxRtemp = convert('R', maxKtemp);
        maxRtempFixed = maxRtemp.toFixed(0)

      if(dayReleventName.indexOf('oday') > 0) {
        dayStr = 'Today';
      } else {
        dayStr = dayReleventName;
      }

      if( dayStr.indexOf("at") > 0 ) {
        dayStr = dayName.format("ddd");
      }

      moment.locale('en', {
        calendar: {
          lastDay: '[Tomorrow]',
          sameDay: '[Today]'
        }
      });

      scope.$apply(function () {
        $scope.currCity.cityName;
        scope.forecasts.push({cityName:cityName,
                              dayStry:dayStr,
                              minFtemp:minFtempFixed,
                              maxFtemp:maxFtempFixed,
                              minCtemp:minCtempFixed,
                              maxCtemp:maxCtempFixed,
                              minKtemp:minKtempFixed,
                              maxKtemp:maxKtempFixed,
                              minRtemp:minRtempFixed,
                              maxRtemp:maxRtempFixed,
                              idCounter:1});
      });
  }
    //temperature conversions
    function convert(degree, temp) {
        if (degree == "C") {
            F = (temp - 32) * 5 / 9; //[°C] = ([°F] − 32) × 5/9
            return F;
        }
        if (degree == "K") {
            K = (temp * 1) + 273.15; //[°C] + 273.15
            return K;
        }
        if (degree == "R") {
            R = temp * 9/5; //[K] × 9/5 //[°C] × 9/5 + 491.67
            return R;
        }
    }

  $scope.changeTempMetric = function (metric) {
    $scope.currTempMetric = { metric: metric };
  }

  
  //?
    function initScope() {
        $scope.foo = 1;
        $scope.bar = { ram: 'ewe' };
    }

    initScope();

    $scope.$on('$routeChangeUpdate', initScope);
    $scope.$on('$routeChangeSuccess', initScope);  
  
}]);

  var appElement = document.querySelector('[ng-app=myApp]');
  var scope = angular.element(appElement).scope();
  //var currentTempMetric = scope.currTempMetric;

  //router config
  app.config(function($routeProvider) {
    $routeProvider
    .when('/celsius', {
	  templateUrl : "pages/celsius.html",
      //resolve: { $scope.currTempMetric = 'C' },
      //resolve: { currTempMetric: function() { return 'C' } },
      reloadOnSearch: false
    })
    .when('/kelvin', {
	  templateUrl : "pages/kelvin.html",
      reloadOnSearch: false
    })
    .when('/rankine', {
	  templateUrl : "pages/rankine.html",
      reloadOnSearch: false
    })
	/*.when('/city/:cityName', {
      resolve: {
      }
	})*/
	.otherwise({
      //controller: "myCtrl",
	  templateUrl : "pages/farenheit.html",
	  reloadOnSearch: false
	});
  });