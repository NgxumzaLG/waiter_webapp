document.addEventListener('DOMContentLoaded', function() {
	let flash = document.querySelector('.entry');

	if (flash.innerHTML !== '') {
		setTimeout(function() {
			flash.innerHTML = '';

		}, 5000);
	}
});
