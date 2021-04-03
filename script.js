var selectedFieldObj = document.getElementById('selector')
var formContainer = document.getElementById('container')
var count = 0;
var options_arr = [];
var flag = false;
var previousType;

function createButton(tagName ,className, onclickFunction, btnName){
    var button = document.createElement(tagName)
    button.setAttribute('class',className)
    button.setAttribute('onclick', onclickFunction)
    buttonTextNode = document.createTextNode(btnName)
    button.appendChild(buttonTextNode)
    return button
}

function createInput(type, id, className, placeholder, value){
    var input = document.createElement('input')
    input.setAttribute('type',type)
    if(id.length > 0){
        input.setAttribute('id',id)
    }
    if(placeholder.length > 0){
        input.setAttribute('placeholder',placeholder)
    }
    if(className.length > 0){
        input.setAttribute('class',className)
    }
    if(value.length > 0){
        input.setAttribute('value',value)
    }
    return input
}

function createDiv(id, className, nodeText){
    var div = document.createElement('div')
    if(className){
        div.setAttribute('class',className)
    }
    if(id){
        div.setAttribute('id',id)
    }
    if(nodeText){
        textNode = document.createTextNode(nodeText)
        div.appendChild(textNode)
    }

    return div
}


function displaySavedData(arr){
                //saved container is parent
                // <div class="bottom-right__pair">
                //     <div class="key">Name:</div>
                //     <div class="value">Rakshit</div>
                // </div>
                // <div class="bottom-right__pair">
                //     <div class="key">Name:</div>
                //     <div class="value">Rakshit</div>
                // </div>
                // <div class="bottom-right__pair">
                //     <div class="key">Name:</div>
                //         <div class="array">
                //             <div class="value">
                //                 Mumbai
                //             </div>
                //             <div class="value">
                //                 Pune
                //             </div>
                //             <div class="value">
                //                 Delhi
                //             </div>
                //         </div>
                //     </div> 
                // </div>

    var savedDataContainer = document.getElementsByClassName('bottom-right')[0]

    for(var i = 0; i < arr.length; i++){
        var pair = document.createElement('div')
        pair.setAttribute('class','bottom-right__pair')

        var keyDiv = document.createElement('div')
        keyDiv.setAttribute('class','key')

        var textNodeKey;
        var textNodeValue
        for(x in arr[i]){
            textNodeKey = document.createTextNode(x)
            keyDiv.appendChild(textNodeKey)
            pair.appendChild(keyDiv)
            if(Array.isArray(arr[i][x])){
                var valueArr = arr[i][x]
                var arrayDiv = document.createElement('div')
                arrayDiv.setAttribute('class','array')
                for(var j = 0; j < valueArr.length; j++){
                    var valueDiv = createDiv(null,'value',valueArr[j])
                    arrayDiv.appendChild(valueDiv)
                }
                pair.appendChild(arrayDiv)
            }else{
                var valueDiv = createDiv(null,'value',arr[i][x])
                pair.appendChild(valueDiv)
            }


        }
        savedDataContainer.appendChild(pair)
    }
    savedDataContainer.style.display = "flex"
    
    
    
}


function getValueRadio(arr){
    var checked = null

    for(var i = 0; i < arr.length; i++){
        if(arr[i].type === "radio"){
            if(arr[i].checked){
                checked = arr[i].value
            }
        }
    }

    return checked    
}
function getValueCheckbox(arr){
    var checked = []

    for(var i = 0; i < arr.length; i++){
        if(arr[i].type === "checkbox"){
            if(arr[i].checked){
                checked.push(arr[i].value)
            }
        }
    }

    return checked

    
}

