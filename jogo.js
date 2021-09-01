console.log('[DevSoutinho] Flappy Bird');


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

let frames = 0

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

function criarCanos() {

    const canos = {
        altura: 400,
        largura: 52,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },

        ceu: {
            spriteX: 52,
            spriteY: 169,
        },

        espaco: 80,

        desenha() {


            canos.paresDeCanos.forEach(function(paresDeCanos) {

                const yRandom = paresDeCanos.y
                const espacamentoEntreCanos = 100

                const canoCeuX = paresDeCanos.x;
                const canoCeuY = yRandom;

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                );

                const canoChaoX = paresDeCanos.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                );

                paresDeCanos.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }

                paresDeCanos.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },

        temColisaoComOBird(paresDeCanos) {
            const cabecaBird = globais.bird.y
            const peDoBird = globais.bird.y + globais.bird.altura
            if (globais.bird.x >= paresDeCanos.x) {
                if (cabecaBird <= paresDeCanos.canoCeu.y) {
                    return true
                }

                if (peDoBird >= paresDeCanos.canoChao.y) {
                    return true
                }
                return false
            }


        },

        paresDeCanos: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0
            if (passou100Frames) {
                canos.paresDeCanos.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            canos.paresDeCanos.forEach(function(paresDeCanos) {
                paresDeCanos.x = paresDeCanos.x - 2

                if (canos.temColisaoComOBird(paresDeCanos)) {
                    mudaTela(telas.INICIO)
                }

                if (paresDeCanos.x + canos.largura <= 0) {
                    canos.paresDeCanos.shift();
                }
            });
        },
    }
    return canos
}

function criarChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 214,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza() {
            const movimentoChao = 1;
            const repeteChao = chao.largura / 2
            const movimentacao = chao.x - movimentoChao
            chao.x = movimentacao % repeteChao
        },

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
    return chao
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
            if (fazColisao(bird, globais.chao)) {
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

        movimentos: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0
            if (passouIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + bird.frameAtual;
                const baseRepeticao = bird.movimentos.length;
                bird.frameAtual = incremento % baseRepeticao
            }

        },
        desenha() {
            bird.atualizaFrameAtual();
            const { spriteX, spriteY } = bird.movimentos[bird.frameAtual]
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
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

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    INICIO: {
        inicializa() {
            globais.bird = criarBird()
            globais.chao = criarChao();
            globais.canos = criarCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.bird.desenha();
            globais.chao.desenha();
            telaInicio.desenha();

        },

        click() {
            mudaTela(telas.JOGO)
        },

        atualiza() {
            globais.chao.atualiza();
        }
    }
};

telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.bird.desenha();
    },

    click() {
        globais.bird.pula();
    },

    atualiza() {
        globais.canos.atualiza();
        globais.bird.atualiza();
    }
}


function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames += 1
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaTela(telas.INICIO)
loop();