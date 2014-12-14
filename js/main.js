/**
 * Main program
 * for Simple Spreadsheet project 
 */

main();  // the application itself

function main() {
	
	// Global variables
	
	var rows, columns, tblArray;
	var a = "A".charCodeAt(0);
	

	window.onload = function() {
	

	
		// Assign actions to menu buttons
		document.getElementById("menu_new").addEventListener("click", createNew);
		document.getElementById("menu_open").addEventListener("click", openExisting);
		document.getElementById("menu_save").addEventListener("click", saveCurrent);
	}	

	function createNew() {
		setTableSize(20, 58);
		createBlankArray();	
		createScreenTable();
		
	}
	
	function openExisting() {
		alert("Open - not implemented yet");
	} 
	
	function saveCurrent() {
		alert("Save - not implemented yet");
	}

	function setTableSize(nRows, nCols) {
		rows = nRows;
		columns = nCols;
	}
	
	function Cell(nRow, nCol, value, cellHandler) {
		
		var inputElement, cellElement, isHeader, parentTable, that = this;
		
		this.row = nRow;
		this.col = nCol;
		this.value = value || "";
		this.eventHandler = cellHandler;
		this.elemHTML = createHTML();
		this.inputElement = inputElement;
		
		this.setValue = function(value) {
			this.value = value;
			this.inputElement.value = value;
		}
		
		function createHTML()  {
			isHeader = that.row == 0 || that.col == 0;
			cellElement = document.createElement(isHeader ? "th" : "td");
			cellElement.setAttribute("id", "" + numberToLetters(that.col) + that.row);

			
			inputElement = document.createElement("input")
			inputElement.setAttribute("type", "text");
			inputElement.value = that.value;
			if (isHeader) {
				inputElement.setAttribute("disabled", true);
				inputElement.setAttribute("class", "HeaderCell");
			} else {
				inputElement.setAttribute("class", "DataCell");
				if(that.eventHandler) {
					inputElement.addEventListener("blur", 
						function() {
							that.setValue(that.eventHandler(inputElement.value));

						}, 
						true);
				}	
			}
			
			cellElement.appendChild(inputElement);
			return cellElement;
		}
		

	}
	
	function createBlankArray() {
		var nRow, nCol	// variables for loops
		tblArray = [];
		for (nRow=1; nRow<=rows; nRow++) {
			tblArray[nRow] = [];
			for (nCol=1; nCol<=columns; nCol++) {
				tblArray[nRow][nCol] = new Cell(nRow, nCol, "", cellProcessor); 
			}			
		}				
	}
	
	function createScreenTable() {
		var tableContainer = document.getElementById("table_container");
		// first create DOM of the entire table and only then append it to the container
		var newTable = document.createElement("table");
		newTable.setAttribute("id", "main_table");
		
		// Treat header row (#0) separately
		newTable.appendChild(createHeaderRow());
		
		// Data rows
		for (nRow=1; nRow <= rows; nRow++) {
			var dataRow = document.createElement("tr");
			dataRow.setAttribute("id", "" + nRow);
			dataRow.appendChild(new Cell(nRow, 0, nRow, null).elemHTML);
			for (nCol=1; nCol <= columns; nCol++) {
				dataRow.appendChild(tblArray[nRow][nCol].elemHTML);
			}
			newTable.appendChild(dataRow);			
		}
		
		// final step
		tableContainer.innerHTML = "";
		tableContainer.appendChild(newTable);
		
		function createHeaderRow() {
			var headerRow = document.createElement("tr");
			headerRow.setAttribute("id", "0");
			headerRow.appendChild(new Cell(0, 0, "*", null).elemHTML);
			
			for(var nCol=1; nCol <= columns; nCol++) {
				headerRow.appendChild(new Cell(0, nCol, numberToLetters(nCol), null).elemHTML);
			}
			
			return headerRow;
		}		
	}
	
	

	
	function cellProcessor(userValue) {
		if (userValue.trim().charAt(0) === "=") { 
			return cellParser(userValue);
		} else 
			return userValue;
		
		function cellParser(formula) {
			var value;
			var errorMessage = "Invalid formula";

			var expression = formula.trim().substring(1).toUpperCase();

			try {

				switch (expression.substr(0, 3)) {
				case "SUM": 
					value = sumFunction(aRange(expression.substring(3)));
					break;
				case "AVG":
					value = avgFunction(aRange(expression.substring(3)));
					break;
				default:
					value = evaluateExpression(expression);
				}
			} catch (e) {
				errorMessage = e.message;  
			}

			if(value) {
				return value;
			} else {
				return errorMessage;
			}

			function aRange(expression) {

				var arrayRange = new Array(4);   // top, left, bottom, right
				var errorMessage = "Invalid cell range";
				var isError = true;
				expression = extractCellRange(expression);
				if(expression) {
					var cells = expression.split(":");
					if (cells.length === 2) {
						var pattern = /(\d+)/   // split numbers from the rest
						var first = cells[0].split(pattern);	
						var second = cells[1].split(pattern);

						if (first.length >= 2 && second.length >= 2) {
							arrayRange[1] = Math.min(lettersToNumber(first[0]), lettersToNumber(second[0]));
							arrayRange[3] = Math.max(lettersToNumber(first[0]), lettersToNumber(second[0]));
							arrayRange[0] = Math.min(Number(first[1]), Number(second[1]));
							arrayRange[2] = Math.max(Number(first[1]), Number(second[1]));

							for (var i=1; i<4; i++) {
								if (isNaN(arrayRange[i]) || arrayRange[i] < 0) {
									break;
								}
							}
							// The only successful pass
							isError = false;
						} 
					} 
				}

				if (isError) {
					throw new Error(errorMessage);
				} 

				return arrayRange;

				function extractCellRange(expression) {
					var result;
					// Remove all white space
					expression = expression.replace(/\s/g, "");
					if(expression && 
					   expression.charAt(0) === "(" && expression.charAt(expression.length-1) === ")") {
						// Remove all opening and closing parentheses
						expression = expression.replace(/\(|\)/g, "");
						result = expression;
					} else {
						result = "";
					} 
					return result;
				}

			}

			function sumFunction(range) {
				var sum = 0;
				for (var nRow = range[0]; nRow <= range[2]; nRow++) {
					for (var nCol = range[1]; nCol <= range[3]; nCol++) {
						sum += Number(tblArray[nRow][nCol].value);
					}
				}

				if (isNaN(sum)) {
					throw new Error("Non numeric values in the specified range");
				}

				return sum;
			}

			function avgFunction(range) {
				var sum = sumFunction(range);
				var nNum =  (range[2] - range[0] + 1) * (range[3] - range[1] + 1);
				return sum / nNum;
			}

			function evaluateExpression(expression) {		
				var errorMessage;
				
				// Sanitize 

				// Empty formula
				if (expression == "") {
					errorMessage = "Invalid formula";
				} else {

					// Substitute cells by their values
					expression = expression.replace(/([A-Z]+)(\d+)/g, replaceCellCodes);

					if (expression.indexOf("error") !== -1) {
						errorMessage = "Invalid cell(s)";
					} else {

						// Nothing but numbers, parentheses, arithmetic operators 
						if (!expression.match(/^[\d\.\(\)\+/\*-]*$/)) {
							errorMessage = "Not an arithmetic expression;"
						} else {

							// Should evaluate to number
							var result = eval(expression);
							if (isNaN(result)) {
								errorMessage = "Invalid arithmetic expression";
							}
						}
					}
				}

				if (errorMessage) {
					throw new Error(errorMessage);
				} else {
					return result;
				}


				function replaceCellCodes(match, p1, p2, offset, string) {
					
					var row = Number(p2);
					var col = lettersToNumber(p1);
					
					if (row > 0 && row <= rows &&
						col > 0 && col <= columns) {
						var value = tblArray[row][col].value;
						return value;
					} else {
						throw new Error("Invalid cell code(s)");
					}
				}
				
			}
		}
	}
	
	function numberToLetters(nNum) {
		var result;
			
		if (nNum <= 26) {
			result = letter(nNum);
		} else {
			var modulo = nNum % 26;
			var quotient = Math.floor(nNum / 26);
			if (modulo === 0) {
				result = letter(quotient - 1) + letter(26);
			} else {
				result = letter(quotient) + letter(modulo);
			}
		}
		
		return result;
		
		function letter(nNum) {
			return String.fromCharCode(a + nNum - 1);
		}
	}
	
	function lettersToNumber(str) {

		var nNum = 0;
		var v26 = 1;
		for (var i = str.length -1; i >= 0; i--) {
			nNum += (str.charCodeAt(i) - a + 1) * v26;
			v26 *= 26;
		}
		return nNum;
	}

	
	function parentElementByTag(element, tag) {
		var targetTag = tag.toUpperCase();
		var parent = element.parentElement;
		while(parent && parent.tagName !== targetTag) {
			parent = parent.parentElement;
		}  
		return parent;
	}
	
}

