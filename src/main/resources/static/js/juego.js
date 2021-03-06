/* global updateGameArea, updateBullets, graficarBalas, graficarBalaOponente, actualizarTrayectoriaBalas, send */

var juego = (function () {

    class Usuario {
        constructor(userName, tipoMaquina, puntaje, equipo, vida) {
            this.userName = userName;
            this.tipoMaquina = tipoMaquina;
            this.puntaje = puntaje;
            this.equipo = equipo;
            this.vida = vida;
        }
        ;
    }
    ;

    class Bandera {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    ;

    class Maquina {
        constructor(x, y, direction, bullets) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.bullets = bullets;
        }
        ;
    }
    ;

    class Bulletcita {
        constructor(x, y, direction, equipo) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.equipo = equipo;
        }
    }


    var myroom;
    var myGamePiece;
    var oponents = [];
    var aliados = [];
    var banderaA;
    var banderaB;
    var myGameArea;
    var myteam;
    var enemyteam;
    var stompClient = null;
    var puntaje = 0;
    var directionImageTank = "/images/tank";
    var directionImageShoot = "/images/bullet";
    var directionBandera = "/images/bandera";
    var directionShoot = 1;
    var updateGameArea;


    var centesimas = 0;
    var segundos = 0;
    var minutos = 0;
    var horas = 0;



    var graficarBala = function (bullet) {
        var temp2 = new Image();
        temp2.src = directionImageShoot + bullet.direction + bullet.equipo + ".png";
        var h, w, sx, sy, deltaX, deltaY;
        if (bullet.direction === 3) {
            h = 30;
            w = 10;
            sx = 5;
            sy = 10;
            dx = 0;
            dy = -15;
        } else if (bullet.direction === 4) {
            h = 30;
            w = 10;
            sx = 5;
            sy = 0;
            dx = 0;
            dy = 15;
        } else if (bullet.direction === 2) {
            h = 10;
            w = 30;
            sx = 0;
            sy = 0;
            dx = 15;
            dy = 0;
        } else {
            h = 10;
            w = 30;
            sx = 10;
            sy = 0;
            dx = -15;
            dy = 0;
        }
        if (myGamePiece.crashWith(bullet, h, w)) {
            myGameArea.context.fillStyle = "#A9A9A9";
            myGameArea.context.fillRect(bullet.x + sx + dx, bullet.y + sy + dy, w, h);
            let image = new Image();
            image.src = "/images/explosion.png";
            myGameArea.context.drawImage(image, myGamePiece.x, myGamePiece.y, 30, 30);
            document.getElementById("live").innerHTML = "Vida: " + myGamePiece.vida;
        } else {
            myGameArea.context.fillStyle = "#A9A9A9";
            myGameArea.context.fillRect(bullet.x + sx + dx, bullet.y + sy + dy, w, h);
            myGameArea.context.drawImage(temp2, bullet.x + sx, bullet.y + sy, w, h);
        }

    };

    var actualizarTrayectoriaBalas = function () {
        var temp = myGamePiece.shoots;
        var borrar = [];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].dir === 3) {
                myGamePiece.shoots[i].y += 15;
            } else if (temp[i].dir === 4) {
                myGamePiece.shoots[i].y -= 15;
            } else if (temp[i].dir === 2) {
                myGamePiece.shoots[i].x -= 15;
            } else {
                myGamePiece.shoots[i].x += 15;
            }
            if (temp[i].x >= myGameArea.canvas.width || temp[i].x <= -30 || temp[i].y >= myGameArea.canvas.height || temp[i].y <= -30) {
                borrar.push(i);
            }
            var temp2 = new Bulletcita(myGamePiece.shoots[i].x, myGamePiece.shoots[i].y, myGamePiece.shoots[i].dir, myteam);
            stompClient.send("/app/sala." + myroom + "/bullets", {}, JSON.stringify(temp2));
        }
        for (let i = 0; i < borrar.length; i++) {
            if (i === 0) {
                myGamePiece.shoots.splice(borrar[i], 1);
            } else {
                myGamePiece.shoots.splice(borrar[i] - 1, 1);
            }
        }
    };


    function Bullet(width, height, color, x, y, type, dir) {
        this.gamearea = myGameArea;
        if (type === "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.dir = dir;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    ;

    //Manejo del tiempo en el canvas

    function inicio() {
        control = setInterval(cronometro, 10);
    }

    function cronometro() {
        if (centesimas < 99) {
            centesimas++;
            if (centesimas < 10) {
                centesimas = "0" + centesimas
            }
        }
        if (centesimas == 99) {
            centesimas = -1;
        }
        if (centesimas == 0) {
            segundos++;
            if (segundos < 10) {
                segundos = "0" + segundos
            }
            document.getElementById("Segundos").innerHTML = "Tiempo " + minutos + ":" + segundos;
        }
        if (segundos == 59) {
            segundos = -1;
        }
        if ((centesimas == 0) && (segundos == 0)) {
            minutos++;
            if (minutos < 10) {
                minutos = "0" + minutos
            }
            Segundos.innerHTML = "Tiempo " + minutos + ":" + segundos;
        }
        if (minutos == 59) {
            minutos = -1;
        }
        if ((centesimas == 0) && (segundos == 0) && (minutos == 0)) {
            horas++;
            if (horas < 10) {
                horas = "0" + horas
            }
        }
    }



    updateGameArea = function () {
        myGameArea.clear();
        myGameArea.context.fillStyle = "#A9A9A9";
        myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
        myGamePiece.newPos();
        myGamePiece.update();
    };

    var updateBullets = function (bullets) {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    function Component(width, height, color, x, y, type, bullets, direction, propietario, equipo, vida) {
        this.gamearea = myGameArea;
        if (type === "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.propietario = propietario;
        this.vida = vida;
        this.equipo = equipo;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.shoots = bullets;

        this.newPos = function () {
            this.x += this.speedX;
            this.y += this.speedY;
        };

        this.update = function () {
            //Dibujarme
            var ctx = myGameArea.context;
            if (this.vida > 0) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            //Dibujar Bandera
            var temp = new Image();
            temp.src = directionBandera + myteam + ".png";
            ctx.drawImage(temp, bandera.x, bandera.y, 10, 10);
            //Dibujar Oponentes
            for (var i = 0; i < oponents.length; i++) {
                if (oponents[i].propietario !== sessionStorage.getItem("user") && oponents[i].vida > 0) {
                    var temp = new Image();
                    temp.src = directionImageTank + oponents[i].direction + enemyteam + ".png";
                    ctx.drawImage(temp, oponents[i].x, oponents[i].y, 30, 30);
                }
            }
            //Dibujar aliados
            for (var i = 0; i < aliados.length; i++) {
                if (aliados[i].propietario !== sessionStorage.getItem("user") && aliados[i].vida > 0) {
                    var temp = new Image();
                    temp.src = directionImageTank + aliados[i].direction + myteam + ".png";
                    ctx.drawImage(temp, aliados[i].x, aliados[i].y, 30, 30);
                }
            }
        };
        this.crashWith = function (otherobj, h, w) {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var otherright = otherobj.x + w;
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + h;
            var crash = true;
            this.vida -= 1;
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright) && otherobj.equipo === myteam) {
                crash = false;
                this.vida += 1;
            }
            return crash;
        }
    }

    var send = function () {
        var bullets = [];
        for (var i = 0; i < myGamePiece.shoots.length; i++) {
            bullets.push(new Bulletcita(myGamePiece.shoots[i].x, myGamePiece.shoots[i].y, myGamePiece.shoots[i].dir, myteam));
        }
        var maquina = new Maquina(myGamePiece.x, myGamePiece.y, myGamePiece.direction, bullets);
        var usuario = new Usuario(sessionStorage.getItem("user"), maquina, puntaje, myteam, myGamePiece.vida);
        stompClient.send("/app/sala." + myroom + "/" + myteam, {}, JSON.stringify(usuario));
        stompClient.send("/app/sala." + myroom + "/" + enemyteam, {}, JSON.stringify(usuario));
    };

    myGameArea = {
        canvas: document.createElement("canvas"),
        start: function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.canvas.width = w - 200;
            this.canvas.height = h - 200;
            this.context = this.canvas.getContext("2d");
            this.context.fillStyle = "#A9A9A9";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.interval = setInterval(actualizarTrayectoriaBalas, 20);
            document.getElementById("Game").appendChild(this.canvas);
            window.addEventListener("keydown", function (e) {

                myGameArea.key = e.keyCode;
                if(myGamePiece.vida>0){
                //THE A KEY
                if (myGameArea.key && myGameArea.key === 65) {
                    myGamePiece.speedX = -10;
                    myGamePiece.image.src = directionImageTank + "2" + myteam + ".png";
                    directionShoot = 2;
                    myGamePiece.direction = 2;
                    //updateGameArea();
                    myGamePiece.newPos();
                    send();
                    myGamePiece.speedX = 0;
                }
                //THE D KEY
                else if (myGameArea.key && myGameArea.key === 68) {
                    myGamePiece.speedX = 10;
                    myGamePiece.image.src = directionImageTank + "1" + myteam + ".png";
                    directionShoot = 1;
                    myGamePiece.direction = 1;
                    //updateGameArea();
                    myGamePiece.newPos();
                    send();
                    myGamePiece.speedX = 0;
                }
                //THE W KEY
                else if (myGameArea.key && myGameArea.key === 87) {
                    myGamePiece.speedY = -10;
                    myGamePiece.image.src = directionImageTank + "4" + myteam + ".png";
                    directionShoot = 4;
                    myGamePiece.direction = 4;
                    //updateGameArea();
                    myGamePiece.newPos();
                    send();
                    myGamePiece.speedY = 0;
                }
                //THE S KEY
                else if (myGameArea.key && myGameArea.key === 83) {
                    myGamePiece.speedY = 10;
                    myGamePiece.image.src = directionImageTank + "3" + myteam + ".png";
                    directionShoot = 3;
                    myGamePiece.direction = 3;
                    //updateGameArea();
                    myGamePiece.newPos();
                    send();
                    myGamePiece.speedY = 0;
                }
                //THE SPACE KEY   
                else if (myGameArea.key && myGameArea.key === 32) {
                    var h, w, sx, sy;
                    if (directionShoot === 3) {
                        h = 30;
                        w = 10;
                        sx = 5;
                        sy = 30;
                    } else if (directionShoot === 4) {
                        h = 30;
                        w = 10;
                        sx = 5;
                        sy = -30;
                    } else if (directionShoot === 2) {
                        h = 10;
                        w = 30;
                        sx = -30;
                        sy = 10;
                    } else {
                        h = 10;
                        w = 30;
                        sx = 30;
                        sy = 10;
                    }
                    var temp = new Bullet(w, h, directionImageShoot + myGamePiece.direction + myteam + ".png", myGamePiece.x + sx, myGamePiece.y + sy, "image", myGamePiece.direction);
                    myGamePiece.shoots.push(temp);
                }}
            });
            window.addEventListener("keyup", function (e) {
                myGameArea.key = false;
            });
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    };



    return{
        movimiento: function () {
            if (sessionStorage.getItem("myTeam") === "A") {
                enemyteam = "B";
                myteam = "A";
            } else {
                enemyteam = "A";
                myteam = "B";
            }
            myroom = sessionStorage.getItem("idRoom");
            var socket = new SockJS('/stompendpoint');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                
                stompClient.subscribe("/topic/sala." + myroom + "/endGame", function (evenbody) {
                    var newURL = window.location.protocol + "//" + window.location.host + "/" + "endgame.html";
                    window.location.replace(newURL);
                });

                stompClient.subscribe('/topic/sala.' + myroom + "/" + myteam, function (eventbody) {
                    var object = JSON.parse(eventbody.body);
                    var ban = 0;
                    for (var i = 0; i < aliados.length && ban === 0; i++) {
                        if (aliados[i].propietario === object.userName) {
                            ban = 1;
                            aliados[i] = new Component(30, 30, directionImageTank + object.tipoMaquina.direction + myteam + ".png", object.tipoMaquina.x, object.tipoMaquina.y, "image", object.tipoMaquina.bullets, object.tipoMaquina.direction, object.userName, myteam, object.vida);
                        }
                    }
                    if (ban === 0 && object.equipo === myteam) {
                        aliados.push(new Component(30, 30, directionImageTank + object.tipoMaquina.direction + myteam + ".png", object.tipoMaquina.x, object.tipoMaquina.y, "image", object.tipoMaquina.bullets, object.tipoMaquina.direction, object.userName, myteam, object.vida));
                    }
                    updateGameArea();
                });
                stompClient.subscribe('/topic/sala.' + myroom + "/" + enemyteam, function (eventbody) {
                    var object = JSON.parse(eventbody.body);
                    var ban = 0;
                    for (var i = 0; i < oponents.length && ban === 0; i++) {
                        if (oponents[i].propietario === object.userName) {
                            ban = 1;
                            oponents[i] = new Component(30, 30, directionImageTank + object.tipoMaquina.direction + enemyteam + ".png", object.tipoMaquina.x, object.tipoMaquina.y, "image", object.tipoMaquina.bullets, object.tipoMaquina.direction, object.userName, enemyteam, object.vida);
                        }
                    }
                    if (ban === 0 && object.equipo !== myteam) {
                        oponents.push(new Component(30, 30, directionImageTank + object.tipoMaquina.direction + enemyteam + ".png", object.tipoMaquina.x, object.tipoMaquina.y, "image", object.tipoMaquina.bullets, object.tipoMaquina.direction, object.userName, enemyteam, object.vida));
                    }
                    updateGameArea();
                });
                stompClient.subscribe('/topic/sala.' + myroom + "/bullets", function (eventbody) {
                    var object = JSON.parse(eventbody.body);
                    graficarBala(object);
                });
            });
            myGameArea.start();
            var x,y,dir;
  
            if(sessionStorage.getItem("pos")==="1"){x=30;y=Math.round(myGameArea.canvas.height*0.30);dir="1";}
            else if(sessionStorage.getItem("pos")==="2"){x=myGameArea.canvas.width-30;y=Math.round(myGameArea.canvas.height*0.30);dir="2";}
            else if(sessionStorage.getItem("pos")==="3"){x=30;y=Math.round(myGameArea.canvas.height*0.60);dir="1";}
            else if(sessionStorage.getItem("pos")==="4"){x=myGameArea.canvas.width-30;y=Math.round(myGameArea.canvas.height*0.60);dir="2";}
            else if(sessionStorage.getItem("pos")==="5"){x=30;y=Math.round(myGameArea.canvas.height*0.90);dir="1";}
            else if(sessionStorage.getItem("pos")==="6"){x=myGameArea.canvas.width-30;y=Math.round(myGameArea.canvas.height*0.90);dir="2";}
       
            myGamePiece = new Component(30, 30, directionImageTank + dir + myteam + ".png", x, y, "image", [], 1, sessionStorage.getItem("user"), myteam, 500);
            if(myteam==="A"){bandera = new Bandera(0, 30);}
            else{bandera = new Bandera(300, 30);}
            setTimeout(function (){send();},10000);
            send();
            updateGameArea();
            inicio();
        }
    };


}());