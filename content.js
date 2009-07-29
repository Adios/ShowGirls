(function() {

if (window == top) {
	var d, 
		isSplashed,
		shadow = document.createDocumentFragment();
		div = document.createElement('div'),
		img = [new Image, new Image, new Image],

		corner = (function() {
			d = div.cloneNode(false);
			d.className = 'sg-corner';

			d.addEventListener('mouseover', toggleEnlarge);
			d.addEventListener('mouseout', toggleEnlarge);
			d.addEventListener('click', toggleSplash);

			d.appendChild(img[0]);

			return d;
		})(),

		mask = (function() {
			d = div.cloneNode(false);
			d.className = 'sg-mask';
			return d;
		})(),

		splash = (function() {
			var a = document.createElement('a');
			d = div.cloneNode(false);
			d.className = 'sg-splash';
			d.addEventListener('click', toggleSplash);

			a.appendChild(img[2]);
			a.addEventListener('click', function(evt) {
				open(this.href);
				evt.preventDefault();
			});
			d.appendChild(a);
			return d;
		})();

	fold();
	show();
};

function fold() {
	document.body.appendChild(corner);
};
function show() {
	var port = chrome.extension.connect('suck');
	port.onMessage.addListener(function(src) {
		img[0].src = src.square, img[1].src = src.small, img[2].src = src.medium;
		var a = splash.getElementsByTagName('a')[0];
		a.href = src.page;
		a.title = src.title;
	})
	port.postMessage(window.location.href);
};
function open(url) {
	chrome.extension.connect('open').postMessage(url);
};

function toggleEnlarge(e) {
	if (e.type == 'mouseover') {
		this.replaceChild(img[1], img[0]);
		this.className += ' enlarge';
	} else {
		this.replaceChild(img[0], img[1]);
		this.className = this.className.replace(/ enlarge/, '');
	}
};
function toggleSplash() {
	if (isSplashed) {
		shadow.appendChild(mask);
		shadow.appendChild(splash);
		isSplashed = 0;
	} else {
		document.body.appendChild(mask);	
		document.body.appendChild(splash);
		center();
		isSplashed = 1;
	}
};
function center() {
	img[2].style.left = (550 - img[2].offsetWidth) / 2 + 'px';
	img[2].style.top = (550 - img[2].offsetHeight) / 2 + 'px';
};
})();
