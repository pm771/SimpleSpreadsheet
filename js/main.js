/**
 * Main program
 * for Simple Spreadsheet project 
 */


window.onload = function() {
	
	var rows, columns, tblArray;

	// Assign actions to menu buttons
	document.getElementById("menu_new").addEventListener("click", CreateNew);
	document.getElementById("menu_open").addEventListener("click", OpenExisting);
	document.getElementById("menu_save").addEventListener("click", SaveCurrent);


	function CreateNew() {
		setTableSize(10, 10);
		createBlankArray();	
		createScreenTable();
		
	}
	
	function OpenExisting() {
		alert("Open - not implemented yet");
	} 
	
	function SaveCurrent() {
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
			cellElement.setAttribute("id", "" + letter(that.row) + that.col);
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
			var rowLetter = letter(nRow);
			dataRow.setAttribute("id", rowLetter);
			dataRow.appendChild(new Cell(nRow, 0, rowLetter, null).elemHTML);
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
			headerRow.appendChild(new Cell(0, nCol, ""+nCol, null).elemHTML);
		}
		
		return headerRow;
	}
	
	function letter(nNum) {
		var a = "A".charCodeAt(0);
		return String.fromCharCode(a + nNum - 1);
	}
	
	function cellProcessor() {
		// nothing yet
	}
	
	
}

