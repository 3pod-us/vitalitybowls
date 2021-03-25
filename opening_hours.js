try{
var Loc = window.location.href.split("locations/")[1].split("/")[0];
fetch("https://vitalitybowls.com/GoogleViews/get.php?location="+Loc).then(function(r){
    return r.json();
}).then(function(r){
	console.log(r);
    opening_hours = r.result.opening_hours;
    var elements = [...document.querySelectorAll(".opening_hours")];
    elements.map(function( node ){
    	var html = "";
    	opening_hours.weekday_text.map(function( hour ){
    		html += `${hour}<br>`
    	})
    	node.innerHTML = html;
    })
})
}catch(e){}
