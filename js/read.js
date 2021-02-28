const CSKey="<yourkey>"
const CSRegion="westeurope";

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function run(){
    var path=getParameterByName("d");
    var id=getParameterByName("i");
    var debug=getParameterByName("debug");

    document.getElementById("divOutput").innerHTML="";
    if (debug=="true")
        document.getElementById("divDebug").style.display="block";

    if (path){
        var bShow=false;
        var resp=await fetch(path);
        var text=await resp.text();

        if (text.startsWith("#QR"))
        {
            var instructions=text.split('\n');
            var mode="SHOW";
            for (let i = 1; i < instructions.length; i++) {
                const element = instructions[i];
                if (element.toLowerCase().startsWith("#show"))
                    mode="SHOW";
                else if (element.toLowerCase().startsWith("#play"))
                    mode="PLAY";
                else if (element.toLowerCase().startsWith("#read"))
                    mode="READ";
                else if (element.toLowerCase().startsWith("#share"))
                    mode="SHARE";
                else
                {
                    if (debug=="true")
                        document.getElementById("divDebug").innerHTML+=mode + ":" + element + "<br>";
                    switch (mode) {
                        case "SHOW":
                            document.getElementById("divOutput").innerHTML+=element + "<br>";
                            break;
                        case "PLAY":
                            bShow=true;
                            //MEDIA PLAY
                            document.getElementById("divOutput").innerHTML=`<iframe width="100%" height="100%" style="min-height:300px" src="${element}" frameborder="0" allowfullscreen></iframe></iframe>`;
                    
                            break;
                        case "READ":
                            bShow=true;
                            await synthesizeSpeech(element);
                            break;
                        case "SHARE":
                            textToShare=element;
                            document.getElementById("divOutput").innerHTML+=`<button onclick=goShare() type="button" title="Share this link">
                            <svg>
                              <use href="#share-icon"></use>
                            </svg>
                            <span>Share</span>
                          </button>`;
                        
                            break;
                    default:
                        break;
                    }
                }
            }
        }
        else
        {
            document.getElementById("divOutput").innerHTML=text;
        }

        if (bShow)
        {
            document.getElementById("btnRun").style.display="block";
        }

    }
    else
        document.getElementById("divOutput").innerHTML="No source provided";
}

async function synthesizeSpeech(text) {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(CSKey, CSRegion);
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, undefined);
        
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
    xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    <mstts:express-as style="cheerful">
      ${text}
    </mstts:express-as>
  </voice>
</speak>`;

    await synthesizer.speakSsmlAsync(
        ssml,
        result => {
            if (result.errorDetails) {
                document.getElementById("divDebug").innerHTML+="Error Synth<br>";
                document.getElementById("divDebug").innerHTML+="result.errorDetails";
                console.error(result.errorDetails);
            } else {
                document.getElementById("divDebug").innerHTML+=JSON.stringify(result);
            }
            //synthesizer.close();
        },
        error => {
            document.getElementById("divDebug").innerHTML+="Error Synth 2<br>";
            document.getElementById("divDebug").innerHTML+=JSON.stringify(error);
            //synthesizer.close();
        });
}

const shareDialog = document.querySelector('.share-dialog');

var textToShare="";
function goShare() {
  if (navigator.share) { 
   navigator.share({
      title: textToShare,
      url: window.location
    }).then(() => {
      //console.log('Thanks for sharing!');
    })
    .catch(console.error);
    } else {
        shareDialog.classList.add('is-open');
    }
}

