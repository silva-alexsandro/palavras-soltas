// const docId = '1psh-D6F9cBJh49H9Fak3u7eBqsQ0zfjQa2GBRcDZVwg';
// const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;

// async function carregarDocumento() {
//  const container = document.getElementById('doc-content');

//  try {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error('Não foi possível acessar o documento.');

//   const text = await res.text();
//   container.textContent = text; // texto puro, seguro
//  } catch (err) {
//   container.textContent = 'Erro ao carregar o documento: ' + err.message;
//  }
// }

// carregarDocumento();

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalCloseBtn = document.getElementById('modal-close');

// Abrir modal com conteúdo do post-it clicado
document.querySelectorAll('.postit-card').forEach((card) => {
 card.addEventListener('click', () => {
  const title = card.getAttribute('data-title');
  const content = card.getAttribute('data-content');

  modalTitle.textContent = title;
  modalText.textContent = content;

  modal.classList.add('active');
  modal.focus();
  document.body.style.overflow = 'hidden'; // Bloquear scroll do body
 });
});

// Fechar modal
function closeModal() {
 modal.classList.remove('active');
 document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener('click', (e) => {
 if (e.target === modal) {
  closeModal();
 }
});

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape' && modal.classList.contains('active')) {
  closeModal();
 }
});
