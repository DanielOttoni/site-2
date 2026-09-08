const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    menuToggle.setAttribute('aria-expanded', aberto);
});

document.querySelectorAll('.menu a, [data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const destino = link.getAttribute('href') || link.dataset.scroll;
        if (!destino.startsWith('#')) return;
        event.preventDefault();
        document.querySelector(destino).scrollIntoView({ behavior: 'smooth' });
        menu.classList.remove('aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

const revelar = new IntersectionObserver((elementos) => {
    elementos.forEach((elemento) => {
        if (elemento.isIntersecting) {
            elemento.target.classList.add('visivel');
            revelar.unobserve(elemento.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.revelar').forEach((secao) => revelar.observe(secao));

const servidor = document.querySelector('.servidor-modelo');
let rotacao = -22;
let arrastando = false;
let ultimoX = 0;

function atualizarServidor() {
    servidor.style.transform = `rotateX(-8deg) rotateY(${rotacao}deg)`;
}

document.querySelectorAll('.modelo-interface [data-giro]').forEach((botao) => {
    botao.addEventListener('click', () => {
        rotacao += Number(botao.dataset.giro);
        atualizarServidor();
    });
});

servidor.addEventListener('pointerdown', (event) => {
    arrastando = true;
    ultimoX = event.clientX;
    servidor.setPointerCapture(event.pointerId);
});

servidor.addEventListener('pointermove', (event) => {
    if (!arrastando) return;
    rotacao += (event.clientX - ultimoX) * 0.7;
    ultimoX = event.clientX;
    atualizarServidor();
});

servidor.addEventListener('pointerup', () => { arrastando = false; });
servidor.addEventListener('pointercancel', () => { arrastando = false; });

const informacoes = {
    seguranca: {
        numero: '01 / 05',
        titulo: 'Segurança',
        texto: 'O SQL Server controla quem pode acessar cada informação. Assim, somente pessoas autorizadas conseguem consultar ou alterar os dados.',
        detalhes: ['CONTROLE DE ACESSO', 'CRIPTOGRAFIA', 'BACKUP'],
        progresso: '20%'
    },
    desempenho: {
        numero: '02 / 05',
        titulo: 'Desempenho',
        texto: 'Índices funcionam como o índice de um livro: ajudam o banco a encontrar as informações sem precisar procurar em tudo.',
        detalhes: ['ÍNDICES', 'CONSULTAS RÁPIDAS', 'OTIMIZAÇÃO'],
        progresso: '40%'
    },
    escala: {
        numero: '03 / 05',
        titulo: 'Escalabilidade',
        texto: 'O sistema pode acompanhar o crescimento do projeto: 100, 1.000 ou 10.000+ usuários sem perder sua organização.',
        detalhes: ['100 USUÁRIOS', '1.000 USUÁRIOS', '10.000+ USUÁRIOS'],
        progresso: '60%'
    },
    manutencao: {
        numero: '04 / 05',
        titulo: 'Manutenção',
        texto: 'Backups, monitoramento e organização ajudam a encontrar problemas cedo e manter o banco estável.',
        detalhes: ['BACKUPS', 'MONITORAMENTO', 'ORGANIZAÇÃO'],
        progresso: '80%'
    },
    sql: {
        numero: '05 / 05',
        titulo: 'T-SQL na prática',
        texto: 'Com T-SQL, você cria bancos e tabelas, adiciona informações e consulta os dados usando comandos claros.',
        detalhes: ['CREATE', 'INSERT', 'SELECT'],
        progresso: '100%'
    }
};

const tituloTopico = document.querySelector('#topico-titulo');
const textoTopico = document.querySelector('#topico-texto');
const numeroTopico = document.querySelector('.numero-topico');
const detalhesTopico = document.querySelector('#topico-detalhes');
const progressoTopico = document.querySelector('.progresso span');

document.querySelectorAll('.topico').forEach((botao) => {
    botao.addEventListener('click', () => {
        const informacao = informacoes[botao.dataset.topico];
        document.querySelector('.topico.ativo').classList.remove('ativo');
        botao.classList.add('ativo');
        numeroTopico.textContent = informacao.numero;
        tituloTopico.textContent = informacao.titulo;
        textoTopico.textContent = informacao.texto;
        detalhesTopico.innerHTML = informacao.detalhes.map((detalhe) => `<span>${detalhe}</span>`).join('');
        progressoTopico.style.width = informacao.progresso;
    });
});

const janelaTopico = document.querySelector('#janela-topico');
const janelaTitulo = document.querySelector('#janela-titulo');
const janelaTexto = document.querySelector('#janela-texto');
const janelaIcone = document.querySelector('#janela-icone');
const janelaDetalhes = document.querySelector('#janela-detalhes');
const iconesTopicos = { seguranca: '◈', desempenho: 'ϟ', escala: '↗', manutencao: '⚙', sql: '</>' };
const palco = document.querySelector('.modelo-palco');
const fecharJanela = document.querySelector('.fechar-janela');

function fecharDetalhes() {
    janelaTopico.hidden = true;
}

fecharJanela.addEventListener('click', fecharDetalhes);

document.addEventListener('click', (event) => {
    if (!janelaTopico.hidden && !janelaTopico.contains(event.target) && !event.target.closest('.no-mapa')) {
        fecharDetalhes();
    }
});

document.querySelectorAll('.no-mapa').forEach((no) => {
    no.addEventListener('click', () => {
        const informacao = informacoes[no.dataset.mapa];
        document.querySelector(`.topico[data-topico="${no.dataset.mapa}"]`).click();
        janelaIcone.textContent = iconesTopicos[no.dataset.mapa];
        janelaTitulo.textContent = informacao.titulo;
        janelaTexto.textContent = informacao.texto;
        janelaDetalhes.innerHTML = informacao.detalhes.map((detalhe) => `<span>${detalhe}</span>`).join('');
        janelaTopico.hidden = false;
        requestAnimationFrame(() => {
            const noRect = no.getBoundingClientRect();
            const palcoRect = palco.getBoundingClientRect();
            const abaixo = noRect.top < palcoRect.top + palcoRect.height / 2;
            const metadeJanela = janelaTopico.offsetWidth / 2;
            const centroNo = noRect.left - palcoRect.left + noRect.width / 2;
            const posicaoX = Math.max(metadeJanela + 8, Math.min(palcoRect.width - metadeJanela - 8, centroNo));
            const posicaoY = abaixo ? noRect.bottom - palcoRect.top + 13 : noRect.top - palcoRect.top - janelaTopico.offsetHeight - 13;
            janelaTopico.style.left = `${posicaoX}px`;
            janelaTopico.style.top = `${Math.max(8, posicaoY)}px`;
        });
    });
});

document.querySelector('[data-auto-giro]').addEventListener('click', () => {
    rotacao += 90;
    atualizarServidor();
});