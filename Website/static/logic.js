//Hide ad when clicked
var ad_list = document.querySelectorAll('.advertisement');
var ad_list_arr = [...ad_list];
ad_list_arr.forEach(i => {
	i.onclick = function() {
	  //this.style.visibility = 'hidden';
	};
});
function binanceNigga()
{
	alert ("My binance user id: 21262360");
}
//for everyone else
document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
  
 }, false);

//Overlaying the uploaded/calculated img.
function overlayingImg ()
{
	overlayImg.src = document.getElementById("imageResult").toDataURL();
}

//Update range/slider input value
//https://stackoverflow.com/questions/10004723/html5-input-type-range-show-range-value
function updateTextInput(val, ID) {
          document.getElementById(ID).value=val; 
        }

//Drag N Drop Image
const dropContainer = document.getElementById("dropContainer");
const InputBox = document.getElementById("InputBox");
const InputBox2 = document.getElementById("InputBox2");
  
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
dropContainer.ondrop = function(evt) {
  // pretty simple -- but not for IE :(
  console.log ("ye");
  evt.preventDefault();
  InputBox.files = evt.dataTransfer.files;
  InputBox2.files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  //dT.items.add(evt.dataTransfer.files[3]);
  InputBox.files = dT.files;
  InputBox2.files = dT.files;
  blah.src = URL.createObjectURL(evt.dataTransfer.files[0]);
  document.getElementById("sample").src =  blah.src;
  evt.preventDefault();
  //document.getElementById ("dropContainer").classList.add('Part_1_shrinked');
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("AdjustmentBox");
  elmntToView.scrollIntoView({ behavior: "smooth"});
};
InputBox.onchange = evt => {
  const [file] = InputBox.files;
  InputBox2.files = InputBox.files;
  if (file) {
    blah.src = URL.createObjectURL(file);
	document.getElementById("sample").src =  blah.src;
  }
  //document.getElementById ("dropContainer").classList.add('Part_1_shrinked');
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("AdjustmentBox");
  elmntToView.scrollIntoView({ behavior: "smooth"}); 
};

/*var ele = document.getElementById("ImageForm");
if(ele.addEventListener){
    ele.addEventListener("submit", function(e){
		console.log ("Success");
		
	}, false);  //Modern browsers
}*/
const InputBoxOverlay = document.getElementById("InputBoxOverlay");
InputBoxOverlay.onchange = evt => {
  const [file] = InputBoxOverlay.files;
  if (file) {
    overlayImg.src = URL.createObjectURL(file)
  }
}

var currentBlobImage;
function changeImage(blobImage) {
 const urlCreator = window.URL || window.webkitURL;
 currentBlobImage = blobImage;
 document.getElementById('resultImg').src = urlCreator.createObjectURL(blobImage);
}

document.querySelector("#ImageForm").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm = document.forms['ImageForm'];
		fetch(document.forms['ImageForm'].action, {method:'post', body: new FormData(myForm)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {changeImage (blob); 
  document.getElementById("confirmBox").classList.remove("Hidden");
  setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
  elmntToView.scrollIntoView({ behavior: "smooth"});},500);
  });
});

document.querySelector("#ImageForm2").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm2 = document.forms['ImageForm2'];
		
		// Default values
		const defaultValues = {
			"myNum": "0",
			"myNum2": "0",
			"myNum3": "0",
			"myNum4": "0",
			"BlurRatio": "0",
			"ErosionNum": "0",
		};
		
		// Loop through the default values and set the field value if empty
		Object.keys(defaultValues).forEach(fieldName => {
			const field = myForm2[fieldName];
			if (field && field.value.trim() === "") {
				field.value = defaultValues[fieldName]; 
			}
		});
	
		fetch(document.forms['ImageForm2'].action, {method:'post', body: new FormData(myForm2)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {changeImage (blob); 
  });
});
function disableLastButton(){
      document.getElementById("LastButton").disabled = true;
      setTimeout(function(){document.getElementById("LastButton").disabled = false;},20000);
  }
document.querySelector("#LastButton").addEventListener("click", function(e){
	disableLastButton();
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
