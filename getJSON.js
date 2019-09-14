
function x() {
	arrayFotos = document.getElementsByClassName("_mck9w _gvoze _f2mse");
	var json = [];

	for (let i = 0; i < arrayFotos.length; i++) {
		item = arrayFotos[i];
		var link = item.children[0].href
		link = link.substring(0, link.indexOf("?tagged=triumph5"));

		var thumbnail =  item.children[0].children[0].children[0].children[0].src;
		var descricao = item.children[0].children[0].children[0].children[0].alt;
		var data = {};
		data["thumbnail"] = thumbnail;
		data["descricao"] = descricao;
		data["code"] = link;
		json[i] = data;

	}
	return json;

}
