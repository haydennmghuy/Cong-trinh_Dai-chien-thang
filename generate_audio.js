const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
const fs = require("fs");
const path = require("path");

const vietnameseText = `Chiến thắng Phước Thành – Đòn phủ đầu chiến lược "Chiến tranh đặc biệt" của Mỹ ngụy.

Cách đây hơn 60 năm, đêm 17 rạng ngày 18 tháng 9 năm 1961, quân và dân ta đã làm nên chiến thắng Phước Thành vang dội. Đây là lần đầu tiên lực lượng vũ trang cách mạng tiến công và xóa sổ hoàn toàn một tỉnh lỵ của chính quyền Sài Gòn, tạo tiếng vang lớn trên chiến trường miền Nam.

Tỉnh Phước Thành được Ngô Đình Diệm thành lập ngày 22 tháng 10 năm 1956 theo Sắc lệnh 143, gồm ba quận Tân Uyên, Hiếu Liêm và Phú Giáo, với trung tâm tỉnh lỵ đặt tại Phước Vĩnh. Mục đích của Mỹ Diệm là xây dựng Phước Thành thành một tiểu khu quân sự mạnh, cùng với các cứ điểm Chân Thành, Bình Long, Đồng Xoài, Lộc Ninh, Phước Long tạo thành hệ thống phòng thủ liên hoàn bao vây chia cắt Chiến khu Đ.

Năm 1960, dưới sự lãnh đạo của Đảng, nhân dân miền Nam phát động cuộc Đồng Khởi rộng lớn, nhanh chóng đập tan bộ máy kìm kẹp của Mỹ ngụy ở cơ sở. Trước nguy cơ sụp đổ, Mỹ cho ra đời chiến lược "Chiến tranh đặc biệt" với kế hoạch bình định miền Nam trong vòng 18 tháng.

Tháng 9 năm 1961, Khu ủy và Bộ Tư lệnh Miền Đông quyết định tiến công vào tỉnh lỵ Phước Thành. Đồng chí Nguyễn Hữu Xuyến, Tư lệnh Quân khu, giữ chức Chỉ huy trưởng. Đồng chí Nguyễn Việt Hồng làm Chính ủy. Lực lượng tham chiến gồm Tiểu đoàn 800, Đại đội C260, phân đội đặc công, trung đội DKZ cùng lực lượng vũ trang địa phương tỉnh và các huyện.

Sau 1 giờ 30 phút chiến đấu oanh liệt, quân ta đã tiêu diệt và làm tan rã hoàn toàn lực lượng chiếm đóng gần 2000 tên, gồm 1 tiểu đoàn biệt động quân, 1 tiểu đoàn bảo an, 1 chi đội thiết giáp, 1 đại đội pháo 105 ly cùng nhiều đơn vị khác. Ta thu trên 400 súng các loại và rất nhiều quân trang quân dụng, giải thoát gần 300 tù chính trị.

Phát huy chiến thắng, 10 đồn bót địch trên đường Phước Sang đi Đồng Xoài hốt hoảng bỏ chạy. Các tuyến đường lên Phước Long và các huyện nam Chiến khu Đ được giải phóng hầu hết. Căn cứ Miền Đông được mở rộng và hình thành vững chắc.

Chiến thắng Phước Thành có ý nghĩa vô cùng to lớn. Lần đầu tiên lực lượng vũ trang ta đánh chiếm một tỉnh lỵ, đập tan bộ máy kìm kẹp cấp tỉnh của địch, báo hiệu sự phá sản của chiến lược Chiến tranh đặc biệt. Tướng Oét-mo-len trong hồi ký đã thừa nhận ý nghĩa của sự kiện này. Tài liệu mật Lầu Năm Góc cũng xác nhận đây là trận tiến công lớn nhất có tác dụng làm cho Sài Gòn nhốn nháo.

Ngày nay, Tượng đài Chiến thắng Phước Thành tọa lạc tại thị trấn Phước Vĩnh, huyện Phú Giáo, tỉnh Bình Dương. Công trình được xây dựng bằng đá hoa cương, cao 13 mét, trong khuôn viên rộng hơn 12 nghìn mét vuông. Đây là nơi sinh hoạt truyền thống, giáo dục tinh thần yêu nước cho thế hệ trẻ, mãi mãi là niềm tự hào của quân và dân cả nước.`;

