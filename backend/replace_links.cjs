const fs = require('fs');
const path = require('path');

const newLinks = [
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783674109/IMG_5513_zdktl8.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783674021/IMG_5511_g5wtwz.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673977/IMG_5507_j18xsw.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673836/IMG_5514_pmarqf.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673823/IMG_5502_gfptsa.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673477/IMG_5505_vtjbjl.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673398/IMG_5504_n0ncmo.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673356/IMG_5510_lfmf6a.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783673032/IMG_5503_dyr71m.mp4",
  "https://res.cloudinary.com/urhqjeae/video/upload/v1783672957/IMG_5509_yv5enm.mp4"
];

// Map of IMG_XXXX to new link
const linkMap = {};
newLinks.forEach(link => {
  const match = link.match(/(IMG_\d+)/);
  if (match) {
    linkMap[match[1]] = link;
  }
});

const filesToUpdate = [
  "e:\\hariram motor\\website\\haririamcars\\frontend\\src\\components\\CustomerReviewReels.jsx",
  "e:\\hariram motor\\website\\haririamcars\\frontend\\src\\components\\CustomerDeliveryReels.jsx",
  "e:\\hariram motor\\website\\haririamcars\\frontend\\src\\components\\client\\DeliveryReelClient.jsx"
];

let filesModified = 0;

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Replace all old links with new links based on IMG_XXXX
    content = content.replace(/https:\/\/res\.cloudinary\.com\/dvo48lu7g\/video\/upload\/[^\s'"]+(IMG_\d+)[^\s'"]+/g, (match, imgId) => {
      if (linkMap[imgId]) {
        hasChanges = true;
        // Keep the q_auto,f_auto if it was there? Actually new links are direct, we can inject q_auto,f_auto
        const newUrl = linkMap[imgId].replace('/upload/', '/upload/q_auto,f_auto/');
        return newUrl;
      }
      return match;
    });

    if (hasChanges) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${path.basename(file)}`);
      filesModified++;
    }
  }
});

console.log(`Done. Updated ${filesModified} files.`);
