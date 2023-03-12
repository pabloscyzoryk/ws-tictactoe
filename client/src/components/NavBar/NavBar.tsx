import {
  Flex,
  Box,
  Text,
  Heading,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  ModalCloseButton,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { primary, secondary, tertiary } from "../../pallette";
import { AiFillEdit } from "react-icons/ai/";
import { useRef, useState } from "react";
import { setNickname } from "../../redux/game";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { nickname } = useSelector((state: RootState) => state.game);
  const [newNickname, setNewNickname] = useState<string>(nickname);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const initialRef = useRef(null);

  const handleSave = () => {
    dispatch(setNickname(newNickname));
    onClose();
  };

  return (
    <>
      <Flex
        bgColor={tertiary}
        align="center"
        justify="space-between"
        pos="fixed"
        w="100vw"
        h={50}
        as="nav"
      >
        <Heading color={primary} mx={50}>
          <Link to='/'>
            Tic Tac Toe        
          </Link>
        </Heading>

        <Flex mr="20%" gap={5} justify="center">
          <Text fontSize={20} color={primary}>
            Hello, {nickname}{" "}
          </Text>
          <Icon
            cursor="pointer"
            onClick={onOpen}
            fontSize={25}
            color={primary}
            as={AiFillEdit}
          />
        </Flex>
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change nickname</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>New Nickname</FormLabel>
              <Input maxLength={15} value={newNickname} type="text" onChange={e => { setNewNickname(e.target.value) }} ref={initialRef} placeholder="nickname"  />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSave} bgColor={secondary} mr={3}>
              Save
            </Button>

            <Button onClick={() => { onClose() ; setNewNickname(nickname) }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NavBar;
