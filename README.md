# İnciland

Fuzun Games'in su altı eşleştirme bulmacası. Büyük İnci 10.000 taneye bölündü; her bölüm bir taneyi geri getirir. Deniz canlılarını kaydır, üçlü eşleştir, Solgunluğun kararttığı denizleri yeniden renklendir.

**Oyna:** https://fuzunhub.github.io/incikoyu/

## Telefona kurmak

- **Android (Chrome):** adresi aç → ⋮ menü → *Uygulamayı yükle*
- **iPhone (Safari):** Paylaş → *Ana Ekrana Ekle*

İlk açılıştan sonra internetsiz de çalışır.

## Oyunda neler var

- **400 bölüm, 4 diyar** (her diyar 100 bölüm, haritada ayrı sayfa)
  - Diyar 1 · Kumsal Sığlığı: kum, kaya, özel objeler
  - Diyar 2 · Balıkçı Ağları: ağa takılan canlıları kurtar
  - Diyar 3 · Akıntı Kanalları: kayan satırlar ve şekilli tahtalar
  - Diyar 4 · İstiridye Yatağı: kapalı istiridyeler; yanında iki eşleşme yapınca açılır, içinden inci çıkar
  - Diyar 5 · Yavru Yuvası: yakında
- **İnci Tanesi sayacı:** her bitirilen bölüm 10.000 taneden birini geri getirir.
- **Bölgeler:** 20 bölümlük her bölge solgun başlar; bitince renklenir ve bölge sandığı açılır (inci, can, kabarcık bombası).
- **Dede Kabuk'un hikayesi:** ilk girişte açılış hikayesi; Ayarlar'dan tekrar izlenebilir.
- **Bekçiler:** her diyarın 100. bölümünde canı olan bir bekçi (Kum Yengeci, Düğümcü Yengeç, Hızlı Uskumru Sürüsü, Dev İstiridye). Eşleştirdiğin her canlı ona vurur; birkaç hamlede bir saldırır (kaya atar, ağ atar, satırları kaydırır). Yenilince kurtulur.
- **Özel bölümler:** her 10 bölümde bir sırayla: *Hazine* (kaybetmek yok, topladığın her canlı bir inci), *Bulmaca* (tahta hep aynı, 3 hamlede çöz, can gitmez; beklersen ipucu gelir), *Kurtarma* (ağdaki yavruları kurtar).
- **Özel objeler:** dalga (4'lü), kabarcık bombası (L/T), yunus (2×2), inci girdabı (5'li). Kendi renkleriyle eşleşince patlarlar; kaydırdığında da (eşleşme olsa da olmasa da) her zaman görevlerini yaparlar. Satın alınanlarla oyunda oluşturulanlar aynı çalışır. İki özel objeyi birbirine kaydırınca birleşik patlama olur.
- **İnci harcama:** bölüm öncesi güçlendiriciler (dalga, kabarcık, yunus, girdap, +3 hamle) ve oyun içi aletler: Olta (yukarıdan misina iner, tek kareyi çeker), Kılıçbalığı (bir satırı keser), Gayzer (bir sütunu fışkırtır), Gelgit (tahtadaki her şeyin yerini değiştirir).
- **İnci Sarayı:** incilerle 10 parça kurulur (zemin, sütunlar, kubbe, kemer, bahçe, kuleler, fenerler, çeşme, inci taç). Kurtarılan bekçiler sarayda yüzer. **Hikaye Kitabı**'ndan izlenen sahneler tekrar açılır.
- **Yavru balık:** besle, büyüt; 10 aşama (Yavru'dan Işık Taşıyıcı'ya), her aşama yeni bir avantaj ve görünüm verir. Adını sen koyarsın.
- **Günlük Dalış**, **Altın İnci** meydan okuması (5 altın inci = **Altın Sandık**: 400 inci, 2 can, 3 bedava güçlendirici), **Resif** istasyonları ve **Deniz ansiklopedisi** kartları.
- Uyarlanabilir müzik (haritada dolu, oyunda kısık), dokunmatik titreşim, iPhone çentik ve tam ekran desteği.

## Yol haritası

Oyun 10.000 bölümlük bir destan olarak tasarlandı: 10 deniz, her denizde 10 diyar. Yeni diyarlar önce haftada bir, sonra ayda bir eklenir. Sıradaki işler: haftalık yeni diyarlar (Yavru Yuvası, Kabarcık Bahçesi, Mürekkep Koyu...).

## Bu depo

Bu depo oyunun yayındaki sürümünü tutar (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`). GitHub Pages `gh-pages` dalından yayınlar. Bölümler numaradan üretilir; hamle sayıları bir bot ile ayarlanır.

## Son güncellemeler

- Düzeltme: "Sonraki bölüm" penceresinde Kapat artık haritaya döner
- Altın Sandık: altın inciler artık birikiyor ve 5 tanesiyle sandık açılıyor
- Bulmaca hedefleri adil hale getirildi (bulunabilir yollar) ve ipucu eklendi
- Aletlere yeni isimler (Olta, Kılıçbalığı, Gayzer) ve dördüncü alet Gelgit; Olta'ya çekme animasyonu
- Özel objeler hem kendi renkleriyle eşleşince hem de herhangi bir yöne kaydırınca çalışıyor; 400 bölümün hamleleri buna göre yeniden ayarlandı
- Diyar 4 · İstiridye Yatağı (301–400), Dev İstiridye bekçisi
- İnci Sarayı, Hikaye Kitabı ve yavru balığın 10 aşaması
- Özel bölümler: hazine, bulmaca ve kurtarma
- Bekçi savaşları: 100, 200 ve 300. bölümlerde bekçiler, saldırıları ve kurtarma sahnesi
- 300 bölüm ve diyar sayfaları; diyar kapıları, "yakında" duvarı
- İncilerle güçlendirici ve oyun içi aletler
- Solgun başlayan bölgeler, bölge canlanma sahnesi ve sandık
- İnci Tanesi sayacı ve Dede Kabuk açılış hikayesi
- Giriş ekranında Oyna her zaman haritayı açar
- Daha hızlı bölüm girişi, yeni İnciland logosu ve simgesi

© Fuzun Games
