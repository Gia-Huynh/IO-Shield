//Update range/slider input value
//https://stackoverflow.com/questions/10004723/html5-input-type-range-show-range-value
export function updateTextInput(val, ID) {
          document.getElementById(ID).value=val; 
        }
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