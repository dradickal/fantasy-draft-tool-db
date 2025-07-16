type DelayLabel = string | null;
type DelayId = number | null;


export class InputDelay {
    delay:number;
    delayCallback:Function;
    timeoutId:DelayId = null;
    label:DelayLabel = null;

    constructor(delay:number = 1000, delayCallback:Function) {
        this.delay = delay;
        this.delayCallback = delayCallback;
    }

    startDelay(label:DelayLabel, target:any) {
        this.label = label;
        this.timeoutId = setTimeout((data:any) => {
            this.delayCallback(data);
            console.log(label, data);
        }, this.delay, target);
    }

    cancelDelay() {
        if(this.timeoutId === null) return;
        clearTimeout(this.timeoutId as number);
    }
}