function saveData(){
    var dataArr = []
    var formGroupArr = document.querySelectorAll('.form-group')
    alert('Form Submission Successfull')
    for(var i = 0; i < formGroupArr.length; i++){
        var currentId = formGroupArr[i].getAttribute('id')  
        var formGroupChildArr = formGroupArr[i].childNodes
        var key = null
        var value = null
        for(var j = 0 ; j < formGroupChildArr.length; j++){
            if(formGroupChildArr[j].tagName === 'DIV' && formGroupChildArr[j].getAttribute('class') === 'title')
            {
                key = formGroupChildArr[j].innerHTML
            }else if(formGroupChildArr[j].tagName === 'INPUT'){
                value = formGroupChildArr[j].value
            }

            if(formGroupChildArr[j].tagName === 'DIV' && formGroupChildArr[j].getAttribute('class') === 'option-group'){
                var arr;
                if(formGroupChildArr[j].getAttribute('id').includes('radio')){
                    arr = document.querySelectorAll(`.radio-${currentId}`)
                    value =  getValueRadio(arr)
                   
               }else if(formGroupChildArr[j].getAttribute('id').includes('checkbox')){
                    arr = document.querySelectorAll(`.checkbox-${currentId}`)
                    value =  getValueCheckbox(arr)
                }else if(formGroupChildArr[j].getAttribute('id').includes('select')){
                    //option-group_select-n => options-container_select-n
                    var createChildId = formGroupChildArr[j].getAttribute('id').replace(/-group/,"s-container")
                    value = document.getElementById(createChildId).value
                }
            }

        }
       
        if(key && value){
            var obj = {
              
            }
            obj[key] = value
            dataArr.push(obj)
        }
    } 
    //disable submit btn
    document.querySelector('.submit-btn').disabled = "true"

    displaySavedData(dataArr)
}

function saveForm(){
    
    document.querySelector('.add-btn').disabled = "true"

    var savedForm = document.getElementsByClassName('bottom-left')[0]
    
    var formGroup = document.querySelectorAll('.form-group')


   for(var i = 0; i < formGroup.length; i++){
       var child_arr = formGroup[i].childNodes
       formGroup[i].removeChild(child_arr[2])
   }
    
    savedForm.appendChild(formContainer)
    
    document.querySelector('.submit-btn').setAttribute('onclick',"saveData()")

    savedForm.style.display = "flex"
}


function displaySubmitButton(){
    var button = createButton('button', 'submit-btn','saveForm()','Submit')
    formContainer.appendChild(button)
}


function touchUpOptions(){
    var optionGroup = document.getElementById('option-group_'+previousType+"-"+count)
    var optionGroup_arr = optionGroup.childNodes
    var formGroup = document.getElementById(count)
    optionGroup.removeChild(optionGroup_arr[1])
    //length is 2 now
    optionGroup.removeChild(optionGroup_arr[1])
    
}

function addFormOptionField(formGroupID, inputID ){
    
    var formGroup = document.getElementById(formGroupID)
    var propertyName = document.getElementById(inputID).value
    
    //creating title div
    var propertyDiv = createDiv(null,'title',propertyName)

    //modifying the form-group
    const nodeArr = formGroup.childNodes
    formGroup.replaceChild(propertyDiv, nodeArr[0])
    formGroup.removeChild(nodeArr[1])

}

function addOptions(id,type){
    var item = document.getElementById(id).value
    var optionContainer = document.getElementById('options-container_'+type+"-"+count)
    options_arr.push(item)
    optionContainer.innerHTML = ''
    if(type === "select"){
        for(var i = 0; i < options_arr.length; i++){
            var option = document.createElement('option')
            option.setAttribute('value',options_arr[i])
            var textNode = document.createTextNode(options_arr[i].toUpperCase())
            option.appendChild(textNode)
            optionContainer.appendChild(option)
        }
    }else{
        //if type is radio or checkbox
        for(var i = 0; i < options_arr.length; i++){
            var input = createInput(type,'',id,"",options_arr[i])
            var textNode = document.createTextNode(options_arr[i])
            var label = document.createElement('label')
            label.appendChild(textNode)
            var options = document.createElement('div')
            options.setAttribute('class','options')
            options.appendChild(input)
            options.appendChild(label)
            optionContainer.appendChild(options)
        }
    }
    document.getElementById(id).value = ''
   



}


