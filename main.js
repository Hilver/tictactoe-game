var gameData = new Vue({
        data: {
        numPlayer: 0,       // liczba graczy
        player: 0,          // wybór gracza - kółko lub krzyżyk   
        AI: 0,              // wybór komputera - poziom trudności (0 - easy, 1 - master)       
    }   
});

Vue.component('board',{
    template: '<table cellspacing="0" cellpadding="0" border="0" id="table-game" class="table-game" ><tbody><tr><td id="1" ref="cell" class="cell border-left-none border-top-none"></td><td id="2" ref="cell" class="cell border-top-none"></td><td id="3" ref="cell" class="cell border-right-none border-top-none"></td></tr><tr><td id="4" ref="cell" class="cell border-left-none"></td><td id="5" ref="cell" class="cell"></td><td id="6" ref="cell" class="cell border-right-none"></td></tr><tr><td id="7" ref="cell" class="cell border-bottom-none border-left-none"></td><td id="8" ref="cell" class="cell border-bottom-none"></td><td id="9" ref="cell" class="cell border-bottom-none border-right-none"></td></tr></tbody></table>'
});

Vue.component('game-AI-O-master',{
    template: '<div style=" width: 100%; height: 100%;"><div id="score-pop-up"><h2>{{ scoreMessage }}</h2><button id="reset-score" v-on:click="resetScore">Play again</button></div><board v-on:click.native="move($event)"></board></div>',
    data: function(){
        return {
            winDataP: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],  // możliwe kombinacje wygranej dla gracza
            winDataC: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],  // możliwe kombinacje wygranej dla komputera
            comMoves: [],                                                                 // tablica ruchów wykonanych przez komputer
            winFilter: [],                                                                // tablica zwracająca możliwe ruchy na wygraną dla gracza w czasie rzeczywistym
            playData: [],                                                                 // tablica ruchów wykonanych przez gracza
            scoreMessage: ''            
        }
    },    
   

    methods:{

     resetScore: function(){
     this.winDataP = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];   
     this.winDataC = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
     this.comMoves = [];
     this.winFilter = [];
     this.playData = [];
     document.getElementById('score-pop-up').classList.remove('show');
     for(i=1; i < 10; i++){
     document.getElementById(i).innerHTML = '';
     document.getElementById(i).classList.remove('disabled');
     }    
    },    

    move: function(event){
       var clickedCell = document.getElementById(event.target.id);
       var num = parseInt(event.target.id);
       var dataP = this.playData;                

       if(!clickedCell.classList.contains('disabled')){
         clickedCell.innerHTML = "X";
         clickedCell.classList.add('disabled');
         this.playData.push(num);
         this.winDataC = this.winDataC.filter(function(el){                              // filtr tablicy możliwych wygranych komputera poprzez usunięcie wszystkich kombinacji zawierających bieżący ruch gracza
            if(el.indexOf(num) === -1){
                return el;
            };        
         });                 

         if(num !== 5 && this.playData.length === 1){                                   // jeśli gracz w pierwszym ruchu nie ruszy się w środek, komputer jako pierwszy wykona tam ruch (to nie jest warunek konieczny do wygranej/remisu, można usunąć)                                    
            document.getElementById('5').innerHTML = "O";
            document.getElementById('5').classList.add('disabled');
            this.comMoves.push(5);
            this.winDataP = this.winDataP.filter(function(el){                     
                return el.indexOf(5) === -1;            
            });
            this.winFilter = this.winDataP.map(function(el){ 
                if(el.indexOf(num) > -1){
                    el.splice(el.indexOf(num),1);
                }                
                return el;                
            });
            this.winDataC = this.winDataC.map(function(el){ 
                if(el.indexOf(5) > -1){
                    el.splice(el.indexOf(5),1);
                }                
                return el;                
            });
            console.log(this.winDataC);            
         }else if(this.playData.length === 1){                                        // jeśli pierwszym ruchem gracza jest zagranie w środek, komputer musi wykonać ruch w jeden z rogów (warunek konieczny do wygranej/remisu)
            var randomMove = [1,3,7,9];
            var pickRandom = randomMove[Math.floor(Math.random()*randomMove.length)];
            document.getElementById(pickRandom).innerHTML = "O";
            document.getElementById(pickRandom).classList.add('disabled');
            this.comMoves.push(pickRandom);
            this.winDataP = this.winDataP.filter(function(el){                   
                return el.indexOf(pickRandom) === -1;             
            });
            this.winFilter = this.winDataP.map(function(el){   
                if(el.indexOf(num) > -1){
                    el.splice(el.indexOf(num),1);
                }                
                return el;                
            });
            this.winDataC = this.winDataC.map(function(el){ 
                if(el.indexOf(pickRandom) > -1){
                    el.splice(el.indexOf(pickRandom),1);
                }                
                return el;                
            });           
         }else{                                                                      // algorytm gry dla pozostałych ruchów
            
            this.winFilter = this.winDataP.map(function(el){   
                if(el.indexOf(num) > -1){
                    el.splice(el.indexOf(num),1);
                }
                return el;                
            });               
            
            var moveC = this.winFilter.filter(function(el){                         // filtr ruchów AI, jeśli zwracana tablica ma jeden element to jest to ruch na zwycięstwo dla gracza
                return el.length === 1;                
            });
            
            var tryWinMoveC = this.winDataC.filter(function(el){                    // filtr ruchów AI, jeśli zwracana tablica ma jeden element to jest to ruch na zwycięstwo dla AI   
                return el.length === 1;
            });
            
            if(tryWinMoveC.length >= 1){                                                        
                                
                randomMoveC = tryWinMoveC[Math.floor(Math.random()*tryWinMoveC.length)];
                document.getElementById(randomMoveC).innerHTML = "O";
                document.getElementById(randomMoveC).classList.add('disabled');
                this.comMoves.push(randomMoveC);
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(randomMoveC) === -1;             
                });
                this.winDataC = this.winDataC.map(function(el){ 
                    if(el.indexOf(randomMoveC) > -1){
                        el.splice(el.indexOf(randomMoveC),1);
                    }                
                    return el;                
                });

                if(randomMoveC === tryWinMoveC[0] || randomMoveC === tryWinMoveC[1]){
                    this.scoreMessage = 'Computer win!';
                    document.getElementById('score-pop-up').classList.add('show');
                    game.compScore++;
                }
            }else if(moveC.length === 1){                                 // algorytm dla gry w której ruch AI filtrowany jest po możliwościach wygranej gracza               
            document.getElementById(moveC[0]).innerHTML = "O";
            document.getElementById(moveC[0]).classList.add('disabled');
            this.comMoves.push(moveC);
            this.winDataP = this.winDataP.filter(function(el){                   
                return el.indexOf(parseInt(moveC[0])) === -1;             
            });
            this.winDataC = this.winDataC.map(function(el){ 
                if(el.indexOf(parseInt(moveC[0])) > -1){
                    el.splice(el.indexOf(parseInt(moveC[0])),1);
                }                
                return el;                
            });
            }else{

                if(this.playData.length === 5){
                    this.scoreMessage = 'Draw!';
                    document.getElementById('score-pop-up').classList.add('show');
                }                                                                
                
                if(this.playData[this.playData.length -1] && this.playData[this.playData.length -2] % 2){        // poprawka do buga związanego z zagraniem X po przekątnych

                    moveC = this.winFilter.map(function(el){                              // filtr tablicy po pozostałych możliwościach wygranej dla gracza w dwóch następnych ruchach
                        if(el.length === 2){
                            return el;
                        }else{
                            return [];
                        }
                    }).reduce(function(a,b){
                        return a.concat(b);
                    }).filter(function(el){
                        return el % 2 === 0;
                    })


                }else{

                moveC = this.winFilter.map(function(el){                              // filtr tablicy po pozostałych możliwościach wygranej dla gracza w dwóch następnych ruchach
                    if(el.length === 2){
                        return el;
                    }else{
                        return [];
                    }
                }).reduce(function(a,b){
                    return a.concat(b);
                })
            }

                console.log(moveC);
                
                randomMoveC = moveC[Math.floor(Math.random()*moveC.length)];        // wybór ruchu komputera z pozostałych możliwych wygranych gracza
                document.getElementById(randomMoveC).innerHTML = "O";
                document.getElementById(randomMoveC).classList.add('disabled');
                this.comMoves.push(randomMoveC);
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(randomMoveC) === -1;             
                });
                this.winDataC = this.winDataC.map(function(el){ 
                    if(el.indexOf(randomMoveC) > -1){
                        el.splice(el.indexOf(randomMoveC),1);
                    }                
                    return el;                
                });
            }                     
          }   
       }
     }    
    }
})

