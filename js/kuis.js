/* ==========================================================================
   ZATLOKA KUIS & PROGRESI LINIER ENGINE
   Mekanika Kuis 5 PG (Acak) + 3 Esai (Validasi >= 3 kata),
   Sistem Terkunci Linier, Gelar Bertahap, & Ekspor Cetak PDF.
   ========================================================================== */

(function () {
    'use strict';

    // --- 1. DATASET LENGKAP KUIS LEVEL 1 - 4 ---
    // Sesuai teks presisi docs/prd_kuis_progresi.md
    const KUIS_DATA = {
        1: {
            level: 1,
            title: "Wujud Zat & Model Partikel",
            badge: "Level 1: Detektif Pemula",
            rankTitle: "Detektif Pemula",
            pg: [
                {
                    id: "1.1",
                    asset: null, // Tanpa Gambar
                    caption: null,
                    question: "Ketika arak diuapkan dan menghasilkan gas, gas tersebut akan berpindah dari wadah tabung bervolume besar ke wadah tabung bervolume kecil yang tertutup rapat, partikel zat dalam wujud gas tersebut tetap mampu memenuhi seluruh ruangan wadah yang baru. Berdasarkan konsep sub-mikroskopis, analisis mengapa hal tersebut dapat terjadi...",
                    options: [
                        { text: "Ukuran fisik partikel gas mengecil secara drastis untuk menyesuaikan diri dengan volume tabung yang sempit.", correct: false },
                        { text: "Jarak antarpartikel gas sangat berjauhan serta gaya tariknya sangat lemah sehingga bebas bergerak mengisi seluruh ruang.", correct: true },
                        { text: "Seluruh partikel gas berhenti bergerak secara total dan menempel erat pada permukaan dinding bagian dalam tabung.", correct: false },
                        { text: "Tekanan udara luar menekan partikel gas secara terus-menerus hingga berubah wujud menjadi bentuk zat dalam wujud cair.", correct: false }
                    ]
                },
                {
                    id: "1.2",
                    asset: "assets/images/kuis/kuis1-grafik-jarak.svg",
                    caption: "Grafik perbandingan jarak antarpartikel zat dalam wujud padat, cair, dan gas.",
                    question: "Besi memiliki partikel yang tersusun teratur, berjarak sangat rapat, namun partikelnya tetap menunjukkan aktivitas getaran kecil di posisinya (tidak diam mutlak). Jika besi tersebut dimasukkan ke dalam wadah yang berbeda bentuk, kesimpulan logis apakah yang akan terjadi pada besi?",
                    options: [
                        { text: "Bentuk besi akan berubah menyerupai wadah baru, tetapi ukuran volume totalnya akan tetap konstan.", correct: false },
                        { text: "Besi akan mencair secara perlahan dan menyebar untuk memenuhi seluruh bagian dalam wadah baru.", correct: false },
                        { text: "Bentuk dan volume besi akan tetap sama persis seperti semula karena merupakan karakteristik zat dalam wujud padat.", correct: true },
                        { text: "Seluruh partikel besi akan merenggang bebas lepas mengisi penuh ke setiap sudut ruang wadah.", correct: false }
                    ]
                },
                {
                    id: "1.3",
                    asset: "assets/images/kuis/kuis1-rongga-bambu.svg",
                    caption: "Ilustrasi mikroskopis rongga antarpartikel pada bambu dibandingkan dengan logam padat.",
                    question: "Meskipun bambu suling pada alat penyulingan arak dikategorikan sebagai zat dalam wujud padat yang memiliki ikatan antarpartikel sangat kuat, mengapa bambu masih memungkinkan untuk menyerap sejumlah kecil uap air atau mengalami sedikit pemuaian saat dipanaskan?",
                    options: [
                        { text: "Karena partikel zat dalam wujud padat pada bambu dapat memutuskan ikatan kimianya dan berubah menjadi gas secara instan.", correct: false },
                        { text: "Karena partikel zat dalam wujud padat selalu bergetar dan memiliki rongga antarpartikel yang memungkinkan ruang gerak termal.", correct: true },
                        { text: "Karena struktur zat dalam wujud padat sebenarnya tidak memiliki massa jenis dan sangat mudah larut di dalam air panas.", correct: false },
                        { text: "Karena ikatan antarmolekul pada zat dalam wujud padat bersifat cair fleksibel sehingga dapat mengalir bebas ke luar.", correct: false }
                    ]
                },
                {
                    id: "1.4",
                    asset: "assets/images/kuis/kuis1-diagram-wujud.svg",
                    caption: "Ilustrasi skematik susunan partikel pada ketiga wujud zat.",
                    question: "Ketika cairan nira dipanaskan dalam proses pembuatan arak, cairan yang mulanya berada di dalam wadah perlahan-lahan berubah menjadi uap panas yang keluar melalui bambu pengantar. Bagaimana perubahan susunan dan energi kinetik partikel yang terjadi pada peristiwa tersebut?",
                    options: [
                        { text: "Jarak antarpartikel menjadi semakin rapat dan kecepatan gerak partikelnya mengalami penurunan drastis.", correct: false },
                        { text: "Susunan partikel berubah dari bentuk semula yang renggang menjadi sangat teratur dan kaku keras.", correct: false },
                        { text: "Jarak partikel merenggang dan kecepatan geraknya meningkat akibat menyerap kalor dari proses pemanasan.", correct: true },
                        { text: "Ukuran fisik dari setiap partikel individu di dalam zat tersebut membesar dua kali lipat dari semula.", correct: false }
                    ]
                },
                {
                    id: "1.5",
                    asset: "assets/images/kuis/kuis1-piston-gas.svg",
                    caption: "Ilustrasi perbandingan penekanan piston pada wadah tertutup yang berisi gas dan berisi air.",
                    question: "Mengapa volume gas dapat dimampatkan (ditekan) menjadi lebih kecil, sementara hal tersebut sangat sulit dilakukan pada zat dalam wujud cair?",
                    options: [
                        { text: "Karena gas memiliki ruang kosong (rongga antarpartikel) yang sangat luas dibandingkan zat dalam wujud cair yang rapat.", correct: true },
                        { text: "Karena massa dari partikel gas akan hilang sebagian secara otomatis saat ditekan kuat dari luar.", correct: false },
                        { text: "Karena partikel zat dalam wujud cair tidak memiliki gaya tarik menarik sama sekali di antara molekul penyusunnya.", correct: false },
                        { text: "Karena molekul gas dapat melebur menjadi bentuk zat dalam wujud padat seketika saat diberi tekanan luar.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e1.1",
                    num: 1,
                    asset: null,
                    caption: null,
                    question: "Saat proses penyulingan arak tradisional Bali, uap panas yang mengalir dari periuk perebusan melewati pipa bambu panjang yang didinginkan dengan air, hingga akhirnya menetes menjadi cairan arak. Analisislah mengapa uap gas yang tadinya bebas melesat di udara bisa berubah kembali menjadi tetesan cairan ketika melewati pipa yang dingin!"
                },
                {
                    id: "e1.2",
                    num: 2,
                    asset: "assets/images/kuis/kuis1-esai-bola-karet.png",
                    caption: "Ilustrasi pengembangan bola karet saat dipindahkan ke tempat bersuhu panas.",
                    question: "Seorang siswa mencoba memasukkan bola karet yang terisi penuh oleh udara ke dalam wadah berisi air dingin, lalu memindahkannya ke tempat yang panas di bawah terik matahari. Siswa tersebut mengamati bahwa bola karet tampak sedikit lebih tegang dan mengembang. Hubungkan peristiwa ini dengan perubahan jarak antarpartikel dan pergerakan partikel gas di dalam bola karet!"
                }
            ]
        },

        2: {
            level: 2,
            title: "Perubahan Wujud & Titik Suhu",
            badge: "Level 2: Penjelajah Materi",
            rankTitle: "Penjelajah Materi",
            pg: [
                {
                    id: "2.1",
                    asset: "assets/images/kuis/kuis2-grafik-pemanasan.svg",
                    caption: "Grafik pemanasan zat dari wujud es padat hingga menjadi uap gas.",
                    question: "Perhatikan grafik pemanasan zat pada aplikasi ZatLoka di atas! Saat grafik menunjukkan garis mendatar (konstan) pada suhu 0°C dan 100°C, suhu zat tidak mengalami kenaikan meskipun proses pemanasan atau pemberian panas terus dilanjutkan. Analisis mengapa fenomena tersebut dapat terjadi pada tingkat sub-mikroskopis...",
                    options: [
                        { text: "Kalor yang diserap digunakan untuk menaikkan kecepatan gerak seluruh partikel secara drastis.", correct: false },
                        { text: "Kalor yang diserap digunakan sepenuhnya untuk memutuskan atau merenggangkan ikatan antarpartikel.", correct: true },
                        { text: "Partikel zat berhenti bergerak sama sekali selama garis mendatar grafik pemanasan berlangsung.", correct: false },
                        { text: "Massa zat mengalami penyusutan drastis sehingga seluruh energi panas terbuang ke udara.", correct: false }
                    ]
                },
                {
                    id: "2.2",
                    asset: "assets/images/kuis/kuis2-evaporasi-didih.svg",
                    caption: "Perbandingan penguapan air laut Kusamba (permukaan) dan air mendidih (seluruh bagian).",
                    question: "Dalam proses tradisional pembuatan garam di Pesisir Kusamba, air laut dijemur di bawah terik matahari hingga perlahan-lahan berubah menjadi uap dan meninggalkan kristal garam. Berdasarkan prinsip kalor dan wujud zat, apa perbedaan mendasar antara proses penguapan air laut di ladang garam tersebut dengan proses air mendidih di dalam panci?",
                    options: [
                        { text: "Penguapan memerlukan pasokan api besar, sedangkan mendidih hanya memerlukan energi dari matahari.", correct: false },
                        { text: "Penguapan mengubah identitas kimia air menjadi garam, sedangkan proses mendidih tidak mengubah zat.", correct: false },
                        { text: "Penguapan terjadi pada suhu berapa pun di permukaan, sedangkan mendidih pada suhu tetap di seluruh bagian.", correct: true },
                        { text: "Penguapan melepaskan kalor ke lingkungan sekitar, sedangkan proses mendidih menyerap kalor lingkungan.", correct: false }
                    ]
                },
                {
                    id: "2.3",
                    asset: "assets/images/kuis/kuis2-pipa-pendingin.svg",
                    caption: "Pipa pendingin bambu pada alat destilasi arak Bali.",
                    question: "Pada alat penyulingan arak tradisional Bali, uap panas yang mengalir dari proses perebusan nira akan melewati pipa pendingin bambu yang disiram air dingin, sehingga uap tersebut berubah menjadi tetesan cairan arak. Jika aliran air dingin pada pipa pendingin dihentikan, apa dampak langsung yang akan terjadi pada proses perubahan wujud di dalam pipa?",
                    options: [
                        { text: "Tetesan cairan arak di dalam pipa pendingin akan berubah menjadi bentuk kristal padat seketika.", correct: false },
                        { text: "Proses perubahan wujud mencair akan berlangsung jauh lebih cepat daripada kondisi sebelumnya.", correct: false },
                        { text: "Uap gas gagal mengembun secara maksimal dan akan terus berwujud gas yang lolos keluar.", correct: true },
                        { text: "Suhu yang berada di dalam pipa pendingin tersebut akan turun drastis di bawah titik 0°C", correct: false }
                    ]
                },
                {
                    id: "2.4",
                    asset: "assets/images/kuis/kuis2-kapur-barus.svg",
                    caption: "Ilustrasi proses menyublim pada kapur barus padat yang dipanaskan.",
                    question: "Kapur barus (kamper) padat yang diletakkan di dalam lemari lama-kelamaan akan habis tanpa meninggalkan sisa cairan di dasarnya. Peristiwa ini melibatkan perubahan wujud menyublim. Analisis apa yang terjadi pada jarak antarpartikel dan kebutuhan kalor pada peristiwa tersebut?",
                    options: [
                        { text: "Melepaskan kalor ke lingkungan, serta jarak antarpartikel berubah dari wujud renggang menjadi sangat rapat.", correct: false },
                        { text: "Menyerap kalor, jarak partikel berubah langsung dari padat (rapat) menjadi gas (berjauhan) tanpa cair.", correct: true },
                        { text: "Melepaskan kalor ke lingkungan, serta jarak antarpartikel berubah dari wujud bentuk cair menjadi padat.", correct: false },
                        { text: "Menyerap kalor dari lingkungan, serta ukuran fisik dari setiap molekul individu menyusut menjadi gas.", correct: false }
                    ]
                },
                {
                    id: "2.5",
                    asset: "assets/images/kuis/kuis2-grafik-leleh-didih.svg",
                    caption: "Grafik perbandingan energi kalor pada titik leleh es dan titik didih air.",
                    question: "Seorang siswa melakukan eksperimen pemanasan es batu bersuhu -10°C hingga mendidih menjadi uap air pada 100°C. Ia mencatat bahwa waktu yang dibutuhkan air untuk berubah sepenuhnya menjadi uap (pada titik didihnya) jauh lebih lama daripada waktu yang dibutuhkan es untuk mencair seluruhnya (pada titik lelehnya). Mengapa hal tersebut dapat terjadi ditinjau dari ikatan partikel?",
                    options: [
                        { text: "Karena massa total es jauh lebih ringan daripada jumlah massa cairan air yang berada di dalam wadah.", correct: false },
                        { text: "Karena titik leleh memerlukan pasokan energi kalor yang jauh lebih besar daripada titik didih zat.", correct: false },
                        { text: "Pemutusan ikatan total dari cair ke gas memerlukan kalor penguapan yang jauh lebih besar daripada meleleh.", correct: true },
                        { text: "Karena partikel gas memiliki ukuran bentuk volume yang jauh lebih besar daripada partikel padat.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e2.1",
                    num: 1,
                    asset: null,
                    caption: null,
                    question: "Dalam pembuatan garam tradisional di Kusamba, petani garam memanfaatkan panas matahari untuk menguapkan air laut di atas petakan tanah/batang kelapa hingga terbentuk kristal garam. Jika seandainya cuaca mendung total terus menerus selama seminggu, jelaskan kendala apa yang terjadi pada pergerakan partikel air laut dan pembentukan kristal garam tersebut dalam menerima panas!"
                },
                {
                    id: "e2.2",
                    num: 2,
                    asset: "assets/images/kuis/kuis2-esai-luka-melepuh.png",
                    caption: "Perbedaan keparahan luka melepuh akibat terkena uap air panas dan air bersuhu mendidih.",
                    question: "Mengapa ketika tubuh kita secara tidak sengaja terkena tumpahan air yang sedang mendidih 100°C luka melepuhnya terasa jauh lebih parah dan sakit dibandingkan jika terkena tumpahan air panas biasa yang bersuhu sama-sama 100°C (atau uap air panas)? Hubungkan jawabanmu dengan proses pelepasan panas pada peristiwa pengembunan!"
                }
            ]
        },

        3: {
            level: 3,
            title: "Perubahan Fisika & Kimia",
            badge: "Level 3: Ilmuwan Muda",
            rankTitle: "Ilmuwan Muda",
            pg: [
                {
                    id: "3.1",
                    asset: "assets/images/kuis/kuis3-dupa-bakar.svg",
                    caption: "Perbandingan batang dupa yang terbakar menjadi abu dan penguapan minyak aromanya.",
                    question: "Saat melakukan persembahyangan di rumah, keluarga Made menyalakan Dupa Harum Bali. Dalam satu batang dupa tersebut, terjadi dua peristiwa sekaligus: serbuk kayu pada batang dupa terbakar menjadi abu, sementara minyak wangi di dalam dupa menguap menjadi aroma harum di ruangan. Analisis mengapa peristiwa pembakaran dupa dikategorikan sebagai perubahan kimia, bukan perubahan fisika...",
                    options: [
                        { text: "Pembakaran dupa mengubah wujud dari padat menjadi gas, sedangkan penguapan minyak wangi mengubah wujud dari cairan ke padat.", correct: false },
                        { text: "Pembakaran dupa menghasilkan jenis zat baru yang permanen, sedangkan penguapan minyak wangi hanya mengubah wujud fisiknya.", correct: true },
                        { text: "Pembakaran dupa menyerap energi kalor dari lingkungan sekitar, sedangkan penguapan minyak wangi melepaskan kalor ke udara bebas.", correct: false },
                        { text: "Pembakaran dupa tidak melibatkan perubahan warna secara total, sedangkan penguapan minyak wangi mengubah warna zat asalnya.", correct: false }
                    ]
                },
                {
                    id: "3.2",
                    asset: "assets/images/kuis/kuis3-fermentasi.svg",
                    caption: "Proses fermentasi nira menjadi tuak/tape khas Bali oleh mikroorganisme.",
                    question: "Dalam tradisi pembuatan tuak atau tape di Bali, masyarakat menggunakan ragi untuk mengubah rasa manis ketan atau nira menjadi beralkohol dan berasa asam setelah didiamkan beberapa hari. Berdasarkan karakteristik perubahannya, termasuk jenis perubahan apakah proses fermentasi tersebut dan apa alasannya?",
                    options: [
                        { text: "Perubahan fisika, karena wujud fisik dari ketan ataupun nira tetap berupa zat dalam wujud cair dan padat.", correct: false },
                        { text: "Perubahan fisika, karena proses reaksi fermentasinya dapat dibalik dengan cara mendinginkannya.", correct: false },
                        { text: "Perubahan kimia, terbentuk zat baru disertai perubahan rasa dan sifat akibat kerja mikroorganisme.", correct: true },
                        { text: "Perubahan kimia, karena wujud zat berubah langsung dari bentuk gas menjadi padat secara instan.", correct: false }
                    ]
                },
                {
                    id: "3.3",
                    asset: "assets/images/kuis/kuis3-lilin.svg",
                    caption: "Ilustrasi lilin yang mengalami proses meleleh (fisika) dan sumbu yang terbakar (kimia).",
                    question: "Komang menyalakan sebuah lilin aromaterapi di kamarnya. Ketika lilin menyala, batang lilin di pinggirannya meleleh mengalir ke bawah, sementara bagian sumbu lilin yang terbakar berubah menjadi asap hitam dan arang. Analisis perubahan zat yang terjadi pada batang lilin yang meleleh dan sumbu lilin yang terbakar secara berurutan adalah...",
                    options: [
                        { text: "Perubahan jenis kimia dan diikuti dengan proses perubahan jenis kimia secara bersamaan.", correct: false },
                        { text: "Perubahan jenis fisika dan diikuti dengan proses perubahan jenis kimia secara berurutan.", correct: true },
                        { text: "Perubahan jenis fisika dan diikuti dengan proses perubahan jenis fisika secara bersamaan.", correct: false },
                        { text: "Perubahan jenis kimia dan diikuti dengan proses perubahan jenis fisika secara berurutan.", correct: false }
                    ]
                },
                {
                    id: "3.4",
                    asset: "assets/images/kuis/kuis3-es-karat.svg",
                    caption: "Perbandingan es batu yang mencair dengan besi pagar yang berkarat.",
                    question: "Ibu meletakkan pagar besi di dekat pantai sehingga lama-kelamaan besi tersebut berlubang dan berubah menjadi lapisan berwarna coklat kemerahan (karat). Di sisi lain, es batu di dalam teh manis mencair menjadi air. Siswa kelas 7 diminta membedakan sifat kekekalan zat dari kedua peristiwa tersebut. Pernyataan manakah yang paling tepat?",
                    options: [
                        { text: "Besi berkarat bersifat reversible (dapat kembali seperti semula), sedangkan es mencair bersifat irreversible.", correct: false },
                        { text: "Es mencair tidak menghasilkan zat baru, sedangkan besi berkarat menghasilkan jenis zat baru.", correct: true },
                        { text: "Kedua peristiwa tersebut merupakan contoh dari perubahan kimia karena mengubah bentuk wujud benda.", correct: false },
                        { text: "Karat besi dapat diubah kembali menjadi besi murni hanya dengan mencucinya menggunakan air biasa.", correct: false }
                    ]
                },
                {
                    id: "3.5",
                    asset: null, // Tidak ada gambar khusus
                    caption: null,
                    question: "Siti membuat segelas Es Daluman khas Bali. Ia mencampurkan cincau hijau, santan, dan air gula aren cair ke dalam es batu, lalu diaduk rata. Apakah pencampuran bahan-bahan makanan tersebut dapat digolongkan sebagai perubahan kimia? Berikan alasan ilmiahnya untuk tingkat siswa SMP!",
                    options: [
                        { text: "Ya, karena wujud santan dan gula tercampur merata menjadi satu kesatuan warna yang baru.", correct: false },
                        { text: "Ya, karena rasa dari air kelapa dan gula aren tercampur rata menjadi berasa sangat manis.", correct: false },
                        { text: "Tidak, pencampuran tidak menghasilkan zat baru; masing-masing bahan mempertahankan sifatnya.", correct: true },
                        { text: "Tidak, karena semua bahan makanan tersebut langsung menguap menjadi gas saat diaduk.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e3.1",
                    num: 1,
                    asset: null,
                    caption: null,
                    question: "Di pesisir Kusamba, petani menjemur air laut di atas petak-petak tanah atau palungan batang kelapa hingga airnya habis dan menyisakan kristal garam putih. Di sisi lain, sisa-sisa sesajen (canang sari) yang dibiarkan di pekarangan rumah lama-kelamaan akan membusuk dan hancur menyatu dengan tanah. Berdasarkan konsep yang telah kamu pelajari, analisislah mana di antara kedua peristiwa tersebut (pembuatan garam vs pembusukan canang sari) yang termasuk perubahan fisika dan mana yang perubahan kimia, serta jelaskan alasannya!"
                },
                {
                    id: "e3.2",
                    num: 2,
                    asset: null,
                    caption: null,
                    question: `Siti ingin membuktikan perbedaan sifat perubahan fisika dan kimia di dapur rumahnya melalui dua aktivitas berbeda:
<ol class="ecard-numbered-list">
    <li><strong>Aktivitas Pertama:</strong> Ia mencampurkan satu sendok teh gula pasir ke dalam segelas air hangat hingga larut sempurna menjadi air gula, lalu mencoba memisahkan kembali gula tersebut dengan cara menguapkan airnya.</li>
    <li><strong>Aktivitas Kedua:</strong> Ia merebus sebutir telur mentah di dalam air mendidih hingga bagian putih dan kuning telurnya mengeras (matang), lalu mencoba mendinginkan telur rebus tersebut di dalam lemari es agar putih telurnya bisa kembali cair seperti semula.</li>
</ol>
Evaluasilah kedua aktivitas Siti tersebut dan jelaskan apakah kedua usaha pemisahan/pengembalian wujud tersebut akan berhasil, ditinjau dari karakteristik perubahan fisika dan perubahan kimia!`
                }
            ]
        },

        4: {
            level: 4,
            title: "Kerapatan & Massa Jenis",
            badge: "Level 4: Master Sains",
            rankTitle: "Master Sains",
            pg: [
                {
                    id: "4.1",
                    asset: "assets/images/kuis/kuis4-timbang-bambu.svg",
                    caption: "Ilustrasi timbangan digital dan pengukuran volume bambu suling.",
                    question: "Seorang perajin cilik di Bali menguji potongan kayu bambu suling yang digunakan untuk alat musik tradisional. Setelah ditimbang, bambu tersebut memiliki massa (m) = 120 gram dan volume (V) = 150 cm3. Jika massa jenis air bersih adalah 1,0 g/cm3, analisis nilai massa jenis bambu tersebut dan tentukan posisinya jika dimasukkan ke dalam air!",
                    options: [
                        { text: "ρ = 0,8 g/cm3, posisi benda akan tenggelam di dalam air.", correct: false },
                        { text: "ρ = 0,8 g/cm3, posisi benda akan mengapung di atas permukaan air.", correct: true },
                        { text: "ρ = 1,25 g/cm3, posisi benda akan melayang di tengah air.", correct: false },
                        { text: "ρ = 1,25 g/cm3, posisi benda akan tenggelam ke dasar wadah.", correct: false }
                    ]
                },
                {
                    id: "4.2",
                    asset: "assets/images/kuis/kuis4-bambu-koin.svg",
                    caption: "Perbandingan mikroskopis rongga udara pada struktur bambu dengan padatnya koin logam.",
                    question: "Mengapa sepotong bambu yang berukuran sama persis dengan koin logam bisa mengapung, sementara koin logam tersebut langsung tenggelam ke dasar air? Evaluasi kejadian ini berdasarkan struktur kerapatan partikelnya (diketahui dinding sel bambu memiliki rongga berukuran sekitar 21 hingga 198 Nm, sedangkan koin logam tersusun dari atom-atom yang rapat tanpa rongga)!",
                    options: [
                        { text: "Karena massa dari koin logam jauh lebih ringan daripada massa bambu ketika berada di dalam air.", correct: false },
                        { text: "Karena koin logam menyerap air jauh lebih cepat daripada bambu yang bersifat kedap air.", correct: false },
                        { text: "Bambu punya rongga udara yang membuat kerapatan totalnya kecil, sedangkan logam padat tanpa rongga.", correct: true },
                        { text: "Karena koin logam memiliki gaya dorong ke atas yang jauh lebih besar daripada berat aslinya.", correct: false }
                    ]
                },
                {
                    id: "4.3",
                    asset: "assets/images/kuis/kuis4-telur-garam.svg",
                    caption: "Uji kualitas kesegaran telur di dalam air tawar dan larutan air garam Kusamba.",
                    question: "Petani garam di Kusamba sering menggunakan uji larutan garam untuk menentukan kualitas telur. Telur yang masih segar akan tenggelam di dalam air tawar, akan melayang jika dimasukkan ke air garam. Analisis apa yang terjadi pada sifat cairan tersebut...",
                    options: [
                        { text: "Massa total dari telur bertambah besar secara signifikan sehingga mendesak air ke bawah.", correct: false },
                        { text: "Penambahan garam meningkatkan massa jenis air hingga sama persis dengan massa jenis telur.", correct: true },
                        { text: "Kandungan garam membuat volume telur menyusut drastis sehingga menjadi sangat ringan.", correct: false },
                        { text: "Air garam menarik udara yang ada di dalam telur hingga telur terdorong mengapung ke atas.", correct: false }
                    ]
                },
                {
                    id: "4.4",
                    asset: "assets/images/kuis/kuis4-lapisan-cairan.svg",
                    caption: "Ilustrasi susunan tiga lapisan cairan yang berbeda massa jenis di dalam sebuah gelas kimia.",
                    question: "Siti mencampurkan tiga jenis cairan ke dalam satu gelas tinggi: Minyak kelapa (0,8 g/cm3), Air murni (1,0 g/cm3), dan Larutan gula pekat (1,3 g/cm3). Ketiga cairan tersebut tidak saling melarutkan. Urutan lapisan cairan dari posisi paling atas hingga ke paling bawah secara berurutan adalah...",
                    options: [
                        { text: "Larutan gula — Air murni — Minyak kelapa", correct: false },
                        { text: "Minyak kelapa — Air murni — Larutan gula", correct: true },
                        { text: "Air murni — Minyak kelapa — Larutan gula", correct: false },
                        { text: "Larutan gula — Minyak kelapa — Air murni", correct: false }
                    ]
                },
                {
                    id: "4.5",
                    asset: "assets/images/kuis/kuis4-batu-gelasukur.svg",
                    caption: "Pengukuran volume benda tidak beraturan menggunakan metode gelas ukur.",
                    question: "Komang ingin mencari massa jenis sebuah batu hias candi. Ia memasukkan batu tersebut ke dalam gelas ukur. Permukaan air awal berada di angka 50 mL, dan setelah batu dimasukkan sepenuhnya, permukaan air naik menjadi 90 mL. Jika timbangan menunjukkan massa batu tersebut adalah 100 gram, berapakah massa jenis batu tersebut?",
                    options: [
                        { text: "0,9 g/cm3", correct: false },
                        { text: "1,25 g/cm3", correct: false },
                        { text: "2,0 g/cm3", correct: false },
                        { text: "2,5 g/cm3", correct: true }
                    ]
                }
            ],
            essay: [
                {
                    id: "e4.1",
                    num: 1,
                    asset: null,
                    caption: null,
                    question: "Seorang perajin ukiran kayu di Bali membuat dua jenis patung hiasan dengan ukuran volume yang sama persis, yaitu 200 cm3. Patung A (terbuat dari kayu) memiliki massa 140 gram, sedangkan Patung B (terbuat dari batu padas padat) memiliki massa 500 gram. Jika kedua patung tersebut dimasukkan ke dalam kolam air besar (air= 1,0 g/cm3) hitunglah masing-masing massa jenis patung tersebut, lalu prediksikan dan jelaskan posisi akhir benda (mengapung, melayang, atau tenggelam)!"
                },
                {
                    id: "e4.2",
                    num: 2,
                    asset: null,
                    caption: null,
                    question: "Kadek ingin merancang replika perahu tradisional Bali dari gabus sterofoam dan kayu. Ia ingin perahunya dapat melayang tepat di tengah-tengah kedalaman air kolam (tidak tenggelam ke dasar dan tidak muncul terlalu tinggi di permukaan). Berdasarkan pemahamanmu tentang konsep massa jenis zat dalam wujud cair dan benda, saran strategi apa yang harus dilakukan Kadek terhadap rancangan bahan perahunya agar tujuan tersebut tercapai?"
                }
            ]
        }
    };

    // --- 2. PROGRESSION & PERSISTENCE MANAGER ---
    const ProgressionManager = {
        STORAGE_KEY: 'zatloka_linear_progress',

        getDefault() {
            return {
                unlockedMateri: [1], // Level 1 Materi terbuka secara default
                completedMateri: [],  // Materi yang sudah selesai dibaca
                unlockedKuis: [],     // Kuis yang sudah terbuka
                passedKuis: [],       // Kuis yang lulus 100% (5/5)
                scores: {},           // Level -> score ({ "1": 5, ... })
                essays: {},           // Level -> [ans1, ans2, ans3]
                essayDates: {}        // Level -> timestamp
            };
        },

        get() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (!raw) return this.getDefault();
                const parsed = JSON.parse(raw);
                return {
                    unlockedMateri: Array.isArray(parsed.unlockedMateri) ? parsed.unlockedMateri : [1],
                    completedMateri: Array.isArray(parsed.completedMateri) ? parsed.completedMateri : [],
                    unlockedKuis: Array.isArray(parsed.unlockedKuis) ? parsed.unlockedKuis : [],
                    passedKuis: Array.isArray(parsed.passedKuis) ? parsed.passedKuis : [],
                    scores: parsed.scores || {},
                    essays: parsed.essays || {},
                    essayDates: parsed.essayDates || {}
                };
            } catch (e) {
                return this.getDefault();
            }
        },

        save(data) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.syncRankWithState(data);
            this.notifyChange();
        },

        syncRankWithState(data) {
            // Gelar bertahap berdasarkan Kuis yang lulus 100%
            let rank = "Calon Ilmuwan";
            if (data.passedKuis.includes(4)) {
                rank = "Master Sains";
            } else if (data.passedKuis.includes(3)) {
                rank = "Ilmuwan Muda";
            } else if (data.passedKuis.includes(2)) {
                rank = "Penjelajah Materi";
            } else if (data.passedKuis.includes(1)) {
                rank = "Detektif Pemula";
            }

            localStorage.setItem('zatloka_profile_rank', rank);
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.rank = rank;
            }

            // Update UI widgets
            const widgetRank = document.getElementById('widget-rank');
            const modalRank = document.getElementById('profile-rank-val');
            if (widgetRank) widgetRank.textContent = rank;
            if (modalRank) modalRank.textContent = rank;
        },

        isMateriUnlocked(level) {
            const data = this.get();
            return data.unlockedMateri.includes(level);
        },

        isKuisUnlocked(level) {
            const data = this.get();
            return data.unlockedKuis.includes(level);
        },

        isKuisPassed(level) {
            const data = this.get();
            return data.passedKuis.includes(level);
        },

        // Triggered when user reaches the end of Materi Level N
        completeMateri(level) {
            const data = this.get();
            let changed = false;

            if (!data.completedMateri.includes(level)) {
                data.completedMateri.push(level);
                changed = true;
            }

            // Membuka Kuis level bersangkutan
            if (!data.unlockedKuis.includes(level)) {
                data.unlockedKuis.push(level);
                changed = true;
            }

            if (changed) {
                this.save(data);
            }
        },

        // Triggered when user passes Kuis Level N (100% PG)
        passKuis(level, score, essayAnswers) {
            const data = this.get();
            if (!data.passedKuis.includes(level)) {
                data.passedKuis.push(level);
            }

            data.scores[level] = Math.max(data.scores[level] || 0, score);
            data.essays[level] = essayAnswers;
            data.essayDates[level] = new Date().toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            // Unlock next Materi level (Linear progression)
            const nextLevel = level + 1;
            if (nextLevel <= 4 && !data.unlockedMateri.includes(nextLevel)) {
                data.unlockedMateri.push(nextLevel);
            }

            this.save(data);
        },

        // Save attempt score without passing
        recordAttempt(level, score, essayAnswers) {
            const data = this.get();
            data.scores[level] = Math.max(data.scores[level] || 0, score);
            data.essays[level] = essayAnswers;
            data.essayDates[level] = new Date().toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            this.save(data);
        },

        // DEV CHEAT: UNLOCK ALL
        devUnlockAll() {
            const data = {
                unlockedMateri: [1, 2, 3, 4],
                completedMateri: [1, 2, 3, 4],
                unlockedKuis: [1, 2, 3, 4],
                passedKuis: [1, 2, 3, 4],
                scores: { "1": 5, "2": 5, "3": 5, "4": 5 },
                essays: {
                    "1": ["Uap panas mengalami kondensasi karena penurunan suhu dingin pada pipa bambu.", "Partikel zat dalam wujud padat bergetar di tempatnya dan tidak diam total secara mikroskopis.", "Udara memuai saat panas karena energi kinetik dan jarak partikel gas bertambah."],
                    "2": ["Air laut sulit menguap tanpa adanya transfer energi panas dari sinar matahari.", "Tekanan udara di gunung lebih rendah sehingga partikel lebih mudah lepas menjadi uap.", "Uap air menyimpan energi panas laten penguapan yang dilepas seketika saat menyentuh kulit."],
                    "3": ["Garam adalah perubahan fisika sedangkan pembusukan canang sari menghasilkan zat baru (kimia).", "Tidak berhasil karena putih dan kuning telur mengalami denaturasi protein kimiawi permanen.", "Pengelasan melibatkan pelelehan besi (fisika) dan pembakaran oksidasi percikan api (kimia)."],
                    "4": ["Patung kayu mengapung (rho < 1 g/cm3), patung batu tenggelam (rho > 1 g/cm3).", "Partikel besi tersusun sangat padat dengan massa atom yang jauh lebih besar daripada es.", "Menyesuaikan rongga dan beban agar massa jenis total sama dengan massa jenis air."]
                },
                essayDates: {
                    "1": "Cheat Developer Unlocked",
                    "2": "Cheat Developer Unlocked",
                    "3": "Cheat Developer Unlocked",
                    "4": "Cheat Developer Unlocked"
                }
            };
            this.save(data);

            // Add EXP bonus
            const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || 0;
            const newExp = Math.max(currentExp, 600);
            localStorage.setItem('zatloka_profile_exp', newExp);
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.exp = newExp;
            }

            const widgetExp = document.getElementById('widget-exp');
            const modalExp = document.getElementById('profile-exp-val');
            if (widgetExp) widgetExp.textContent = `✨ ${newExp} EXP`;
            if (modalExp) modalExp.textContent = `${newExp} EXP`;
        },

        // DEV CHEAT: RESET ALL
        devResetAll() {
            const def = this.getDefault();
            this.save(def);
            localStorage.setItem('zatloka_profile_rank', 'Calon Ilmuwan');
            localStorage.setItem('zatloka_profile_exp', '0');
            localStorage.removeItem('zatloka_exp');

            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.rank = 'Calon Ilmuwan';
                window.ZatlokaApp.appState.profile.exp = 0;
            }

            const widgetRank = document.getElementById('widget-rank');
            const modalRank = document.getElementById('profile-rank-val');
            const widgetExp = document.getElementById('widget-exp');
            const modalExp = document.getElementById('profile-exp-val');
            if (widgetRank) widgetRank.textContent = 'Calon Ilmuwan';
            if (modalRank) modalRank.textContent = 'Calon Ilmuwan';
            if (widgetExp) widgetExp.textContent = '✨ 0 EXP';
            if (modalExp) modalExp.textContent = '0 EXP';
        },

        notifyChange() {
            // Trigger refresh on both Kuis and Materi UI
            if (window.ZatlokaKuis && window.ZatlokaKuis.refreshMapUI) {
                window.ZatlokaKuis.refreshMapUI();
            }
            if (window.ZatlokaMateri && window.ZatlokaMateri.refreshLevelMapUI) {
                window.ZatlokaMateri.refreshLevelMapUI();
            }
        }
    };

    // --- 3. HELPER RANDOMIZER (Fisher-Yates) ---
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Helper Sound Synthesizer (Web Audio API)
    const KuisSound = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },
        play(type) {
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                if (type === 'click') {
                    osc.frequency.setValueAtTime(480, now);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    osc.start(now);
                    osc.stop(now + 0.06);
                } else if (type === 'correct') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                    osc.start(now);
                    osc.stop(now + 0.45);
                } else if (type === 'wrong') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.setValueAtTime(180, now + 0.12);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === 'victory') {
                    const notes = [523.25, 659.25, 783.99, 1046.5];
                    notes.forEach((freq, idx) => {
                        const o = this.ctx.createOscillator();
                        const g = this.ctx.createGain();
                        o.type = 'triangle';
                        o.frequency.setValueAtTime(freq, now + idx * 0.12);
                        g.gain.setValueAtTime(0.12, now + idx * 0.12);
                        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
                        o.connect(g);
                        g.connect(this.ctx.destination);
                        o.start(now + idx * 0.12);
                        o.stop(now + idx * 0.12 + 0.3);
                    });
                }
            } catch (e) {
                // Audio fallback silence
            }
        }
    };

    // --- 4. KUIS CONTROLLER CLASS ---
    class KuisController {
        constructor() {
            this.container = null;
            this.currentLevel = null;
            this.activeQuestions = []; // Shuffled PG
            this.userAnswersPG = {};   // qId -> selectedOptionObj
            this.userAnswersEssay = {};// eId -> string text
        }

        init() {
            this.container = document.getElementById('quiz-screen');
            if (!this.container) return;
            this.showLevelMap();
        }

        // ==========================================
        // 1. PETA SELEKTOR LEVEL KUIS
        // ==========================================
        showLevelMap() {
            if (!this.container) return;
            const prog = ProgressionManager.get();

            this.container.innerHTML = `
                <div class="kuis-screen-wrapper">
                    <!-- Header -->
                    <header class="lokaplay-header">
                        <div class="header-left">
                            <button class="back-btn" data-target="home">← Beranda</button>
                            <div class="lokaplay-title-wrapper">
                                <span class="lokaplay-badge">UJI KOMPETENSI</span>
                                <h2>Peta Tantangan Kuis</h2>
                            </div>
                        </div>
                        <div class="header-right">
                            <button class="btn btn-secondary btn-print-all" id="btn-print-summary">
                                📄 Cetak Laporan
                            </button>
                        </div>
                    </header>

                    <!-- Main Map Content -->
                    <main class="kuis-map-content">
                        <div class="hub-welcome-banner">
                            <div class="hub-banner-text">
                                <h3>Uji Pemahaman Sains Etnosains Bali!</h3>
                                <p>Selesaikan 5 Pilihan Ganda & 2 Esai. Raih skor 100% untuk membuka Gelar & Materi selanjutnya.</p>
                            </div>
                        </div>

                        <div class="kuis-level-grid">
                            ${[1, 2, 3, 4].map(lvl => {
                                const qData = KUIS_DATA[lvl];
                                const isUnlocked = ProgressionManager.isKuisUnlocked(lvl);
                                const isPassed = ProgressionManager.isKuisPassed(lvl);
                                const score = prog.scores[lvl];
                                
                                let statusClass = 'locked';
                                let statusBadge = '🔒 Terkunci';
                                let statusBtnText = 'Terkunci';

                                if (isPassed) {
                                    statusClass = 'passed';
                                    statusBadge = '⭐ Lulus (5/5)';
                                    statusBtnText = 'Ulangi Kuis ▶';
                                } else if (isUnlocked) {
                                    statusClass = 'unlocked';
                                    statusBadge = score !== undefined ? `Skor Terakhir: ${score}/5` : '🔓 Terbuka';
                                    statusBtnText = 'Mulai Kuis ▶';
                                } else {
                                    statusBadge = `🔒 Baca Materi Lvl ${lvl} Dahulu`;
                                }

                                return `
                                    <div class="kuis-level-card ${statusClass}" data-level="${lvl}">
                                        <div class="kuis-card-header">
                                            <span class="kuis-card-badge">${qData.badge}</span>
                                            <span class="kuis-card-status">${statusBadge}</span>
                                        </div>
                                        <div class="kuis-card-body">
                                            <div class="kuis-card-icon">
                                                ${lvl === 1 ? '🔍' : lvl === 2 ? '🔥' : lvl === 3 ? '🧪' : '🏆'}
                                            </div>
                                            <h3>${qData.title}</h3>
                                            <p>5 Pilihan Ganda • 2 Soal Esai Ilmiah</p>
                                        </div>
                                        <div class="kuis-card-footer">
                                            <span class="kuis-tag-gelar">Gelar: ${qData.rankTitle}</span>
                                            <button class="btn ${isUnlocked ? 'btn-primary' : 'btn-secondary'} btn-start-kuis" 
                                                    data-level="${lvl}" ${!isUnlocked ? 'disabled' : ''}>
                                                ${statusBtnText}
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </main>
                </div>
            `;

            // Bind Navigation Events
            const backBtn = this.container.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    KuisSound.play('click');
                    if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                        window.ZatlokaApp.navigateTo('home');
                    }
                });
            }

            const printSummaryBtn = document.getElementById('btn-print-summary');
            if (printSummaryBtn) {
                printSummaryBtn.addEventListener('click', () => {
                    KuisSound.play('click');
                    this.openPrintDialog();
                });
            }

            // Bind Start Quiz Buttons
            this.container.querySelectorAll('.btn-start-kuis').forEach(btn => {
                btn.addEventListener('click', () => {
                    const lvl = parseInt(btn.dataset.level, 10);
                    if (ProgressionManager.isKuisUnlocked(lvl)) {
                        KuisSound.play('click');
                        this.startKuis(lvl);
                    }
                });
            });
        }

        refreshMapUI() {
            if (this.container && this.currentLevel === null) {
                this.showLevelMap();
            }
        }

        // ==========================================
        // 2. MEMULAI KUIS LEVEL TERTENTU
        // ==========================================
        startKuis(levelNum) {
            const rawData = KUIS_DATA[levelNum];
            if (!rawData) return;

            this.currentLevel = levelNum;
            this.userAnswersPG = {};
            this.userAnswersEssay = {};

            // Acak urutan 5 soal PG
            const shuffledPG = shuffleArray(rawData.pg).map(q => {
                // Acak urutan 4 opsi opsi A-B-C-D
                return {
                    ...q,
                    shuffledOptions: shuffleArray(q.options)
                };
            });

            this.activeQuestions = shuffledPG;
            this.renderKuisArena(rawData);
        }

        renderKuisArena(qData) {
            const letters = ['A', 'B', 'C', 'D'];

            this.container.innerHTML = `
                <div class="kuis-screen-wrapper">
                    <!-- Header -->
                    <header class="lokaplay-header">
                        <div class="header-left">
                            <button class="back-btn" id="btn-kuis-back-map">← Peta Kuis</button>
                            <div class="lokaplay-title-wrapper">
                                <span class="lokaplay-badge">${qData.badge}</span>
                                <h2>${qData.title}</h2>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="lokaplay-progress-pill" id="kuis-answered-pill">
                                Terjawab: 0 / 5 PG • 0 / ${qData.essay.length} Esai
                            </div>
                        </div>
                    </header>

                    <!-- Quiz Content (Scrollable) -->
                    <main class="kuis-arena-content">
                        <!-- PETUNJUK PENGERJAAN -->
                        <div class="kuis-inst-banner">
                            <span class="inst-icon">💡</span>
                            <div class="inst-text">
                                <strong>Petunjuk:</strong> Jawab 5 soal Pilihan Ganda & ${qData.essay.length} soal Esai di bawah ini dengan teliti untuk menguji pemahaman sainsmu.
                            </div>
                        </div>

                        <!-- BAGIAN 1: PILIHAN GANDA -->
                        <div class="kuis-section-title">
                            <h3>Bagian I: Pilihan Ganda (5 Soal)</h3>
                            <span class="kuis-req-note">Syarat Lulus: 100% Benar (5 dari 5)</span>
                        </div>

                        <div class="kuis-questions-list">
                            ${this.activeQuestions.map((q, qIndex) => `
                                <div class="kuis-question-card" id="qcard-${q.id}">
                                    <div class="qcard-header">
                                        <span class="qcard-num">Soal ${qIndex + 1} dari 5</span>
                                    </div>

                                    ${q.asset ? `
                                        <div class="qcard-asset-container">
                                            <div class="qcard-asset-box">
                                                <img src="${q.asset.startsWith('assets/') ? q.asset : 'assets/images/kuis/' + q.asset}" 
                                                     alt="${q.caption || ('Ilustrasi Soal ' + (qIndex + 1))}"
                                                     onerror="this.parentElement.parentElement.style.display='none'" />
                                            </div>
                                            ${q.caption ? `<p class="qcard-asset-caption">${q.caption}</p>` : ''}
                                        </div>
                                    ` : ''}

                                    <p class="qcard-text">${q.question}</p>

                                    <div class="qcard-options-list">
                                        ${q.shuffledOptions.map((opt, optIndex) => `
                                            <label class="qcard-option-label" data-qid="${q.id}" data-opt-idx="${optIndex}">
                                                <input type="radio" name="pg_${q.id}" value="${optIndex}" class="qcard-radio" />
                                                <span class="qcard-opt-letter">${letters[optIndex]}</span>
                                                <span class="qcard-opt-text">${opt.text}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- BAGIAN 2: SOAL ESAI -->
                        <div class="kuis-section-title" style="margin-top: 2rem;">
                            <h3>Bagian II: Soal Esai Ilmiah (${qData.essay.length} Soal)</h3>
                            <span class="kuis-req-note">Pengayaan & Analisis</span>
                        </div>

                        <div class="kuis-essay-list">
                            ${qData.essay.map((e, eIndex) => `
                                <div class="kuis-essay-card" id="ecard-${e.id}">
                                    <div class="ecard-header">
                                        <span class="ecard-num">Esai #${e.num}</span>
                                    </div>
                                    ${e.asset ? `
                                        <div class="qcard-asset-container" style="margin-bottom: 0.85rem;">
                                            <div class="qcard-asset-box">
                                                <img src="${e.asset.startsWith('assets/') ? e.asset : 'assets/images/kuis/' + e.asset}" 
                                                     alt="${e.caption || ('Ilustrasi Esai #' + e.num)}"
                                                     onerror="this.parentElement.parentElement.style.display='none'" />
                                            </div>
                                            ${e.caption ? `<p class="qcard-asset-caption">${e.caption}</p>` : ''}
                                        </div>
                                    ` : ''}
                                    <div class="ecard-text">${e.question}</div>
                                    <div class="ecard-input-wrapper">
                                        <textarea class="ecard-textarea" data-eid="${e.id}" 
                                                  placeholder="Ketik jawaban atau analisismu di sini (wajib minimal 3 kata)..."></textarea>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- TOMBOL SUBMIT -->
                        <div class="kuis-submit-bar">
                            <button class="btn btn-secondary" id="btn-kuis-cancel">Batal & Kembali</button>
                            <button class="btn btn-primary" id="btn-kuis-submit">
                                ✓ Kirim & Selesaikan Kuis
                            </button>
                        </div>
                    </main>

                    <!-- MODAL EVALUASI & FEEDBACK AKHIR -->
                    <div class="kuis-modal-overlay hidden" id="kuis-modal-feedback">
                        <div class="kuis-modal-card" id="kuis-modal-card">
                            <div class="kuis-modal-icon" id="km-icon">🎉</div>
                            <h3 id="km-title">Hasil Evaluasi Kuis</h3>
                            <div class="km-score-badge" id="km-score-badge">Skor: 5 / 5</div>
                            <p class="km-essay-note">Catatan: Soal esai berfungsi sebagai bentuk pengayaan.</p>
                            <p class="km-desc" id="km-desc">Keterangan hasil kuis</p>
                            <div class="km-actions" id="km-actions">
                                <!-- Tombol aksi dinamis -->
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Bind Back to Map
            document.getElementById('btn-kuis-back-map').addEventListener('click', () => {
                KuisSound.play('click');
                this.currentLevel = null;
                this.showLevelMap();
            });

            document.getElementById('btn-kuis-cancel').addEventListener('click', () => {
                KuisSound.play('click');
                this.currentLevel = null;
                this.showLevelMap();
            });

            // Bind Options Selection
            this.container.querySelectorAll('.qcard-option-label').forEach(label => {
                label.addEventListener('click', () => {
                    const qId = label.dataset.qid;
                    const optIdx = parseInt(label.dataset.optIdx, 10);
                    const qObj = this.activeQuestions.find(q => q.id === qId);
                    if (qObj) {
                        KuisSound.play('click');
                        this.userAnswersPG[qId] = qObj.shuffledOptions[optIdx];

                        // Update styling
                        const card = document.getElementById(`qcard-${qId}`);
                        if (card) {
                            card.querySelectorAll('.qcard-option-label').forEach(l => l.classList.remove('selected'));
                            label.classList.add('selected');
                        }

                        this.updateProgressPill(qData);
                    }
                });
            });

            // Bind Essay Textarea live validation
            this.container.querySelectorAll('.ecard-textarea').forEach(textarea => {
                textarea.addEventListener('input', () => {
                    const eId = textarea.dataset.eid;
                    const val = textarea.value.trim();
                    this.userAnswersEssay[eId] = val;
                    this.updateProgressPill(qData);
                });
            });

            // Bind Submit Button
            document.getElementById('btn-kuis-submit').addEventListener('click', () => {
                this.handleSubmitKuis(qData);
            });
        }

        updateProgressPill(qData) {
            const answeredPGCount = Object.keys(this.userAnswersPG).length;
            let answeredEssayCount = 0;

            qData.essay.forEach(e => {
                const text = (this.userAnswersEssay[e.id] || '').trim();
                const wordCount = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
                if (wordCount >= 3) {
                    answeredEssayCount++;
                }
            });

            const pill = document.getElementById('kuis-answered-pill');
            if (pill) {
                pill.textContent = `Terjawab: ${answeredPGCount} / 5 PG • ${answeredEssayCount} / ${qData.essay.length} Esai`;
            }
        }

        // ==========================================
        // 3. SUBMIT & EVALUASI KUIS
        // ==========================================
        handleSubmitKuis(qData) {
            // 1. Validasi PG Lengkap
            const answeredPGCount = Object.keys(this.userAnswersPG).length;
            if (answeredPGCount < 5) {
                KuisSound.play('wrong');
                alert("Harap jawab seluruh 5 soal Pilihan Ganda sebelum mengirimkan kuis!");
                return;
            }

            // 2. Validasi Esai (Wajib diisi)
            for (let i = 0; i < qData.essay.length; i++) {
                const e = qData.essay[i];
                const text = (this.userAnswersEssay[e.id] || '').trim();
                const wordCount = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
                if (wordCount < 3) {
                    KuisSound.play('wrong');
                    alert(`Soal Esai #${e.num} belum diisi dengan lengkap. Silakan lengkapi jawabanmu terlebih dahulu.`);
                    const textarea = document.querySelector(`.ecard-textarea[data-eid="${e.id}"]`);
                    if (textarea) textarea.focus();
                    return;
                }
            }

            // 3. Hitung Skor Pilihan Ganda (Benar / 5)
            let correctCount = 0;
            this.activeQuestions.forEach(q => {
                const userChoice = this.userAnswersPG[q.id];
                if (userChoice && userChoice.correct) {
                    correctCount++;
                }
            });

            // Kumpulkan jawaban esai dalam array
            const essayAnswersList = qData.essay.map(e => (this.userAnswersEssay[e.id] || '').trim());

            // Tampilkan Feedback Modal
            this.showFeedbackModal(qData, correctCount, essayAnswersList);
        }

        showFeedbackModal(qData, correctCount, essayAnswersList) {
            const modal = document.getElementById('kuis-modal-feedback');
            const card = document.getElementById('kuis-modal-card');
            const icon = document.getElementById('km-icon');
            const title = document.getElementById('km-title');
            const badge = document.getElementById('km-score-badge');
            const desc = document.getElementById('km-desc');
            const actions = document.getElementById('km-actions');

            if (!modal) return;

            const isPassed = (correctCount === 5); // 100% Syarat Lulus

            if (isPassed) {
                KuisSound.play('victory');
                ProgressionManager.passKuis(this.currentLevel, correctCount, essayAnswersList);

                // Tambahkan EXP bonus (+150 EXP)
                const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || 0;
                const newExp = currentExp + 150;
                localStorage.setItem('zatloka_profile_exp', newExp);
                if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                    window.ZatlokaApp.appState.profile.exp = newExp;
                }

                card.className = 'kuis-modal-card modal-passed';
                icon.textContent = '🏆';
                title.textContent = 'Selamat, Kamu Lulus 100%!';
                badge.className = 'km-score-badge badge-passed';
                badge.textContent = `Skor Pilihan Ganda: 5 / 5 (+150 EXP)`;

                const nextLvl = this.currentLevel + 1;
                let nextNote = nextLvl <= 4 
                    ? `Gelar <strong>"${qData.rankTitle}"</strong> & Materi Level ${nextLvl} berhasil terbuka!`
                    : `Luar biasa! Kamu telah menuntaskan seluruh tingkatan kuis dan meraih gelar tertinggi <strong>Master Sains</strong>!`;

                desc.innerHTML = `Analisis sainsmu sangat tajam dan tepat. ${nextNote}`;

                actions.innerHTML = `
                    <button class="btn btn-secondary" id="btn-modal-print">📄 Cetak Laporan</button>
                    <button class="btn btn-secondary" id="btn-modal-map">Peta Kuis</button>
                    ${nextLvl <= 4 ? `
                        <button class="btn btn-primary" id="btn-modal-next-materi">
                            Lanjut Eksplorasi Zat Lvl ${nextLvl} ▶
                        </button>
                    ` : `
                        <button class="btn btn-primary" id="btn-modal-finish">
                            Selesai & Ke Beranda 🏠
                        </button>
                    `}
                `;

                modal.classList.remove('hidden');

                document.getElementById('btn-modal-print').onclick = () => {
                    this.printReport(this.currentLevel);
                };

                document.getElementById('btn-modal-map').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.currentLevel = null;
                    this.showLevelMap();
                };

                const nextMateriBtn = document.getElementById('btn-modal-next-materi');
                if (nextMateriBtn) {
                    nextMateriBtn.onclick = () => {
                        KuisSound.play('click');
                        modal.classList.add('hidden');
                        if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                            window.ZatlokaApp.navigateTo('materi');
                        }
                    };
                }

                const finishBtn = document.getElementById('btn-modal-finish');
                if (finishBtn) {
                    finishBtn.onclick = () => {
                        KuisSound.play('click');
                        modal.classList.add('hidden');
                        if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                            window.ZatlokaApp.navigateTo('home');
                        }
                    };
                }

            } else {
                // TIDAK LULUS (< 5/5): PRD feedback tanpa membocorkan jawaban yang salah
                KuisSound.play('wrong');
                ProgressionManager.recordAttempt(this.currentLevel, correctCount, essayAnswersList);

                card.className = 'kuis-modal-card modal-retry';
                icon.textContent = '💡';
                title.textContent = 'Terus Berjuang, Detektif!';
                badge.className = 'km-score-badge badge-retry';
                badge.textContent = `Skor Pilihan Ganda: ${correctCount} / 5`;

                const wrongCount = 5 - correctCount;
                desc.textContent = `Skor: ${correctCount}/5. Kamu hebat, tapi ada ${wrongCount} konsep yang masih bersembunyi. Syarat kelulusan adalah 5/5. Pelajari kembali materi dan coba lagi!`;

                actions.innerHTML = `
                    <button class="btn btn-secondary" id="btn-modal-map-fail">Peta Kuis</button>
                    <button class="btn btn-primary" id="btn-modal-retry">🔄 Coba Lagi Kuis</button>
                `;

                modal.classList.remove('hidden');

                document.getElementById('btn-modal-map-fail').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.currentLevel = null;
                    this.showLevelMap();
                };

                document.getElementById('btn-modal-retry').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.startKuis(this.currentLevel); // Acak ulang kuis
                };
            }
        }

        // ==========================================
        // 4. EKSPOR LAPORAN CETAK / PDF (window.print)
        // ==========================================
        printReport(specificLevel = null) {
            const prog = ProgressionManager.get();
            const studentName = localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || 'Siswa ZatLoka';
            const studentRank = localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan';
            const studentExp = localStorage.getItem('zatloka_profile_exp') || '0';
            const studentPhoto = localStorage.getItem('studentPhoto') || null;

            const levelsToPrint = specificLevel ? [specificLevel] : [1, 2, 3, 4].filter(l => prog.scores[l] !== undefined);

            if (levelsToPrint.length === 0) {
                alert("Belum ada riwayat kuis yang diselesaikan untuk dicetak.");
                return;
            }

            // Buat iframe tersembunyi khusus cetak agar tidak merusak tampilan SPA
            let printFrame = document.getElementById('zatloka-print-frame');
            if (printFrame) printFrame.remove();

            printFrame = document.createElement('iframe');
            printFrame.id = 'zatloka-print-frame';
            printFrame.style.position = 'fixed';
            printFrame.style.top = '-9999px';
            printFrame.style.left = '-9999px';
            printFrame.style.width = '1000px';
            printFrame.style.height = '1000px';
            document.body.appendChild(printFrame);

            let reportsHtml = levelsToPrint.map(lvl => {
                const qData = KUIS_DATA[lvl];
                const score = prog.scores[lvl] || 0;
                const isPassed = prog.passedKuis.includes(lvl);
                const essayAnswers = prog.essays[lvl] || [];
                const dateStr = prog.essayDates[lvl] || '-';

                return `
                    <div class="print-level-block">
                        <div class="print-level-header">
                            <h3>${qData.badge}: ${qData.title}</h3>
                            <span class="print-status-tag ${isPassed ? 'tag-lulus' : 'tag-belum'}">
                                ${isPassed ? '✓ LULUS (100%)' : 'BELUM LULUS'}
                            </span>
                        </div>
                        <div class="print-meta-grid">
                            <div><strong>Skor Pilihan Ganda:</strong> ${score} / 5 (${score * 20}%)</div>
                            <div><strong>Waktu Pengerjaan:</strong> ${dateStr}</div>
                        </div>

                        <div class="print-essay-section">
                            <h4>Lembar Jawaban Esai Siswa:</h4>
                            ${qData.essay.map((e, idx) => `
                                <div class="print-essay-item">
                                    <div class="print-q-text"><strong>Soal ${e.num}:</strong> ${e.question}</div>
                                    ${e.asset ? `
                                        <div style="margin: 8px 0; text-align: center;">
                                            <img src="${e.asset.startsWith('assets/') ? e.asset : 'assets/images/kuis/' + e.asset}" 
                                                 alt="${e.caption || ('Ilustrasi Esai ' + e.num)}"
                                                 style="max-width: 220px; max-height: 120px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 4px; display: inline-block;" />
                                            ${e.caption ? `<p style="font-style: italic; font-size: 8.5pt; color: #475569; margin: 4px 0 0 0; text-align: center;">${e.caption}</p>` : ''}
                                        </div>
                                    ` : ''}
                                    <div class="print-ans-box">
                                        <strong>Jawaban:</strong><br/>
                                        ${essayAnswers[idx] ? essayAnswers[idx].replace(/\n/g, '<br/>') : '<em>(Belum dijawab)</em>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('<hr class="print-divider"/>');

            const printDocumentContent = `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <title>Laporan Hasil Kuis Sains - ${studentName}</title>
                    <style>
                        @page { size: A4; margin: 15mm; }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            color: #0f172a;
                            background: #ffffff;
                            margin: 0;
                            padding: 10px;
                            font-size: 11pt;
                            line-height: 1.5;
                        }
                        .print-header {
                            border-bottom: 2px solid #0284c7;
                            padding-bottom: 12px;
                            margin-bottom: 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .print-header h1 {
                            font-size: 18pt;
                            color: #0284c7;
                            margin: 0 0 4px 0;
                        }
                        .print-header p {
                            margin: 0;
                            color: #64748b;
                            font-size: 9pt;
                        }
                        .print-student-info {
                            background: #f0f9ff;
                            border: 1px solid #bae6fd;
                            border-radius: 8px;
                            padding: 12px 16px;
                            margin-bottom: 20px;
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            gap: 10px;
                        }
                        .print-student-info div {
                            font-size: 10pt;
                        }
                        .print-level-block {
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .print-level-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #cbd5e1;
                            padding-bottom: 6px;
                            margin-bottom: 10px;
                        }
                        .print-level-header h3 {
                            margin: 0;
                            font-size: 13pt;
                            color: #0369a1;
                        }
                        .print-status-tag {
                            font-weight: bold;
                            font-size: 9pt;
                            padding: 3px 8px;
                            border-radius: 4px;
                        }
                        .tag-lulus { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
                        .tag-belum { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
                        .print-meta-grid {
                            display: flex;
                            gap: 24px;
                            font-size: 10pt;
                            margin-bottom: 12px;
                            color: #334155;
                        }
                        .print-essay-section h4 {
                            margin: 10px 0 6px 0;
                            font-size: 11pt;
                            color: #0f172a;
                        }
                        .print-essay-item {
                            margin-bottom: 12px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 8px 12px;
                        }
                        .print-q-text {
                            margin: 0 0 6px 0;
                            font-size: 9.5pt;
                            color: #1e293b;
                        }
                        .print-ans-box {
                            background: #ffffff;
                            border: 1px solid #cbd5e1;
                            border-radius: 4px;
                            padding: 6px 10px;
                            font-size: 9.5pt;
                            color: #0f172a;
                        }
                        .print-divider {
                            border: none;
                            border-top: 1.5px dashed #cbd5e1;
                            margin: 24px 0;
                        }
                        .print-footer {
                            margin-top: 30px;
                            text-align: right;
                            font-size: 9pt;
                            color: #64748b;
                            border-top: 1px solid #e2e8f0;
                            padding-top: 8px;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <div>
                            <h1>ZATLOKA • Laporan Hasil Kuis IPA</h1>
                            <p>Media Pembelajaran Etnosains Bali SMP Kelas VII (Kurikulum Merdeka)</p>
                        </div>
                    </div>

                    <div class="print-student-info" style="display:flex; align-items:center; justify-content:space-between;">
                        <div>
                            <div><strong>Nama Siswa:</strong> ${studentName}</div>
                            <div><strong>Gelar Saat Ini:</strong> ${studentRank}</div>
                            <div><strong>Total EXP:</strong> ${studentExp} EXP</div>
                        </div>
                        ${studentPhoto ? `<img src="${studentPhoto}" alt="Foto Siswa" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #0284c7;">` : ''}
                    </div>

                    ${reportsHtml}

                    <div class="print-footer">
                        Dicetak secara otomatis dari Aplikasi Media Pembelajaran ZatLoka pada ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </body>
                </html>
            `;

            const doc = printFrame.contentWindow.document;
            doc.open();
            doc.write(printDocumentContent);
            doc.close();

            setTimeout(() => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            }, 400);
        }

        openPrintDialog() {
            this.printReport();
        }
    }

    // Expose Global Singletons
    window.ZatlokaProgression = ProgressionManager;
    window.ZatlokaKuis = new KuisController();

    // Auto-init on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ZatlokaKuis.init();
        // Initial rank sync
        ProgressionManager.syncRankWithState(ProgressionManager.get());
    });

})();
