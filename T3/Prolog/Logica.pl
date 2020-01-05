% === get coords ===
%getLine(-Y, +Size)
getLine(Y,Size):-
	write('\n Line value must be between 1 and '),
	write(Size),
	nl,
	read_line([H|T]),
    length(T,0),
	Y is H-48,
	Y=<Size,
	Y>=1.

%getColumn(-X, +Size)
getColumn(X,Size):-
	MaxCharCode is 96+Size,
	char_code(Char,MaxCharCode),
	write('\n Column value must be between \'a\' and \''),
	write(Char),
	write('\' (uppercase is also accepted)\n'),	
	read_line([H|T]),
	length(T,0),
	auxGetColumn(H,X,MaxCharCode).

auxGetColumn(X, NewX, MaxCharCode):- %para minuscula
	X=<MaxCharCode,
	X>=97,
	NewX is X-96.

auxGetColumn(X, NewX, MaxCharCode):- %para maiuscula
	X=<MaxCharCode-22,
	X>=65,
	NewX is X-64.

%getCoord(-X, -Y, +Board)
getCoord(X, Y, Board):-
	length(Board, Size),
	repeat,
	getLine(Y,Size),
	getColumn(X,Size),
	validMove(X,Y,Board).

%getSquare(+Board, +X, +Y, -List)
getSquare(Board,X,Y,[Value1,Value2,Value3,Value4]):-
	X1 is X + (X mod 2) - 1,
	Y1 is Y + (Y mod 2) - 1,
	Y2 is Y1+1,
	X2 is X1+1,
	nth1(Y1,Board,Row),
	nth1(Y2,Board,Row1),
	nth1(X1,Row,Value1),
	nth1(X2,Row,Value2),
	nth1(X1,Row1,Value3),
	nth1(X2,Row1,Value4).

% ============= 
% === RULES ===
% =============

% === Win from List ===
%true if all elements of list multiplied equal 24 (true if list contains 1, 2, 3 and 4)
%winList(+List, +Counter)
winList([] , 24).

winList( [H|T] , Counter):-
	Value1 is H mod 5,
	Counter1 is Counter * Value1,
	winList( T , Counter1).

% === Checks if piece is valid in row===
%true if row doesnt contain oponent equivalent of Piece
%pieceCheckC(+Board, +Y, +Piece)
pieceCheckR(Board , Y , Piece):-
	Piece>5,
	Piece1 is Piece-5,
	pieceCheckRAux(Board,Y,Piece1).

pieceCheckR(Board , Y , Piece):-
	Piece<5,
	Piece1 is Piece+5,
	pieceCheckRAux(Board,Y,Piece1).

pieceCheckRAux(Board, Y, Piece):-
	nth1(Y,Board,Row),
	\+member(Piece, Row).

% === Checks if piece is valid in column ===
%true if column doesnt contain oponent equivalent of Piece
%pieceCheckC(+Board, +X, +Piece)
pieceCheckC(Board , X , Piece):-
	Piece>5,
	Piece1 is Piece-5,
	pieceCheckCAux(Board,X,Piece1).

pieceCheckC(Board , X , Piece):-
	Piece<5,
	Piece1 is Piece+5,
	pieceCheckCAux(Board,X,Piece1).

pieceCheckCAux(Board, X, Piece):-
	transpose(Board,Board1),
	nth1(X,Board1,Column),
	\+member(Piece, Column).

%true if list doesnt contain oponent equivalent of Piece
%pieceCheck(+List, +Piece)
pieceCheck(List , Piece):-
	Piece>5,
	Piece1 is Piece-5,
	\+member(Piece1, List).

pieceCheck(List , Piece):-
	Piece<5,
	Piece1 is Piece+5,
	\+member(Piece1, List).

% === checks if move is valid ===
%true if cell(X,Y) contains number 0 (if its empty)
%validMove(+X, +Y, +List)
validMove(X , Y , List):-
	isEmptyCell(X , Y , List).

validMove(_ , _, _):- 
	write('\n Not a valid move.'),
	fail.

isEmptyCell(X , Y , List):-
	nth1(Y,List,NewList),
	nth1(X,NewList,0).	

% === checks if piece is valid 
%validPiece(+Piece, +AvailablePieces)
validPiece(Piece,List):- 
	member(Piece,List).

