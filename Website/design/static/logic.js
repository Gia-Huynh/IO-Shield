var ad_list = document.querySelectorAll('.advertisement');
var ad_list_arr = [...ad_list];
ad_list_arr.forEach(i => {
	i.onclick = function() {
	  this.style.visibility = 'hidden';
	};
});


//for everyone else
document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
  
 }, false);

const dropContainer = document.getElementById("dropContainer");
//const InputBox = document.getElementById("InputBox");
  
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
dropContainer.ondrop = function(evt) {
  // pretty simple -- but not for IE :(
 console.log ("ye");
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
InputBox.onchange = evt => {
  const [file] = InputBox.files;
  if (file) {
    blah.src = URL.createObjectURL(file)
  }
  document.getElementById ("dropContainer").classList.add('Part_1_shrinked');
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
};

/*var ele = document.getElementById("ImageForm");
if(ele.addEventListener){
    ele.addEventListener("submit", function(e){
		console.log ("Success");
		
	}, false);  //Modern browsers
}*/
var currentBlobImage;
function changeImage(blobImage) {
 const urlCreator = window.URL || window.webkitURL;
 currentBlobImage = blobImage;
 document.getElementById('resultImg').src = urlCreator.createObjectURL(blobImage);
}

document.querySelector("#ImageForm").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm = document.forms['ImageForm']
		fetch(document.forms['ImageForm'].action, {method:'post', body: new FormData(myForm)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => changeImage (blob));
});
document.querySelector("#LastButton").addEventListener("click", function(e){
  fetch('/convert', {method:"POST", body:currentBlobImage})
                .then(response  => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {
					var file = window.URL.createObjectURL(blob);
					window.location.assign(file);
					});
});