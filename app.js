var arr = [];
//array size
var arrSize = 10;
$('#arraySize').on('change', function() {
  arrSize = this.value;
  $("#svg").empty();
  reRandomArr();
  bubbleAssets();
  selectionAssets();
  insertionAssets();
  quickAssets();
});

//random array elements
for(var i=0; i<arrSize; i++){
  arr[i] = Math.floor(Math.random() * 30) + 1; 
}

var svgContainer = d3.select("svg");

var rectangle,rect;

for(var i = 0, j = 100; i<arrSize; i++, j+=30){
  var x = j, y = j+30;
  rectangle = svgContainer.append("g");
  rectangle.append("rect").attr("x", j).attr("y", 200).attr("width", 20).attr("height", arr[i] * 5).attr("fill", "orange").attr("transform", "translate(10," + (50 - arr[i] * 5) + ")");
  rectangle.append("text").attr("x", arr[i] > 9 ? j + 12 : j + 16).attr("y", 248).text(arr[i]).attr("font-family", "sans-serif").attr("font-size", "15px").attr("fill", "black");
}

// RErandom array
function reRandomArr(){
  $("#svg").empty();
  for(var i=0; i<arrSize; i++){
    arr[i] = Math.floor(Math.random() * 30) + 1; 
  }
  var svgContainer = d3.select("svg");

  var rectangle,rect;
  
  for(var i = 0, j = 100; i<arrSize; i++, j+=30){
    rectangle = svgContainer.append("g");
    rectangle.append("rect").attr("x", j).attr("y", 200).attr("width", 20).attr("height", arr[i] * 5).attr("fill", "orange").attr("transform", "translate(10," + (50 - arr[i] * 5) + ")");
    rectangle.append("text").attr("x", arr[i] > 9 ? j + 12 : j + 16).attr("y", 248).text(arr[i]).attr("font-family", "sans-serif").attr("font-size", "15px").attr("fill", "black");
  }  
bubbleAssets();
selectionAssets();
insertionAssets();
createPointer();
quickAssets();
}

//sort speed
var speed = 2;
var slider = new Slider("#ex12a", { id: "slider12a", min: 1, max: 5, value: 3 });
slider.on("change", function(sliderValue) {
  sliderValue = document.getElementById("ex12a").value;
  if(sliderValue == '5') sliderValue = 'TOP GEAR';
  document.getElementById("ex6SliderVal").textContent = sliderValue;
  speed = sliderValue == 'TOP GEAR' ? 4:sliderValue-1;
}); 
 var speeds = [0.5,0.75, 1, 1.5, 3];
 var timeoutIntervals = [2000,1500,1000,500,250];


var gElements = document.getElementsByTagName('g');

// -------- Timer with pause/resume --------------
function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
  };

  this.resume = function() {
      start = new Date();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}

//---------------------------- Merge sort ----------------

var mergeCounter = 0;


// trans down merge
function transDownMerge(x, end){
  let start = x.transX;
  let startVert = 0;
  let element = gElements[x.number];
  function moveMerge(){
    startVert+=5*speeds[speed];
    start += end/30*speeds[speed];
    if(startVert > 150){
      window.cancelAnimationFrame(moveMerge);
      x.transX += end;
      return;
    }
    element.style.transform = "translate("+start+"px,"+startVert+"px)";
    window.requestAnimationFrame(moveMerge);
  }
  window.requestAnimationFrame(moveMerge);

}

// trans up merge

function transUpMerge(x){
  let startHor = x.transX;
  let startVert = 150;
  let element = gElements[x.number];
  function moveUpMerge(){
    startVert -= 5*speeds[speed];
    if(startVert < 0){
      window.cancelAnimationFrame(moveUpMerge);
      return;
    }
    element.style.transform = "translate("+startHor+"px,"+startVert+"px)";
    window.requestAnimationFrame(moveUpMerge);
  }
  window.requestAnimationFrame(moveUpMerge);
}


