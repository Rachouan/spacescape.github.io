class UI{
    constructor(){
        this.ui = document.querySelector('#ui');
        this.volume = document.querySelector('#score');
        this.score = document.querySelector('#score');
        this.ammo = document.querySelector('#ammo');
        this.fuel = document.querySelector('#fuel');
    }
    update(score,ammo,fuel){
        this.updateScore(Math.floor(score));
        this.updateFuel(fuel);
        this.updateAmmo(ammo);
    }
    toggleUI(){
        this.ui.classList.toggle('d-none');
    }
    updateScore(score){
        this.score.innerHTML = `Score: ${score}m`;
    }
    updateFuel(percent){
        this.fuel.querySelector('.progress').style.width = percent+'%';
    }
    updateAmmo(percent){
        this.ammo.querySelector('.progress').style.width= percent+'%';
    }
}