import { secondary, tertiary, primary } from "../../pallette";
import { Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface TileI {
    value: string | null;
    handleClick: MouseEventHandler<HTMLDivElement>;
    index: number;
}

const Tile = (props: TileI) => {

    const { amIX, isXMove, isGameFinished } = useSelector((state: RootState) => state.game);
    const [ canClick, setCanClick ] = useState(true);

    useEffect(() => {
        setCanClick( !isGameFinished && !props.value && ((isXMove && amIX) || (!isXMove && !amIX)));
    }, [isGameFinished, props]);
    
    return (<>
    
        { canClick &&
            <Flex justify='center' align='center' cursor={'pointer'} onClick={props.handleClick} w={120} h={120} borderRadius={5} bgColor={secondary}>
                <Text fontSize={65}>{props.value}</Text>
            </Flex>
        }

        { !canClick &&
            <Flex justify='center' align='center' cursor={'default'} w={120} h={120} borderRadius={5} bgColor={secondary}>
                <Text fontSize={65}>{props.value}</Text>
            </Flex>
        }
    
    
    </>)
}

export default Tile;