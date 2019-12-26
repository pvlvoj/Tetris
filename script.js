$(document).ready(function() {

	/* Defaultní hodnoty radku a sloupcu */
	let defRowNum = 20;
	let defColNum = 10;


	/* Pocty sloupcu a radku hraciho pole */
	let rowNum = defRowNum;
	let colNum = defColNum;

	/* Indikator, zda uzivatel prave hraje */
	let isPlaying = false;
	
	let emptyColor = "rgba(0, 128, 0, 0.2)";
	
	let msIter = 500;
	
	let iterator;
	
	let calculating = false;
	
	
	$("#gameCanvas").empty();
		
	var table = "";
	for(iter = 0; iter<defRowNum; iter++){
		
		table = table + "<tr id='r" + iter + "'>";
		for(j_iter = 0; j_iter<defColNum; j_iter++){
			
			table = table + "<td id='r" + iter + "c" + j_iter + "'></td>";
		}	
		table = table + "</tr>";
	}
	$("#gameCanvas").append(table);
	$("td").css("backgroundColor", emptyColor);


	/**************************************************************************
	Trida Shape
	***************************************************************************/
	
	
	
	class Shape{
		
		constructor(shape, color){
		
			this.shape = shape;
			this.color = color;
			this.x = Math.round((defColNum/2) - 2);
			this.y = 0 - (this.countHeight() - 1);
		}
		
		log(){
			
			console.log("color: " + this.color + "; width: " + this.countWidth() + "; height: " + this.countHeight());
		}
		
		countHeight(){
			
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
		
		countWidth(){
			
			var rowWidths = [this.crw(this.shape[0]), this.crw(this.shape[1]), this.crw(this.shape[2]), this.crw(this.shape[3])];
			var result = Math.max(...rowWidths);
			this.width = result;
			return result;
		}
		
		crw(row){
			
			var result = 0;
			
			for(let i = 0; i<4; i++){
				
				if(row[i]==1){
					result = i+1;
				}
			}
			return result;
		}
		
		rotate() {
			
			var nShape = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
			
			for(var i = 0; i<4; i++){
				
				for(var j = 0; j<4; j++) {
					
					if(this.shape[i][j] == 1) {
						
						nShape[3-j][i] = 1;
					}
				}
			}
			
			shape.clear();
			
			if(this.rotateCheck(nShape)){
				
				var y_coor = this.y;
				var x_coor = this.x;
				var color_oldShape = this.color;

				shape = new Shape(nShape, this.color);
				shape.y = y_coor;
				shape.x = x_coor;
				shape.color = color_oldShape;
				shape.draw(shape.color);
			}
			else {
				
				shape.draw(color);
			}
		}
		
		rotateCheck(newShape){
			
			var ok = true;
			
			for(var i = 0; i<4; i++){
				
				for(var j = 0; j<4; j++){
					
					if(newShape[i][j] == 1) {
						
						var bc = $("#r" + (i + this.y) + "c" + (j + this.x)).css("backgroundColor");
						
						if((j + this.x) > (defColNum-1)){
							
							ok = false;
							shape.draw(shape.color);
						}						
						else if(bc != emptyColor){
							
							ok = false;
							break;
						}
					}
				}
			}
			return ok;
		}
		
		
		draw(color){
		
			for(var i = 0; i < 4; i++) {
				
				for(var j = 0; j < 4 ; j++) {
					
					if(this.shape[i][j] == 1){
							
						$("#r"+(i+this.y)+"c"+(j+ this.x)).css("backgroundColor", color);
					}
				}
			}
		}
		
		clear(){
			
			this.draw(emptyColor);
		}
		
		moveD() {
			
			
			calculating = true;
		
			if((this.y + this.countHeight()) < defRowNum){
				
				if(this.checkDown()){
					this.y++;
					this.draw(this.color);
					calculating = false;
					return true;
				}
				else {
					checkForFullLines();
					calculating = false;
					return false;
				}
			}
			else {
				checkForFullLines();
				calculating = false;
				return false;
			}
		}
		
		checkDown() {
			
			calculating = true;
			var ok = true;
			this.clear();
			
			for(var i = 0; i<4; i++) {
				
				for(var j = 0; j<4; j++) {
					
					var bc = $("#r"+(i + this.y + 1)+"c"+(j + this.x)).css("backgroundColor");
					
					if((bc != emptyColor) && (this.shape[i][j] == 1)) {
						this.draw(this.color);
						ok = false;
					}
				}
			}
			if((!ok) && (this.y < 0)){
				
				ok = false;
				stop();
				console.log("game over");
			}
			else {
				calculating = false;
			}
			return ok;
		}
		
		moveLeft() {
			
			var ok = true;
			this.clear();
			
			for(var i = 0; i<4; i++) {
				
				for(var j = 0; j<4; j++) {
					
					var bc = $("#r"+(i + this.y)+"c"+(j + this.x-1)).css("backgroundColor");
					
					if((bc != emptyColor) && (this.shape[i][j] == 1)) {
						this.draw(this.color);
						ok = false;
					}
				}
			}
			if(ok){
				this.x--;
				this.draw(this.color);
			}
		}
		
		moveRight() {
			
			calculating = true;
			
			var ok = true;
			this.clear();
			
			for(var i = 0; i<4; i++) {
				
				for(var j = 0; j<4; j++) {
					
					var bc = $("#r"+(i + this.y)+"c"+(j + this.x+1)).css("backgroundColor");
					
					if((bc != emptyColor) && (this.shape[i][j] == 1)) {
						this.draw(this.color);
						ok = false;
					}
				}
			}
			
			if(ok){
				this.x++;
			}
			this.draw(this.color);
		}
		calculating = false;
	}





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
		[0, 1, 1, 0],
		[1, 1, 0, 0],
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
		
		[
		[1, 1, 1, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
		],
		[
		[1, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
		]
	];

	let shapeColors = ["red", "blue", "purple", "yellow", "green", "orange", "brown"];

	let shape;
	
	let state = true;
	
	let score = 0;

	$("#tlacitko").click(function(){
	
		$("#gameCanvas").empty();
		
		var table = "";
		for(i = 0; i<defRowNum; i++){
			
			table = table + "<tr id='r" + i + "'>";
			for(j = 0; j<defColNum; j++){
				
				table = table + "<td id='r" + i + "c" + j + "'></td>";
			}	
			table = table + "</tr>";
		}
		$("#gameCanvas").append(table);
		$("td").css("backgroundColor", emptyColor);
	});

	$("#posunDolu").click(function(){
		
		run();
	});
	
	
	$("#posunR").click(function(){
		
		shape.rotate();
	});
	
	function run(){
		
		shape = new Shape(randomArrayPick(shapes), randomArrayPick(shapeColors));
		increaseScore(0);
		isPlaying = true;
		start(msIter);
	}
	

	function clearShape(){
		
		shape.clear();
	}
	
	function moveDown() {
	
		if(isPlaying){
			if(state){
				if(!shape.moveD()) {
					if(!calculating){
						shape = new Shape(randomArrayPick(shapes), randomArrayPick(shapeColors));
					}
					else {
						state = false;
					}
				}
			}
			else{
				state = true;
			}
		}
	}
	
	
	
	function drawShape(){
		
		shape.draw();
	}
	
	function checkForFullLines() {
		
		 
		var indicator = false;
		for(var j = 0; j <= 4; j++){
			for(var i = defRowNum - 1; i > (-1); i--) {
					
				if(checkForLine(i)){
					increaseScore(100);
					emptyTheLine(i);
					indicator = true;
									
					for(var r = i-1; r >= 0; r--) {
						
						moveLineDown(r);
					}
				}
			}
		}
		return indicator;
	}
	
	function checkForLine(index) {
		
		var fullLine = true;
		
		if(index > defRowNum){
			
			fullLine =  false;
		}
		
		for(var i = 0; i < defColNum; i++) {
			
			var bc = $("#r" + index + "c" + i).css("backgroundColor");
			
			if(bc == emptyColor) {

				fullLine = false;
				break;
			}
		}
		
		return fullLine;
	}

	
	function emptyTheLine(index) {
		
		for(var i = 0; i < defColNum; i++) {
			
			$("#r" + index + "c" + i).css("backgroundColor", emptyColor);
		}
	}
	
	function increaseScore(forVal) {
		
		score = score + forVal;
		$("#score").html("Score: " + score);
	}
	
	
	function stop(){
		
		clearInterval(iterator);
	}
	
	function start(ms) {
		
		iterator = setInterval(moveDown, ms);
	}
	
	function moveLineDown(index) {
		
		for(var c = 0; c < defColNum; c++) {
			
			var blockColor = $("#r" + index + "c" + c).css("backgroundColor");
			
			$("#r" + (index + 1) + "c" + c).css("backgroundColor", blockColor);
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
	
	
	/**
	 * Pri stiskunti klavesy se spusti tato anonymni funkce
	 */
	$(document).keydown(function(e) {
		
    switch(e.which) {
		
		case 32: {
			if(isPlaying == false){
				isPlaying = true;
				start(msIter);
			}
			else {
				isPlaying = false;
				stop();
			}
			break;
		} // spacebar
		
        case 37: {
			if(isPlaying){
				shape.moveLeft();
				break;
			}
		} 				// levo


		case 38: {		// nahoru
			if(isPlaying){
				shape.rotate();
				break;
			}
		} 

        case 39: {
			if(isPlaying){
				shape.moveRight();
				break;
			}
		}				// pravo
		
        case 40: {
			if(isPlaying){
				shape.moveD();
				break;
			}
		}				// dolu
		
		
		case 80: {		// p
			if(isPlaying == false){
				isPlaying = true;
				start(msIter);
				increaseScore(0);
			}
			else {
				isPlaying = false;
				stop();
				$("#score").html("Pauza");
			}
			break;
		}
		
        
		
		default: return;
    }
    e.preventDefault(); //brani pohybu
});
	
	
	
});