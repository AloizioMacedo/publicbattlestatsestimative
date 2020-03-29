// ==UserScript==
// @name         Public Battle Stats Estimate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Estimating battle stats of profiles in TORN via the triggers-rank method.
// @author       You
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// ==/UserScript==

(function() {
    var ranks_list = {"Absolute beginner":0, "Beginner":1, "Inexperienced":2, "Rookie":3,
              "Novice":4, "Below average":5, "Average":6, "Reasonable":7, "Above average":8,
              "Competent":9, "Highly competent":10, "Veteran":11, "Distinguished":12,
              "Highly distinguished":13, "Professional":14, "Star":15, "Master":16,
              "Outstanding":17, "Celebrity":18, "Supreme":19, "Idolised":20, "Champion":21,
              "Heroic":22, "Legendary":23, "Elite":24, "Invincible":25};
    var levels_list = [2,6,11,26,31,50,71,100];
    var crimes_list = [100,5000,10000,20000,30000,50000];
    var networths_list = [5000000, 50000000, 500000000, 5000000000];
    var battle_stats_list = ["<2.5k", "2.5k-5k &#8614 20k", "20k-25k &#8614 200k",
                             "200k-250k &#8614 2m", "2m-2.5m &#8614 20m", "20m-35m &#8614 200m", ">200m-250m"];
    var response

    var target_id = document.querySelectorAll('[rel=canonical]')[0].href.split("ID=")[1];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.torn.com/user/"+target_id+"?selections=profile,personalstats,crimes&key=APIKEYHERE", true);
    xhr.send();

    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText);
        }
    }

    function level_triggers(x){
        var i = 0;
        while (i+1<=levels_list.length && levels_list[i] <= x) { i++}
        return i;
    }
    function crimes_triggers(x){
        var i = 0;
        while (i+1<=crimes_list.length && crimes_list[i] <= x) { i++}
        return i;
    }
    function networth_triggers(x){
        var i = 0;
        while (i+1 <= networths_list.length && networths_list[i] <= x) { i++}
        return i;
    }

    setTimeout(function(){var rank = response.rank.split(" "); rank.pop(); rank = rank.join(" ");
    var networth = response.personalstats.networth;
    var crimes = response.criminalrecord.total;
    var level = response.level;

    var expected_battle_stats = battle_stats_list[ranks_list[rank]
    -networth_triggers(networth)
    -crimes_triggers(crimes)-level_triggers(level)]

    document.getElementsByClassName("empty-block")[0].innerHTML = "Estimated total battle stats:<br/>"+expected_battle_stats
    document.getElementsByClassName("empty-block")[0].style = "text-align:center"
    document.getElementsByClassName("empty-block")[0].style.fontSize = "18px"}, 1000)
})();