// merge
const merge = (arr1, arr2) => {
  let sorted = [];
  while (arr1.length && arr2.length) {
    if (arr1[0].value < arr2[0].value) {
      sorted.push(arr1.shift());
    }
    else {
      sorted.push(arr2.shift());
    }
  };
  let tempArr = sorted.concat(arr1.slice().concat(arr2.slice()));
  setTimeout(() => {
    for (let index = 0; index < tempArr.length; index++) {
      fillRed(tempArr[index].number);
    }
  }, ++mergeCounter * timeoutIntervals[speed]);
  for (let index = 0; index < tempArr.length; index++) {
    setTimeout(() => {
      transDownMerge(quickArr[ tempArr[index].number], ((Math.min(...tempArr.map(a => a.number))+index)-quickArr[tempArr[index].number].number)*30 - quickArr[tempArr[index].number].transX);
    }, timeoutIntervals[speed] * (mergeCounter + index+1));
    
  }
  mergeCounter+=tempArr.length;
  setTimeout(() => {
    for (let index = 0; index < tempArr.length; index++) {
      transUpMerge(quickArr[ tempArr[index].number]);
      if(tempArr.length != arr.length)fillBlue(tempArr[index].number);
      else fillGreen(tempArr[index].number);
    }
  }, ++mergeCounter * timeoutIntervals[speed]);
  return sorted.concat(arr1.slice().concat(arr2.slice()));
};


// partition
const mergeSort = mergeArr => {
  if (mergeArr.length <= 1) return mergeArr;
  let mid = Math.floor(mergeArr.length / 2),
      left = mergeSort(mergeArr.slice(0, mid)),
      right = mergeSort(mergeArr.slice(mid));
  return merge(left, right);
};


// start merge sort button
function mergeSortBtn(){
  quickAssets();
  gElements[arr.length].remove();
  mergeCounter = 0;
  mergeSort(quickArr);

}
// ----------------------- end of merge sort -----------







// ----------------- Quick sort -----------------

var quickArr = new Array();
function quickAssets(){
  quickArr = new Array();
  for(var i=0; i<arrSize; i++){
    let temp = new Object();
    temp.transX = 0;
    temp.transY = 0;
    temp.number = i;
    temp.value = arr[i];
    quickArr.push(temp); 
  }
}
quickAssets();

function quickLeveler(x){  
  pointer = svgContainer.append("g");
  pointer.append("rect").attr("x", 100).attr("y", 200).attr("width", quickArr.length *30 - 10 ).attr("height", 1).attr("fill", "red").attr("transform", "translate(10," + (50 - quickArr[x].value * 5) + ")");

  let barCounter = document.getElementsByTagName('g');
  if(barCounter.length > quickArr.length +1) {
    barCounter.item(quickArr.length).remove();
  }


}


//move left (Quick)
function moveLeftQuick(x, end){
  let endPosition = end + x.transX;
  let start = x.transX;
  let element1 = gElements[x.number];
  fillRed(x.number);
  function moveBackQuick(){
    start-=speeds[speed]*(speed+1);
    if(start < endPosition){
      window.cancelAnimationFrame(moveBackQuick);
      fillOrange(x.number);
      return;
    }
    element1.style.transform = "translateX("+start+"px)";
    window.requestAnimationFrame(moveBackQuick);
  }
  window.requestAnimationFrame(moveBackQuick);
}

//move right (Quick)
function moveRightQuick(x, end){
  let endPosition = end + x.transX;
  let start = x.transX;  
  let element = gElements[x.number];
  fillRed(x.number);
  function moveForwardQuick(){
    start+=speeds[speed]*(speed+1);
    if(start > endPosition){
      window.cancelAnimationFrame(moveForwardQuick);
      fillOrange(x.number);
      return;
    }
    element.style.transform = "translateX("+start+"px)";
    window.requestAnimationFrame(moveForwardQuick);
  }
  window.requestAnimationFrame(moveForwardQuick);
}
var quickTimer = 1, quickCicle = 0;

