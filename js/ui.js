class UI{
    constructor(){
        this.ui = document.querySelector('#ui');
        this.volume = document.querySelector('#score');
        this.score = document.querySelector('#score');
        this.ammo = document.querySelector('#ammo');
        this.shield = document.querySelector('#shield');
        this.fuel = document.querySelector('#fuel');
    }
    update(score){
        this.updateScore(Math.floor(score));
    }
    toggleUI(){
        this.ui.classList.remove('d-none');
    }
    updateScore(score){
        this.score.innerHTML = `Score: ${score}m`;
    }
}