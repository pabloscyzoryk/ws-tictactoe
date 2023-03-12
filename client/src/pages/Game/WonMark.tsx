import { Box, ChakraProps } from "@chakra-ui/react";
import { tertiary } from "../../pallette";

interface WonMarkI {
  wonConditions: number[];
}

const WonMark = (props: WonMarkI) => {
  let style: ChakraProps;

  const winningPatterns = [
    // horizontal
    /* 0 */ [0, 1, 2],
    /* 1 */ [3, 4, 5],
    /* 2 */ [6, 7, 8],

    // vertical
    /* 3 */ [0, 3, 6],
    /* 4 */ [1, 4, 7],
    /* 5 */ [2, 5, 8],

    // diagonal
    /* 6 */ [0, 4, 8],
    /* 7 */ [2, 4, 6],
  ];

  const patternIndex = winningPatterns.findIndex((pattern) =>
    props.wonConditions.every((cell) => pattern.includes(cell))
  );

  switch (patternIndex) {
    case 0:
      style = {
        top: `15%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95%",
      };
      break;
    case 1:
      style = {
        top: `50%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95%",
      };
      break;
    case 2:
      style = {
        top: `85%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95%",
      };
      break;
    case 3:
      style = {
        top: "50%",
        left: `15%`,
        transform: "translate(-50%, -50%)",
        height: "95%",
      };
      break;
    case 4:
      style = {
        top: "50%",
        left: `50%`,
        transform: "translate(-50%, -50%)",
        height: "95%",
      };
      break;
    case 5:
      style = {
        top: "50%",
        left: `85%`,
        transform: "translate(-50%, -50%)",
        height: "95%",
      };
      break;
    case 6:
      style = {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(45deg)",
        width: "115%",
      };
      break;
    case 7:
      style = {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-45deg)",
        width: "115%",
      };
      break;
    default:
      style = {};
      break;
  }

  return (
    <Box
      sx={style}
      borderRadius={5}
      position="absolute"
      border={`solid 3px ${tertiary}`}
      bgColor={tertiary}
      w={0}
    />
  );
};

export default WonMark;
