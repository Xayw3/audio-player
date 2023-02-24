import fs from 'fs';
import ffprobe from 'ffprobe';
import path from 'path';
import ffprobeStatic from 'ffprobe-static';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseFile } from 'music-metadata';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const folderPath = './src/audio';
  const audioFiles = fs.readdirSync(folderPath);
  const data:any = [];

  for (let file of audioFiles) {
    const audioFilePath = path.join(folderPath, file);

    const info = await ffprobe(audioFilePath, { path: ffprobeStatic.path });
    const durationSeconds = info.streams[0].duration;

    parseFile(audioFilePath)
      .then((metadata: any) => {
        const durationMinutes = metadata.format.duration ? metadata.format.duration / 60 : 0
        return data.push({ name: file, duration: durationMinutes?.toFixed(2) });
    }) 
      .catch((err: any) => {
        console.error(err.message);
    });

  };
  console.log(data) 

 res.status(200).json(data);
};

export default handler;