/*By Eyal Benezra
ver 0.334
*/

// analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-53672371-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function() {

    var feed = "https://dl.dropboxusercontent.com/u/54065586/feeder.json";
    var sitesList = localStorage.wixSitesList;


    $.get(feed, function(obj) {
        sitesList = JSON.stringify(obj);
        showSite(JSON.parse(obj));
    });

    $('#wixtabs .toggle').click(function(e) {
        e.preventDefault();
        toggle_tab();
    });

    $('#wixtabs #mobile').click(function(e) {
        e.preventDefault();
        if (!$(this).hasClass("active")) {
            $('#wixtabs #desktop').removeClass("active");
            $('iframe.startframe').attr('src', changeToMobile(url));
        }
    });

    $('#wixtabs #desktop').click(function(e) {
        e.preventDefault();
        if (!$(this).hasClass("active")) {
            $('#wixtabs #mobile').removeClass("active");
            $('iframe.startframe').attr('src', changeToDesktp(url));
        }
    });

    $('#wixtabs .next').click(function(e) {
        e.preventDefault();
        location.reload(); // Reloads the current document

    });

    $(".contact").tooltip();
    $('.btn').button();

});


function showSite(sitesList) {

    // get a new site object from the feed
    if(localStorage.wixTabsCounter != "undefined" || (localStorage.wixTabsCounter == sitesList.length - 1)) {
        localStorage.setItem("counter", 0);
    } else {
        localStorage.wixTabsCounter++;
    }

    localStorage.setItem("counter", "5");
    
    siteKey = localStorage.wixTabsCounter;
    console.log(localStorage.wixTabsCounter);
    //siteKey = Math.round((sitesList.length - 1) * Math.random());
    obj = sitesList[siteKey];
    // sitesList.splice(siteKey, 1);
    // localStorage.wixSitesList = JSON.stringify(sitesList);
    url = obj['Url'];

    // display the chosen site
    $('iframe.startframe').attr('src', url);
    _gaq.push(['_trackEvent', "event", 'newtab']);


    /* set toolbar variables */

    // set app name
    if (obj['App Name']) {
        if (obj['App Name'].toLowerCase().valueOf() == "no app".valueOf()) {
            appendItem("App", obj['App Name'].toLowerCase(), "app");
        } else {
            appendItem("App", obj['App Name'].toLowerCase() + " - " + obj['Site Type'].toLowerCase(), "app");
        }

    }

    // set package
    // removes double appearance of strings as in "Free Free" and brackets
    if (obj['Package']) {
        var packWithoutBrackets = obj['Package'].replace(/\(\)$/g, "").toLowerCase();
        if ((obj['Cycle'].valueOf() != obj['Package'].valueOf())) {
            appendItem("Package", packWithoutBrackets + " paid " + obj['Cycle'].toLowerCase(), "pack");
        } else {
            appendItem("Package", packWithoutBrackets, "pack");
        }
    }

    // set template name
    if (obj['Temp Name']) {
        var tempname = obj['Temp Name'].toLowerCase();
        if (enOnly(tempname)) {
            appendItem("Template", tempname, "temp");
        }

    }

    // set date created
    if (obj['Date Created']) {
        appendItem("Published", dayCount(obj['Date Created']) + " days ago");
    }

    // set country
    if (obj['Country']) {
        var flag = $("<img class=\"flag\" src=\"layout/flags/" + getCountryName(obj['Country']) + ".png\"" + "\"/>").tooltip({
            title: getCountryName(obj['Country'])
        });
        $("<li><b>Made In &nbsp;</b></li>").append(flag).appendTo('.wixtabs .description');
    }

    // set sites url href
    if (obj['Url']) {
        $li = $('<li></li>');
        $('<a></a>').text('site link').attr('href', obj['Url']).attr('target', '_BLANK').appendTo($li);
        $li.appendTo('.wixtabs .description');
        $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');

    }

    // set view mode
    setViewMode(obj['Url']);
}

// assert true if letters are latin
function enOnly(str) {
    var pat = /[a-z]/;
    return pat.test(str);

}

// add key, value and id to the description container
function appendItem(k, v, id) {
    $("<li><b>" + k + "</b><br></li>").append(v).attr("id", id).appendTo('.wixtabs .description');
    $("<hr class=\"nomargin\">").appendTo('.wixtabs .description');
}

// returns the amount of time passed since date
function dayCount(date) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(date);
    var secondDate = new Date();

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

// toolbar toggle
function toggle_tab() {
    $('.wixtabs').toggleClass('hide');
    $('#toggle_open').toggleClass('hide');

}

// refresh site cache when updating versions
function refreshCache() {
    localStorage.clear();
    console.log("Wix tabs site cache was refreshed");
}

// returns true case mobile view
function assertMobileViewMode(url) {
    var pat = /\?(showMobileView)=(true)/;
    return pat.test(url);
}

function changeToMobile(url) {
    return url + "?showMobileView=true";
}

function changeToDesktp(url) {
    return url.replace(/\?(showMobileView)=(true)/, "");
}

function setViewMode(url) {
    if (assertMobileViewMode(url)) {
        $('#wixtabs #mobile').addClass("active");
    } else {
        $('#wixtabs #desktop').addClass("active");
    }
}
