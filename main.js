const botaoMenu = document.querySelector('.botao-menu');
const navegacao = document.querySelector('.navegacao');
const modal = document.querySelector('.modal-imagem');
const imagemModal = modal.querySelector('img');
const tituloModal = modal.querySelector('p');
const fecharModal = modal.querySelector('.fechar-modal');
const musicaAmbiente = document.querySelector('#musica-ambiente');
const botaoMusica = document.querySelector('#botao-musica');
const textoMusica = botaoMusica.querySelector('.texto-musica');

document.querySelector('#ano-atual').textContent = new Date().getFullYear();

botaoMenu.addEventListener('click', () => {
    const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    botaoMenu.setAttribute('aria-expanded', String(!estaAberto));
    navegacao.classList.toggle('aberta');
});

botaoMusica.addEventListener('click', async () => {
    try {
        if (musicaAmbiente.paused) {
            await musicaAmbiente.play();
        } else {
            musicaAmbiente.pause();
        }
    } catch (erro) {
        console.error('Não foi possível controlar a música ambiente.', erro);
    }
});

musicaAmbiente.addEventListener('play', () => {
    botaoMusica.setAttribute('aria-pressed', 'true');
    botaoMusica.setAttribute('aria-label', 'Pausar música ambiente');
    textoMusica.textContent = 'Pausar';
});

musicaAmbiente.addEventListener('pause', () => {
    botaoMusica.setAttribute('aria-pressed', 'false');
    botaoMusica.setAttribute('aria-label', 'Reproduzir música ambiente');
    textoMusica.textContent = 'Música';
});

document.querySelectorAll('.navegacao a').forEach((link) => {
    link.addEventListener('click', () => {
        navegacao.classList.remove('aberta');
        botaoMenu.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('[data-imagem]').forEach((botao) => {
    botao.addEventListener('click', () => {
        imagemModal.src = botao.dataset.imagem;
        imagemModal.alt = botao.dataset.titulo;
        tituloModal.textContent = botao.dataset.titulo;
        modal.showModal();
    });
});

function fecharVisualizacao() {
    modal.close();
    imagemModal.src = '';
}

fecharModal.addEventListener('click', fecharVisualizacao);

modal.addEventListener('click', (evento) => {
    if (evento.target === modal) fecharVisualizacao();
});

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.revelar').forEach((elemento) => observador.observe(elemento));
