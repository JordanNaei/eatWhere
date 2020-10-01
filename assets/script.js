// Assign Variables
var resturantsIds = [];
var restaurantReviewsObj = {};
var restaurantsReviewsArray = [];
var homePage = $("#homePageContent");
var resultPage = $("#resultPage");
var bodyImg = $("body");
var validationMessage = $("#validationModal");
var holdCuisine = [];
var cuisineStageList = [];
var cuisineEntered;
var cityEntered;
var cuisineWrapperBox = $("#cuisineInfo");
var currentLocationLat;
var currentLocationLon;
var picArray=[];

// Getting and validating the input fields on a click of the search buttom

$("#searchButton").on("click", validateInput);

function validateInput() {
    console.log("got clicked");
    cuisineEntered = $("#selectBox option:selected").val().trim();
    cityEntered = $("#locationInput").val().trim() || "";


    if (cityEntered.length < 1) {
        $(validationMessage).addClass("is-active");
        return;
    }
    else {
        if (isNaN(cityEntered)) {
            console.log("this is probably a city");
            getCityLonLat(cityEntered);
        }
        else {
            console.log("this might be a zip");
            getCityFromZipCode(cityEntered);
        }
    }
    console.log(cuisineEntered);
    console.log(cityEntered);
    renderDisplay();
}

//adding an event on the validation modal 'OK' button

$("#modalOkButton").on('click', function () {
    $(validationMessage).removeClass("is-active");
})

// The rating function 
function ratings(n) {
    if (n == 1) {
        return "🌝";
    }
    else if (n > 1 && n < 1.5) {
        return "🌝🌘"
    }
    else if (n == 1.5) {
        return "🌝🌗"
    }
    else if (n > 1.5 && n < 2) {
        return "🌝🌖"
    }
    if (n == 2) {
        return "🌝🌝";
    }
    else if (n > 2 && n < 2.5) {
        return "🌝🌝🌘"
    }
    else if (n == 2.5) {
        return "🌝🌝🌗"
    }
    else if (n > 2.5 && n < 3) {
        return "🌝🌝🌖"
    }
    if (n == 3) {
        return "🌝🌝🌝";
    }
    else if (n > 3 && n < 3.5) {
        return "🌝🌝🌝🌘"
    }
    else if (n == 3.5) {
        return "🌝🌝🌝🌗"
    }
    else if (n > 3.5 && n < 4) {
        return "🌝🌝🌝🌖"
    }
    if (n == 4) {
        return "🌝🌝🌝🌝";
    }
    else if (n > 4 && n < 4.5) {
        return "🌝🌝🌝🌝🌘"
    }
    else if (n == 4.5) {
        return "🌝🌝🌝🌝🌗"
    }
    else if (n > 4.5 && n < 5) {
        return "🌝🌝🌝🌝🌖"
    }
    else if (n == 5) {
        return "🌝🌝🌝🌝🌝";
    }

    else {
        return "No rating is available at this time"
    }
}

// Clear the home page after search is done
function renderDisplay() {
    $("#defaultOne").prop("disabled", true);
    $("#defaultOne").prop("selected", true);
    $("#locationInput").val('')
}

