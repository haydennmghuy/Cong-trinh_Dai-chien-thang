const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const googleTTS = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Vietnamese text
const vietnameseText = `Cách đây hơn sáu mươi năm, đêm mười bảy rạng ngày mười tám tháng chín năm một ngàn chín trăm sáu mươi mốt, quân và dân ta đã làm nên chiến thắng Phước Thành vang dội. Chiến thắng đó là nỗi kinh hoàng của ngụy quân ngụy quyền lúc bấy giờ, là một tin sét đánh đối với Chính phủ Ken nơ đi và Hội đồng An ninh quốc gia Mỹ.

Tướng Oét mo len trong hồi ký Một quân nhân tường trình đã thú nhận: Mùa thu năm một ngàn chín trăm sáu mươi mốt đã chứng kiến một bước đầu tiên họ tạm thời chiếm được tỉnh lỵ Phước Thành. Tài liệu mật Lầu Năm Góc của Mỹ cũng xác nhận: Trận tiến công lớn nhất có tác dụng làm cho Sài Gòn nhốn nháo.

Phước Thành trước đây là một tỉnh thuộc miền Đông Nam Bộ. Ngày hai mươi hai tháng mười năm một ngàn chín trăm năm mươi sáu, Ngô Đình Diệm ban hành Sắc lệnh một bốn ba thành lập tỉnh Phước Thành gồm ba quận Tân Uyên, Hiếu Liêm và Phú Giáo, trung tâm tỉnh lỵ đặt tại Phước Vĩnh.

Trận đánh bắt đầu lúc một giờ đêm mười bảy rạng ngày mười tám tháng chín năm một ngàn chín trăm sáu mươi mốt. Sau một giờ ba mươi phút chiến đấu dũng cảm, Tiểu đoàn tám trăm cùng lực lượng địa phương đã tiêu diệt và làm tan rã hoàn toàn gần hai ngàn quân địch, thu trên bốn trăm súng các loại, giải thoát gần ba trăm tù chính trị.

Chiến thắng Phước Thành thực sự là tiếng còi báo hiệu sự phá sản của chiến lược Chiến tranh đặc biệt của đế quốc Mỹ áp dụng tại Việt Nam. Chiến thắng này mãi mãi là niềm tự hào của quân và dân cả nước.`;

// English text
const englishText = `Over sixty years ago, on the night of September 17th to the morning of September 18th, 1961, our armed forces achieved the resounding Phuoc Thanh Victory. This victory was a nightmare for the puppet army and government, a bolt from the blue for the Kennedy administration and the US National Security Council.

General Westmoreland admitted in his memoirs: "The autumn of 1961 witnessed the first step when they temporarily captured the Phuoc Thanh provincial capital." The Pentagon Papers also confirmed this was the largest attack that caused panic in Saigon.

Phuoc Thanh was previously a province in the East of South Vietnam. On October 22nd, 1956, Ngo Dinh Diem issued Decree 143/NV establishing Phuoc Thanh province comprising three districts: Tan Uyen, Hieu Liem, and Phu Giao, with the provincial capital at Phuoc Vinh.

The battle began at 1 AM on the night of September 17th to the morning of September 18th, 1961. After 1 hour and 30 minutes of fierce combat, Battalion 800 and local forces completely destroyed and dispersed nearly 2,000 enemy troops, captured over 400 weapons, and liberated nearly 300 political prisoners.

The Phuoc Thanh Victory truly signaled the bankruptcy of the American imperialists' "Special War" strategy applied in Vietnam. This victory remains a source of everlasting pride for the people of the entire nation.`;

// Helper to download from URL
function downloadUrl(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: Status Code ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Generate a chunk with Edge TTS
async function generateEdgeChunk(voice, format, text, outputPath) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, format);
  const { audioStream } = tts.toStream(text);
  if (!audioStream) {
    throw new Error("No audioStream returned");
  }
  const writable = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    let bytes = 0;
    audioStream.on('data', (c) => {
      bytes += c.length;
      writable.write(c);
    });
    audioStream.on('end', () => {
      writable.end(() => {
        if (bytes === 0) {
          reject(new Error("Zero bytes written"));
        } else {
          resolve(outputPath);
        }
      });
    });
    audioStream.on('error', (err) => {
      writable.end();
      reject(err);
    });
  });
}

// Main generation function
async function generateAudio() {
  const voiceDir = path.join(__dirname, 'Voice');
  if (!fs.existsSync(voiceDir)) {
    fs.mkdirSync(voiceDir, { recursive: true });
  }

  // Define language tasks
  const tasks = [
    {
      lang: 'vi',
      voice: 'vi-VN-HoaiMyNeural',
      format: OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
      text: vietnameseText,
      fileName: 'VietnameseVoice.mp3'
    },
    {
      lang: 'en',
      voice: 'en-US-AriaNeural',
      format: OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
      text: englishText,
      fileName: 'EnglishVoice.mp3'
    }
  ];

  for (const t of tasks) {
    console.log(`\n=== Generating ${t.fileName} (${t.lang.toUpperCase()}) ===`);
    const chunks = t.text.split('\n\n').filter(c => c.trim());
    const tempFiles = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      const tempPath = path.join(voiceDir, `_temp_${t.lang}_${i}.mp3`);
      console.log(`Chunk ${i+1}/${chunks.length} (${chunk.length} chars)...`);

      // Try Edge TTS first
      let success = false;
      try {
        console.log(`  Trying Edge Neural TTS (${t.voice})...`);
        await generateEdgeChunk(t.voice, t.format, chunk, tempPath);
        const size = fs.statSync(tempPath).size;
        console.log(`  -> SUCCESS (Edge): ${size} bytes`);
        success = true;
      } catch (err) {
        console.log(`  -> FAILED (Edge): ${err.message}`);
      }

      // Fallback to Google Translate TTS
      if (!success) {
        try {
          console.log(`  Falling back to Google Translate TTS (${t.lang})...`);
          const url = googleTTS.getAudioUrl(chunk, {
            lang: t.lang,
            slow: false,
            host: 'https://translate.google.com'
          });
          await downloadUrl(url, tempPath);
          const size = fs.statSync(tempPath).size;
          console.log(`  -> SUCCESS (Google): ${size} bytes`);
          success = true;
        } catch (err) {
          console.error(`  -> FATAL: Google fallback failed: ${err.message}`);
        }
      }

      if (success) {
        tempFiles.push(tempPath);
      }

      // Delay to prevent rate-limiting
      await new Promise(r => setTimeout(r, 1500));
    }

    // Combine chunks
    if (tempFiles.length === chunks.length) {
      const finalPath = path.join(voiceDir, t.fileName);
      console.log(`Combining all chunks into ${t.fileName}...`);
      const buffers = tempFiles.map(file => fs.readFileSync(file));
      fs.writeFileSync(finalPath, Buffer.concat(buffers));
      
      // Cleanup temp files
      for (const file of tempFiles) {
        try { fs.unlinkSync(file); } catch (e) {}
      }
      console.log(`Completed ${t.fileName}! Size: ${fs.statSync(finalPath).size} bytes`);
    } else {
      console.error(`ERROR: Could not generate all chunks for ${t.fileName}`);
    }
  }

  console.log('\nAll audio generation tasks complete!');
}

generateAudio().catch(console.error);
