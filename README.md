
# Racing Championship

## Proje Hakkında

Racing Championship, modern web teknolojileri kullanılarak geliştirilmiş, heyecan verici bir araba yarışı simülasyon oyunudur. Vue.js framework'ü üzerine inşa edilen bu proje, kullanıcılara interaktif ve görsel açıdan etkileyici bir yarış deneyimi sunmayı amaçlamaktadır.

## Özellikler

- **5 Yüksek Riskli Şampiyona Yarışı**: Oyuncular, her biri benzersiz zorluklara sahip 5 farklı yarışta rekabet edebilir.
- **12 Elit Yarış Arabası**: Çeşitli performans özelliklerine sahip 12 farklı araba arasından seçim yapabilirsiniz.
- **Dinamik Hızlanma Bölgeleri**: Stratejik olarak yerleştirilmiş hızlanma bölgeleri, yarış dinamiklerini değiştirir.
- **Hassas Geçiş Sistemi**: Rakiplerinizi geçmek için becerilerinizi kullanın.
- **Gerçek Zamanlı Performans Analitiği**: Yarış sırasında anlık performans verilerinizi takip edin.

## Teknoloji Yığını

- **Frontend**: Nuxt
- **State Yönetimi**: Vuex
- **Stil**: SCSS
- **Animasyonlar**: CSS Animations, Vue Transitions
- **Ses Efektleri**: Web Audio API

## Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. Repoyu klonlayın:
   ```
   git clone https://github.com/oguzhan18/racing-championship
   ```

2. Proje dizinine gidin:
   ```
   cd racing-championship
   ```

3. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

4. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

5. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyin.

## Nasıl Oynanır

1. Ana menüden "Yarış Oluştur" butonuna tıklayın.
2. Yarışmak istediğiniz arabayı seçin.
3. "Yarışı Başlat" butonuna basarak yarışa başlayın.
4. Yarış sırasında diğer arabaları geçmeye ve en iyi zamanı yapmaya çalışın.
5. 5 turun sonunda en iyi toplam zamana sahip olan yarışı kazanır.

## Proje Yapısı

- `components/`: Vue bileşenleri
    - `RaceTrack.vue`: Ana yarış pisti bileşeni
    - `CarModal.vue`: Araba detaylarını gösteren modal
    - `WelcomeModal.vue`: Oyun başlangıç ekranı
    - `ProgramList.vue`: Yarış programı ve sonuçları
- `store/`: Vuex store dosyaları
- `assets/`: Stil dosyaları ve görseller
- `services/`: Yardımcı servisler (örn. ses yönetimi)