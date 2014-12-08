/**
 * Main program
 * for Simple Spreadsheet project 
 */


window.onload = function() {
	
	var rows, columns, tblArray;

	// Assign actions to menu buttons
	document.getElementById("menu_new").addEventListener("click", createNew);
	document.getElementById("menu_open").addEventListener("click", openExisting);
	document.getElementById("menu_save").addEventListener("click", saveCurrent);


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
		
		var inputElement, cellElement, isHeader, that = this;
		
		this.row = nRow;
		this.col = nCol;
		this.value = value || "";
		this.eventHandler = cellHandler;
		this.elemHTML = createHTML();
		this.inputElement = inputElement;
		
		function createHTML()  {
			isHeader = that.row == 0 || that.col == 0;
			cellElement = document.createElement(isHeader ? "th" : "td");
			cellElement.setAttribute("id", "" + numberToLetters(that.col) + that.row);
			if(!isHeader && this.eventHandler) {
				cellElement.addEventListener("blur", function() {
					setValue(that.eventHandler(inputElement.value));
					});
			}
			
			inputElement = document.createElement("input")
			inputElement.setAttribute("type", "text");
			inputElement.value = that.value;
			if (isHeader) {
				inputElement.setAttribute("disabled", true);
				inputElement.setAttribute("class", "HeaderCell");
			} else {
				inputElement.setAttribute("class", "DataCell");
			}
			
			cellElement.appendChild(inputElement);
			return cellElement;
		}
		
		this.setValue = function(value) {
			this.value = value;
			this.input.value = value;
			
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
		
	}
	
	function createHeaderRow() {
		var headerRow = document.createElement("tr");
		headerRow.setAttribute("id", "0");
		headerRow.appendChild(new Cell(0, 0, "*", null).elemHTML);
		
		for(var nCol=1; nCol <= columns; nCol++) {
			headerRow.appendChild(new Cell(0, nCol, numberToLetters(nCol), null).elemHTML);
		}
		
		return headerRow;
	}
	
	function letter(nNum) {
		var a = "A".charCodeAt(0);
		return String.fromCharCode(a + nNum - 1);
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
	}
	
	function cellProcessor() {
		// nothing yet
	}
	
	
}