Vue.component('game-AI-X-master',{
    template: '<div style=" width: 100%; height: 100%;"><div id="score-pop-up"><h2>{{ scoreMessage }}</h2><button id="reset-score" v-on:click="resetScore">Play again</button></div><board v-on:click.native="move($event)"></board></div>',
    data: function(){
        return {
            winDataP: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            winDataC: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]], 
            comMoves: [],
            winFilter: [],
            playData: [],
            scoreMessage: ''            
        }
    },    
    mounted: function(){       

        var randomMove = [1,3,5,7,9];
        var pickRandom = randomMove[Math.floor(Math.random()*randomMove.length)];
        document.getElementById(pickRandom).innerHTML = "X";
        document.getElementById(pickRandom).classList.add('disabled');
        this.comMoves.push(pickRandom);
        this.winDataP = this.winDataP.filter(function(el){                   
            return el.indexOf(pickRandom) === -1;             
        });
        this.winDataC = this.winDataC.map(function(el){  // 
            if(el.indexOf(pickRandom) > -1){
                el.splice(el.indexOf(pickRandom),1);
            }
            return el;            
        });       
    },

    methods:{

    resetScore: function(){
    this.winDataP = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
    this.winDataC = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
    this.comMoves = [];
    this.winFilter = [];
    this.playData = [];
    document.getElementById('score-pop-up').classList.remove('show');
    for(i=1; i < 10; i++){
    document.getElementById(i).innerHTML = '';
    document.getElementById(i).classList.remove('disabled');
    }

        var randomMove = [1,3,5,7,9];
        var pickRandom = randomMove[Math.floor(Math.random()*randomMove.length)];
        document.getElementById(pickRandom).innerHTML = "X";
        document.getElementById(pickRandom).classList.add('disabled');
        this.comMoves.push(pickRandom);
        this.winDataP = this.winDataP.filter(function(el){                   
            return el.indexOf(pickRandom) === -1;             
        });
        this.winDataC = this.winDataC.map(function(el){  // 
            if(el.indexOf(pickRandom) > -1){
                el.splice(el.indexOf(pickRandom),1);
            }
            return el;            
        });    
    },    

    move: function(event){
       var clickedCell = document.getElementById(event.target.id);
       var num = parseInt(event.target.id);
       var dataP = this.playData;
                        

       if(!clickedCell.classList.contains('disabled')){
        clickedCell.innerHTML = "O";
        clickedCell.classList.add('disabled');
        this.playData.push(num);
        this.winDataC = this.winDataC.filter(function(el){                    
            if(el.indexOf(num) === -1){
                return el;
            };        
         });                
            
            this.winFilter = this.winDataP.map(function(el){  // 
                if(el.indexOf(num) > -1){
                    el.splice(el.indexOf(num),1);
                }
                return el;                
            });                
            
            var moveC = this.winFilter.filter(function(el){            // filtr ruchów AI, jeśli zwracana tablica ma jeden element to jest to ruch na zwycięstwo dla gracza
                return el.length === 1;                
            });

            var tryWinMoveC = this.winDataC.filter(function(el){     // filtr ruchów AI, jeśli zwracana tablica ma jeden element to jest to ruch na zwycięstwo dla AI
                return el.length === 1;
            });
            
            if(tryWinMoveC.length >= 1){

                randomMoveC = tryWinMoveC[Math.floor(Math.random()*tryWinMoveC.length)];
                document.getElementById(randomMoveC).innerHTML = "X";
                document.getElementById(randomMoveC).classList.add('disabled');
                this.comMoves.push(randomMoveC);
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(randomMoveC) === -1;             
                });
                this.winDataC = this.winDataC.map(function(el){ 
                    if(el.indexOf(randomMoveC) > -1){
                        el.splice(el.indexOf(randomMoveC),1);
                    }                
                    return el;                
                });               

                if(randomMoveC === tryWinMoveC[0] || randomMoveC === tryWinMoveC[1]){
                    this.scoreMessage = 'Computer win!';
                    document.getElementById('score-pop-up').classList.add('show');
                    game.compScore++;               
                }            

            }else if(moveC.length === 1){                                 
                
            document.getElementById(moveC[0]).innerHTML = "X";
            document.getElementById(moveC[0]).classList.add('disabled');
            this.comMoves.push(parseInt(moveC[0]));
            this.winDataP = this.winDataP.filter(function(el){                   
                return el.indexOf(parseInt(moveC[0])) === -1;             
            });
            this.winDataC = this.winDataC.map(function(el){ 
                if(el.indexOf(parseInt(moveC[0])) > -1){
                    el.splice(el.indexOf(parseInt(moveC[0])),1);
                }                
                return el;                
            });           
            }else if(this.winFilter.length !== 0){                                                                 
                       
                moveC = this.winFilter.map(function(el){
                    if(el.length === 2){
                        return el;
                    }else{
                        return [];
                    }
                }).reduce(function(a,b){
                    return a.concat(b);
                })

                randomMoveC = moveC[Math.floor(Math.random()*moveC.length)];
                document.getElementById(randomMoveC).innerHTML = "X";
                document.getElementById(randomMoveC).classList.add('disabled');
                this.comMoves.push(randomMoveC);
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(randomMoveC) === -1;             
                });
                this.winDataC = this.winDataC.map(function(el){ 
                    if(el.indexOf(randomMoveC) > -1){
                        el.splice(el.indexOf(randomMoveC),1);
                    }                
                    return el;                
                });           
            }else{

             var allMoves = this.comMoves.concat(this.playData);
             var lastMove = [1,2,3,4,5,6,7,8,9].filter(function(el){
                 return allMoves.indexOf(el) === -1;
             });

             document.getElementById(lastMove[0]).innerHTML = "X";
             document.getElementById(lastMove[0]).classList.add('disabled');
             this.comMoves.push(lastMove[0]);

                if(this.comMoves.length === 5){
                    this.scoreMessage = 'Draw!';
                    document.getElementById('score-pop-up').classList.add('show');                    
                }  
            }
        }  
    }        
    }
})

