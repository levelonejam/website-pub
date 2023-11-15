//Simple customizable api-less timer developed by 
//Mikkel Luja Rasmussen 05-06-2019 | bphlox@gmail.com 

class Timer{
    constructor(startInit,startMS,incrementMS){
        this.running = startInit;
        this.counterMS = startMS;
        this.startValueMS = this.counterMS;
        this.incrementMS = incrementMS;
        if(this.running) this.start();
    }

    setOnEnd(endFunc){
        this.endFunc = endFunc;
    }

    setOnUpdate(updateFunc){
        this.updateFunc = updateFunc;  
    }

    start(){
        this.running = true;
        this.timer = setInterval(() => {
            if(this.counterMS >= 0 && !((this.counterMS - this.incrementMS) < 0)) {
                this.counterMS -= this.incrementMS;
                this.update();
            } else { 
                this.stop();
                this.endFunc();
            };
        },this.incrementMS);
    }

    stop(){
        this.running = false;
        clearInterval(this.timer);
    }

    reset(){
        this.stop();
        this.counterMS = this.startValueMS;
        this.update();
    }

    update(){
        this.declareCheck();
        this.updateFunc();
    }

    declareCheck(){
        if(!this.funcIsDeclared(this.updateFunc)){
            console.error("Update function not defined, stopping timer");
            this.stop();
        }
        if(!this.funcIsDeclared(this.endFunc)){
            console.error("End function not defined, stopping timer");
            this.stop();
        }
    }

    funcIsDeclared(func){
        return (typeof func) === "function";
    }
}