import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import {JOIN_ROOM, LEAVE_ROOM, CHAT} from "@repo/common/constants"
import {prisma} from "@repo/db/client"

interface User {
  ws : WebSocket,
  userId: string,
  rooms: string[]
}

const wss = new WebSocketServer({ port: 8080 });
const users : User[] = [];

const checkUser = (token : string) : string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if(!decoded || (!(decoded as JwtPayload).userId)){
        return null;
    }
    return (decoded as JwtPayload).userId
  } catch (error) {
    return null
  }
}

wss.on('connection', function connection(ws, request) {
  
  const url = request.url
  
  if(!url){
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1])
  const token = queryParams.get("token") ?? ""

  const userId = checkUser(token)
  if(!userId){
    ws.close()
    return;
  }

  users.push({
    userId: userId,
    rooms: [],
    ws
  })

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    try {
      const parsedData = JSON.parse((data as unknown as string))
      
      if(parsedData.type === JOIN_ROOM){
        const user = users.find(x => x.ws === ws)
        user?.rooms.push(parsedData.roomId)
      }
  
      if(parsedData.type === LEAVE_ROOM){
        const user = users.find(x => x.userId === userId)
        if(!user){
          return;
        }
  
        user.rooms = user.rooms.filter(r => r !== parsedData.roomId)
      }
  
      if(parsedData.type === CHAT){
  
        // TODO: check if roomId exists or not
        // TODO: eventually message will be x, y coordinates then do message validation too
        // TODO: if user is allowed to message in any roomId or not
        // TODO: database persistence here via a queue because the db call here will slow down the ws server
  
        
        users.forEach(user => {
          if(user.rooms.includes(parsedData.roomId)){
            user.ws.send(JSON.stringify({
              message: parsedData.message,
              roomId: parsedData.roomId,
              type: CHAT
            }))
          }
        })
        
        await prisma.chat.create({
          data: {
            message: parsedData.message,
            roomId: Number(parsedData.roomId),
            userId
          }
        })
      }
    } catch (error) {
      console.log("Error", error)
    }

  });

  ws.send('userId:' + userId);
});