const englishText = `The Phuoc Thanh Victory: A Decisive Blow Against America's Special War Strategy.

Over sixty years ago, on the night of September 17th to the morning of September 18th, 1961, the revolutionary armed forces of South Vietnam achieved a resounding victory at Phuoc Thanh. This was the first time they attacked and completely destroyed a provincial capital held by the Saigon regime, sending shockwaves throughout the southern battlefield.

Phuoc Thanh province was established on October 22nd, 1956, by the Ngo Dinh Diem government, comprising three districts: Tan Uyen, Hieu Liem, and Phu Giao, with its capital at Phuoc Vinh. The US-Diem strategy was to build Phuoc Thanh into a strong military sub-sector, forming a chain of fortifications to encircle and divide War Zone D.

In 1960, under the leadership of the Communist Party, the people of South Vietnam launched the Dong Khoi uprising, swiftly shattering the enemy's apparatus of control at the grassroots level. Facing potential collapse, the United States introduced its Special War strategy, aiming to pacify South Vietnam within eighteen months.

In September 1961, the Eastern Region Party Committee and Military Command decided to attack the provincial capital of Phuoc Thanh. Comrade Nguyen Huu Xuyen served as Commander-in-Chief, and Comrade Nguyen Viet Hong as Political Commissar. The attacking force included Battalion 800, Company C260, a sapper unit, a DKZ platoon, and provincial militia forces.

After just one hour and thirty minutes of fierce combat, the revolutionary forces destroyed the entire garrison of nearly two thousand enemy troops, including a ranger battalion, a security battalion, an armored squadron, and a 105-millimeter artillery company. They captured over four hundred weapons and liberated nearly three hundred political prisoners.

Following the victory, ten enemy outposts along the route from Phuoc Sang to Dong Xoai panicked and fled. Most of the southern areas of War Zone D were liberated, and the Eastern Region base area was expanded and firmly established.

The Phuoc Thanh Victory holds tremendous historical significance. For the first time, revolutionary forces captured a provincial capital, shattering the enemy's apparatus of oppression at the provincial level, and heralding the failure of America's Special War strategy. General Westmoreland himself acknowledged this event in his memoirs, and the Pentagon Papers confirmed it as the largest attack that caused panic in Saigon.

Today, the Phuoc Thanh Victory Monument stands in Phuoc Vinh town, Phu Giao district, Binh Duong province. Built of granite and standing thirteen meters tall within grounds spanning over twelve thousand square meters, it serves as a place of patriotic education and a source of enduring pride for the people of Vietnam.`;

async function generateAudio() {
  const voiceDir = path.join(__dirname, "Voice");
  if (!fs.existsSync(voiceDir)) {
    fs.mkdirSync(voiceDir, { recursive: true });
  }

  // Helper: generate audio using stream and pipe to file
  async function generateToFile(voice, format, text, outputPath) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, format);
    const { audioStream } = tts.toStream(text);
    const writable = fs.createWriteStream(outputPath);
    return new Promise((resolve, reject) => {
      audioStream.pipe(writable);
      writable.on("finish", () => resolve(outputPath));
      writable.on("error", reject);
      audioStream.on("error", reject);
    });
  }

  // Generate Vietnamese voice - HoaiMyNeural (formal, news-anchor style)
  console.log("Generating Vietnamese narration with vi-VN-HoaiMyNeural...");
  const viPath = path.join(voiceDir, "VietnameseVoice.mp3");
  await generateToFile("vi-VN-HoaiMyNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, vietnameseText, viPath);
  console.log("Vietnamese audio saved to:", viPath);

  // Generate English voice - AriaNeural (professional, formal)
  console.log("Generating English narration with en-US-AriaNeural...");
  const enPath = path.join(voiceDir, "EnglishVoice.mp3");
  await generateToFile("en-US-AriaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, englishText, enPath);
  console.log("English audio saved to:", enPath);

  console.log("Audio generation complete!");
}

generateAudio().catch(console.error);
