const kuis = document.querySelector('#kuis');
const password = document.querySelector('#password');


kuis.addEventListener('click',()=>{
    console.log(`sudah dipencet`)
    if(kuis.src.includes("eye.svg") ){
        console.log(`aselole`);
        kuis.src="/img/eye-off.svg";
        password.type = "text";
    }else{
        console.log(`nganjuk`);
        kuis.src="/img/eye.svg"
        password.type = "password";
    }
})

document.body.addEventListener('click',()=>{
    console.log(`saya`)
})