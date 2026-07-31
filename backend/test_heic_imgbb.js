import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function testImgBB() {
  try {
    console.log('Downloading sample HEIC...');
    const heicRes = await axios.get('https://filesamples.com/samples/image/heic/sample1.heic', { responseType: 'arraybuffer' });
    fs.writeFileSync('sample1.heic', heicRes.data);
    
    console.log('Uploading to ImgBB...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream('sample1.heic'));
    
    const res = await axios.post('https://api.imgbb.com/1/upload?key=e73a9ee89da796b3df7c8d188cd78392', formData, {
      headers: formData.getHeaders()
    });
    
    console.log('ImgBB Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testImgBB();
