/**
 * Página do formulário (index.html).
 * Lê os dados do formulário e envia para a API.
 */
const formulario = document.querySelector('#form-perfil');
const botao = formulario.querySelector('button[type="submit"]');
const textoOriginalBotao = botao.textContent;
const modal = document.querySelector('#modal-aviso');

// "dançar , , cantar " -> ["dançar", "cantar"]
const textoParaLista = (texto) =>
  texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

const mostrarAviso = (mensagem) => {
  modal.querySelector('#modal-mensagem').textContent = mensagem;
  modal.showModal();
};

const definirCarregando = (carregando) => {
  botao.disabled = carregando;
  botao.textContent = carregando ? 'Analisando seu perfil...' : textoOriginalBotao;
};

const enviarPerfil = async (perfil) => {
  const resposta = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(perfil),
    signal: AbortSignal.timeout(CONFIG.TEMPO_LIMITE_MS),
  });

  if (!resposta.ok) {
    throw new Error(`A API respondeu com status ${resposta.status}`);
  }

  return resposta.json();
};

// Quando a pessoa volta a digitar, some o aviso de erro do campo.
formulario.addEventListener('input', (evento) => {
  evento.target.setCustomValidity('');
});

formulario.addEventListener('submit', async (evento) => {
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

  if (!CONFIG.API_URL) {
    mostrarAviso('O serviço ainda não está disponível. Tente novamente mais tarde.');
    return;
  }

  definirCarregando(true);

  try {
    const resultado = await enviarPerfil(perfil);
    sessionStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(resultado));
    window.location.href = 'resultado.html';
  } catch (erro) {
    console.error(erro);

    if (erro.name === 'TimeoutError') {
      mostrarAviso('O servidor demorou demais para responder. Tente novamente em instantes.');
    } else {
      mostrarAviso('Não foi possível analisar seu perfil agora. Tente novamente mais tarde.');
    }

    definirCarregando(false);
  }
});