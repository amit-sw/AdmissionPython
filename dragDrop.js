// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []

function initializeProgress(numFiles) {
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  console.debug('update', fileNumber, percent, total)
}

function handleFiles(files) {
  files = [...files]
  initializeProgress(files.length)
  files.forEach(previewFile)
  files.forEach(uploadFile)
}

function previewFile(file) {
  console.log("Calling preview")
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}

/*
function uploadFileIE(file, i) {
  console.log("Calling upload",i)
  //var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
  var url = 'https://q6x4m57367.execute-api.us-east-1.amazonaws.com/Predict/44a35099-a847-4406-84eb-19b35427e4e5'
  url = 'https://gs0ifmmj6h.execute-api.us-east-1.amazonaws.com/Predict/2e38646b-76c8-4af2-9903-c8f9aaf1b830'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  //formData.append('upload_preset', 'ujpu6gyk')
  //var imageData = file.toDataURL("image/png");
  formData.append('data', file)
  //formData.append('data', imageData)
  xhr.send(formData)
  console.log("Just sent form data IE")
}
*/

function uploadFile(file) {
  let url = 'https://q6x4m57367.execute-api.us-east-1.amazonaws.com/Predict/44a35099-a847-4406-84eb-19b35427e4e5'
 url = 'https://gs0ifmmj6h.execute-api.us-east-1.amazonaws.com/Predict/2e38646b-76c8-4af2-9903-c8f9aaf1b830'

  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    //var b64 = reader.result.replace(/^data:.+;base64,/, '');
    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
    //console.log(encoded);
    fetch(url, {
       method: 'POST',
        body: encoded
    })
    .then(function(response) {
      console.log('Got response:',response)
       return response.json();
    }).then(function(data) {
      console.log('Got data:',data);
      processPrediction(data['predicted_label'])
      //let predictedValue=data['predicted_label']
      //console.log(predictedValue)
      //let newContent = document.createTextNode("Prediction: "+predictedValue);
      //document.getElementById('gallery').appendChild(newContent)
    })
    .catch(() => { /* Error. Inform the user */ })
      console.log("Just sent form data non-IE")
    }
}

function processPrediction(predictedValue) {
  console.log("Processing prediction: ",predictedValue)
  let pr = predictionResponse(predictedValue)
  console.log("Prediction response:",pr)
  let newContentNode = document.createTextNode(pr);
  document.getElementById('prediction').appendChild(newContentNode)

}

function predictionResponseOrig(predictedValue) {
  return "AA Predicting:"+predictedValue
}


function predictionResponse(predictedValue) {
  if (predictedValue== "1_normal") {
    return "Predicted value is Normal"
  } else 
  if (predictedValue== "2_cataract") {
    return "Predicted value is Cataract_Disease. Recommendation: Cataract surgery"
  } else 
  if (predictedValue== "2_glaucoma") { 
    return "Predicted value is Glacoma_Disease. Recommendation: laser procedures,surgical operation,eye drop, pills, Glaucoma medication, beta blocker"
  } else 
  if (predictedValue== "3_retina_disease") {
   return "Predicted value is Retina Disease. Recommendation: Surgeries ranging from vitrectomy, replantation, cryosurgery, scleral buckle, laser surgery"
  }
}
