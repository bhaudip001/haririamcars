import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function testImgBB() {
  try {
    // 1. Download a sample HEIC
    const heicRes = await axios.get('https://github.com/alexey-lin/heic2any/raw/master/demo/sample.heic', { responseType: 'arraybuffer' });
    fs.writeFileSync('sample.heic', heicRes.data);
    console.log('Downloaded sample.heic');

    // 2. Upload to ImgBB
    const formData = new FormData();
    formData.append('image', fs.createReadStream('sample.heic'));
    
    console.log('Uploading to ImgBB...');
    const res = await axios.post('https://api.imgbb.com/1/upload?key=e73a9ee89da796b3df7c8d188cd78392', formData, {
      headers: formData.getHeaders()
    });
    
    console.log('ImgBB Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testImgBB();
