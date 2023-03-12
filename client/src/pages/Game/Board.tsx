import { BoardT } from "../../types/BoardT";
import { Box, Grid } from "@chakra-ui/react";
import { primary, secondary, tertiary } from "../../pallette";
import Tile from "./Tile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { socketEmit } from '../../utils/socket';

interface BoardI {
    boardState: BoardT;
}

const Board = (props: BoardI) => {

    const { amIX, isXMove } = useSelector((state: RootState) => state.game);
    const { id: roomId } = useParams();

    const handleClick = (index: number) => {
        if(!props.boardState[index] && ((isXMove && amIX) || (!isXMove && !amIX))) {
  
          socketEmit('move', roomId, index);
        }
    }

    return (
        <Grid 
         templateColumns="repeat(3, 1fr)"
         templateRows="repeat(3, 1fr)"
         width={400}
         gap={5}
        >
          {
            props.boardState.map((tile, index) =>        
                <Tile index={index} key={index} value={tile} handleClick={() => handleClick(index)} />     
            )
          }  
        </Grid>
    )
}

export default Board;