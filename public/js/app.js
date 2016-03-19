(function() {
	document.addEventListener("DOMContentLoaded", function() {
		var lines = [].slice.call(document.getElementsByClassName("posters--line"));

		lines.forEach(function(line) {
			line.firstChild.addEventListener('mouseover', function(event) {
				line.style.marginLeft = "0%";
			}, false);

			line.firstChild.addEventListener('mouseout', function(event) {
				line.style.marginLeft = "-8.333%";
			}, false);

			if (line.childElementCount === 7) {
				line.lastChild.addEventListener('mouseover', function(event) {
					line.style.marginLeft = "-16.666%";
				}, false);

				line.lastChild.addEventListener('mouseout', function(event) {
					line.style.marginLeft = "-8.333%";
				}, false);
			}
		});

		function get(url) {
			return new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();

				req.open('GET', url);

				req.onload = function() {
					if (req.status == 200)
						resolve(req.response);
					else
						reject(Error(req.statusText));
				};

				req.send();
			});
		}

		var posters = [].slice.call(document.getElementsByClassName("poster"));

		posters.forEach(function(poster) {
			poster.addEventListener('click', function(event) {
				event.preventDefault();

				get(location.protocol + '//' + location.host + '/json/serie/info/' + poster.dataset.id).then(function(res) {
					console.log(JSON.parse(res));
				});
			}, false);
		});
	});
})(document);