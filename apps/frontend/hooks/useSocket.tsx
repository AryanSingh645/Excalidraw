"use client"
import {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {SOCKET_URL} from "@repo/common/constants"

interface SocketContextType {
    socket: WebSocket | null,
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
}


const SocketContext = createContext<SocketContextType>({
    socket : null,
    setSocket : () => {}
})

export const SocketProvider = ({children} : {children : ReactNode}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token")
        const tempSocketUrl = SOCKET_URL + `?token=${token}`

        const ws = new WebSocket(tempSocketUrl);

        ws.onopen = () => {
            console.log("ws.onopen() get called.")
            setSocket(ws)
        }

        ws.onmessage = (event) => {
            console.log(event)
        }

        ws.onclose = () => {
            console.log("ws.onclose() get called.")
            setSocket(null)
        }

        return () => {
            console.log("side effects cleaned...")
            ws.close()
        }
    }, [])

    useEffect(() => {
        console.log(socket)
    }, [socket])

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    )

}

export const useSocket = () => {
    return useContext(SocketContext)
}