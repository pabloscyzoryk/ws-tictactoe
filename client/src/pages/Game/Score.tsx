import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState, useEffect } from "react";
import { socketOn, socketOff, socketEmit } from "../../utils/socket";
import { useParams } from "react-router-dom";

interface ScoreI {
  status: string;
}

const Score = (props: ScoreI) => {

  const { score, amIX, nickname, opponentNickname, isGameFinished } =
    useSelector((state: RootState) => state.game);

  const { playerO, playerX } = score;
  const [rematchOfferSent, setRematchOfferSent] = useState(false);
  const [gotRematchOffer, setGotRematchOffer] = useState(false);

  const { id: roomId } = useParams();

  const handleRequestRematch = () => {
    socketEmit('send-rematch-request', roomId);
    setRematchOfferSent(true);
    setGotRematchOffer(false);
  };

  const handleAcceptRematch = () => {
    socketEmit('accept-rematch', roomId);
    setGotRematchOffer(false);
    setRematchOfferSent(false);
  }

  useEffect(() => {
    socketOn('rematch-request', () => {
        setGotRematchOffer(true);
        setRematchOfferSent(false);
    })

    socketOn("start-rematch", () => {
        setGotRematchOffer(false);
        setRematchOfferSent(false);
        // restart board position and so on
    });


    return () => {
      socketOff("start-rematch");
      socketOff('rematch-request');
    };

  }, []);

  return (
    <Flex
      borderRadius={5}
      align="center"
      direction="column"
      bgColor="white"
      w={400}
      h={300}
    >
      <Heading>Score</Heading>
      <Flex mt={5} w="100%" justify="space-around">
        <Flex gap={5} direction="column" align="center">
          <Text fontWeight={700} fontSize={50}>
            {playerX}
          </Text>
          <Text mt={-7}>{amIX ? nickname : opponentNickname}</Text>
        </Flex>
        <Divider orientation="vertical" />
        <Flex gap={5} direction="column" align="center">
          <Text fontWeight={700} fontSize={50}>
            {playerO}
          </Text>
          <Text mt={-7}>{!amIX ? nickname : opponentNickname}</Text>
        </Flex>
      </Flex>

      {(isGameFinished && !rematchOfferSent && !gotRematchOffer) && (
        <Button
          w={125}
          color="white"
          onClick={handleRequestRematch}
          bgColor="red.400"
          mt={15}
        >
          Rematch ?
        </Button>
      )}
      {(isGameFinished && rematchOfferSent && !gotRematchOffer) && (
        <Button w={125} color="white" bgColor="red.400" mt={15}>
          <Spinner />
        </Button>
      )}

      {(isGameFinished && gotRematchOffer && !rematchOfferSent) &&  
        <Button onClick={handleAcceptRematch} w={125} color="white" bgColor="red.400" mt={15}>
            Accept Rematch
        </Button>
    }

      <Text fontWeight={500} fontSize={20} mt={5}>
        {props.status}
      </Text>
    </Flex>
  );
};

export default Score;