// The display functionality
function displaySearchResult(q) {
    $(".infoWrapper").hide();
    $(homePage).hide(500);
    $(resultPage).show(500);
    $(bodyImg).css("background-image", "url('./img/salad-dim.png')");
    console.log(q.nearby_restaurants.length);
    var using = $("#using");

    for (var i = 0; i < q.nearby_restaurants.length; i++) {
        // generate parent divs
        var resultWrapper = $(" <div class='resultBlockBody card result-card'>");
        $(resultWrapper).attr("data-id", q.nearby_restaurants[i].restaurant.id);
        var resultBeforeButtons = $(" <div class='columns'>");
        // generating the photo
        var imgWrapper = $("<div class='card-image column is-4 left res-img'>");
        var figure = $("<figure class='image image image image is-3by3'>");

        // create a relevant source to rest img
        // var imageSource = q.nearby_restaurants[i].restaurant.photos_url;
        var img = $("<img class='restPicPixa' src='' alt='Placeholder image'>").attr("src", picArray[i]);
        figure.append(img);
        imgWrapper.append(figure);
        resultBeforeButtons.append(imgWrapper);
        resultWrapper.append(resultBeforeButtons);
        using.append(resultWrapper);


        // generate the restaurant info wrapper
        var restInfoWrapper = $("<div class='card-content column is-8' id=''>");
        // generating the cuisines listing
        var cuisinerWrapper = $("<div class='tags'>");
        var cusineListArray = q.nearby_restaurants[i].restaurant.cuisines.split(",");
        for (var p = 0; p < cusineListArray.length; p++) {
            var cuisineList = $("<span class='tag cuisine'>").text(cusineListArray[p]);
            if (cusineListArray[p] !== cuisineEntered) {
                console.log("no cuisine to highlight");
            }
            else {
                $(cuisineList).addClass("darken");
            }
            cuisinerWrapper.append(cuisineList);
            restInfoWrapper.append(cuisinerWrapper);
            resultBeforeButtons.append(restInfoWrapper);
            holdCuisine.push(cusineListArray[p]);
        }
        // generate the ressturant name
        var restNameWrapper = $("<div class='res-name'>");
        var restNameText = $("<h3>").text(q.nearby_restaurants[i].restaurant.name);
        var opperationTime = $("<span class='tag is-primary is-rounded open-biz'>").text("Reviews");
        $(opperationTime).attr("data-id", q.nearby_restaurants[i].restaurant.id);
        $(opperationTime).attr("data-url", q.nearby_restaurants[i].restaurant.url);
        $(restNameText).append(opperationTime);
        restNameWrapper.append(restNameText);
        restInfoWrapper.append(restNameWrapper);

        // genrate the rating stars 
        var ratingWrapper = $("<div class='rating'>");
        var restRatingNum = q.nearby_restaurants[i].restaurant.user_rating.aggregate_rating;
        var votesRatings = q.nearby_restaurants[i].restaurant.user_rating.votes;
        var ratingNumber = $("<span title=" + restRatingNum + " class='onHover ratingStars'>").text(ratings(restRatingNum) + " | " + votesRatings + " votes");
        ratingWrapper.append(ratingNumber);
        restInfoWrapper.append(ratingWrapper);


        // generate locality
        var addressWrrapper = $("<div class='addressInfo'>");
        var localityAreas = $("<p class='address'>").text(q.nearby_restaurants[i].restaurant.location.locality_verbose);
        addressWrrapper.append(localityAreas);
        var restAddress = $("<p class='address'>").text(q.nearby_restaurants[i].restaurant.location.address);
        addressWrrapper.append(restAddress);
        restInfoWrapper.append(addressWrrapper);

        // generate the footer of the card with two buttons 'website' and 'directions'
        var resultFooterWrapper = $(" <footer class='card-footer'>");
        var websiteButton = $("<a href='#' class='card-footer-item res-url' target='_blank'><i class='fas fa-globe'></i>Website</a>");
        $(websiteButton).attr("href", q.nearby_restaurants[i].restaurant.url);
        resultFooterWrapper.append(websiteButton);
        // generate the direction button 
        var directionButton = $("<a href='#' class='card-footer-item phone direction' target='_blank'><i class='fas fa-compass'></i>Direction</a>");
        $(directionButton).attr("data-address", (q.nearby_restaurants[i].restaurant.location.latitude + "," + q.nearby_restaurants[i].restaurant.location.longitude));
        resultFooterWrapper.append(directionButton);
        resultWrapper.append(resultFooterWrapper);
        using.append(resultWrapper);
    }
    displayCuisineMessage(holdCuisine);
    finalizeHyperLinks();
}

// reivews function on hover
$("#using").on('click', '.open-biz', function () {
    var gotRestUrl = $(this).attr('data-url');
    var modifiedUrl = gotRestUrl.split('?')[0];
    var finalUrl = modifiedUrl +"/reviews";
    console.log(finalUrl);
    return window.open(finalUrl);
});


