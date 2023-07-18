const letrasCodigo = ["a", "s", "d", "w", "q", "e"];

const jogo = document.getElementById("jogo");

const botao = document.querySelector(".botao button.btn");
const botaoAudio = document.getElementById('audio');

const select = document.getElementById('select');
const container_select = document.getElementById('container-select');

const itens = document.querySelectorAll(".letras .item");
const codigo = document.querySelectorAll("#codigo .item");

const endGame = document.getElementById("EndGame");
const container = document.querySelector("#EndGame .container h2");

const barraProgresso = document.querySelector('.progress-bar');

var botaoControle = false;

var posicao = 0; var pontuacao = 0;

var clickAudio; var erroAudio; var bombAudio; var sucessoAudio; var fracassoAudio; var explosaoAudio;

// Verifique se o navegador suporta a reprodução de áudio
if('Audio' in window){
    // Crie um novo elemento de áudio
    clickAudio = new Audio();
    erroAudio = new Audio();
    bombAudio = new Audio();
    sucessoAudio = new Audio();
    fracassoAudio = new Audio();
    explosaoAudio = new Audio();

    //Define o URL do Arquivo MP3
    clickAudio.src = "./sound/sound_key_press_sound.mp3";
    erroAudio.src = "./sound/sound_wrong_sound.mp3";
    bombAudio.src = "./sound/BombTimerSoundEffect.mp3";
    sucessoAudio.src = "./sound/Successsoundeffect.mp3";
    explosaoAudio.src = "./sound/explosion.mp3";


    //Ajuste de volume
    clickAudio.volume = clickAudio.volume * 0.7;
    erroAudio.volume = erroAudio.volume * 0.7;
    bombAudio.volume = bombAudio.volume * 0.6;
    explosaoAudio.volume = explosaoAudio.volume * 0.6;
    sucessoAudio.volume = sucessoAudio.volume * 0.5;
}

function mutarAudio() {
    clickAudio.muted = !clickAudio.muted;
    erroAudio.muted = !erroAudio.muted;
    bombAudio.muted = !bombAudio.muted;
    sucessoAudio.muted = !sucessoAudio.muted;
    explosaoAudio.muted = !explosaoAudio.muted;
    if(bombAudio.muted){
        botaoAudio.style.background = "url(./img/semAudio.png), transparent";
    }else{
        botaoAudio.style.background = "url(./img/audio.png), transparent"
    }
    botaoAudio.style.backgroundSize = '90%';
    botaoAudio.style.backgroundPosition = 'center';
    botaoAudio.style.backgroundRepeat = 'no-repeat';
}

select.addEventListener("change", function(){
    mudarVelocidadeAudio(select.value);
})

function mudarVelocidadeAudio(velocidade){
    bombAudio.playbackRate = velocidade;
}

var barraDecrescente;
var timeoutId;

function iniciarBarraProgresso() {
  barraProgresso.style.width = "100%";
  barraProgresso.style.backgroundColor = "#008000";

  bombAudio.addEventListener("timeupdate", function() {
    var progresso = (bombAudio.currentTime / bombAudio.duration) * 100;
    barraDecrescente = 100 - progresso;
    barraProgresso.style.width = barraDecrescente + "%";

    if (barraDecrescente >= 60) {
      barraProgresso.style.backgroundColor = "#008000";
    } else if (barraDecrescente >= 30) {
      barraProgresso.style.backgroundColor = "#F37021";
    } else {
      barraProgresso.style.backgroundColor = "#B22222";
    }

    if (pontuacao >= 8 && barraDecrescente > 0) {
      ganhou();
      cancelarTimeout();
    }
  });

  bombAudio.addEventListener("ended", function() {
    barraProgresso.style.width = "0%";
    iniciarTimeout();
  });
}

function iniciarTimeout() {
  timeoutId = setTimeout(function() {
      perdeu();
  }, 600);
}

function cancelarTimeout() {
  clearTimeout(timeoutId);
}


function cancelarTimeout() {
  clearTimeout(timeoutId);
}


function ganhou(){
    reset();
    resetBomb();
    sucessoAudio.play();
    EndGame("Sequência Correta!","ganhou","perdeu");
}

function perdeu() {
    reset();
    resetBomb();
    explosaoAudio.play();
    EndGame("Sequência Errada!","perdeu","ganhou");
}

function reset(){
    itens.forEach(element => {
        element.classList.remove("desativado");
        element.classList.remove("ativo");
    });
    codigo.forEach(element => {
        element.classList.remove('acertou');
    });
    posicao = 0;
    pontuacao = 0;
}

function resetBomb(){
    bombAudio.pause();
    bombAudio.currentTime = 0;
}
function iniciar(){
    botao.textContent = 'parar';
    botao.classList.remove('iniciar');
    botao.classList.add('parar');
    container_select.style.display = 'none';
    botaoControle = !botaoControle;
    reset()
    resetBomb();
    atribuiCodigo();
    iniciarBarraProgresso();
    window.addEventListener("keyup", verificaLetra);
    bombAudio.play();
}

function parar(){
    botao.textContent = 'iniciar';
    botao.classList.remove('parar');
    botao.classList.add('iniciar');
    container_select.style.display = 'block';
    botaoControle = !botaoControle;
    reiniciar();
    window.removeEventListener("keyup", verificaLetra);
}

function controleJogo() {
    if(botaoControle == false){
        iniciar();
    }else{
        parar();
    }
}

function numeroAleatorio(){
    return Math.floor(Math.random() * 6);
}

function atribuiCodigo() {
    for (let index = 0; index < itens.length; index++) {
        const element = itens[index];
        element.textContent = letrasCodigo[numeroAleatorio()];
        let cod = codigo[index];
        cod.textContent = element.textContent;
        if(index == 0){
            element.classList.add('ativo');
        }
    }
}

function verificaLetra(event){
    let letra = event.key;
    if(posicao <= 7){
        let element = itens[posicao];
        let cod = codigo[posicao];

        if(letra == element.textContent){
            clickAudio.play();
            element.classList.remove("ativo");
            element.classList.add('desativado');
            cod.classList.add('acertou');
            if(posicao < 7){
                element = itens[posicao + 1];
                element.classList.add("ativo");
            }
            pontuacao++;
            posicao++;
        }else{
            erroAudio.play();
            reset();
            atribuiCodigo();
        }
    }else{
        posicao = 0;
    }
}

function EndGame(texto,add,remove){
    jogo.style.display = 'none';
    endGame.style.display = 'flex';
    container.textContent = texto;
    const resultado = document.getElementById("resultado");
    resultado.classList.add(add);
    resultado.classList.remove(remove);
}

function reiniciar(){
    jogo.style.display = 'block';
    endGame.style.display = 'none';
    reset();
    resetBomb();
    itens.forEach(element => {
        element.textContent = '';
    });
    codigo.forEach(element => {
        element.textContent = '';
        element.classList.remove('acertou');
    });
    barraProgresso.style.width = "100%";
    barraProgresso.style.backgroundColor = '#008000';
}
