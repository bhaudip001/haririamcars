import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function testHeicToJpg() {
  try {
    console.log('Downloading sample HEIC...');
    const res = await axios.get('https://github.com/alexey-lin/heic2any/raw/master/demo/sample.heic', { responseType: 'arraybuffer' });
    fs.writeFileSync('test.heic', res.data);
    console.log('Downloaded test.heic');

    console.log('Converting using FFmpeg...');
    ffmpeg('test.heic')
      .output('test.jpg')
      .on('end', () => {
        console.log('Successfully converted HEIC to JPG using FFmpeg!');
        process.exit(0);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err.message);
        process.exit(1);
      })
      .run();
  } catch (error) {
    console.error('Download error:', error.message);
  }
}

testHeicToJpg();
