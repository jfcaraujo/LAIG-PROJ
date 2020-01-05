menus:- % First Menu
        repeat,
        displayMainMenu,
        nl,
        read_line([H|T]),
        length(T,0),
        !,
        Input is H-48,
        menuChoice(Input).

menuChoice(1):- % start game
        initialBoard(InitialBoard),
        length(InitialBoard, X),
        X1 is X-2,
        piecesBlack(BlackPieces,X1),
        piecesWhite(WhitePieces,X1),
        repeat,
        displayGameMenu,
        nl,
        read_line([H|T]),
        length(T,0),
        !,
        Input is H-48,
        gameChoice(Input , InitialBoard , BlackPieces , WhitePieces).

menuChoice(2):- % instructions
        displayInstructions,
        read_line(_),
        menus.

menuChoice(3):- % credits
        displayCredits,
        read_line(_),
        menus.

menuChoice(4):- % exitgame
        write('\nThanks for playing!\n').

menuChoice(_):- % invalid input
        write('Must choose between 1 or 4\n'),
        menus.

% ========== Init game option ==================
gameChoice(1 , InitialBoard , BlackPieces , WhitePieces):- personVSperson(white,InitialBoard , 0, WhitePieces , BlackPieces) , menus. % person vs person
gameChoice(2 , InitialBoard , BlackPieces , WhitePieces):- personVSpc(random,player,InitialBoard , 0 , WhitePieces, BlackPieces) , menus. % person vs pc (easy)
gameChoice(3 , InitialBoard , BlackPieces , WhitePieces):-  personVSpc(smart,player,InitialBoard, 0 , WhitePieces , BlackPieces) , menus. % person vs pc (hard)
gameChoice(4 , InitialBoard , BlackPieces , WhitePieces):-  pcVSpc(random,pc1,InitialBoard, 0 , WhitePieces , BlackPieces) , menus. % pc vs pc (easy)
gameChoice(5 , InitialBoard , BlackPieces , WhitePieces):-  pcVSpc(smart,pc1,InitialBoard, 0 , WhitePieces , BlackPieces) , menus. % pc vs pc (hard)
gameChoice(_ , _InitialBoard , _BlackPieces , _WhitePieces):- menuChoice(1). % invalid input

% ============= Menus Display =====================
displayMainMenu:-
        write('\n ----------------------------------------\n'),
        write('|                                        |\n'),
        write('|                Quantik                 |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write('|         Options:                       |\n'),
        write('|                    1- Start Game       |\n'),
        write('|                    2- Instructions     |\n'),
        write('|                    3- Credits          |\n'),
        write('|                    4- Exit             |\n'),
        write('|                                        |\n'),
        write('|                                        |\n'),
        write(' ----------------------------------------\n').

displayGameMenu:-
        write('\n ------------------------------------------\n'),
        write('|                                            |\n'),
        write('|                   Quantik                  |\n'),
        write('|                                            |\n'),
        write('|                                            |\n'),
        write('|    Options:                                |\n'),
        write('|                                            |\n'),
        write('|             1- Person vs Person            |\n'),
        write('|             2- Computer vs Person (Easy)   |\n'),
        write('|             3- Computer vs Person (Hard)   |\n'),
        write('|             4- Computer vs Computer (Easy) |\n'),
        write('|             5- Computer vs Computer (Hard) |\n'),
        write('|                                            |\n'),
        write(' --------------------------------------------\n').

displayInstructions:-
        write('\n ------------------------------------------\n'),
        write('|                                            |\n'),
        write('|                   Quantik                  |\n'),
        write('|                                            |\n'),
        write('| Instructions:                              |\n'),
        write('|                                            |\n'),
        write('| The goal is to be the first player to pose |\n'),
        write('| the fourth different forms of a line, a    |\n'),
        write('| column or a square zone. Each turn the     |\n'),
        write('| players will put one of their pieces on    |\n'),
        write('| the boardgame. It\'s forbidden to put a     |\n'),
        write('| shape in a line, a column or an area on    |\n'),
        write('| which this same form has already been      |\n'),
        write('| posed by the opponent. We can only double  |\n'),
        write('| a shape if we have played the previous one |\n'),
        write('| ourself. The first player who places the   |\n'),
        write('| fourth different form in a row, column or  |\n'),
        write('| zone wins the game immediately, no matter  |\n'),
        write('| who owns the other pieces of that winning  |\n'),
        write('| move.                                      |\n'),
        write('|                    (Press Enter to Escape) |\n'),
        write(' --------------------------------------------\n\n').

displayCredits:-
        write('\n ------------------------------------------\n'),
        write('|                                            |\n'),
        write('|                   Quantik                  |\n'),
        write('|                                            |\n'),
        write('|                                            |\n'),
        write('|   This game was made by:                   |\n'),
        write('|                           Andreia Gomes    |\n'),
        write('|                           Joao Araujo      |\n'),
        write('|                                            |\n'),
        write('|                    (Press Enter to Escape) |\n'),
        write(' --------------------------------------------\n\n').