// generate hrefs for the direction buttons
function finalizeHyperLinks() {
    var getButtons = $(".direction");

    for (var a = 0; a < getButtons.length; a++) {
        console.log($(getButtons[a]).data('address'));
        var url = "https://www.google.com/maps/dir/" + currentLocationLat + "," + currentLocationLon + '/' + ($(getButtons[a]).data('address'));
        console.log(url);
        $(getButtons[a]).attr("href", url);
    }
}


// Adding the cuisines Message box
function displayCuisineMessage(m) {
    var cuisineMessageBoxWrapper = $("<div id='cuisineMessageBox' class='message is-danger'>");
    var messageBoxHearder = $("<div class='message-header'>").text("Important Message!");
    var messageBoxCloseX = $("<button id='cuisineMessageB' class='delete' aria-label='delete'></button>");
    messageBoxHearder.append(messageBoxCloseX);
    cuisineMessageBoxWrapper.append(messageBoxHearder);
    var messageBoxBody = $("<div class='message-body'>");
    var messageBoxText = $("<h4><b>Hi There good to see you</b></h4>");
    messageBoxBody.append(messageBoxText);
    cuisineMessageBoxWrapper.append(messageBoxBody);

    if (cuisineEntered == "Select Cuisine (Optional)") {
        console.log("nothing about the cuisines need to be done");
    }
    else if (m.indexOf(cuisineEntered) == -1) {
        $(messageBoxText).text("No cuisine matches your preference, please check the result below for other options")
        $("#using").removeClass("using1").addClass("using2");
        cuisineWrapperBox.append(cuisineMessageBoxWrapper);
        console.log("Your cuisine was not found");

    }
    else {
        $(cuisineMessageBoxWrapper).addClass("is-success");
        $(cuisineMessageBoxWrapper).removeClass("is-danger");
        $(messageBoxText).text("Cuisine that matches you preference is higlighted in orange")
        $("#using").removeClass("using1").addClass("using2");
        cuisineWrapperBox.append(cuisineMessageBoxWrapper);
        console.log("Your Cuisine was found");
    }

}

// adding the closing on click functionality for the cuisine box
$("#cuisineInfo").on('click', "#cuisineMessageB", function () {
    $(cuisineWrapperBox).empty();
    $("#using").removeClass("using2").addClass("using1");

})






// Get current location lat lon so we get the weather info
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("we not permitted to get the location");;
    }
}
function showPosition(position) {
    currentLocationLat = position.coords.latitude;
    currentLocationLon = position.coords.longitude;
    console.log("Your coordinates are Latitude: " + currentLocationLat + " Longitude " + currentLocationLon);
    getCityName(currentLocationLat, currentLocationLon);
}
//get city lat and lon form name:
function getCityLonLat(c) {

    var queryCity =
        "https://api.openweathermap.org/data/2.5/weather?q=" + c + "&APPID=2b07208e40c4f732c8daffed5bf88d24";
    console.log(queryCity);

    $.ajax({
        url: queryCity,
        method: "GET",
        success: function (respo) {
            getNearByRetaurant(respo.coord.lat, respo.coord.lon)
            console.log(respo);
        },
        error: function (ee, status, errorThrown) {
            $(cityEntered).text("");
            $("#validationModal").addClass("is-active");
            $("#saySomething").text("Please provide correct CityName");
            console.log(ee.status);

        }
    });
}


// get city name from Weahter API using lon and lat
function getCityName(la, lo) {

    var queryLonLat =
        "https://api.openweathermap.org/data/2.5/weather?lat=" + la + "&lon=" + lo + "&APPID=2b07208e40c4f732c8daffed5bf88d24";
    console.log(queryLonLat);

    $.ajax({
        url: queryLonLat,
        method: "GET",
        success: function (repo) {
            displayWeatherInfo(repo);
            console.log(repo);
        },
        error: function (l, status, errorThrown) {

            $("#weatherStuff").addClass("hide");
            console.log(l);
        }

    })

}

