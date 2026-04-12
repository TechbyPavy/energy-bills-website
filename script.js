console.log("Tesseract disponível:", typeof Tesseract);

pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3/build/pdf.worker.min.js';

const inputFatura = document.getElementById('input-fatura');
const botaoAnalisar = document.getElementById('botao-analisar');
const resultado = document.getElementById('resultado');

async function lerPDF(ficheiro) {
    const arrayBuffer = await ficheiro.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const pagina = await pdf.getPage(1);
    const canvas = document.createElement('canvas');
    const contexto = canvas.getContext('2d');
    const viewport = pagina.getViewport({ scale: 3 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await pagina.render({ canvasContext: contexto, viewport }).promise;
    const dados = await Tesseract.recognize(canvas, 'por');
    return dados.data.text;
}

async function lerImagem(ficheiro) {
    const dados = await Tesseract.recognize(ficheiro, 'por');
    return dados.data.text;
}

function analisarTexto(texto) {

    // total — "apagar?" seguido do valor
    const totalMatch = texto.match(/apagar\?\s*\n\s*(\d{2,3}[,.]\d{2})\s*€/i);
    const total = totalMatch ? totalMatch[1] : 'Não encontrado';

    // apanha os 3 primeiros valores da linha dos totais
    const valoresMatch = texto.match(/(\d{2,3}[,.]\d{2})\s*€\s+(\d{2,3}[,.]\d{2})\s*€\s+(\d{2,3}[,.]\d{2})\s*€/);
    const eletricidade = valoresMatch ? valoresMatch[1] : 'Não encontrado';
    const gas = valoresMatch ? valoresMatch[2] : 'Não encontrado';
    const servicos = valoresMatch ? valoresMatch[3] : 'Não encontrado';

    // potência
    const potenciaMatch = texto.match(/(\d[,.]\d)\s*[Kk][Vv][Aa]/i);
    const potencia = potenciaMatch ? potenciaMatch[1] : 'Não encontrado';

    // data
    const dataMatch = texto.match(/(\d{1,2}\s+(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*\s+\d{4})/i);
    const data = dataMatch ? dataMatch[1] : 'Não encontrado';

    // alerta
    const totalNum = parseFloat(total.replace(',', '.'));
    let alerta = '';
    if (totalNum > 100) {
        alerta = '⚠️ Fatura acima de 100€ — verifica os detalhes!';
    } else if (totalNum > 0) {
        alerta = '✅ Fatura dentro do esperado.';
    } else {
        alerta = '⚠️ Não foi possível verificar o total.';
    }

    return { total, eletricidade, gas, servicos, potencia, data, alerta };
}

botaoAnalisar.addEventListener('click', async function () {

    if (inputFatura.files.length === 0) {
        resultado.textContent = "⚠️ Escolhe uma fatura primeiro!";
        return;
    }

    const ficheiro = inputFatura.files[0];
    resultado.textContent = "⏳ A ler a fatura... por favor aguarda.";

    let textoExtraido = '';

    if (ficheiro.type === 'application/pdf') {
        textoExtraido = await lerPDF(ficheiro);
    } else {
        textoExtraido = await lerImagem(ficheiro);
    }

    const r = analisarTexto(textoExtraido);

    resultado.innerHTML = `
        <h3>📊 Resultado da Análise — EDP</h3>
        <p>💶 Total a pagar: <strong>${r.total} €</strong></p>
        <p>⚡ Eletricidade: <strong>${r.eletricidade} €</strong></p>
        <p>🔥 Gás Natural: <strong>${r.gas} €</strong></p>
        <p>🔧 Serviços: <strong>${r.servicos} €</strong></p>
        <p>🔌 Potência: <strong>${r.potencia} kVA</strong></p>
        <p>📅 Data limite: <strong>${r.data}</strong></p>
        <br>
        <p>${r.alerta}</p>
    `;
});

