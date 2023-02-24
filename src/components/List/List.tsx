import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import styles from './list.module.scss';

type Audio = {
  name: string,
  duration: string
}

const List = () => {
  const [data, setData] = useState<Audio[]>([]);

  const baseUrl = process.env.BASE_URL;

  const getData = async () => {
    try {
      const audio: any = await axios.get(`${baseUrl}/api/files`);
      setData(audio.data)
    } catch (error) {
      console.log(error)
    };
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.audio_wrapper}>
      {
        data.map(({ name, duration }, i) => (
          <div className={styles.audio_info} key={i}>
            <div>
              <p className={styles.audio_name}>{name.split('_')[0]}</p>
              <p className={styles.audio_track}>{name.split('_')[1].split('.')[0]}</p>
            </div>
            <p className={styles.audio_duration}>{duration}</p>
          </div>
        ))
      }
    </div>
  );
};

export default List;