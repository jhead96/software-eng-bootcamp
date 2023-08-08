class Interpreter{
    constructor (rawProgram, textDesc) {
       this.rawProgram = rawProgram;
       this.textDesc = textDesc;
       this.program = this.generateProgram();
       
       this.directions = new Set([">", "<", "^", "v"]);
       this.numerical_instrs = new Set(["+", "-", "*", "/", "%"]);

        // Flags
        this.current_dir = ">";
        this.current_instr = null;
        this.string_mode = false;
        this.skip_instr = false;
        this.finished = false;

        // Pointers
        this.v_pntr = 0;
        this.h_pntr = 0;

        // Stack
        this.stack = [];
        this.output = "";
    };

    generateProgram() {
        let program = [];
        let code_split = this.rawProgram.split("\n");
    
        // Make blank program
        for (let i = 0; i < NUM_ROWS; i++) {
            let new_row = [];
            for (let j = 0; j < NUM_COLS; j++) {
                new_row.push(INITCHAR);
            };
            program.push(new_row);  
        };
    
        // Insert program into blanks
        for (let i = 0; i < code_split.length; i++) {
            for (let j = 0; j < code_split[i].length; j++) {
                program[i][j] = code_split[i][j];
            }; 
        };
    
        return program;
    };

    incrementInstruction() {
         
        let op = this.program[this.v_pntr][this.h_pntr];
        this.current_instr = op;

        console.log(`(v, h) = (${this.v_pntr}, ${this.h_pntr})`);
        console.log(op);
        
        // Terminate program
        if (op == "@") {
            self.finished = true;
            return;
        }

        // Toggle string mode
        if (op == '"') {
            this.string_mode = !this.string_mode;
        };

        // Check for string mode
        if (!this.string_mode) {

            // Check for instruction skip
            if (!this.skip_instr) {
                // Run instruction
                this.executeInstruction(op); 
            } else {
                this.skip_instr = false;
                console.log("SKIPPED!");
            }
 


        } else {
            // String mode operation
            if (op != '"') {
                this.stack.push(op.charCodeAt(0));
            };
        };

        this.incrementPointers();
    };

    executeInstruction(op) {

        // Space
        if (op == " ") {
            return;
        };

        // Number
        if (!isNaN(op)) {
            this.stack.push(parseInt(op));
        };

        // Math operation
        if (this.numerical_instrs.has(op)) {
            this.numericalIntruction(op);
        }

        // Output manipulation
        if (op == "."){
            this.output += this.stack.pop().toString();
        };
                
        if (op == ","){
            this.output += String.fromCharCode(this.stack.pop());
        };

        // Stack manipulation
        if (op == ":") {

            if (this.stack.length > 0) {
                let val = this.stack.pop();
                this.stack.push(val, val);
            } else {
                this.stack.push(0);
            };
        };

        if (op == "$") {
            if (this.stack.length > 0) {
                this.stack.pop();
            };
        };

        if (op == "\\") {

            let val1 = this.stack.pop();
            let val2 = this.stack.pop();

            if (val1 == undefined) {
                val1 = 0;
            };

            if (val2 == undefined) {
                val2 = 0;
            };

            this.stack.push(val1);
            this.stack.push(val2);









        };

        // Instruction manipulation
        if (op == "#") {
            this.skip_instr = true;
        };

        // Conditionals
        if (op == "_") {
            let val = this.stack.pop();
            console.log(val);

            if (val == 0) {
                this.current_dir = ">";
                console.log("RIGHT");
            } else {
                this.current_dir = "<";
                console.log("LEFT");
            };

        };

        // Memory
        if (op == "g") {
            console.log("HERE")
            let y = this.stack.pop();
            let x = this.stack.pop();

            if (y == undefined) {
                y = 0;
            };

            if (x == undefined) {
                x = 0;
            }

            let val = this.stack[y][x];

            this.stack.push(val);

        };
            
        // Change direction
        if (this.directions.has(op)) {
            this.current_dir = op;
            };
    };

    numericalIntruction(op) {

        let a = this.stack.pop();
        let b = this.stack.pop();

        if (op == "+") {
            this.stack.push(a + b);
        } else if (op == "-") {
            this.stack.push(b - a);
        } else if (op == "*") {
            this.stack.push(a * b);
        } else if (op == "/") {

            if (a == 0) {
                this.stack.push(0);
            } else {
                this.stack.push(Math.floor(b / a));
            };

        } else {

            if (a == 0) {
                this.stack.push(0);
            } else {
                this.stack.push(b % a);
            };
        };

    };

    incrementPointers() {
        if (this.current_dir == ">") {
            this.h_pntr += 1;   
        } else if (this.current_dir == "<") {
            this.h_pntr -= 1;
        } else if (this.current_dir == "v") {
            this.v_pntr += 1;
        } else {
            this.v_pntr -= 1;    
        }; 
        // Wrap around NOT IMPLEMENTED
    };
};