Vue.component('game-AI-X-easy',{
    template: '<div style=" width: 100%; height: 100%;"><div id="score-pop-up"><h2>{{ scoreMessage }}</h2><button id="reset-score" v-on:click="resetScore">Play again</button></div><board v-on:click.native="move($event)"></board></div>',
    data: function(){
        return {
            winDataP: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            winDataC: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            possibleMoves: [1,2,3,4,5,6,7,8,9],
            comMoves: [],            
            playData: [],
            scoreMessage: ''            
        }
    },

    mounted: function(){       

        var randomMove = [1,2,3,4,5,6,7,8,9];
        var pickRandom = randomMove[Math.floor(Math.random()*randomMove.length)];
        document.getElementById(pickRandom).innerHTML = "X";
        document.getElementById(pickRandom).classList.add('disabled');
        this.comMoves.push(pickRandom);
        this.winDataP = this.winDataP.filter(function(el){                   
            return el.indexOf(pickRandom) === -1;             
        });
        this.winDataC = this.winDataC.map(function(el){  // 
            if(el.indexOf(pickRandom) > -1){
                el.splice(el.indexOf(pickRandom),1);
            }
            return el;            
        });
        this.possibleMoves = this.possibleMoves.filter(function(el){  // 
                return el !== pickRandom;            
        });      
    },

    methods:{

        resetScore: function(){
            this.winDataP = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
            this.winDataC = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
            this.possibleMoves = [1,2,3,4,5,6,7,8,9];
            this.comMoves = [];            
            this.playData = [];
            document.getElementById('score-pop-up').classList.remove('show');
            for(i=1; i < 10; i++){
            document.getElementById(i).innerHTML = '';
            document.getElementById(i).classList.remove('disabled');
            }        
                var pickRandom = this.possibleMoves[Math.floor(Math.random()*this.possibleMoves.length)];
                document.getElementById(pickRandom).innerHTML = "X";
                document.getElementById(pickRandom).classList.add('disabled');
                this.comMoves.push(pickRandom);
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(pickRandom) === -1;             
                });
                this.winDataC = this.winDataC.map(function(el){  // 
                    if(el.indexOf(pickRandom) > -1){
                        el.splice(el.indexOf(pickRandom),1);
                    }        
                    return el;                    
                });              

                this.possibleMoves = this.possibleMoves.filter(function(el){  // 
                    return el !== pickRandom;                
            });            
            },    

        move: function(event){
             
            var clickedCell = document.getElementById(event.target.id);
            var num = parseInt(event.target.id);                        

             if(!clickedCell.classList.contains('disabled')){
              clickedCell.innerHTML = "O";
              clickedCell.classList.add('disabled');
              this.playData.push(num);        

                 this.possibleMoves = this.possibleMoves.filter(function(el){  // 
                 return el !== num;            
                 });                  
            
                var checkWinP = this.winDataP.map(function(el){  // 
                    if(el.indexOf(num) > -1){
                     el.splice(el.indexOf(num),1);
                    }
                    return el;
                
                }).filter(function(el){
                    return el.length === 0;  
                });

            if(checkWinP.length > 0){
                this.scoreMessage = 'Player win!';
                document.getElementById('score-pop-up').classList.add('show');
                game.playerScore++;
            }else{                   
                var pickRandom = this.possibleMoves[Math.floor(Math.random()*this.possibleMoves.length)];
                document.getElementById(pickRandom).innerHTML = "X";
                document.getElementById(pickRandom).classList.add('disabled');
                this.comMoves.push(pickRandom);            
                this.winDataP = this.winDataP.filter(function(el){                   
                    return el.indexOf(pickRandom) === -1;             
                });
                this.possibleMoves = this.possibleMoves.filter(function(el){  // 
                    return el !== pickRandom;            
                });        

                var checkWinC = this.winDataC.map(function(el){
                     if(el.indexOf(pickRandom) > -1){
                         el.splice(el.indexOf(pickRandom),1);
                    }
                     return el;
                }).filter(function(el){
                    return el.length === 0;  
                });

                if(checkWinC.length > 0){
                     this.scoreMessage = 'Computer win!';
                     document.getElementById('score-pop-up').classList.add('show');
                     game.compScore++;
                }else if(this.comMoves.length === 5){
                     this.scoreMessage = 'Draw!';
                     document.getElementById('score-pop-up').classList.add('show');
                }
            }
        }    
    }        
    }
})

