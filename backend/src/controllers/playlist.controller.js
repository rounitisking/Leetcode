import {db} from "../db/index.js"

export const createPlaylist = async (req, res) => {

            const userId = req.user.id;
            const {name , discription} = req.body

            try {

                if(!userId || !name || !discription){
                    return res.status(401).json({
                        success:false,
                        message:"user or name or discription not found in playlist controller"
                    })
                }
                const playlist = await db.playlist.create({
                    data:{
                        name,
                        discription,
                        userId
                    }
                })

                if(!playlist){
                    return res.status(401).json({
                        success:false,
                        message:"Playlist not created successfully"
                    })
                }
                return res.status(200).json({
                    success:true,
                    message:"Playlist created successfully",
                    playlist
                })
                    
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    success:false,
                    message:"Failed to create playlist",
                    error:error.message
                })
            }
}


export const getAllPlaylistDetails = async (req, res) => {

            const userId = req.user.id;
            const {playlistId} = req.params

            try {

                if(!userId || !playlistId){
                    return res.status(401).json({
                        success:false,
                        message:"user or playlistId not found in playlist controller"
                    })
                }

                const playlist = await db.playlist.findMany({
                    where:{
                        id:playlistId,
                        userId
                    },
                    include : {
                        problems : {
                            include : {
                                problem : true
                            }
                        }
                    }
                })

                if(!playlist){
                    return res.status(401).json({
                        success:false,
                        message:"Playlist not found"
                    })
                }

                return res.status(200).json({
                    success:true,
                    message:"Playlist details fetched successfully",
                    playlist
                })
                    
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    success:false,
                    message:"Failed to fetch playlist details",
                    error:error.message
                })
            }   
}

export const getAllPlaylistDetailsOfAUser = async (req, res) => {

            const userId = req.user.id;

            try {

                if(!userId){
                    return res.status(401).json({
                        success:false,
                        message:"user not found in playlist controller"
                    })
                }

                const playlist = await db.playlist.findMany({
                    where:{
                        userId
                    }
                })

                if(!playlist){
                    return res.status(401).json({
                        success:false,
                        message:"Playlist not found"
                    })
                }

                return res.status(200).json({
                    success:true,
                    message:"Playlist details fetched successfully",
                    playlist
                })
                    
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    success:false,
                    message:"Failed to fetch playlist details",
                    error:error.message
                })
            }   
}


export const addProblemToPlaylist = async (req, res) => {
        const {playlistId} = req.params
        const {problemIds} = req.body

        try {
            if(!playlistId || !Array.isArray(problemIds) || problemIds.length == 0){
                return res.status(401).json({
                    success:false,
                    message:"playlistId or problemIds not found in playlist controller"
                })
            }
    
            const playlist = await db.problemInPlaylist.createMany({
                data : problemIds.map((res)=>({
                    playlistId,
                    problemId : res,
                }))
            })
    
            if(!playlist){
                return res.status(401).json({
                    success:false,
                    message:"Playlist not found"
                })
            }
    
            return res.status(200).json({
                success:true,
                message:"Playlist details fetched successfully",
                playlist
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:"Failed to fetch playlist details",
                error:error.message
            })
        }
        

        
}


export const removeProblemFromPlaylist = async (req, res) => {


    const {playlistId} = req.params.id
    const {problemIds} = req.body

    if(!playlistId || !Array.isArray(problemIds) || problemIds.length == 0){
        return res.status(401).json({
            success:false,
            message:"playlistId or problemIds not found in playlist controller"
        })
    }

    try {
        const removeProblemPlaylist = await db.problemInPlaylist.deleteMany({
            where : {
                playlistId,
                problemId : {
                    in : problemIds
                }
            }
        })
        
        if(!removeProblemPlaylist){
            return res.status(401).json({
                success:false,
                message:"Problem not found in playlist"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Problem removed from playlist successfully",
            removeProblemPlaylist
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to remove problem from playlist",
            error:error.message
        })
    }
    
}


export const deletePlaylist = async (req, res) => {

    const playlistId = req.params.id

    if( !playlistId){
        return res.status(401).json({
            success:false,
            message:"playlistId not found in playlist controller"
        })
    }

    try {
        const deletePlaylist = await db.playlist.delete({
            where : {
                id:playlistId
            }
        })
        
        if(!deletePlaylist){
            return res.status(401).json({
                success:false,
                message:"Playlist not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Playlist deleted successfully",
            deletePlaylist
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to delete playlist",
            error:error.message
        })
    }


}