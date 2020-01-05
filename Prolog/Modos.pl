% =============== Auxiliary Functions ====================

%playerPlay(+Board, +Counter, +Pieces, -NewBoard, -NewPieces, -Counter1)
playerPlay(Board, Counter, Pieces, NewBoard, NewPieces, Counter1):-
        printBoard(Board),
        showPieces(Pieces),
        remove_dups(Pieces, NewPieces1),
        valid_moves(Board, [], NewPieces1, ListOfMoves),
        length(ListOfMoves, L),
        L>0,
        getPlay(Board, NewBoard, Pieces, NewPieces),
        game_over(NewBoard, Counter, NewCounter),
        Counter1 is NewCounter + 1.

playerPlay(Board, Counter, Pieces, Board, Pieces, Counter1):-
        write('\n There are no available moves!\n'),
        game_over(Board,Counter,NewCounter),
        Counter1 is NewCounter + 1.

%pcPlay(+Smart, +Board, +Counter, -NewBoard, -NewPieces, -Counter1)
pcPlay(Smart, Board, Counter, Pieces, NewBoard, NewPieces, Counter1):-
        printBoard(Board),
        showPieces(Pieces),
        remove_dups(Pieces, NewPieces1),
        valid_moves(Board, [], NewPieces1, ListOfMoves),
        length(ListOfMoves, L),
        L>0,
        choose_move(Board, Smart, X, Y, Piece, ListOfMoves),
        finishMove(Board, X, Y, Piece, Pieces, NewPieces, NewBoard),
        game_over(NewBoard, Counter, NewCounter),
        Counter1 is NewCounter + 1.

pcPlay(_Smart, Board, Counter, Pieces, Board, Pieces, Counter1):-
        write('\n There are no available moves!\n'),
        game_over(Board, Counter, NewCounter),
        Counter1 is NewCounter + 1.


% ================ Person vs Person ======================

%personVSperson(+Player, +Board, +Counter, +WhitePieces, +BlackPieces)
personVSperson(_Player, Board, 16, _WhitePieces, _BlackPieces):-
        printBoard(Board),
        write('\n Game over! \n').

% == Player 1(white) turn ==   
personVSperson(white, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(white),
        playerPlay(Board, Counter, WhitePieces, NewBoard, NewWhitePieces, Counter1),
        personVSperson(black, NewBoard, Counter1, NewWhitePieces, BlackPieces).

% == Player 2(black) turn ==   
personVSperson(black, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(black),
        playerPlay(Board, Counter, BlackPieces, NewBoard, NewBlackPieces, Counter1),
        personVSperson(white, NewBoard, Counter1, WhitePieces, NewBlackPieces).


% ================ Person vs Computer ======================

%personVSpc(+Smart, +PlayerorBot, +Board, +Counter, +WhitePieces, +BlackPieces)
personVSpc(_Smart, _PlayerorBot, Board, 16, _WhitePieces, _BlackPieces):-
        printBoard(Board),
        write('\n Game over!\n').

% == Person turn ==
personVSpc(Smart, player, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(white),
        playerPlay(Board, Counter, WhitePieces, NewBoard, NewWhitePieces, Counter1),
        personVSpc(Smart, bot, NewBoard, Counter1, NewWhitePieces, BlackPieces).

% == PC turn ==
personVSpc(Smart, bot, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(black),
        pcPlay(Smart, Board, Counter, BlackPieces, NewBoard, NewBlackPieces, Counter1),
        personVSpc(Smart, player, NewBoard, Counter1, WhitePieces, NewBlackPieces).


% ================ Computer vs Computer ======================

%pcVSpc(+Smart, +Pc, +Board, +Counter, +WhitePieces, +BlackPieces)
pcVSpc(_Smart, _Pc, Board, 16, _WhitePieces, _BlackPieces):-
        printBoard(Board),
        write('\n Game over!\n').

% == PC1 turn ==
pcVSpc(Smart, pc1, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(white),
        pcPlay(Smart, Board, Counter, WhitePieces, NewBoard, NewWhitePieces, Counter1),
        pcVSpc(Smart, pc2, NewBoard, Counter1, NewWhitePieces, BlackPieces).

% == PC2 turn ==
pcVSpc(Smart, pc2, Board, Counter, WhitePieces, BlackPieces):-
        Counter<16,
        turn(black),
        pcPlay(Smart, Board, Counter, BlackPieces, NewBoard, NewBlackPieces, Counter1),
        pcVSpc(Smart, pc1, NewBoard, Counter1, WhitePieces, NewBlackPieces).