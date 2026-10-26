/**
 * Página do formulário (index.html).
 * Lê os dados do formulário e (futuramente) envia para a API.
 */
const formulario = document.querySelector('#form-perfil');

// "dançar , , cantar " -> ["dançar", "cantar"]
const textoParaLista = (texto) =>
  texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  const modal = document.querySelector('#modal-aviso');

  const mostrarAviso = (mensagem) => {
    modal.querySelector('#modal-mensagem').textContent =  mensagem;
    modal.showModal();
  };

// Quando a pessoa volta a digitar, some o aviso de erro do campo.
formulario.addEventListener('input', (evento) => {
  evento.target.setCustomValidity('');
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const campos = formulario.elements;
  const nome = campos.nome.value.trim();
  const hobbies = textoParaLista(campos.hobbies.value);
  const interesses = textoParaLista(campos.interesses.value);

  if (hobbies.length === 0) {
    campos.hobbies.setCustomValidity('Informe pelo menos um hobby.');
    campos.hobbies.reportValidity();
    return;
  }

  if (interesses.length === 0) {
    campos.interesses.setCustomValidity('Informe pelo menos uma área de interesse.');
    campos.interesses.reportValidity();
    return;
  }

  const perfil = {
    name: nome,
    hobbies: hobbies,
    interests: interesses,
  };

  console.log('Perfil montado:', perfil);

  // TODO: enviar o perfil para a API configurada em CONFIG.API_URL
  // e levar o usuário para a página resultado.html.
mostrarAviso('O serviço ainda não está disponível. Tente novamente mais tarde.');
});