Vue.component('game-AI-O-easy',{
    template: '<div style=" width: 100%; height: 100%;"><div id="score-pop-up"><h2>{{ scoreMessage }}</h2><button id="reset-score" v-on:click="resetScore">Play again</button></div><board v-on:click.native="move($event)"></board></div>',
    data: function(){
        return {
            winDataP: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            winDataC: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            possibleMoves: [1,2,3,4,5,6,7,8,9],
            comMoves: [],            
            playData: [],
            scoreMessage: ''            
        }
    },

    methods:{

        resetScore: function(){
            this.winDataP = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
            this.winDataC = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
            this.possibleMoves = [1,2,3,4,5,6,7,8,9];
            this.comMoves = [];            
            this.playData = [];
            document.getElementById('score-pop-up').classList.remove('show');
            for(i=1; i < 10; i++){
            document.getElementById(i).innerHTML = '';
            document.getElementById(i).classList.remove('disabled');
            }     
            },    

        move: function(event){
         var clickedCell = document.getElementById(event.target.id);
         var num = parseInt(event.target.id);                        

            if(!clickedCell.classList.contains('disabled')){
                 clickedCell.innerHTML = "X";
                 clickedCell.classList.add('disabled');
                 this.playData.push(num);
                 this.possibleMoves = this.possibleMoves.filter(function(el){   
                    return el !== num;            
                });           
                var checkWinP = this.winDataP.map(function(el){ 
                    if(el.indexOf(num) > -1){
                      el.splice(el.indexOf(num),1);
                    }
                    return el;                
                }).filter(function(el){
                    return el.length === 0;  
                });

                if(checkWinP.length > 0){
                     this.scoreMessage = 'Player win!';
                     document.getElementById('score-pop-up').classList.add('show');
                     game.playerScore++;
                }else if(this.playData.length === 5){
                     this.scoreMessage = 'Draw!';
                     document.getElementById('score-pop-up').classList.add('show')
                }else{                   
                     var pickRandom = this.possibleMoves[Math.floor(Math.random()*this.possibleMoves.length)];
                     document.getElementById(pickRandom).innerHTML = "O";
                     document.getElementById(pickRandom).classList.add('disabled');
                     this.comMoves.push(pickRandom);           
                     this.winDataP = this.winDataP.filter(function(el){                   
                         return el.indexOf(pickRandom) === -1;             
                    });
                     this.possibleMoves = this.possibleMoves.filter(function(el){  // 
                         return el !== pickRandom;            
                    });       

                var checkWinC = this.winDataC.map(function(el){
                     if(el.indexOf(pickRandom) > -1){
                         el.splice(el.indexOf(pickRandom),1);
                     }
                      return el;
                }).filter(function(el){
                     return el.length === 0;  
                });

                if(checkWinC.length > 0){
                     this.scoreMessage = 'Computer win!';
                     document.getElementById('score-pop-up').classList.add('show');
                     game.compScore++;
                }
            }
        }    
    }        
    }    
})

