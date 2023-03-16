var ad_list = document.querySelectorAll('.advertisement');
var ad_list_arr = [...ad_list];
ad_list_arr.forEach(i => {
	i.onclick = function() {
	  this.style.visibility = 'hidden';
	};
});
/*.onclick = function() {
  this.style.display = 'none';
};*/