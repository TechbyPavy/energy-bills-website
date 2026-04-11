let app = "Energy Bills";
let versao = "1";
let ativo = true;

console.log(app);
console.log(versao);
console.log(ativo);


console.log("O JavaScript está a funcionar!");

function analisarConsumo(kwh) {
    if (kwh > 400) {
        return "Consumo alto — considera rever os teus hábitos!";
    } else if (kwh > 200) {
        return "Consumo normal para uma família portuguesa.";
    } else {
        return "Consumo baixo — muito bem!";
    }
}

console.log(analisarConsumo(500));
console.log(analisarConsumo(342));
console.log(analisarConsumo(150));

// busca o elemento pelo ID
const titulo = document.getElementById('titulo-pagina');

// mostra o elemento no console
console.log(titulo);

// muda o texto
titulo.textContent = "Bem-vindo à Energy Bill! ⚡";

// muda a cor
titulo.style.color = "#00C896";

const inputFatura = document.getElementById('input-fatura');
const botaoAnalisar = document.getElementById('botao-analisar');
const resultado = document.getElementById('resultado');

// quando escolhe o ficheiro
inputFatura.addEventListener('change', function () {
    const ficheiro = inputFatura.files[0];
    console.log("Ficheiro pronto: " + ficheiro.name);
});

// quando clica em analisar
botaoAnalisar.addEventListener('click', function () {
    if (inputFatura.files.length === 0) {
        resultado.textContent = "⚠️ Escolhe uma fatura primeiro!";
        return;
    }
    resultado.textContent = "✅ Ficheiro recebido — a analisar...";
});