import { db } from "../libs/db.js"

export const getPlayAllListDetails = async (req,res) => {


}
export const getPlayListDetails = async (req,res) => {}
export const createPlayList = async (req,res) => {
    try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playList = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playList,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }

}
export const addProblemToPlaylist = async (req,res) => {}
export const deletePlayList = async (req,res) => {}
export const removeProblemFromPlaylist = async (req,res) => {}