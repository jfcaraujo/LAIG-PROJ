% Boards and Pieces
initialBoard(
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]).

%piecesBlack(-List, +X)
piecesBlack(List, X):-
        isEmpty(L),createPieces(L, X, 1, List).

%piecesWhite(-List, +X)
piecesWhite(List, X):-
        isEmpty(L),createPieces(L, X, 6, List).

%createPieces(+List, +NumberOfRepetitions, +FirstPiece, -NewPieces)
createPieces(List, NumberOfRepetitions, Piece, NewPieces):-
        length(List,L),
        L<(Piece mod 5)*NumberOfRepetitions,
        append(List, [Piece], NewList),
        createPieces(NewList,NumberOfRepetitions,Piece,NewPieces).
        
createPieces(List,NumberOfRepetitions,Piece,NewPieces):-
        length(List,L),
        L=:= (Piece mod 5)*NumberOfRepetitions,
        Piece mod 5 =\= 4,
        NewPiece is Piece+1,
        createPieces(List,NumberOfRepetitions,NewPiece,NewPieces).

createPieces(List,NumberOfRepetitions,Piece,List):-
        length(List,L),
        L=:= (Piece mod 5)*NumberOfRepetitions,
        Piece mod 5 =:= 4.

% Tradution
piece(0, V) :- V = '*'.
piece(1, V) :- V ='p'.
piece(6, V) :- V ='P'.
piece(2, V) :- V ='c'.
piece(7, V) :- V ='C'.
piece(3, V) :- V ='l'.
piece(8, V) :- V ='L'.
piece(4, V) :- V ='e'.
piece(9, V) :- V ='E'.

player(white , V) :- V = 1.
player(black , V) :- V = 2.

% Display functions 

turn(Player):-
        player(Player,Num),
        write( '\nIt\'s player '),
        write( Num ),
        write( ' turn!\n' ).

printBoard(Board):-
        write('\n  '),
        length(Board, X),
        printTopBoard(X,0),
        write('\n   ') ,
        printEmptyLine(X,0),
        printBoard(Board, 1).

%printTopBoard(+MaxIndex, +CurrentIndex)
printTopBoard(MaxIndex,MaxIndex).

printTopBoard(MaxIndex,CurrentIndex):-
        MaxIndex>CurrentIndex,
        LetterCode is CurrentIndex+65,
        CurrentIndex1 is CurrentIndex+1,
        write('   '),
        char_code(LetterChar,LetterCode),
        write(LetterChar),
        printTopBoard(MaxIndex,CurrentIndex1).

%printEmptyLine(+CurrentIndex, +IsEmpty)
printEmptyLine(0,_):- 
        write('|').

printEmptyLine(X,0):-
        X>0,
        1 =\= X mod 2,
        write('|---'),
        X1 is X-1,
        printEmptyLine(X1,0).

printEmptyLine(X,0):-
        X>0,
        1 =:= X mod 2,
        write('----'),
        X1 is X-1,
        printEmptyLine(X1,0).

printEmptyLine(X,1):-
        X>0,
        1 =:= X mod 2,
        write('    '),
        X1 is X-1,
        printEmptyLine(X1,1).

printEmptyLine(X,1):-
        X>0,
        1 =\= X mod 2,
        write('|   '),
        X1 is X-1,
        printEmptyLine(X1,1).

%printBoard(+Lines, +CurrentIndex)
printBoard([],_):-
        nl,
        nl.

printBoard([H|T],Num):-
        write('\n '),
        write(Num),
        printLine(H),
        length(H,X),
        write('\n   '),
        Num1 is Num mod 2,
        printEmptyLine(X,Num1),
        Num2 is Num+1,
        printBoard(T,Num2).

%printLine(+Line)
printLine([]):-
        write(' |').

printLine([H|T]):-
        length(T,X),
        0 =:= X mod 2,
        write('   '),
        piece(H,Piece),
        write(Piece),
        printLine(T).

printLine([H|T]):-
        length(T,X),
        0 =\= X mod 2,
        write(' | '),
        piece(H,Piece),
        write(Piece),
        printLine(T).

% Prints the pieces that are still available
%printPieces(+ListOfPieces, +Counter, +CurrentPiece)
printPieces([],Counter,CurrentPiece):-
        piece(CurrentPiece,Piece),
        write(Counter), write('*'),
        write(Piece), write('('),
        write(CurrentPiece), write(')  ').

printPieces([Code|Pieces],Counter,CurrentPiece):-
        Code==CurrentPiece,
        Counter1 is Counter+1,
        printPieces(Pieces,Counter1,CurrentPiece).

printPieces([Code|Pieces],Counter,CurrentPiece):-
        Code\=CurrentPiece,
        piece(CurrentPiece,Piece),
        write(Counter), write('*'),
        write(Piece), write('('),
        write(CurrentPiece), write(')  '),
        printPieces(Pieces,1,Code).

isEmpty([]).

showPieces(PlayerPieces):-
        isEmpty(PlayerPieces),
        !,
        write('\n Error: there are no more available pieces :( \n').

showPieces([P|PlayerPieces]):-
        write('\n Player\'s available pieces: \n '),
        printPieces(PlayerPieces,1,P),
        nl.