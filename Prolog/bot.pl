% === obtenção das jogadas validas ===
%valid_moves(+Board, +ListOfMoves, +Pieces, -FinalList)
valid_moves(_Board, ListOfMoves, Pieces, FinalList):-
    isEmpty(Pieces),
    copy(ListOfMoves, FinalList).

valid_moves(Board, ListOfMoves, [Piece|T], FinalList):-
    findall(V-X-Y-Piece, (pieceRuleValidation(Board, X, Y, Piece),
        isEmptyCell(X, Y, Board),
        finishMove(Board, X, Y, Piece, [Piece|T], _NewPieces, NewBoard),
        value(NewBoard, V)), List),
    append(ListOfMoves, List, NewList),
    valid_moves(Board, NewList, T, FinalList).

% == getBest Value
%getfirstelement(+List, -H)
getfirstelement([H|_T], H).

%getValue(+V-X-Y-Piece, -V)
getValue(V-_X-_Y-_Piece, V).

%bestMove(+List, +Move, -BestMove)
bestMove([], Move, Move).

bestMove([H|T], Move, BestMove):-
    getValue(H, Value),
    getValue(Move, Value2),
    Value > Value2, % if new move is better than the last
    !,
    bestMove(T, H, BestMove).

bestMove([_H|T], Move, BestMove):-
    bestMove(T, Move, BestMove).

%getBestMove(+List, -BestMove)
getBestMove(List, BestMove):-
    getfirstelement(List, Move),
    bestMove(List, Move, BestMove).

% === get move
%getMove(+V-X-Y-Piece, -X, -Y, -Piece)
getMove(_V-X-Y-Piece, X, Y, Piece).

%choose_move(+Board, +Smart, -X, -Y, -Piece, +ListOfMoves)
%     RANDOM
choose_move(_Board, random, _X, _Y, _Piece, []):-
    write('\n ---- No available moves ----').

choose_move(Board, random, X, Y, Piece, ListOfMoves):-
    random_select(Elem, ListOfMoves, _),
    getMove(Elem, X, Y, Piece),
    validMove(X, Y, Board),
    !,
    write('\n Column: '),
    X1 is X + 64,
	char_code(C, X1),
    write(C),
    write('\n Line: '),
    write(Y),
    write('\n Piece: '),
    piece(Piece, C1),
    write(C1),
    nl.

%       WITH VALUE
choose_move(_Board, smart, _X, _Y, _Piece, []):-
    write('\n ---- No available moves ----').

choose_move(Board, smart, X, Y, Piece, List):-
    getBestMove(List, BestMove),
    getMove(BestMove, X, Y, Piece),
    validMove(X, Y, Board),
    !,
    write('\n Column: '),
    X1 is X + 64,
	char_code(C, X1),
    write(C),
    write('\n Line: '),
    write(Y),
    write('\n Piece: '),
    piece(Piece, C1),
    write(C1),
    nl.

% ==== VALUE FUNCTIONS ===
%list_sum(+List, -TotalSum)
list_sum([], 0).
list_sum([Head|Tail], TotalSum) :-
    list_sum(Tail, Sum1),
    Count1 is Head mod 5,
    TotalSum is Count1 + Sum1.

%copy(+L, -R)
copy(L,R) :- append(L,[],R). % function to copy lists

%are_identical(+X, +Y)
are_identical(X, Y) :- % sees if 2 elements are identical
    X == Y.

%filterList(+Elem, +List, -Number)
filterList(Elem, List, Number) :- % sees how many 0s
    exclude(are_identical(Elem), List, FilteredList),
    length(FilteredList, Number).

%attributeValue(+Line, -Value, +Counter)
attributeValue(_Line, 0, 0):- !. % if row is empty ignores value

attributeValue(_Line, 5, 1):- !. % 1 piece - middle option

attributeValue(Line, 6, 2):- % 2 different pieces - middle option
    list_sum(Line, Sum),
    member(Sum, [3,4,5,6,7]), 
    !.

attributeValue(_Line, 1, 2):- !. % 2 pieces with repetitions - bad option

attributeValue(Line, -1, 3):- % 3 different pieces - worst option
    list_sum(Line, Sum),
    member(Sum, [6,7,8,9]), 
    !.

attributeValue(_Line, 1, 3):- !. % 3 pieces with repetitions - bad option

attributeValue(Line, 15, 4):- % 4 different pieces - best option
    winList(Line, 1),
    !.

attributeValue(_Line, 1, 4):- !. % 4 pieces with repetition - bad option

attributeValue(_Line, 0, _Counter). % if anything else

%checkLine(+Line, -Value)
checkLine(Line, Value):-
    filterList(0, Line, ZeroCounter),
    attributeValue(Line, Value, ZeroCounter).

%checkLines(+Lines, +Counter, -FinalValue)
checkLines([], Counter, Counter).

checkLines([H|T], Counter, FinalValue):-
    checkLine(H, Value1),
    attributeBigger(Counter, Value1, Result),
    checkLines(T, Result, FinalValue).

%value(+Board, -Value)
value(Board, Value):-
    %lines
    checkLines(Board, 0, Counter),
    %rows
    transpose(Board, TransposedBoard),
    checkLines(TransposedBoard, 0, Counter1),
    attributeBigger(Counter, Counter1, Value1),
    %squares
    getSquare(Board, 1, 1, List1),
    getSquare(Board, 4, 4, List2),
    getSquare(Board, 2, 3, List3),
    getSquare(Board, 3, 2, List4),
    checkLines([List1, List2, List3, List4], 0, Counter2),
    attributeBigger(Value1, Counter2, Value).

%attributeBigger(+Value1, +Value2, -Result)
attributeBigger(-1,Value2,-1):-
    Value2 \=15, !.

attributeBigger(Value1,-1,-1):-
    Value1 \=15, !.

attributeBigger(Value1 , Value2 , Value1):-
    Value1>=Value2, !.

attributeBigger(Value1 , Value2 , Value2):-
    Value2 >= Value1, !.

    