function displayOptionField(field){
    // <div class="form-group" id="n">
    //     <input type="text" id="text-n">
    //     <button class="add-btn" onclick="addFormOptionField(n,text-n)">Add</button>
    //     <div class="option-group" id="option-group_type">
    //          <div id="option-container_type">
    //             <div class="options">
    //                 //options
    // //          </div>
    //         <input type="text" id="checkbox-n" placeholder="Options">
    //         <button class="add-btn" onclick="addOptions('checkbox-n','checkbox')">Add</button>
    //     </div>
    //     removebtn
    // </div>
    var lowerCaseField = field.toLowerCase()
    previousType = lowerCaseField

    
    //creating form-group div
    var formGroup = createDiv(count,'form-group',null)

     //creating 1st input
    var input_1 = createInput('text',"text-" + count,'',"Enter Field Name",'')

    //creating add button
    var button_1 = createButton('button','add-btn',`addFormOptionField(${count},"text-${count}")`,'Add')

    formGroup.appendChild(input_1)
    formGroup.appendChild(button_1)

    //creating option-group
    var optionGroup = createDiv('option-group_'+lowerCaseField+"-"+count,'option-group',null)


    var input_2 = createInput('text',lowerCaseField + "-" + count,'','Options','')
    var button_2 = createButton('button','add-btn',`addOptions("${lowerCaseField}-${count}","${lowerCaseField}")`,"+")
    
    var optionsContainer
    if(lowerCaseField === 'select'){
        optionsContainer = document.createElement('select')
        optionsContainer.setAttribute('class','select-options')
        optionsContainer.setAttribute('id','options-container_'+lowerCaseField+"-"+count)
    }else{

        var optionsContainer = createDiv('options-container_'+lowerCaseField+"-"+count,null,null)

    }

    optionGroup.appendChild(optionsContainer)
    optionGroup.appendChild(input_2)
    optionGroup.appendChild(button_2)

    formGroup.appendChild(optionGroup)

    //creating remove button
    var removeButton = createButton('span','remove-btn',`removeFormField(${count})`,'X')

    formGroup.appendChild(removeButton)

    formContainer.appendChild(formGroup)
    
}

function removeFormField(formGroupID){

    var formGroupArr = document.querySelectorAll('.form-group')
    for(var i = 0; i < formGroupArr.length; i++){
        if(Number(formGroupArr[i].id) === formGroupID){
            formContainer.removeChild(formGroupArr[i])
        }
    }
    if(document.querySelectorAll('.form-group').length === 0){
        document.getElementById('welcome').style.display = "block"

    }

}

function addFormField(formGroupID, inputID ){

    // <div class="form-group">
    //     <div class="title">Name</div>
    //     <input type="text" placeholder="text">
    //     <span class="remove-btn" onclick="removeFormField(id)">X</span>
    // </div>


    var formGroup = document.getElementById(formGroupID)
    var propertyName = document.getElementById(inputID).value
    
    //creating title div
    var propertyDiv = createDiv(null,'title',propertyName)


    //modifying the form-group
    const nodeArr = formGroup.childNodes
    formGroup.replaceChild(propertyDiv, nodeArr[0])
    formGroup.removeChild(nodeArr[1])
}


function displayField(field){


    // <div class="form-group" id="n">
    //     <input type="text" id="text-n">
    //     <button class="add-btn" onclick="addFormField(n)">Add</button>
    //     <input type="text" placeholder="text">
    //     <span class="remove-btn" onclick="removeFormField(id)">X</span>
    // </div>

    
    var lowerCaseField = field.toLowerCase()
    previousType = lowerCaseField
    //creating form-group div
    var formGroup = createDiv(count,'form-group',null)


    //creating 1st input
    var input_1 = createInput('text',lowerCaseField + "-" + count,'',"Enter Field Name",'')

    formGroup.appendChild(input_1)

    //creating add button
    var button = createButton('button','add-btn',`addFormField(${count},"${lowerCaseField}-${count}")`,'Add')

    formGroup.appendChild(button)

     //creating 2nd input
    var input_2 = createInput(lowerCaseField,'',lowerCaseField + '-' + count,"",'')

    
    formGroup.appendChild(input_2)

    //creating remove button
    var removeButton = createButton('span','remove-btn',`removeFormField(${count})`,'X')


    formGroup.appendChild(removeButton)
    //append new created form-group to parent
    formContainer.appendChild(formGroup)
}



function addField(){
    document.getElementById('welcome').style.display = "none"

    if(flag){
        touchUpOptions()
        flag = false
    }
    options_arr = []
    var selectedField = selectedFieldObj.value
    if(selectedField === "Text"){
        count++;
        displayField(selectedField)
    }else if(selectedField === "Number"){
        count++;
        displayField(selectedField)
    }else if(selectedField === "Email"){
        count++;
        displayField(selectedField)
    }else if(selectedField === "Radio"){
        flag = true;
        count++;
        displayOptionField(selectedField)
    }else if(selectedField === "Select"){
        flag = true;
        count++;
        displayOptionField(selectedField)
    }else if(selectedField === "Checkbox"){
        flag = true;
        count++;
        displayOptionField(selectedField)
        
    }else{
        count++;
        displaySubmitButton()
    }
}