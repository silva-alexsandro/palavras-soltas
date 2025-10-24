const docId = '1psh-D6F9cBJh49H9Fak3u7eBqsQ0zfjQa2GBRcDZVwg';
const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;

function quebrarEmObjetos(conteudo, delimitadores) {
 if (!conteudo || !delimitadores?.length) return [];

 const regexBloco = new RegExp(
  `${delimitadores[0]}:[\\s\\S]*?(?=${delimitadores[0]}:|$)`,
  'gi'
 );
 const blocos = conteudo.match(regexBloco) || [];

 return blocos.map((bloco) => {
  const obj = {};
  delimitadores.forEach((delim) => {
   const regexCampo = new RegExp(
    `${delim}:\\s*([\\s\\S]*?)(?=${delimitadores.join(':|')}:|$)`,
    'i'
   );
   const match = bloco.match(regexCampo);
   obj[delim.toLowerCase()] = match ? match[1].trim() : '';
  });
  return obj;
 });
}

async function carregarDocumento() {
 const res = await fetch(url);
 if (!res.ok) return 'Não foi possível acessar o documento.';
 return await res.text();
}

/**modal */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('js-modal-content');
const modalTitle = document.getElementById('modal-title');
const modalAutor = document.getElementById('modal-autor');
const modalText = document.getElementById('modal-text');
const modalCloseBtn = document.getElementById('modal-close');

function openModal(title, text, autor, color) {
 modalTitle.textContent = title || 'Sem título';
 modalText.textContent = text;
 modalAutor.textContent = autor;
 
 modalContent.style.backgroundColor = `${color}`;
 modal.classList.add('active');
 modal.focus();
 document.body.style.overflow = 'hidden';
}

function closeModal() {
 modal.classList.remove('active');
 document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
 if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

async function main() {
 const content = await carregarDocumento();
 const objs = quebrarEmObjetos(content, ['Titulo', 'Autor', 'Texto']);
 const sectionMural = document.getElementById('js-mural');

 // cores base em formato HSL (mais fácil de manipular tons)
 const coresBase = {
  yellow: [52, 100, 82], // h, s, l
  pink: [340, 100, 85],
  blue: [200, 100, 90],
  green: [100, 100, 88],
  purple: [260, 100, 90],
 };

 const nomesCores = Object.keys(coresBase);

 objs.forEach((e) => {
  const titulo = e.título || e.titulo || 'Sem título';
  const texto = e.texto;
  const autor = e.autor || '';
  const corNome = nomesCores[Math.floor(Math.random() * nomesCores.length)];
  const [h, s, l] = coresBase[corNome];

  // varia o brilho de forma leve (-5% a +5%)
  const variacao = Math.random() * 10 - 5;
  const lFinal = Math.max(70, Math.min(95, l + variacao));
  const corFinal = `hsl(${h}, ${s}%, ${lFinal}%)`;
  // Criação do post-it
  const article = document.createElement('article');
  article.className = `postit-card`;
  article.dataset.title = titulo;
  article.dataset.content = texto;

  // define cor ligeiramente variada
  article.style.backgroundColor = `hsl(${h}, ${s}%, ${lFinal}%)`;

  article.innerHTML = `
      <h3>${titulo}</h3>
      <p class="text-elipse">${texto}</p>
      <footer><p>click para ler mais...</p></footer>
    `;

  article.addEventListener('click', () =>
   openModal(titulo, texto, autor, corFinal)
  );
  sectionMural.appendChild(article);
 });
}

main();
