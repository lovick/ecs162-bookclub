var responseList = null;

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
	responseList = bookListObj;
	var bookList = responseList.items;
	var displayedIndex = 0;

	// where to put the data on the Web page
	var popup = document.getElementById("popup");

	// Populate the popup content and buttons
	if (bookList.length == 0) {
		// display the no results stuff and return
	}

	if (displayedIndex > 0) {
		// display the left button
	}

	if (displayIndex < bookList.length - 1) {
		// display the right button
	}
	popup.innerHTML = "<button id='goLeft'>left</button><button id='goRight'>right</button>";
	var left = document.getElementById("goLeft");
	var right = document.getElementById("goRight");

	left.onclick = function() {
		if (displayedIndex > 0) {

		}
	}
	/* write each title as a new paragraph */
	//for (i = 0; i < bookList.length; i++) {
	//	var book = bookList[i];
	//	var title = book.volumeInfo.title;
	//	var titlePgh = document.createElement("p");
	//	/* ALWAYS AVOID using the innerHTML property */
	//	titlePgh.textContent = title;
	//	bookDisplay.append(titlePgh);
	//}
}