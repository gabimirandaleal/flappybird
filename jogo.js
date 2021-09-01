console.log('[DevSoutinho] Flappy Bird');


const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');




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


const bird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,
    atualiza() {
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



function loop() {
    bird.atualiza();
    planoDeFundo.desenha();
    chao.desenha();
    bird.desenha();

    requestAnimationFrame(loop);
}

loop();