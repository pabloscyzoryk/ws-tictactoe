import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import UserI from '../../interfaces/UserI';
import Board from "./Board";
import { BoardT } from "../../types/BoardT";
import { RoomI } from "../../interfaces/RoomI";
import { primary, secondary, tertiary } from "../../pallette";
import { setIsXMove, setAmIX, setTurns, setScore, setOpponentNickname, setIsGameFinished } from "../../redux/game";
import { socketOn, socketOff, socketEmit, socketId } from "../../utils/socket";
import Score from "./Score";
import Chat from './Chat';
import WonMark from './WonMark';
import { MessageI } from "../../interfaces/MessageI";

const Game = () => {
  const { id: roomId } = useParams();
  const { nickname, opponentNickname } = useSelector((state: RootState) => state.game);
  const [roomError, setRoomError] = useState<null | string>(null);
  const [boardState, setBoardState] = useState<BoardT>([null, null, null, null, null, null, null, null, null,]);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [users, setUsers] = useState< UserI[] >([]);
  const [status, setStatus] = useState<string>('');
  const [winner, setWinner] = useState<(string | null)>(null);
  const [wonConditions, setWonConditions] = useState<number[]>([]);

  const location = useLocation();

  const fullUrl = useMemo(() => window.location.protocol + '//' + window.location.host + location.pathname + location.search + location.hash, [location.pathname, location.search, location.hash]);

  const dispatch = useDispatch();

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      socketEmit("join-room", roomId, nickname);
    } else {
      isMounted.current = true;
    }

    socketOn("bad-check", (error) => setRoomError(error));

    socketOn("update", (room: RoomI) => {
      (room.users.length === 2) && setIsReady(true);
      setUsers(room.users);
      setBoardState(room.board);
      setMessages(room.chat);
      setWinner(room.winner);
      setWonConditions(room.wonConditions);
      dispatch(setAmIX(room.users[0].id == socketId()));
      dispatch(setTurns(room.turns));
      dispatch(setIsXMove(room.isXMove));
      dispatch(setIsGameFinished(room.isGameFinished));
      dispatch(setScore(room.score));
      const opponentNick = room.users.find(user => user.id != socketId())!.nickname;
      dispatch(setOpponentNickname(opponentNick));

      if(room.isXMove && (room.users[0].id == socketId())) setStatus('Your move (X)');
      if(room.isXMove && !(room.users[0].id == socketId())) setStatus("Opponent's move (X)");
      if(!room.isXMove && (room.users[0].id == socketId())) setStatus("Opponent's move (O)");
      if(!room.isXMove && !(room.users[0].id == socketId())) setStatus('Your move (O)');

      if(room.winner === 'X' && (room.users[0].id == socketId()) ) setStatus('You won (X)!');
      if(room.winner === 'X' && !(room.users[0].id == socketId()) ) setStatus(`${opponentNick} won (X)!`);
      if(room.winner === 'O' && (room.users[0].id == socketId()) ) setStatus(`${opponentNick} won (O)!`);
      if(room.winner === 'O' &&  !(room.users[0].id == socketId())) setStatus(`You won (O)!`);

      if(room.winner === 'D') setStatus('Draw!');

      console.log(room);
    });

    return () => {
      socketOff("bad-check");
      socketOff("open-room");
      socketOff("update");
    };

  }, [roomId]);

  return (
    <Box className="game" w='100vw' h='100vh'>

      {roomError &&
        <Flex bgColor={primary} direction='column' w='100vw' h='90vh' gap={5} align='center' justify='center' >
          <Text fontSize={30}>{roomError}</Text>
          <Link to="/">
            <Button color={tertiary} bgColor={secondary}>Back to homepage</Button>
          </Link>
        </Flex>
       }

       {!roomError && 
          <>
            {isReady && <>
            <Flex wrap='wrap' bgColor={primary} w='100vw' h='90vh' justify='space-around' align='center'>

              <Score status={status}/>

              <Flex direction='column' gap={2} justify='center' align='center'>
                <Text>{ opponentNickname }</Text>
                <Box position='relative'>
                  { winner && <WonMark wonConditions={wonConditions} /> }
                  <Board boardState={boardState} />
                </Box>
                <Text>{ nickname }</Text>
              </Flex>

              <Chat messages={messages}></Chat>
            </Flex>
            </>
            }

            {!isReady && 
            <Flex bgColor={primary} direction='column' gap={5} w='100vw' h='90vh' justify='center' align='center'>
                <Heading>Waiting for an opponent...</Heading>
                <Text>Game ID: {roomId}</Text>
                <Text>Copy this link for your friend to join:</Text>
                <Text>{fullUrl}</Text>
            </Flex>
            }
          </>    
       }
      
    </Box>
  );
};

export default Game;
