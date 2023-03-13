// imports
import { useState, useMemo, useEffect, useCallback } from "react";
import { primary, secondary, tertiary } from "../../pallette";
import { useNavigate } from "react-router-dom";
import { socketOn, socketOff, socketEmit } from '../../utils/socket';

// chakra-ui
import { Box, Flex, Button, Input, Text, Heading, Divider } from "@chakra-ui/react";

const Home = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const navigate = useNavigate();
  
  const handleJoinRoom = useCallback(() => {
      roomId && socketEmit("check-room", roomId);
  }, [roomId]); 

  const handleHostGame = useCallback(() => {
    const randId = crypto.randomUUID().substring(0, 5);
    navigate(`/game/${randId}`);
  }, []);

  useEffect(() => {
    const prevError = joinError;
    setTimeout(() => { 
      if(prevError === joinError) {
        setJoinError(null) 
      }
    }, 3000);
  }, [joinError]);

  useEffect(() => {
    socketOn("room-available", (gameId:string) => { navigate(`/game/${gameId}`) });
    socketOn("bad-check", (message:string) => {setJoinError(message); setRoomId("")});

    return () => {
      socketOff('room-available');
      socketOff('bad-check');
    };
  });

  const btnStyle = useMemo(() => {
    return { color: tertiary, bgColor: secondary, w: 200 };
  }, [tertiary, secondary]);
  
  return (
    <Box className="home" w="100vw" h="100vh" bgColor={primary}>
      <Flex direction="column" align="center">
        <Heading mt={175} fontSize={30} color={tertiary}>Tic Tac Toe</Heading>

        <Input mt={8} placeholder="room id: abc123" w={200} bgColor="white" type="text" value={roomId} onChange={(e) => { setRoomId(e.target.value.trim()); setJoinError(null)}} />
        <Button mt={3} onClick={handleJoinRoom} sx={btnStyle}>
          Join Room
        </Button>

        {joinError && <Text>{joinError}</Text>}

        <Divider mt={10} bgColor={tertiary} w={100} h={.5} orientation="vertical" />

        <Button mt={10} onClick={handleHostGame} sx={btnStyle}>
          Host game
        </Button>

      </Flex>
    </Box>
  );
};

export default Home;