function makeTable(value) {

    // Iterate rows
    for (let i = 0; i < NUM_ROWS; i++) {
        let row = MAINTBL.insertRow();

        // Iterate columns
        for (let j = 0; j < NUM_COLS; j++) {
            let cell = row.insertCell();
            cell.innerHTML = value;
            cell.classList.add("defaultCell")      
        }        
    }
};

function clearTable(value) {

    for(let i = 0; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLS; j++) {
            MAINTBL.rows[i].cells[j].innerHTML = value
        };   
    
    };
};

function modifyCellVal(x, y, val) {
    MAINTBL.rows[y].cells[x].innerHTML = val;
};

function modifyCellColour(x, y) {

    if (MAINTBL.rows[y].cells[x].innerHTML != " ") {
        MAINTBL.rows[y].cells[x].style.color = "red";
    } else {
        MAINTBL.rows[y].cells[x].style.backgroundColor = "red";
    };
    
};

function resetTableColour() {

    for(let i = 0; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLS; j++) {
            // Reset properties
            MAINTBL.rows[i].cells[j].style.color = "black";
            MAINTBL.rows[i].cells[j].style.backgroundColor = "transparent";
            
            MAINTBL.rows[i].cells[j].removeAttribute("style")
        };   
    }; 
};

function changeProgram(key){

    // Change intepreter
    current_interp = new Interpreter(PROGRAMS[key], PROGRAMDESC[key]);

    displayProgram();
    displayDesc();
    updateStackText();
    updateOutputText();
    formatNavBar(key);
    resetTableColour();

};

function displayProgram() {

    let code = current_interp.program

    // Clear table
    clearTable(INITCHAR);

    // Write code into grid
    for (let i = 0; i < code.length; i++) {
        let row = code[i];

        for (let j = 0; j < row.length; j++) {
            modifyCellVal(j, i, row[j]);
        };
    };

};

function displayDesc() {
    var element = document.getElementById("programDescStr");
    element.innerHTML = current_interp.textDesc;
};

function updateStackText() {
    let el = document.getElementById("stackText");
    el.innerHTML = current_interp.stack.toString();

    if (current_interp.stack.length > 0) {
        el.innerHTML = current_interp.stack.toString();
    } else {
        el.innerHTML = "EMPTY";
    }

};

function updateOutputText() {
    let el = document.getElementById("outputText");

    if (current_interp.output == "") {
        el.innerHTML = "EMPTY";
    } else {
        el.innerHTML = current_interp.output;
    }
 
};

function formatNavBar(key) {

    let els = [document.getElementById("HWBtn"),
              document.getElementById("FBtn"),
              document.getElementById("QBtn")];
    
    let selectedCls = "selected_item";

    if (key == "HW") {
        els[0].classList.add(selectedCls);
        els[1].classList.remove(selectedCls);
        els[2].classList.remove(selectedCls);
    } else if (key == "8FACT"){
        els[0].classList.remove(selectedCls);
        els[1].classList.add(selectedCls);
        els[2].classList.remove(selectedCls);
    } else {
        els[0].classList.remove(selectedCls);
        els[1].classList.remove(selectedCls);
        els[2].classList.add(selectedCls);
    }


};

function getProgramSpeed() {
    
    if (document.getElementById("slow_speed").checked) {
        return 500;
    } else if (document.getElementById("medium_speed").checked) {
        return 50;
    } else {
        return 1;
    }
}

function runActiveProgram() {

    // Get speed
    speed = getProgramSpeed();
    
    if (current_interp != null) {
        currentInterval = setInterval(programHelper, speed);
        running = true;
    };
};

function programHelper() {

    resetTableColour();
    modifyCellColour(current_interp.h_pntr, current_interp.v_pntr);
    current_interp.incrementInstruction();
    updateStackText();
    updateOutputText();

    if (current_interp.current_instr == "@") {
        stopActiveProgram();
    };
};

function stopActiveProgram() {
    clearInterval(currentInterval);
};


// Program specs
const INITCHAR = "&nbsp";
const NUM_COLS = 50;
const NUM_ROWS = 15;

// Important HTML elements
const MAINTBL = document.getElementById("programTable");

// Define Befunge programs and descriptions
const PROGRAMS = {
    'HW' : '>25*"!dlroW olleH":v\n                v:,_@\n                >  ^',
    '8FACT': '08>:1-:v v *_$.@ \n  ^    _$>\\:^',
    'QUINE': '01->1# +# :# 0# g# ,# :# 5# 8# *# 4# +# -# _@'};

const PROGRAMDESC = {
    'HW': "Outputs 'Hello world!'",
    '8FACT': "Calculates and outputs 8!",
    'QUINE': "Outputs a copy of the program."};

// Initial program is hello world
makeTable();
let current_interp = null;
let currentInterval = null;
let running = false
changeProgram("HW", running);


// Connect buttons
document.getElementById("HWBtn").addEventListener("click", () => changeProgram("HW"));
document.getElementById("FBtn").addEventListener("click", () => changeProgram("8FACT"));
document.getElementById("QBtn").addEventListener("click", () => changeProgram("QUINE"));
document.getElementById("startBtn").addEventListener("click", runActiveProgram);
document.getElementById("stopBtn").addEventListener("click", stopActiveProgram);