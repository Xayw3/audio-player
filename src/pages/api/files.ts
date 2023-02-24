import fs from 'fs';
import ffprobe from 'ffprobe';
import path from 'path';
import ffprobeStatic from 'ffprobe-static';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseFile } from 'music-metadata';
const { getAudioDurationInSeconds } = require("get-audio-duration");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const folderPath = './public/audio';
  const audioFiles = fs.readdirSync(folderPath);
  const data:any = [];

  for (let file of audioFiles) {
    const audioFilePath = path.join(folderPath, file);

    try {
      const duration = (await getAudioDurationInSeconds(audioFilePath)) | 0;
      const minutes = Math.floor(duration / 60) < 10 ? `0${Math.floor(duration / 60)}` : Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60) < 10 ? `0${Math.floor(duration % 60)}` : Math.floor(duration % 60);
      data.push({ name: file, duration: `${minutes}:${seconds}` });
    } catch (e) {
      console.error(e);
      res.send("500");
    }
  };

 res.status(200).json(data);
};

export default handler;