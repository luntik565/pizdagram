import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { users, messages, rooms, roomMembers } from "../db/schema";

export default function initChat(io) {
    io.on('connection', (socket) => {
    socket.on('join', async ({ room, Id }) => {
    socket.join(room);
    try {
        const [existingRoom] = await db.select().from(rooms).where(eq(rooms.id, room));

        // Если комнаты нет в базе — инициализируем её и ВСЕХ её участников
        if (!existingRoom) {
            // Создаем саму комнату
            await db.insert(rooms).values({
                id: room, // "13_14"
                name: `чат ${room}`,
                isGroup: false
            });

            // НАДЕЖНЫЙ СПОСОБ: Просто бьем строку "13_14" на массив [13, 14]
            // Нам даже не важно, кто из них текущий пользователь, мы просто берем оба ID из названия комнаты
            const userIds = room.split('_').map(Number).filter(id => !isNaN(id));

            // Формируем массив объектов для вставки в room_members
            const membersToInsert = userIds.map(userId => ({
                userId: userId,
                roomId: room
            }));

            // Если в массиве есть пользователи, записываем их в таблицу связей
            if (membersToInsert.length > 0) {
                await db.insert(roomMembers).values(membersToInsert);
            }
        }

        // 2. Получаем историю сообщений
        const history = await db.select()
            .from(messages)
            .where(eq(messages.roomId, room))
            .orderBy(asc(messages.createdAt));

        // 3. Подтягиваем данные участников из таблицы связей
        const membersData = await db.select({
            id: users.id,
            username: users.username
        })
        .from(roomMembers)
        .innerJoin(users, eq(roomMembers.userId, users.id))
        .where(eq(roomMembers.roomId, room));

        const roomInfo = {
            id: room,
            isGroup: room.includes('group'),
            members: membersData // Передаем на фронтенд список участников
        };

        // Отправляем всё на клиент
        socket.emit('chatHistory', { history, roomInfo });
            } catch (error) {
                console.error("Ошибка в событии join:", error);
            }
        });

        // 2. Быстрая отправка сообщения
        socket.on('messageSend', async ({ txt, uId, rId }) => {
            try {
                // Комната уже 100% создана на этапе join, поэтому просто сохраняем сообщение в базу
                const [newMessage] = await db.insert(messages).values({
                    userId: Number(uId),
                    roomId: rId,
                    massage: txt
                }).returning();

                // Отправляем сообщение всем подключенным к сокет-комнате
                io.to(rId).emit('newMessage', newMessage);

            } catch (error) {
                console.error("Ошибка в событии messageSend:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log('off');
        });
    });
}