Vue.component('game-two-players',{
    template: '<div style=" width: 100%; height: 100%;"><div id="score-pop-up"><h2>{{ scoreMessage }}</h2><button id="reset-score" class="hvr-shutter-in-vertical" v-on:click="resetScore">Play again</button></div><board v-on:click.native="move($event)"></board></div>',
    data: function(){
        return {
            winDataX: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],
            winDataO: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],             
            winFilterX: [],
            winFilterO: [],
            xMoves: [],
            playerXTurn: true,
            scoreMessage: ''            
        }
    },
    methods:{

    resetScore: function(){
    this.winDataX = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
    this.winDataO = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];    
    this.winFilterX = [];
    this.winFilterO = [];
    this.xMoves = [];
    this.playerXTurn = true;    
    document.getElementById('score-pop-up').classList.remove('show');
    for(i=1; i < 10; i++){
    document.getElementById(i).innerHTML = '';
    document.getElementById(i).classList.remove('disabled');
    }   
    },    

    move: function(event){
       var clickedCell = document.getElementById(event.target.id);
       var num = parseInt(event.target.id);                       

       if(!clickedCell.classList.contains('disabled') && this.playerXTurn){
            clickedCell.innerHTML = "X";
            clickedCell.classList.add('disabled');
            this.playerXTurn = !this.playerXTurn;            
            this.xMoves.push(num);           
            this.winFilterX = this.winDataX.map(function(el){  // 
                if(el.indexOf(num) > -1){
                    el.splice(el.indexOf(num),1);
                }
                return el;                
            }); 

            var checkWinX = this.winFilterX.filter(function(el){
                return el.length === 0;
            })

            if(checkWinX.length >= 1){
                this.scoreMessage = 'Player X win!';
                document.getElementById('score-pop-up').classList.add('show');
                game.playerScore++;
            }else if(checkWinX.length === 0 && this.xMoves.length === 5){
                this.scoreMessage = 'Draw!';
                document.getElementById('score-pop-up').classList.add('show');
            }  
        
        }else if(!clickedCell.classList.contains('disabled')){
        clickedCell.innerHTML = "O";
        clickedCell.classList.add('disabled');
        this.playerXTurn = !this.playerXTurn;

        this.winFilterO = this.winDataO.map(function(el){  // 
            if(el.indexOf(num) > -1){
                el.splice(el.indexOf(num),1);
            }
            return el;            
        }); 

        var checkWinO = this.winFilterO.filter(function(el){
            return el.length === 0;
        })

        if(checkWinO.length >= 1){
            this.scoreMessage = 'Player O win!';
            document.getElementById('score-pop-up').classList.add('show');
            game.compScore++;
        }
    }
}
}
})

