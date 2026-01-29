# Forsaj Club Offroad V3 🏎💨

Azerbaycan'ın önde gelen offroad motor sporları merkezi. Bu platform; dinamik bir liderlik tablosu, etkinlik galerileri, video arşivleri ve çok dilli yerelleştirme sistemi sunar.

## 🚀 Özellikler

- **Dinamik Liderlik Tablosu**: 4 kategoride (Unlimited, Legend, Semi Stock, UTV) otomatik sürücü sıralaması.
- **Admin Paneli**: Site genelindeki ayarların, duyuruların ve sürücü puanlarının güvenli yönetimi.
- **Kullanıcı Yönetimi**: Admin hesapları oluşturma ve düzenleme (Master ve Secondary rolleri).
- **Yerelleştirme**: **Azerbaycan Türkçesi (AZ)**, **İngilizce (EN)** ve **Rusça (RU)** için tam destek.
- **Medya Arşivi**: İndirme özellikli yüksek çözünürlüklü fotoğraf galerisi ve entegre YouTube video modalları.
- **Premium Estetik**: Glassmorphism ve pürüzsüz mikro animasyonlara sahip yüksek performanslı karanlık mod arayüzü.

## 🛠 Teknoloji Yığını

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Veritabanı**: JSON tabanlı dosya sistemi (Persistence)
- **Dağıtım**: Docker & Docker Compose
- **Proxy**: Traefik (HTTPS Hazır)

## 🔐 Admin Paneli

Admin paneline gizli bir hash rotası üzerinden erişilebilir.
- **URL**: `https://forsaj.octotech.az/#admin`

### Varsayılan Kimlik Bilgileri
| Kullanıcı Adı | Şifre | Rol | Yetkiler |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Master | Tam Erişim (Ayarlar + Kullanıcılar) |

## 📦 Kurulum ve Canlıya Alım (Docker)

Uygulamayı Docker ve Traefik kullanarak yayına almak için:

1. **Depoyu klonlayın**:
   ```bash
   git clone https://github.com/aliyabuz25/forsaj-club-offroad-v3.git
   cd forsaj-club-offroad-v3
   ```

2. **Docker Compose ile başlatın**:
   ```bash
   docker-compose up -d --build
   ```

*Not: `web` adında harici bir ağınız olduğundan emin olun veya `docker-compose.yml` dosyasını kendi Traefik kurulumunuza göre güncelleyin.*

## 📂 Proje Yapısı

- `/components`: UI birimleri ve sayfa bölümleri.
- `/context`: Admin ayarları ve dil yerelleştirmesi için global state (durum) yönetimi.
- `/json`: Harici veri kaynakları (Kullanıcılar, Ayarlar vb.).
- `/uploads`: Yüklenen medyalar için kalıcı depolama alanı.

---
© 2024 Forsaj Club. Tüm Hakları Saklıdır.