%pieceRuleValidation(+Board, +X, +Y, +Piece)
pieceRuleValidation(Board , X , Y , Piece):-
	pieceCheckR(Board , Y , Piece),
	pieceCheckC(Board , X , Piece),
	getSquare(Board,X,Y,List),
	pieceCheck(List, Piece).

% === removes piece from available pieces === 
%removePiece(+Piece, +Pieces, -NewPieces)
removePiece(Piece, List , List1):-
	append(La,[Piece|Lb],List),  
	append(La,Lb,List1)
	,!.

% === ask for piece ===
%getPiece(-Piece, +AvailablePieces)
getPiece(Piece , AvailablePieces):-
	showPieces(AvailablePieces),
	write('\n Choose a piece (INT)\n'),
	read_line([H|T]),
	length(T,0),
	Piece is H-48,
	validPiece(Piece , AvailablePieces ).

%===  functions to insert piece in board ===
%replace(+Board, +X, +Y, +Piece, -NewBoard)
replace([B|Bt] , X , 1 , Piece, [N|Bt]):-
	replace_row(B, X , Piece , N),!.

replace([B|Bt] , X, Y , Piece , [B|Nt]):-
	Y>1,
	Y1 is Y - 1,
	replace(Bt, X , Y1 , Piece, Nt).

%replace_row(+Row, +X, +Piece, -NewRow)
replace_row( [_|Cs] , 1 , Piece , [Piece|Cs]) .

replace_row( [C|Cs] , X , Piece , [C|Ct] ) :- 
	X>1,
  	X1 is X-1 ,                               
  	replace_row( Cs , X1 , Piece , Ct ).                                          


% === function that gets the play ===
%getPlay(+Board, -NewBoard, +AvailablePieces, -UpdatedPieces)
getPlay(Board , NewBoard , AvailablePieces , UpdatedPieces):-
	getCoord(X , Y , Board),
	getPiece(Piece , AvailablePieces),
	move( Board, X , Y , Piece , AvailablePieces , UpdatedPieces , NewBoard).

%finishMove(+Board, +X, +Y, +Piece, +AvailablePieces, -UpdatedPieces, -NewBoard):-
finishMove(Board , X , Y , Piece , AvailablePieces , UpdatedPieces , NewBoard):-
	removePiece(Piece , AvailablePieces , UpdatedPieces),
	replace(Board, X , Y, Piece, NewBoard).

%move(+Board, +X, +Y, +Piece, +AvailablePieces, -UpdatedPieces, -NewBoard):-
move(Board, X, Y, Piece, AvailablePieces, UpdatedPieces, NewBoard):-
	pieceRuleValidation(Board , X , Y , Piece),
	!,
	finishMove(Board , X , Y , Piece , AvailablePieces , UpdatedPieces , NewBoard).

move(_Board, _X, _Y, _Piece, _AvailablePieces, _UpdatedPieces):-
	write("\n Invalid Play\n").

% === function that checks if player has won === 
% checkWin(+Board, +X, +Y)
checkWin(Board , _X , Y):- % win from row
	nth1(Y,Board,Row),
	winList(Row, 1).

checkWin(Board , X , _Y ):- % win from column
	transpose(Board, Board1),
	nth1(X,Board1,Row),
	winList(Row, 1).

checkWin(Board , X , Y):- % win from square
	getSquare(Board,X,Y,List),
	winList(List, 1).

% game_over(+Board, +Counter, -NewCounter)
game_over(Board,_Counter,NewCounter):-
	checkWin(Board,1,1),
	!,
	NewCounter is 15,
	write('\n You won! \n').

game_over(Board,_Counter,NewCounter):-
	checkWin(Board,2,3),
	!,
	NewCounter is 15,
	write('\n You won! \n').

game_over(Board,_Counter,NewCounter):-
	checkWin(Board,3,2), 
	!,
	NewCounter is 15,
	write('\n You won! \n').

game_over(Board,_Counter,NewCounter):-
	checkWin(Board,4,4),
	!,
	NewCounter is 15,
	write('\n You won! \n').

game_over(_Board,Counter,NewCounter):-
	NewCounter is Counter,
	write('\n Keep playing! \n').