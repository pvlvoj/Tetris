$(document).ready(function() {

	/* Defaultní hodnoty radku a sloupcu */
	let defRowNum = 20;
	let defColNum = 10;


	/* Pocty sloupcu a radku hraciho pole */
	let rowNum = defRowNum;
	let colNum = defColNum;

	/* Indikator, zda uzivatel prave hraje */
	let isPlaying = false;

	/* [
		[, , , ],
		[, , , ],
		[, , , ],
		[, , , ]
		],
				
		[0, 0, 0, 0],
	*/

	let shapes = [
		[
		[1, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0], 
		[0, 0, 0, 0]],
		[
		[1, 1, 0, 0],
		[1, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]],
		[
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]],
		[
		[1, 1, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		],
	];

	let shapeColors = ["red", "blue", "purple", "yellow", "green", "orange", "pink", "cyan"];

	let shape = new Shape(randomArrayPick(shapes), randomArrayPick(shapeColors));
	
	let state = true;

	$("#tlacitko").click(function(){
	
		$("#gameCanvas").empty();
		
		var table = "";
		for(i = 0; i<4; i++){
			
			table = table + "<tr id='r" + i + "'>";
			for(j = 0; j<4; j++){
				
				table = table + "<td id='r" + i + "c" + j + "'></td>";
			}	
			table = table + "</tr>";
		}
		$("#gameCanvas").append(table);
	});

	$("#posunDolu").click(function(){
		
		setInterval(mng, 100);
	});
	
	
	function mng(){
		
		if(state){
			shape = new Shape(randomArrayPick(shapes), randomArrayPick(shapeColors));
			shape.log();
			shape.draw(shape.color);
			console.log("Shape drawn");
			state = false;
		}
		else {
			shape.clear();
			console.log("Shape cleared");
			state = true;
		}
	}
	
	function clearShape(){
		
		shape.clear();
	}
	
	
	function drawShape(){
		
		shape.draw();
	}
	
	
	
	
	function Shape(shape, color){
		
		this.x = 0;
		this.y = 0;
		this.shape = shape;
		this.color = color;
		
		this.log = function(){
			
			console.log("color: " + this.color + "; width: " + this.countWidth() + "; height: " + this.countHeight());
		}
		
		this.countHeight = function(){
			
			if(this.shape[3].includes(1)){
				
				this.height = 4;
				return 4;
			} else if (this.shape[2].includes(1)){
				
				this.height = 3;
				return 3;
			} else if (this.shape[1].includes(1)) {
				
				this.height = 2;
				return 2;
			} else {
				this.height = 1;
				return 1;
			}
		}
		
		this.countWidth = function(){
			
			var rowWidths = [this.crw(this.shape[0]), this.crw(this.shape[1]), this.crw(this.shape[2]), this.crw(this.shape[3])];
			var result = Math.max(...rowWidths);
			this.width = result;
			return result;
		}
		
		this.crw = function(row){
			
			var result = 0;
			
			for(let i = 0; i<4; i++){
				
				if(row[i]==1){
					result = i+1;
				}
			}
			return result;
		}
		
		this.rotate = function() {
			
			var nShape = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
			
			for(var i = 0; i<4; i++){
				
				for(var j = 0; j<4; j++) {
					
					if(this.shape[i][j] == 1) {
						
						nShape[j][i] = 1;
					}
				}
			}
			
			return nShape;
		}
		
		
		this.draw = function(color){
		
			for(var i = 0; i < 4; i++) {
				
				for(var j = 0; j < 4 ; j++) {
					
					if(this.shape[i][j] == 1){
							
						$("#r"+(i+this.x)+"c"+(j+ this.y)).css("backgroundColor", color);
					}
				}
			}
		}
		
		this.clear = function(){
			
			this.draw("white");
		}
	}





/*****************************************************************************
	Pomocne funkce
******************************************************************************/


	/**
	 * Funkce pro vyber nahodneho prvku v zadanem poli
	 */
	function randomArrayPick(array){
		
		return array[randomInt(0, array.length-1)];
	}
		
	/**
	 * Funkce pro generovani nahodneho cisla
	 */
	function randomInt(min, max) {
	
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});