async function Generate() {
    try {        
        const url=baseURL + "?d=" + document.getElementById("txtContent").value + "&i=" + document.getElementById("txtId").value
        console.log(url)
        let canvas=await QRCode.toCanvas(url);
        var dataURL = canvas.toDataURL();
        document.getElementById('imgQ').src = dataURL;
    }catch (e) {
        console.error(e);
        alert("ERROR")
        return "";
    }
}        

//Cross-browser function to select content
function SelectText(element) {
    var doc = document;
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
window.onload=function(){
    $(".copyable").click(function (e) {
        //Make the container Div contenteditable
        $(this).attr("contenteditable", true);
        //Select the image
        SelectText($(this).get(0));
        //Execute copy Command
        //Note: This will ONLY work directly inside a click listenner
        document.execCommand('copy');
        //Unselect the content
        window.getSelection().removeAllRanges();
        //Make the container Div uneditable again
        $(this).removeAttr("contenteditable");
        //Success!!
        alert("image copied!");
    });
    Generate()
}