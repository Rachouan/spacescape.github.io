class HightScore{
    constructor(element){
        this.element = document.querySelector(element);
        this.closebtn = this.element.querySelector('#closeHighscore');
        this.closebtn.addEventListener('click',(e)=>this.showHighscore(false));
        this.content;
        this.show = false;
        this.data = [];
    }
    getHighscores(){
        console.log(this.element)
        this.content = this.element.querySelector("#content");
        let highscorecontent;
        db.collection("highscores").orderBy("score", "desc").limit(10).get().then((querySnapshot) => {
            console.log()
            if(querySnapshot.size){
                highscorecontent = `<ul class="list-group list-group-flush">`;
                let data;
                querySnapshot.docs.forEach((doc,index) => {
                    console.log(index);
                    data = doc.data();
                    highscorecontent += `<li class="list-group-item d-flex justify-content-between align-items-center lead"><strong>${index+1}.${data.gamertag}</strong> <span class="text-muted">${data.score}m</span></li>`
                });
                highscorecontent += `</ul>`;
                this.content.innerHTML = highscorecontent;
            }else{
                this.content.innerHTML = '<p class="text-muted py-4">No Leader Right Now</p>';
            }
        });
    }
    addHighscore(gamertag,score){

        db.collection("highscores").doc().set({
            gamertag: gamertag,
            score: score
        })
        .then(() => {
            console.log("Document successfully written!");
            this.getHighscores();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    }
    showHighscore(bool){
        this.show = bool;
        this.element.classList.toggle("d-none",!this.show);
        this.getHighscores();
    }
}