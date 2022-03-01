/*
 * View events for cad-api-form.ejs
 */

window.addEventListener('load', (event) => {
	let links = document.querySelectorAll(".copy-text-link");
	for(var i=0; i<links.length; i++) {
		links[i].addEventListener('click', function(event) {
			
			// Select the text
			var currentLink = event.currentTarget;
			var range = document.createRange();
			var text = document.getElementById(event.currentTarget.getAttribute("data-text-id"));
			range.selectNode(text);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();

			// Temporarily display a green check mark
			currentLink.classList.add("copy-click")
			currentLink.firstChild.style.display = "none";
			setTimeout(function() {
				currentLink.firstChild.style.display = "block";
				currentLink.classList.remove("copy-click")
			}, 1500);

		});
	}
});