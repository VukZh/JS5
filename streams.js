const {
    Readable,
    Writable,
    Transform
} = require('stream');
const {
    performance,
    PerformanceObserver
} = require('perf_hooks');

let count = 0;
let count2 = 0;
let step = 30;
let HWMark = 150;

var time = performance.now();

class MyTransform extends Transform {
    _transform(data, encode, cb) {
        console.log('-- before transform -- ', data.toString());
        let numPlus = Math.random() * (1000000000000000);
        numPlus = numPlus.toFixed(0)
        console.log('-- random num add   -- ', numPlus.toString());
        data = Number(data) + Number(numPlus);
        console.log('-- after  transform -- ', data.toString());
        this.push(data.toString());
        cb();
    }
}

class MyWritable extends Writable {
    constructor(options) {
        super({
            highWaterMark: HWMark,
            objectMode: false
        });
    }
    _write(data, encode, cb) {
        console.log('    write step        ', count2);
        console.log('_write                 ', data.toString());
        count2++;
        cb();
    }
}

class MyReadable extends Readable {
    constructor(options) {
        super({
            highWaterMark: HWMark,
            objectMode: false
        });
    }
    _read() {
        console.log('           STEP: ', count);
        let num = Math.random() * (1000000000000000);
        num = num.toFixed(0);
        console.log('_read                  ', num);
        if (count > step) {
            this.push(null);
        } else {
            count++;
            this.push(num);

        }
    }
}

const myTransform = new MyTransform();
const myWritable = new MyWritable();
const myReadable = new MyReadable();
const myReadable2 = new MyReadable();


myReadable.on('end', () => {
    console.log('stream ended');
});

myReadable2.on('end', () => {
    console.log('stream ended');
});

myReadable.on('error', (error) => {
    console.log('Error _read'.error);
});

myWritable.on('finish', () => {
    time = performance.now() - time;
    console.log('Time = ', time);
});

//////// paused mode
// myReadable.on('readable', () => {
// });

// myReadable.pipe(myTransform).pipe(myWritable);


//////// flowing mode
myReadable2.on('data', (data) => {});

myReadable2.pipe(myTransform).pipe(myWritable);