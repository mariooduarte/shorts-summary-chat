import ytdl from "ytdl-core"
import fs from "fs"

export const download = (videoId) =>
  new Promise((resolve, reject) => {
    const tmpFolder = "./tmp"
    if (!fs.existsSync(tmpFolder)) {
      fs.mkdirSync(tmpFolder)
    }

    const videoURL = "https://www.youtube.com/shorts/" + videoId
    console.log("Realizando o dowload do vídeo:", videoId)

    ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
      .on("end", () => {
        console.log("Download do vídeo finalizado.")
        resolve()
      })
      .on("error", (error) => {
        console.log(
          "Não foi possível fazer o download do vídeo. Detalhes do erro:",
          error
        )
        reject(error)
      })
      .pipe(fs.createWriteStream(`./tmp/${videoId}.mp4`))
  })
