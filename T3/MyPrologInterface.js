/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPrologInterface extends CGFobject {
    constructor(scene) {
        super(scene);
    }

    /* 
    check win

    bot stuff

    */

    checkWin(board) {
        this.sendRequest("checkWin(" + board + ")", data => this.parseCheckWinReply(data));
    }

    getAvailableMoves(piece, board) {
        this.sendRequest("getMoves(" + board + "," + piece + ")", data => this.parseGetMovesReply(data));
    }

    getBotMove(smart, board, pieces) {
        this.sendRequest("getBotMove(" + smart + "," + board + "," + pieces + ")", data => this.parseGetBotMoveReply(data));
    }

    sendRequest(requestString, parseFunction) {
        let request = new XMLHttpRequest(this);
        request.addEventListener("load", parseFunction);
        request.addEventListener("error", this.startPrologGameError);
        request.open('GET', 'http://localhost:8081/' + requestString, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    }

    prologGameError() {
        console.error("Error interacting with prolog interface");
    }

    parseGetMovesReply(data) {
        if (data.status === 400) {
            console.log("ERROR");
            return;
        }
        let response = data.target.responseText.slice(1, -1).split(',');
        let tempArray = [];
        for (let i = 0; i < response.length; i++) {
            let length = response[i].length;
            tempArray.push([response[i][length - 5], response[i][length - 3]]);
        }
        this.scene.gameOrchestrator.tilesToPlay = tempArray;
    }

    parseCheckWinReply(data) {
        if (data.status === 400) {
            console.log("ERROR");
            return;
        }
        let response = data.target.responseText;
        if (response == "15") {
            console.log("You won the game!");
            this.scene.gameOrchestrator.state = 2;
        } else {
            this.scene.gameOrchestrator.state = 0;

        }
        this.scene.gameOrchestrator.changeTurn();
        this.scene.gameOrchestrator.replied = true;
    }

    parseGetBotMoveReply(data) {
        if (data.status === 400) {
            console.log("ERROR");
            return;
        }
        let response = data.target.responseText;
        let gameOrchestrator = this.scene.gameOrchestrator;
        let piece = gameOrchestrator.gameboard.getPieceByType(response[5]);
        gameOrchestrator.movePiece(new MyGameMove(this.scene,
            piece, piece.getTile(), gameOrchestrator.gameboard.getTileWithCoords(response[1] - 1, response[3] - 1),
            gameOrchestrator.gameboard))
    }
}