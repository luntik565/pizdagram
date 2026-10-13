class MediaController{
    async MessageMedia(req, res){
        try {
            if(!req.file){
                return res.status(400).json({ error: 'Файл сообщения не выбран' })
            }

            const fileurl = `http://localhost:8000/uploads/messages/${req.file.filename}`
            return res.json({ url: fileurl })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

export const mediaControll = new MediaController()