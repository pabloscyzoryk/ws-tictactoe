import { useEffect } from 'react';
import { socketDisconnect, isConnected, socketConnect } from '../utils/socket';

const useDisconnect = () => {
    if (!isConnected()) { 
        socketConnect() 
    }

    useEffect(() => {
        return () => {
            socketDisconnect();
        }
    }, [socketConnect]);
}

export default useDisconnect;