import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import {getAudioDurationInSeconds} from 'get-audio-duration'
// const { getAudioDurationInSeconds } = require("get-audio-duration");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const folderPath = './src/audio';
  const audioFiles = fs.readdirSync(folderPath);
  const data:any = [];

  try {
    for (let file of audioFiles) {
      const audioFilePath = path.join(folderPath, file);
      const duration = (await getAudioDurationInSeconds(audioFilePath)) | 0;
      const minutes = Math.floor(duration / 60) < 10 ? `0${Math.floor(duration / 60)}` : Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60) < 10 ? `0${Math.floor(duration % 60)}` : Math.floor(duration % 60);
      data.push({ name: file, duration: `${minutes}:${seconds}` });
    };
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error reading audio files");
  }
};

export default handler;