Vue.component('choose-menu-AI',{
    template: '<div class="center"><h1>Choose your destiny!</h1><ul><li><input type="radio" id="choose-x" name="destiny" v-on:click="choose" /><label for="choose-x"><span id="x-span">X</span></label></li><li><input type="radio" id="choose-o" name="destiny" v-on:click="choose" /><label for="choose-o"><span id="o-span">O</span></label></li></ul><ul class="lvl-list"><li><span class="lvl-choose">Master level: {{ masterONOF }} </span></li><li><center><label class="switch"><input type="checkbox" id="AI-lvl" v-on:click="chooseLVL"><span class="slider round"></span></label></center></li></ul></div>',
    data: function(){
        return {
            masterONOF: 'OFF'
        }
    },
    methods: {
        choose: function(){
            var x = document.getElementById('choose-x');                      
            if(x.checked){
                document.getElementById('x-span').classList.add('big');
                document.getElementById('o-span').classList.remove('big');
                gameData.player = 'X';
            }else{
                document.getElementById('o-span').classList.add('big');
                document.getElementById('x-span').classList.remove('big');
                gameData.player = 'O';
            }            
        },

        chooseLVL: function(){
            var AiLvl = document.getElementById('AI-lvl');
            if(AiLvl.checked){
                this.masterONOF = "ON";
                gameData.AI = 1;
            }else{
                this.masterONOF = "OFF";
                gameData.AI = 0;
            }
        }
    }
})

