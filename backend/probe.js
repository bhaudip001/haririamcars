import path from 'path';
import { fileURLToPath } from 'url';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../frontend/public/IMG_5512.MOV');

ffmpeg.ffprobe(inputPath, function(err, metadata) {
    if (err) {
        console.error(err);
    } else {
        const stream = metadata.streams.find(s => s.codec_type === 'video');
        console.log(`Width: ${stream.width}, Height: ${stream.height}`);
    }
});