function swap(items, leftIndex, rightIndex) {
  if(leftIndex != rightIndex){
    setTimeout(() => {
      moveRightQuick(quickArr[leftIndex], (rightIndex-leftIndex)*30);
      moveLeftQuick(quickArr[rightIndex], (leftIndex-rightIndex)*30);
      quickArr[leftIndex].transX += (rightIndex-leftIndex)*30;
      quickArr[rightIndex].transX += (leftIndex-rightIndex)*30;
      var quickTemp = quickArr[leftIndex];
      quickArr[leftIndex] = quickArr[rightIndex];
      quickArr[rightIndex] = quickTemp;
    }, timeoutIntervals[speed] * quickTimer);
  }
  let swapTemp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = swapTemp;
}
function partition(items, left, right) {
  let pivot = items[Math.floor((right + left) / 2)], //middle element
    leftPointer = left, //left pointer
    rightPointer = right; //right pointer
    setTimeout(() => {      
     quickLeveler(Math.floor((right + left) / 2));
    }, timeoutIntervals[speed] * quickTimer);
  while (leftPointer <= rightPointer) {
    while (items[leftPointer] < pivot) {
      leftPointer++;
    }
    while (items[rightPointer] > pivot) {
      rightPointer--;
    }
    if (leftPointer <= rightPointer) {
      swap(items, leftPointer, rightPointer); //sawpping two elements
      quickTimer+=2;
      leftPointer++;
      rightPointer--;
    }
  }
  return leftPointer;
}

function quickSort(items, left, right) {
  setTimeout(() => {
    let index;
    if (items.length > 1) {
      index = partition(items, left, right); //index returned from partition
      if (left < index - 1) { //more elements on the left side of the pivot
        quickSort(items, left, index - 1);
      }
      if (index < right) { //more elements on the right side of the pivot
        quickSort(items, index, right);
      }
    }
    quickCicle++;
    return items;
    
  }, quickCicle * quickArr.length/2);

}
// first call to quick sort
function quickSortBtn() {
  let quickValues = quickArr.map(a => a.value);
  quickTimer = 1;
  quickSort(quickValues, 0, quickValues.length - 1);
}

// ---------------Insertion sort-----------------


var insertionArr = new Array();
function insertionAssets(){
  insertionArr = new Array();
  for(var i=0; i<arrSize; i++){
    let temp = new Object();
    temp.transX = 0;
    temp.transY = 0;
    temp.number = i;
    temp.value = arr[i];
    insertionArr.push(temp); 
  }
}
insertionAssets();

function insertionSort(){
  var elementToMove = 0;
  for(var i = 0; i < insertionArr.length-1; i++){
    if(insertionArr[i].value > insertionArr[i+1].value){
      transDown(insertionArr[i+1]);
      insertionArr[i+1].transY += 150;
      elementToMove = i+1;
      break;
    }
    fillBlue(i);
    
  }
  var barCounter = 0;
  for(let j = elementToMove; j>0; j--){
      setTimeout (()=>{
        if(insertionArr[j].value<insertionArr[j-1].value){
        moveLeftInsertion(insertionArr[j]);
        insertionArr[j].transX -= 30; 
        moveRightInsertion(insertionArr[j-1]);
        insertionArr[j-1].transX += 30;
        let temp = insertionArr[j];
        insertionArr[j] = insertionArr[j-1];
        insertionArr[j-1] = temp;
      }
      }, timeoutIntervals[speed] * (1+elementToMove-j));
      if(insertionArr[elementToMove].value<insertionArr[j-1].value) barCounter++;
  }
  setTimeout (()=>{
    transUp(insertionArr[elementToMove-barCounter]);
  },timeoutIntervals[speed] * (barCounter+1));
  setTimeout (()=>{
    if(i >= insertionArr.length-2){
      for(let i = 0; i<insertionArr.length; i++){
        fillBlue(i);
      }

    }
    else insertionSort();
  },timeoutIntervals[speed] * (barCounter+2));
}
//move left (Insertion)
function moveLeftInsertion(x){
  fillRed(x.number);
  let end = x.transX - 30;
  let backStart = x.transX;
  let element1 = gElements[x.number];
  function moveBack(){
    backStart-=speeds[speed];
    if(backStart < end){
      window.cancelAnimationFrame(moveBack);
      return;
    }
    element1.style.transform = "translate("+backStart+"px,"+x.transY+"px)";
    window.requestAnimationFrame(moveBack);
  }
  window.requestAnimationFrame(moveBack);
}

