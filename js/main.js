const docId = '1psh-D6F9cBJh49H9Fak3u7eBqsQ0zfjQa2GBRcDZVwg';
const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;

function quebrarEmObjetos(conteudo, delimitadores) {
 if (!conteudo || !delimitadores?.length) return [];

 const primeiro = delimitadores[0];
 const regexSplit = new RegExp(`${primeiro}:`, 'g');

 return conteudo
  .split(regexSplit)
  .filter((b) => b.trim())
  .map((b) => {
   const obj = {};

   delimitadores.forEach((delim, i) => {
    const proximo = delimitadores[i + 1];
    const regexCampo = new RegExp(
     `${delim}:\\s*([\\s\\S]*?)${proximo ? `${proximo}:` : '$'}`,
     'i'
    );
    const match = b.match(regexCampo);
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

/**
 * ler o arquivo do drive - ok
 * identificar todos os titulos e textos - ok
 * titulo pode ser vazio mas textos nao - ok
 * fazer um grande array com essas informações - ok
 * interar, cada titulo + texto precisa ser um postit
 *
 */
/**modal */
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalCloseBtn = document.getElementById('modal-close');

function openModal(title, text) {
 modalTitle.textContent = title || 'Sem título';
 modalText.textContent = text;
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
 console.log('main');
 const content = await carregarDocumento();
 const objs = quebrarEmObjetos(content, ['Titulo', 'Texto']);
 //js-mural
 const sectionMural = document.getElementById('js-mural');

 objs.forEach((e) => {
  const titulo = e.título || e.titulo || 'Sem título';
  const texto = e.texto;

  // Criação do post-it dinamicamente
  const article = document.createElement('article');
  article.className = 'postit-card';
  article.dataset.title = titulo;
  article.dataset.content = texto;
  article.innerHTML = `
      <h3>${titulo}</h3>
      <p class="text-elipse">${texto}</p>
      <footer><p>click para ler mais...</p></footer>
    `;

  // Evento de clique para abrir modal
  article.addEventListener('click', () => openModal(titulo, texto));

  sectionMural.appendChild(article);
 });
}
main();
