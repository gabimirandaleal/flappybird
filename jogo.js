console.log('[DevSoutinho] Flappy Bird');


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const telaInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            telaInicio.spriteX, telaInicio.spriteY,
            telaInicio.largura, telaInicio.altura,
            telaInicio.x, telaInicio.y,
            telaInicio.largura, telaInicio.altura,
        );
    },

}


const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 214,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );


        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura
        )
    },
}

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,




    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );


        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x + planoDeFundo.altura, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        )
    },
}

function fazColisao(bird, barreira) {
    const birdY = bird.y + bird.altura
    const barreiraY = barreira.y

    if (birdY >= barreiraY) {
        return true
    }

    return false
}

function criarBird() {
    const bird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            bird.velocidade = -bird.pulo
        },
        velocidade: 0,
        gravidade: 0.25,
        atualiza() {
            if (fazColisao(bird, chao)) {
                console.log("fez colisao")
                som_HIT.play();
                setTimeout(() => {
                    mudaTela(telas.INICIO)
                }, 200);
                
                return
            }
            bird.velocidade = bird.velocidade + bird.gravidade
            bird.y = bird.y + bird.velocidade
        },
        desenha() {
            contexto.drawImage(
                sprites,
                bird.spriteX, bird.spriteY,
                bird.largura, bird.altura,
                bird.x, bird.y,
                bird.largura, bird.altura
            )
        }
    }

    return bird
}


const globais = {};
let telaAtiva = {};

function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    INICIO: {
        inicializa() {
            globais.bird = criarBird()

        },
        desenha() {
            console.log("entrou")
            planoDeFundo.desenha();
            chao.desenha();
            globais.bird.desenha();
            telaInicio.desenha();

        },

        click() {
            mudaTela(telas.JOGO)
        },

        atualiza() {

        }
    }
};

telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        chao.desenha();
        globais.bird.desenha();
    },

    click() {
        globais.bird.pula();
    },

    atualiza() {
        globais.bird.atualiza();
    }
}


function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaTela(telas.INICIO)
loop();