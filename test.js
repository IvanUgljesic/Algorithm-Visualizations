// selection sort
var selectionArr, minValue;
function selectionAssets(){
  for(var i=0; i<arr.length; i++){
    selectionArr[i].trans = 0;
    selectionArr[i].number = i; 
    selectionArr[i].value = arr[i];
  }
}
selectionAssets();

for(let i=1; i<selectionArr.length-1; i++){
    setTimeout(()=>{
        minValue = 0;
        for(let j=i+1; j<selectionArr.length; j++){
            setTimeout(()=>{
                if(selectionArr[j].value < selectionArr[i].value){
                    if(minValue != 0){
                        //oboji oraange
                        fillPreMinValue(selectionArr[minValue].number);
                    }
                    minValue = j;
                    //oboji crveno
                    fillMinValue(selectionArr[minValue].number);
                }
            gElement.item(arr.length).childNodes[0].style.transform = "translateX("+(30*i)+"px)";// pointer switch
   
            }, 1000 * (j-1))
        }
        //swap, parametars (element, distance)
        moveRightSelection(selectionArr[i].number, (selection[minValue].number - selectionArr[i].number)*30 +selectionArr[minValue].trans);
        moveLeftSelection(selectionArr[minValue].number,-(selection[minValue].number - selectionArr[i].number)*30);
    
        let temp = selectionArr[i];
        selectionArr[i] = selectionArr[minValue];
        selectionArr[minValue] = temp;
        //oboji zeleno
        fillGreen(selectionArr[i].number);
    },(selectionArr.length-i)*1000);
}