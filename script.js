$(document).ready(function() {


	$("#score").hide();

	/* Defaultní hodnoty radku a sloupcu */
	let defRowNum = 20;
	let defColNum = 10;
	
	var player = "";
	
	var started = false;

	/* Pocty sloupcu a radku hraciho pole */
	let rowNum = defRowNum;
	let colNum = defColNum;

	/* Indikator, zda uzivatel prave hraje */
	let isPlaying = false;
	
	let emptyColor = "rgba(0, 128, 0, 0.2)";
	
	let msIter = 1000;
	
	let iterator;
	
	let calculating = false;
	
	const xhr = new XMLHttpRequest();
	
	getResults();
	
	
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
				sendResults();
				endGame();
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
	
	var score = 0;
	

	function startNewGame(){
		
		var insertedName = $("#vstupJmena").val();
		
		if(insertedName.length<1) {
			
			alert("Nebylo zadano platne jmeno!");
			return false;
		}
		else {
			
		player = insertedName;
		
		$("#start").hide();
		
		$("#form").hide();
		
		showScore();
		
		started = false;
		
		stop();
		iterator = null;
		
		started = true;
		msIter = 1000;
		
		score = 0;
		
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
		isPlaying = true;
		started = true;
		return true;
		}
	}


	$("#start").click(function(){
		
		if(startNewGame()){

		started = false;		
		iterator = null;
		shape = null;
		started = true;
		run();
		}
	});
	
	function showScore(){
		
		$("#score").show();
	}
	
	
	function run(){
		
		stop();
		
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
					if(msIter>100){
						
						msIter = msIter - 50;
						console.log("getting faster");
					}
					
					pause();
					pause();
					
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
		$("#score").html("<center><h3>Score: " + score + "</h3></center>");
		
	}
	
	
	function stop(){
		
		clearInterval(iterator);
		
		getResults();
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
	
	function endGame(){
		
		started = false;
		getResults();
		$("#start").show();
		$("#score").hide();
		$("#form").show();
	}
	
	function pause(){
		
		if(started){
			if(isPlaying == false){
				isPlaying = true;
				start(msIter);
				increaseScore(0);
			} else {
				isPlaying = false;
				stop();
				$("#score").html("Pauza");
			}
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
	 *
	 */
	function compareTwoArrays(a, b){
		
		if(a[1] > b[1]){
			
			return -1;
		}
		else if(a[1] < b[1]){
			
			return 1;
		}
		else {
			
			return 0;
		}
	}
	
	function sortResults(newArray){
		
		newArray = newArray.sort(compareTwoArrays)
		
		$("#results").empty();
		$("#results").append("<table id='tableOfResults'></table>");
		$("#tableOfResults").append("<tr><th><div>Jméno</div></th><th><div>Skóre</div></th></tr>");
		
		for(var i = 0; i<newArray.length-1; i++){
			
			$("#tableOfResults").append("<tr><td class='res'>" + newArray[i][0]
			+ "</td><td class='res'>" + newArray[i][1] + "</td></tr>");
		}
		
	}
	
	/**
	 * Funkce pro ziskavani dat ze serveru (AJAX)
	 */
	function getResults(){
		
		xhr.open("get", "./results.txt", true);
		xhr.send();
		 
		xhr.onreadystatechange = function() {
			 
			if(xhr.readyState == 4){
				 
				if(xhr.status == 200){
					 
					var vstup;
					vstup = xhr.responseText.split(";");
					
					var arr1 = [];
					var arr2 = [];
					
					for (var j = 0; j<vstup.length-1; j++){
						
						arr1.push(vstup[j].split(","));
					}		
					sortResults(arr1);
				}
				if(xhr.status == 404) {
					
					console.log("Nepovedlo se spojit se serverem a ziskat data");
				}
			}
		}
	}
	
	
	
	/**
	 * Odesle vysledek na server
	 */
	function sendResults(){	

		var playerName = player;
		var playerScore = score;
		
		var xmlhr = new XMLHttpRequest();
		xmlhr.open("POST", "./php.php", true);
		xmlhr.setRequestHeader('Content-Type', 'application/json');
		xmlhr.send(JSON.stringify(
		{
			name: player,
			sc: score
		}));
	}
	
	
	
	/**
	 * Pri stiskunti klavesy se spusti tato anonymni funkce
	 */
	$(document).keydown(function(e) {
		
    switch(e.which) {
		
		case 32: {
			pause();
			break;
		} // spacebar
		
        case 37: {
			if(isPlaying && started){
				shape.moveLeft();
				e.preventDefault();
				break;
			}
		} 				// levo


		case 38: {		// nahoru
			if(isPlaying && started){
				shape.rotate();
				e.preventDefault();
				break;
			}
		} 

        case 39: {
			if(isPlaying && started){
				shape.moveRight();
				e.preventDefault();
				break;
			}
		}				// pravo
		
        case 40: {
			if(isPlaying && started){
				shape.moveD();
				e.preventDefault();
				break;
			}
		}				// dolu
		
		
		case 80: {		// p
			pause();
			break;
		}
		
		default: return;
    }
});

	$("#rot").click(function(){		
		
		if(isPlaying && started){
			shape.rotate();
		}
	});
	$("#lft").click(function(){
		if(isPlaying && started){
			shape.moveLeft();
		}
	});
	$("#rgh").click(function(){
		if(isPlaying && started){
			shape.moveRight();
		}
		
	});
	$("#dwn").click(function(){
		if(isPlaying && started){
			shape.moveD();
		}
		
	});
	$("#pse").click(function(){
		pause();
	});
	
});