import { eq, inArray } from 'drizzle-orm';
import { db } from "../db/index";
import { rooms, roomMembers, users } from "../db/schema";

class RoomController{
    async getmyroom(req, res){
        try {
            const userId = Number(req.params.id)
            
            const myRooms = await db
            .select({roomId: roomMembers.roomId})
            .from(roomMembers)
            .where(eq(roomMembers.userId, userId))

            if(myRooms.length === 0){
                res.json([])
            }

            const roomIds = myRooms.map(r => r.roomId);

            const myRoomDetail = await db
                .select({
                    roomId: rooms.id,
                    roomName: rooms.name,
                    isGroup: rooms.isGroup,
                    memberId: users.id,
                    memberUsername: users.username,
                }).from(rooms)
                .innerJoin(roomMembers, eq(rooms.id, roomMembers.roomId))
                .innerJoin(users, eq(roomMembers.userId, users.id))
                .where(inArray(rooms.id, roomIds))

            const roomsMap = {}

            myRoomDetail.forEach((r)=>{
                if(!roomsMap[r.roomId]) {
                    roomsMap[r.roomId] = {
                        id: r.roomId,
                        name: r.roomName,
                        isGroup: r.isGroup,
                        members: []
                    }
                }
                roomsMap[r.roomId].members.push({
                    id: r.memberId,
                    username: r.memberUsername,
                    //avatar: r.avatar
                })
            })

            const finalRoomList = Object.values(roomsMap)
            res.json(finalRoomList)
        } catch (error) {
            console.log(error);
        }
    }
}

export const roomController = new RoomController()