// Elementos do menu responsivo e da navegação entre as seções.
const botaoMenu = document.querySelector('.botao-menu');
const navegacao = document.querySelector('.navegacao');

// Modal compartilhado por todas as imagens ampliáveis do portfólio.
const modal = document.querySelector('.modal-imagem');
const imagemModal = modal.querySelector('img');
const tituloModal = modal.querySelector('p');
const fecharModal = modal.querySelector('.fechar-modal');

// Áudio e informações visuais do botão que controla a reprodução.
const musicaAmbiente = document.querySelector('#musica-ambiente');
const botaoMusica = document.querySelector('#botao-musica');
const textoMusica = botaoMusica.querySelector('.texto-musica');

// Controle de tema; a preferência inicial já foi aplicada pelo script no HTML.
const botaoTema = document.querySelector('#botao-tema');
const iconeTema = botaoTema.querySelector('[data-icone-tema]');

/**
 * Sincroniza o tema da página, o ícone e os rótulos do botão de alternância.
 * @param {'claro' | 'escuro'} tema - Aparência que será aplicada à página.
 */
function aplicarTema(tema) {
    const temaEscuro = tema === 'escuro';
    const acao = temaEscuro ? 'Ativar modo claro' : 'Ativar modo escuro';

    document.documentElement.dataset.tema = tema;
    botaoTema.setAttribute('aria-label', acao);
    botaoTema.title = acao;
    iconeTema.textContent = temaEscuro ? '☀' : '☾';

    // Também ajusta a cor usada pela interface de navegadores compatíveis.
    document.querySelector('meta[name="theme-color"]').content = temaEscuro ? '#07111f' : '#f5f8fc';
}

// Atualiza o botão de tema conforme a escolha inicial definida no carregamento.
aplicarTema(document.documentElement.dataset.tema || 'escuro');

// Alterna o tema e tenta guardar a escolha para as próximas visitas.
botaoTema.addEventListener('click', () => {
    const temaAtual = document.documentElement.dataset.tema;
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';

    aplicarTema(novoTema);

    try {
        localStorage.setItem('meu-portfolio:tema', novoTema);
    } catch {
        // A troca continua funcionando durante a visita.
    }
});

// Evita a necessidade de atualizar manualmente o ano exibido no rodapé.
document.querySelector('#ano-atual').textContent = new Date().getFullYear();

// Mantém a abertura visual do menu e seu estado acessível em sincronia.
botaoMenu.addEventListener('click', () => {
    const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    botaoMenu.setAttribute('aria-expanded', String(!estaAberto));
    navegacao.classList.toggle('aberta');
});

// A reprodução depende de uma ação da pessoa e pode ser recusada pelo navegador.
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

// Reflete o estado real do áudio no texto e nos atributos acessíveis do botão.
musicaAmbiente.addEventListener('play', () => {
    botaoMusica.setAttribute('aria-pressed', 'true');
    botaoMusica.setAttribute('aria-label', 'Pausar música ambiente');
    textoMusica.textContent = 'Pausar';
});

// Restaura a indicação de reprodução quando a música é pausada.
musicaAmbiente.addEventListener('pause', () => {
    botaoMusica.setAttribute('aria-pressed', 'false');
    botaoMusica.setAttribute('aria-label', 'Reproduzir música ambiente');
    textoMusica.textContent = 'Música';
});

// Fecha o menu móvel depois que um destino interno é escolhido.
document.querySelectorAll('.navegacao a').forEach((link) => {
    link.addEventListener('click', () => {
        navegacao.classList.remove('aberta');
        botaoMenu.setAttribute('aria-expanded', 'false');
    });
});

// A faixa usa rolagem nativa; as setas apenas avançam ou recuam um cartão.
const galeria = document.querySelector('.galeria-grade');
const controlesGaleria = document.querySelector('.galeria-controles');
const botaoAnterior = controlesGaleria.querySelector('.galeria-anterior');
const botaoProxima = controlesGaleria.querySelector('.galeria-proxima');

/**
 * Desativa as setas nos extremos da faixa, tolerando arredondamentos de um pixel.
 */
function atualizarControlesGaleria() {
    const limiteRolagem = galeria.scrollWidth - galeria.clientWidth;
    botaoAnterior.disabled = galeria.scrollLeft <= 1;
    botaoProxima.disabled = galeria.scrollLeft >= limiteRolagem - 1;
}

/**
 * Desloca a faixa pela largura de um cartão, incluindo o espaço entre cartões.
 * @param {number} direcao - Use -1 para voltar ou 1 para avançar.
 */
function moverGaleria(direcao) {
    const larguraCartao = galeria.firstElementChild.getBoundingClientRect().width;
    const espacamento = parseFloat(getComputedStyle(galeria).columnGap);
    const passo = larguraCartao + espacamento;

    // Alinha o próximo destino mesmo após uma rolagem manual por toque ou teclado.
    const indiceAtual = Math.round(galeria.scrollLeft / passo);
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Respeita a preferência de acessibilidade por movimentos reduzidos.
    galeria.scrollTo({
        left: (indiceAtual + direcao) * passo,
        behavior: reduzirMovimento ? 'instant' : 'smooth'
    });
}

// Liga as setas à navegação manual, sem avanço automático das imagens.
botaoAnterior.addEventListener('click', () => moverGaleria(-1));
botaoProxima.addEventListener('click', () => moverGaleria(1));

// Recalcula os limites após rolagens e alterações na largura disponível.
galeria.addEventListener('scroll', atualizarControlesGaleria, { passive: true });
new ResizeObserver(atualizarControlesGaleria).observe(galeria);

// Exibe os controles somente depois que seus eventos estão configurados.
controlesGaleria.hidden = false;
atualizarControlesGaleria();

// Os atributos data-imagem e data-titulo permitem reutilizar o mesmo modal.
document.querySelectorAll('[data-imagem]').forEach((botao) => {
    botao.addEventListener('click', () => {
        imagemModal.src = botao.dataset.imagem;
        imagemModal.alt = botao.dataset.titulo;
        tituloModal.textContent = botao.dataset.titulo;
        modal.showModal();
    });
});

/** Fecha a ampliação e limpa a referência da imagem que estava sendo exibida. */
function fecharVisualizacao() {
    modal.close();
    imagemModal.src = '';
}

// O botão fecha a visualização; cliques no próprio conteúdo mantêm o modal aberto.
fecharModal.addEventListener('click', fecharVisualizacao);

modal.addEventListener('click', (evento) => {
    if (evento.target === modal) fecharVisualizacao();
});

// Revela cada bloco uma única vez, quando ao menos 12% dele entra na área visível.
const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                // Deixa de observar os elementos já exibidos para evitar trabalho repetido.
                observador.unobserve(entrada.target);
            }
        });
    },
    { threshold: 0.12 }
);

// Registra somente os elementos marcados para a animação de entrada.
document.querySelectorAll('.revelar').forEach((elemento) => observador.observe(elemento));
