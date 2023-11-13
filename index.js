let a=10;
let b=0;
console.log(a+b);

let data = new Promise((resolve , reject)=>{
    setTimeout(()=>{
        resolve(20);
    } , 3000);
});

data.then((b)=>{
    console.log(a+b);
});


