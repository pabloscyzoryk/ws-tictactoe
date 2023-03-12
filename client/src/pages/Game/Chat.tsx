import { Flex, Box, Input, Button, Text, Icon } from "@chakra-ui/react";
import { MessageI } from "../../interfaces/MessageI";
import { useState } from "react";
import { socketEmit } from "../../utils/socket";
import { useParams } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { secondary } from "../../pallette";

interface ChatI {
  messages: MessageI[];
}

const Chat = (props: ChatI) => {
  const [message, setMessage] = useState("");
  const { id: roomId } = useParams();

  const handleSendMessage = () => {
    socketEmit("message", roomId, message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && handleSendMessage();  
  }

  return (
    <Flex gap={3} justify="center" w={425} direction="column" h={400}>
      <Box overflowY="scroll" bgColor="white" h="85%" w="100%" borderRadius={5}>
        {props.messages.map((mess) => 
          <Flex p={1} m={2}>
            <Text><span style={{ fontWeight: 700 }}>{mess.author}: </span>{mess.text}</Text>
          </Flex>
        )}
      </Box>
      <Flex gap={5}>
        <Input
          bgColor="white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          name="message"
          onKeyDown={handleKeyDown}
          maxLength={150}
        />
        <Button bgColor={secondary} onClick={handleSendMessage}>
          <Icon as={FiSend} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Chat;