//Get near by resturants, also to get ret ids 
function getNearByRetaurant(la, lo) {

    var queryRestaurants =
        "https://developers.zomato.com/api/v2.1/geocode?count=20&lat=" + la + "&lon=" + lo;
    console.log(queryRestaurants);

    $.ajax({
        url: queryRestaurants,
        method: "GET",
        headers: {
            "user-key": "9e141855e8de25a334b351ddf9e705d8"
        },
        success: function (x) {
            console.log(x);
            displaySearchResult(x);
        },
        error: function (ee, status, errorThrown) {
            $("#validationModal").addClass("is-active");
            $("#saySomething").text("Please try again at a later time");
            var errorCode = ee.status;
            console.log("We still dont know what happen");
        }
    });
}


// Getting return if throug ids we did not use that for now  
function getRestaurantsReviews(d) {

    var queryReviews =
        "https://developers.zomato.com/api/v2.1/reviews?res_id=" + d;
    console.log(queryReviews);

    $.ajax({
        url: queryReviews,
        method: "GET",
        headers: {
            "user-key": "9e141855e8de25a334b351ddf9e705d8"
        },
        success: function (resp) {
            console.log(resp);

            return resp;
        },
        error: function (v, status, errorThrown) {
            //Here the status code can be retrieved like;
            v.status;
            //The message added to Response object in Controller can be retrieved as following.
            v.responseText;
            console.log(v);
        }
    });
}


//  Getting City name and lat lon from Zip code 

function getCityFromZipCode(z) {

    var queryZip =
        "https://www.zipcodeapi.com/rest/iHdJBCy7m52pf7NL89ljxF957KXisddXFK3YbBSiPb93UuYE3Zi1aTyv9aWptIyb/info.json/" + z + "/degrees";

    $.ajax({
        url: queryZip,
        method: "GET",
        success: function (json) {
            getNearByRetaurant(json.lat, json.lng);
        },
        error: function (error, status, errorThrown) {
            console.log(error);
            $("#validationModal").addClass("is-active");
            var erro = error.status;
            if (erro == 404) {
                $("#saySomething").text("Please try again at a later time");
                console.log("We are not authorized, check credentials");
            }
            else {
                $("#saySomething").text("Please provide correct ZipCode");
                console.log("We are forbidden");
            }
        }
    });

}


// Weather function info display
function displayWeatherInfo(t) {
    console.log(t);
    var currentIcon = "https://openweathermap.org/img/w/" + t.weather[0].icon + ".png";
    $("#wImageSrc").attr("src", currentIcon);
    $("#temp").text(tempKtoFConverter(t.main.temp) + " °F")
}

// Temp Kalvin to F converter
function tempKtoFConverter(k) {
    var tempInK = k;
    var tempInF = (tempInK - 273.15) * (9 / 5) + 32;
    console.log(tempInF);
    return tempInF.toFixed(2);
}

// starter function for getting the client current location for Temp info 
getLocation();

// getting the pixpay ready as a back up on our original plan, which is getting the restaurants pic from Zomato, which we could not do for lack of info and time to invistigae other venues 
   // Example queryURL for Giphy API

   function gettingRandomPixa (){

    var queryFoodURL = "https://pixabay.com/api/?q=food&key=18523919-a2b9e3d6cc1371b217aaa1326&category=food&image_type=photo&safesearch=true&per_page=100";

    $.ajax({
      url: queryFoodURL,
      method: "GET"
    }).then(function(food) {
      console.log(food);
      console.log(queryFoodURL); 
      for (var j=0; j < food.hits.length; j++ ){
        picArray.push(food.hits[j].webformatURL);
      }
// Shuffling the array to create some randomness in picking the pics
      for (let o = picArray.length - 1; o > 0; o--) {
        var r = Math.floor(Math.random() * o);
        var temp = picArray[o];
        picArray[o] = picArray[r];
        picArray[r] = temp;
      }
      console.log(picArray);
      
    });
}
gettingRandomPixa();
