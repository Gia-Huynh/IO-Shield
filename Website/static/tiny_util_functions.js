// PURE FUNCTION
export function dataURLtoFile(dataurl, filename) {
	console.log ("dataURLtoFile: ",dataurl);
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
export function generateFilePostfix(filename, myForm2){
	var FilePostfix = "" + filename.replace(/\.[^/.]+$/, "").replace(" - Copy", "") + " [" + myForm2["myNum"].value + '-' + myForm2["myNum2"].value + '-' + myForm2["myNum3"].value + '-' + myForm2["myNum4"].value + "].stl";
	console.log (FilePostfix);
	document.getElementById('PostFixTextBox').value = FilePostfix;
}

// PAGE ELEMENT UPDATE FUNCTIONS
//Update range/slider input value
//https://stackoverflow.com/questions/10004723/html5-input-type-range-show-range-value
export function updateTextInput(val, ID) {
          document.getElementById(ID).value=val; 
}
export function disableLastButton(){
      document.getElementById("LastButton").disabled = true;
      setTimeout(function(){document.getElementById("LastButton").disabled = false;},10000);
}
export function show_hide_shrink_stuff()
{
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
	
}
export function AllowDownloadImageButton (eventDtTransferFile, fileName){
	const dlBtn = document.getElementById("downloadBtn");
	dlBtn.href = URL.createObjectURL(eventDtTransferFile);
	dlBtn.download = fileName.replace(/\.[^/.]+$/, "") + ".png";
	dlBtn.style.display = "inline-block";
}
// PAGE ELEMENT RETRIEVAL FUNCTIONS
