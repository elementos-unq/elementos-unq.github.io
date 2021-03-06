var lastClicked;
var grid = clickableGrid(30,30,function(el,row,col,i){
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);

    switch (el.className){
        case (''):
            el.className='clicked_bla';
            break;
        case ('clicked_bla'):
            el.className='clicked_red';
            break;
        case ('clicked_red'):
            el.className='clicked_gre';
            break;
        case ('clicked_gre'):
            el.className='';
            break;
    }
    lastClicked = el;
});

document.body.appendChild(grid);

function redibujar(){
    var casilleros = document.getElementById("casilleros");
    if (casilleros == 0) {
        casilleros = 30
    }


}

     
function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            /*cell.innerHTML = ++i;*/
            i++;
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}

