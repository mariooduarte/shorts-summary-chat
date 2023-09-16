import fs from "fs"
import wav from "node-wav"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"

export const convert = (videoId) =>
  new Promise((resolve, reject) => {
    const filePath = `./tmp/${videoId}.mp4`
    const outputPath = filePath.replace(".mp4", ".wav")

    console.log("Convertendo o vídeo...")

    ffmpeg.setFfmpegPath(ffmpegStatic)
    ffmpeg()
      .input(filePath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        const file = fs.readFileSync(outputPath)
        const fileDecoded = wav.decode(file)

        const audioData = fileDecoded.channelData[0]
        const floatArray = new Float32Array(audioData)

        console.log("Video convertido com sucesso!")

        fs.unlinkSync(filePath)
        fs.unlinkSync(outputPath)
        resolve(floatArray)
      })
      .on("error", (error) => {
        console.log("Erro ao converter o vídeo", error)
        fs.unlinkSync(filePath)
        fs.unlinkSync(outputPath)
        reject(error)
      })
      .save(outputPath)
  })