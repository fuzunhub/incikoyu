# SON GÖRÜLME · üretim iş akışı (kullanıcının kalıcı talimatı)

Her bölüm iki aşamada üretilir. **İkinci aşama yalnızca kullanıcı bölüm videosunu açıkça onayladıktan sonra yapılır.**

## Aşama 1 · Bölüm videosu (onaya gönderilir)

1. `python3 seslendir.py --bolum N` ile replikleri üret (tek başına "Nine" uyarısına dikkat).
2. Gerekirse yeni efektleri `uretim/sfx/` altına ElevenLabs sound-generation ile üret (API anahtarında müzik izni yok).
3. `uretim/bolumNN_hazirla.py`: zaman çizelgesi (replik + efekt), `miks.uret()` ile `vediNN.js` ve `sesNN.wav`.
4. `uretim/sahneNN.js`: çekim listesi (`ortak.js` + `ciz.js` yardımcıları), `uretim/bolumNN.html`.
5. Kontrol kareleri: `BOLUM=N node kareler.js <klasör> t1 t2 ...`. İncele, düzelt.
6. Render: `node render.js N <süre>` (arka planda çalıştır), çıktı: `cikti/bolum-NN.mp4` ve `-paylasim.mp4`.
7. Senkron kontrolü: replik başlangıçlarını çapraz korelasyonla ölç (hedef < 0,05 sn).
8. `bolum-NN-paylasim.mp4` dosyasını kullanıcıya gönder, **onay iste**. Videonun başına kapak ekleme.

## Aşama 2 · Yayın paketi (yalnızca onaydan sonra, otomatik)

1. `uretim/paket.json` içine bölümün ayarlarını ekle (ad, kapak karesi zamanı, kanca cümlesi, story parçaları).
2. `node uretim/paketle.js N` → `yayin/bolum-NN/`:
   - `story.mp4`: 7 sn "yeni bölüm yayında" story'si
   - `kapak-tiktok.jpg`, `kapak-instagram.jpg` (1080×1920), `kapak-youtube.jpg` (1280×720)
3. `yayin/bolum-NN/aciklama.md`: Instagram, TikTok, YouTube açıklamaları + story metni (aşağıdaki şablon).
4. Hepsini kullanıcıya gönder, açıklamaları sohbete de yaz.

## Açıklama şablonu

- **Instagram:** 4-6 kısa satırlık birinci ağızdan kanca, `👁️ SON GÖRÜLME · N. Bölüm`, soru ile yorum çağrısı, takip çağrısı, ~15 hashtag (#songörülme ilk sırada).
- **TikTok:** 1-2 satır kanca + soru, 5-6 hashtag (#songörülme #korku #korkudizisi #fyp #keşfet …).
- **YouTube Shorts:** başlık (≤ 70 karakter, "| SON GÖRÜLME N. Bölüm" ile biter), 2-3 satır açıklama, #shorts dahil 3-5 hashtag, etiket listesi.
- **Story metni:** tek satır kanca + "N. bölüm profilde".
- Spoiler verme: cliffhanger'ı anlatma, sadece kancayı ver.
