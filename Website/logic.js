var ad_list = document.querySelectorAll('.advertisement');
var ad_list_arr = [...ad_list];
ad_list_arr.forEach(i => {
	i.onclick = function() {
	  this.style.visibility = 'hidden';
	};
});



dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};

dropContainer.ondrop = function(evt) {
  // pretty simple -- but not for IE :(
 
  evt.preventDefault();
  InputBox.files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  //dT.items.add(evt.dataTransfer.files[3]);
  InputBox.files = dT.files;
  blah.src = URL.createObjectURL(evt.dataTransfer.files[0]);
  evt.preventDefault();
  document.getElementById ("dropContainer").classList.add('Part_1_shrinked');
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
};