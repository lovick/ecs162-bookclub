function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ", "+");

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ", "+");

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-", "");


	var query = ["", title, author, isbn].join("+");
	if (query != "") {

		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
		}
		// make a new script element
		var script = document.createElement('script');

		// build up complicated request URL
		var beginning = "https://www.googleapis.com/books/v1/volumes?q=";
		var callback = "&callback=handleResponse";

		script.src = beginning + query + callback;
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);
	}

}


function handleResponse(bookListObj) {

	function createEle(type, id, text) {
		var ele = document.createElement(type);

		if (id != "") {
			ele.id = id;
		}

		if (text != "") {
			var eleText = document.createTextNode(text);
			ele.appendChild(eleText);
		}

		return ele;
	}

	function genDesc(desc) {
		if (desc == undefined) {
			return "";
		}
		var splitDesc = desc.split(" ");
		var outStr = "";
		var len = splitDesc.length;
		if (len > 30) {
			len = 30;
		}
		for (var i = 0; i < len; i++) {
			outStr += splitDesc[i];
			outStr += " ";
		}
		outStr += ". . .";
		return outStr;
	}

	function generatePopup(index) {
		// where to put the data on the Web page
		var popup = document.createElement("div");
		popup.id = "popup";

		var closeButton = createEle("button", "popupClose", "ⓧ");
		popup.appendChild(closeButton);

		var middleDiv = document.createElement("div");

		var leftButton = createEle("button", "popupLeft", "⬅");
		middleDiv.appendChild(leftButton);
		if (index == 0) {
			leftButton.style.visibility = "hidden";
		}

		var volInfo = bookList[index].volumeInfo;

		var sec = document.createElement("section");
		var img = document.createElement("img");
		if (volInfo.hasOwnProperty("imageLinks")) {
			if (volInfo.imageLinks.hasOwnProperty("thumbnail")) {
				img.src = volInfo.imageLinks.thumbnail;
			} else {
				img.src = volInfo.imageLinks[0];
			}
		} else {
			img.src = "https://dummyimage.com/150x250/EDEDED/000&text=No+Image+Found";
		}
		img.alt = volInfo.title;

		var innerDiv = document.createElement("div");
		var h2 = createEle("h2", "", volInfo.title);
		innerDiv.appendChild(h2);
		var authString = "";
		if (volInfo.authors != undefined) {
			for (var i = 0; i < volInfo.authors.length; i++) {
				authString += volInfo.authors[i];
				if (i+1 < volInfo.authors.length) {
					authString += ", ";
				}
			}
		}
		var h3 = createEle("h3", "", authString);
		innerDiv.appendChild(h3);
		var p = createEle("p", "", genDesc(volInfo.description));
		innerDiv.appendChild(p);

		sec.appendChild(img);
		sec.appendChild(innerDiv);

		middleDiv.appendChild(sec);

		var rightButton = createEle("button", "popupRight", "⮕");
		if (index+1 >= bookList.length) {
			rightButton.style.visibility = "hidden";
		}
		middleDiv.appendChild(rightButton);

		popup.appendChild(middleDiv);

		var keep = createEle("button", "keep", "Keep");
		popup.appendChild(keep);

		closeButton.onclick = function () {
			popup.remove();
		}

		leftButton.onclick = function () {
			popup.remove();
			generatePopup(index-1);
		}

		rightButton.onclick = function () {
			popup.remove();
			generatePopup(index+1);
		}

		keep.onclick = function () {
			var tile = document.createElement("section");

			var tImg = document.createElement("img");
			tImg.src = img.src;
			tImg.alt = volInfo.title;

			tile.appendChild(tImg);

			var tDiv = document.createElement("div");
			var tClose = createEle("button", "", "ⓧ");
			var tH2 = createEle("h2", "", volInfo.title);
			var tH3 = createEle("h3", "", authString);
			var tP = createEle("p", "", genDesc(volInfo.description));

			tDiv.appendChild(tClose);
			tDiv.appendChild(tH2);
			tDiv.appendChild(tH3);
			tDiv.appendChild(tP);

			tile.appendChild(tDiv);

			var tiles = document.getElementById("tiles");
			if (tiles == null) {
				var nav = document.getElementById("nav");

				nav.style.alignItems = "flex-end";
				nav.style.flex = "0 0 auto";
				nav.style.flexDirection = "row";

				nav.children[1].children[0].style.display = "none";
				nav.children[1].style.flexGrow = "1";
				nav.children[1].style.flexWrap = "nowrap";

				tiles = createEle("main", "tiles", "");
				document.body.appendChild(tiles);
			}

			tiles.appendChild(tile);

			tClose.onclick = function () {
				tile.remove();
			}

			popup.remove();
		}

		document.body.appendChild(popup);
	}

	if (bookListObj.totalItems == 0) {
		var popup = createEle("div", "popup", "");

		var noresult = createEle("div", "noresult", "");

		var p = document.createElement("p");
		var str = "The book <strong>b</strong>";
		var pT = document.createTextNode(str);
		p.appendChild(pT);

		document.body.appendChild(p);

		return;
	}

	var bookList = bookListObj.items;

	generatePopup(0);

}