//move right (insertion)
function moveRightInsertion(x){
  fillRed(x.number);
  let end = x.transX + 30;
  let start = x.transX;  
  let element = gElements[x.number];
  function moveForward(){
    start+=speeds[speed];
    if(start > end){
      window.cancelAnimationFrame(moveForward);
      fillBlue(x.number);
      return;
    }
    element.style.transform = "translateX("+start+"px)";
    window.requestAnimationFrame(moveForward);
  }
  window.requestAnimationFrame(moveForward);
}

//trans down
function transDown(x){
  fillRed(x.number);
  let element = gElements[x.number];
  let start = 0;
  function insertionMoveDown(){
    start += speeds[speed]*5;
    if(start > 150){
      window.cancelAnimationFrame(insertionMoveDown);
      return;
    }
    element.style.transform = "translateY("+start+"px)";
    window.requestAnimationFrame(insertionMoveDown);
  }
  window.requestAnimationFrame(insertionMoveDown);
}

//trans up
function transUp(x){
  fillBlue(x.number);
  let element = gElements[x.number];
  let start = x.transY;
  function insertionMoveUp(){
    start -= speeds[speed]*5;
    if(start < 0){
      window.cancelAnimationFrame(insertionMoveUp);
      return;
    }
    element.style.transform = "translate("+x.transX+"px,"+start+"px)";
    window.requestAnimationFrame(insertionMoveUp);
  }
  window.requestAnimationFrame(insertionMoveUp);
}



//  ----------------Bubble sort---------------- 

//move right (bubble)
function moveRight(x){
  gElements.item(x).childNodes[0].style.fill = "#dc3545";
  let start = elementTrans[x];
  let element = gElements[x];
  let moveUp = 0;
  let counter = 0;
  function moveForward(){
    counter++;
    start+=speeds[speed];
    moveUp += counter > 15/speeds[speed] ? speeds[speed]:-speeds[speed];
    if(start >  elementTrans[x]){
      window.cancelAnimationFrame(moveForward);
      gElements.item(x).childNodes[0].style.fill = "orange";
      return;
    }
    element.style.transform = "translate("+start+"px,"+moveUp+"px)";
    window.requestAnimationFrame(moveForward);
  }
  window.requestAnimationFrame(moveForward);
  elementTrans[x] += 30;
}


//move left (bubble)
function moveLeft(x){
  let backStart = elementTrans[x];
  let element1 = gElements[x];
  let moveDown = 0;
  let counter = 0;
  gElements.item(x).childNodes[0].style.fill = "#348ceb";
  function moveBack(){
    counter++;
    backStart-=speeds[speed];
    moveDown += counter > 15/speeds[speed]  ? -speeds[speed]:speeds[speed];
    if(backStart < elementTrans[x]){
      window.cancelAnimationFrame(moveBack);
      gElements.item(x).childNodes[0].style.fill = "orange";
      return;
    }
    element1.style.transform = "translate("+backStart+"px,"+moveDown+"px)";
    window.requestAnimationFrame(moveBack);
  }
  window.requestAnimationFrame(moveBack);
  elementTrans[x] -= 30;
}



var swch = arr, pointer;
var sliceArr = arrSize; 
var elementNo = [];
var elementTrans = [];
function bubbleAssets(){
  for(var i = 0; i<arrSize; i++){
    elementNo[i] = i;
    elementTrans[i] = 0;
  }
  swch = arr;
  sliceArr = arrSize;
}
bubbleAssets();


//pointer for track under bars
function createPointer(){
  pointer = svgContainer.append("g");
  pointer.append("text").attr("x",113).attr("y", 270).text('^').attr("font-size", "30px").attr("fill", "black");//new g element to point on current bar
  gElement = document.getElementsByTagName('g');
}
createPointer();

