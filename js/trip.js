$(document).ready(function () {
	$('#theWorks').click(function () {
		console.log("clicked");
		view()
	});
	$('#reset').click(function () {
		console.log("reset");
		view2()
	});
});

var view = function () {
	console.log("boom?")
	/*$('#theWorks').css("visibility", "hidden");
	$('#reset').css("visibility", "");
	$('.firework').css("visibility", "");
	*/
}
var view2 = function () {
	console.log("no boom?")
	/*
	$('#theWorks').css("visibility", "");
	$('#reset').css("visibility", "hidden");
	$('.firework').css("visibility", "hidden");
	*/
}