Vue.component('choose-menu-PL',{
    template: '<div class="center"><h1>How many players?</h1><ul class="pick-num-pl"><li><input type="radio" id="one-player" name="players-num" v-on:click="pickPLorAI"><label for="one-player"><span id="one-pl">One Player</span></label></li><li><input type="radio" id="two-player" name="players-num" v-on:click="pickPLorAI"><label for="two-player"><span id="two-pl">Two Player</span></label></li></ul></div>',
    methods: {
        pickPLorAI: function(){
            if(document.getElementById('one-player').checked){
                gameData.numPlayer = 1;
                gameData.buttonText = "Next";
                document.getElementById('one-pl').classList.add('mid');
                document.getElementById('two-pl').classList.remove('mid');
                console.log(gameData.buttonText);
            }else if(document.getElementById('two-player').checked){
                gameData.numPlayer = 2;
                gameData.buttonText = "Start";
                document.getElementById('two-pl').classList.add('mid');
                document.getElementById('one-pl').classList.remove('mid');
                console.log(gameData.buttonText);                
            }else{
                gameData.numPlayer = 0;                
            }
        }
    }
})

Vue.component('board-table', {
    template: '<div id="board" class="board center"><choose-menu-PL v-if="menuPL"></choose-menu-PL><choose-menu-AI v-else-if="menuAI"></choose-menu-AI><game-two-players v-else-if="twoPlayers"></game-two-players><game-AI-O-master v-else-if="AIOMaster"></game-AI-O-master><game-AI-X-master v-else-if="AIXMaster"></game-AI-X-master><game-AI-X-easy v-else-if="AIXEasy"></game-AI-X-easy><game-AI-O-easy v-else-if="AIOEasy"></game-AI-O-easy><button class="hvr-shutter-in-vertical" v-on:click="pickPL" v-bind:class="{ displayNone: !menuPL }">Go!</button><button class="hvr-shutter-in-vertical" v-on:click="pickAI" v-bind:class="{ displayNone: !menuAI }">Start</button></div>',
    data: function(){
        return {
            menuPL: true,
            menuAI: false,
            twoPlayers: false,
            AIOMaster: false,
            AIXMaster: false,
            AIOEasy: false,
            AIXEasy: false            
        }
    },
    methods:{
     pickPL: function(){
         if(gameData.numPlayer === 1){
            this.menuPL = !this.menuPL;
            this.menuAI = !this.menuAI;
         }else if(gameData.numPlayer === 2){
            this.menuPL = !this.menuPL;
            this.twoPlayers = !this.twoPlayers;
            game.resetButton = true;
            game.showScore = true;
            game.playerOne = 'Player X';
            game.playerTwo = 'Player O';
         }         
     },   
     pickAI: function(){
         this.menuAI = !this.menuAI;
         if(gameData.player === 'X' && gameData.AI === 1){
             this.AIOMaster = !this.AIOMaster;
         }else if(gameData.player === 'O' && gameData.AI === 1){
            this.AIXMaster = !this.AIXMaster;
         }else if(gameData.player === 'X' && gameData.AI === 0){
             this.AIOEasy = !this.AIOEasy;
         }else if(gameData.player === 'O' && gameData.AI ===0){
             this.AIXEasy = !this.AIXEasy;
         }
         game.playerOne = 'Player';
         game.playerTwo = 'Computer';
         game.resetButton = true;
         game.showScore = true;
        }
    }
  })


  var game = new Vue({
    el: '#game',
    data: {
        playerScore: 0,
        compScore: 0,
        showScore: false,
        resetButton: false,
        playerOne: '',
        playerTwo: ''   
    },
    methods:{

        resetGame: function(){
           game.$refs.boardTable.menuPL = true;
           game.$refs.boardTable.menuAI = false;
           game.$refs.boardTable.twoPlayers = false;
           game.$refs.boardTable.AIOMaster = false;
           game.$refs.boardTable.AIXMaster = false;
           game.$refs.boardTable.AIOEasy = false;
           game.$refs.boardTable.AIXEasy = false;
           this.playerScore = 0;
           this.compScore = 0;
           this.resetButton = false;
           this.showScore = false;
        }     
    },   
});