function  bubbleSort(){
  var sorted = true;
  for (let i = 0, j = 100; i<sliceArr-1; i++, j+=30) {
    var pointerTime = setTimeout(() => {
      gElement.item(arrSize).childNodes[0].style.transform = "translateX("+(30*(i+1))+"px)";// pointer switch
    }, timeoutIntervals[speed] *i);
    if(swch[i]>swch[i+1]){
        sorted = false;
        setTimeout(function(){
          moveRight(elementNo[i]);
          moveLeft(elementNo[i+1]);
          let temp = elementNo[i];
          elementNo[i] = elementNo[i+1];
          elementNo[i+1] = temp;
        },i*timeoutIntervals[speed]);
        let temp1 = swch[i];
        swch[i] = swch[i+1];
        swch[i+1] = temp1;
    }
  }
  if(!sorted){
    sliceArr--;
    setTimeout(function(){
      bubbleSort();
      gElements.item(elementNo[sliceArr+1]).childNodes[0].style.fill = "#99FF99";
    }, timeoutIntervals[speed] * sliceArr);
  }
  else {
    pointerTime = clearTimeout(pointerTime);
    for(var i = 0; i<arrSize; i++){
      gElements.item(i).childNodes[0].style.fill = "#99FF99";
    }
  }
}

// ----------------------------selection sort--------------------------
var selectionArr = new Array();
var selectionCounter = 0;
function selectionAssets(){
  selectionArr = new Array();
  selectionCounter = 0;
  for(var i=0; i<arrSize; i++){
    let temp = new Object();
    temp.trans = 0;
    temp.number = i;
    temp.value = arr[i];
    selectionArr.push(temp); 
  }
}
selectionAssets();

function selectionSort(){
  var minValue = selectionArr[selectionCounter], prevMinValue = 0, minValuePosition;
  var needSwap = false;
  fillRed(selectionArr[selectionCounter].number);
  for(let i=selectionCounter; i<arrSize; i++){
    setTimeout(function(){
      gElement.item(arrSize).childNodes[0].style.transform = "translateX("+(30*i)+"px)";// pointer switch
    if(selectionArr[i].value<minValue.value){
        needSwap = true;
        if(prevMinValue>0) fillOrange(minValue.number);
        fillRed(selectionArr[i].number);
        let temp = minValue; 
        minValue = selectionArr[i];
        minValuePosition = i;
        prevMinValue++;
      }

    },timeoutIntervals[speed]*(i-selectionCounter));
  }
  setTimeout(()=>{
    if(needSwap){
      moveRightSelection(selectionArr[selectionCounter], (minValuePosition - selectionCounter)*30);//(element to move, distance to move)
      moveLeftSelection(selectionArr[minValuePosition],  (selectionCounter - minValuePosition)*30);//(element to move, distance to move)
      let temp = selectionArr[selectionCounter];
      selectionArr[selectionCounter] = minValue;
      selectionArr[minValuePosition] = temp;
    }
  },(arrSize - selectionCounter) * timeoutIntervals[speed]);
  setTimeout(()=>{
    if(selectionCounter < arrSize-1){
      selectionCounter++;
      selectionSort();
    }    
    else{
      fillGreen(selectionArr[selectionCounter].number);
    }
    fillGreen(selectionArr[selectionCounter -1].number);

  },(arrSize - selectionCounter + 3 ) * timeoutIntervals[speed]);
  
}

//move left (selection)
function moveLeftSelection(x, distance){
  let end = x.trans + distance;
  let backStart = x.trans;
  let element1 = gElements[x.number];
  function moveBack(){
    backStart-=speeds[speed]*5;
    if(backStart < end){
      window.cancelAnimationFrame(moveBack);
      return;
    }
    element1.style.transform = "translateX("+backStart+"px)";
    window.requestAnimationFrame(moveBack);
  }
  window.requestAnimationFrame(moveBack);
  x.trans = end;
}

//move right (selection)
function moveRightSelection(x, distance){
  let end = distance + x.trans;
  let start = x.trans;  
  let element = gElements[x.number];
  function moveForward(){
    start+=speeds[speed]*5;
    if(start > end){
      window.cancelAnimationFrame(moveForward);
      return;
    }
    element.style.transform = "translateX("+start+"px)";
    window.requestAnimationFrame(moveForward);
  }
  window.requestAnimationFrame(moveForward);
  fillOrange(x.number);
  x.trans = end;
}

function fillRed(x){
  gElements.item(x).childNodes[0].style.fill = "#dc3545";
}

function fillOrange(x){
  gElements.item(x).childNodes[0].style.fill = "orange";
}

function fillGreen(x){
  gElements.item(x).childNodes[0].style.fill = "#99FF99";
}

function fillBlue(x){
  gElements.item(x).childNodes[0].style.fill = "#337ab7";
}

