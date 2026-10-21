/* ==========================================================================
   ZATLOKA MATERI CONTROLLER (LEVEL 1-4)
   Handles Slide engine, Peta Level, Lottie Mascot, and interactive simulations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS & STATE
    const materiScreen = document.getElementById('materi-screen');
    if (!materiScreen) return; // Exit if not in index.html (safety check)

    const slides = document.querySelectorAll('.materi-slide');
    const prevBtn = document.getElementById('materi-prev-btn');
    const nextBtn = document.getElementById('materi-next-btn');
    const slideNumDisplay = document.getElementById('materi-slide-number');
    const levelBadge = document.getElementById('materi-level-badge');
    const slideTitle = document.getElementById('materi-slide-title');
    const dotsContainer = document.getElementById('materi-dots-container');
    
    // Popup Elements
    const popupOverlay = document.getElementById('materi-popup');
    const popupBody = document.getElementById('materi-popup-body');
    const popupClose = document.getElementById('materi-popup-close');

    // Mascot Elements
    const mascotContainer = document.getElementById('kima-mascot-container');
    const mascotBubbleText = document.getElementById('kima-bubble-text');

    let currentLevel = null;
    let levelSlides = [];
    let currentSlideIndex = 0;
    let currentSlide = 1;
    let kimaLottie = null;
    let mascotTimeout = null;
    
    // State of interactions
    const clickedHotspots = { bambu: false, tetesan: false, uap: false };
    let dupaGameCompleted = false;
    const droppedItems = { bambu: false, telur: false, koin: false };

    // Slide Metadata (Level and Title for Header)
    const slideMetadata = {
        1: { level: 'Level 1: Wujud Zat & Model Partikel', title: 'Rahasia Penyulingan Arak Bali' },
        2: { level: 'Level 1: Wujud Zat & Model Partikel', title: 'Menembus Partikel Rahasia' },
        3: { level: 'Level 2: Perubahan Wujud Zat', title: 'Rahasia Es Daluman Bali' },
        4: { level: 'Level 2: Perubahan Wujud Zat', title: 'Tradisi Penyulingan Arak (Menguap & Mengembun)' },
        5: { level: 'Level 2: Perubahan Wujud Zat', title: 'Pengharum Kamar (Menyublim)' },
        6: { level: 'Level 2: Perubahan Wujud Zat', title: 'Tradisi Garam Kusamba (Pembentukan Kristal)' },
        7: { level: 'Level 2: Perubahan Wujud Zat', title: 'Batas Suhu Perubahan Wujud' },
        8: { level: 'Level 2: Perubahan Wujud Zat', title: 'Ringkasan Perubahan Wujud Zat & Kalor' },
        9: { level: 'Level 3: Perubahan Fisika & Kimia', title: 'Perubahan Fisika & Kimia' },
        10: { level: 'Level 4: Kerapatan & Massa Jenis', title: 'Rahasia Mengapung, Melayang, dan Tenggelam' },
        11: { level: 'Level 4: Kerapatan & Massa Jenis', title: 'Perhitungan Massa Jenis' }
    };

    // 2. LEVEL MAP NAVIGATION & SPA LINKING
    function refreshLevelMapUI() {
        if (!window.ZatlokaProgression) return;
        const prog = window.ZatlokaProgression.get();

        document.querySelectorAll('.level-map-btn').forEach(btn => {
            const lvl = parseInt(btn.getAttribute('data-level'), 10);
            const isUnlocked = window.ZatlokaProgression.isMateriUnlocked(lvl);
            const isCompleted = prog.completedMateri.includes(lvl);
            const statusIcon = btn.querySelector('.level-status-icon');

            if (isUnlocked) {
                btn.classList.remove('locked-level');
                btn.removeAttribute('disabled');
                if (statusIcon) {
                    statusIcon.innerHTML = isCompleted ? '⭐ Selesai Dibaca' : '🔓 Mulai';
                    statusIcon.className = 'level-status-icon status-unlocked';
                }
            } else {
                btn.classList.add('locked-level');
                btn.removeAttribute('disabled'); // Keep clickable so startLevel can show feedback alert
                if (statusIcon) {
                    statusIcon.innerHTML = `🔒 Lulus Kuis Lvl ${lvl - 1}`;
                    statusIcon.className = 'level-status-icon status-locked';
                }
            }
        });
    }

    function clearAllVignettes() {
        const screenVignetteGlobal = document.getElementById('screen-vignette-global');
        if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay';
        const vignetteOverlayL22 = document.getElementById('vignette-overlay-l22');
        if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay';
    }

    function showLevelMap() {
        clearAllVignettes();
        document.getElementById('materi-header').style.display = 'none';
        document.getElementById('materi-footer').style.display = 'none';
        slides.forEach(slide => slide.classList.remove('active'));
        document.getElementById('materi-level-map').style.display = 'flex';
        currentLevel = null;
        levelSlides = [];
        currentSlideIndex = 0;
        refreshLevelMapUI();
    }

    function exitLevelToMap(isCompleted = false) {
        clearAllVignettes();
        resetMateriSlides();
        if (isCompleted && currentLevel) {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.completeMateri(currentLevel);
            }
            showMascotBubble(`Luar biasa! Kamu menyelesaikan Level ${currentLevel}! Kuis Level ${currentLevel} sekarang telah TERBUKA!`);
        }
        showLevelMap();
    }

    function startLevel(levelNum) {
        if (window.ZatlokaProgression && !window.ZatlokaProgression.isMateriUnlocked(levelNum)) {
            alert(`🔒 Materi Level ${levelNum} masih terkunci!\n\nSelesaikan membaca materi dan raih skor 100% pada Kuis Level ${levelNum - 1} untuk membukanya.`);
            return;
        }

        resetMateriSlides();
        currentLevel = levelNum;
        if (levelNum === 1) {
            levelSlides = [1, 2];
        } else if (levelNum === 2) {
            levelSlides = [3, 4, 5, 6, 7, 8];
        } else if (levelNum === 3) {
            levelSlides = [9];
        } else if (levelNum === 4) {
            levelSlides = [10, 11];
        }
        currentSlideIndex = 0;
        currentSlide = levelSlides[currentSlideIndex];
        
        // Hide Level Map
        document.getElementById('materi-level-map').style.display = 'none';
        
        // Show Header and Footer
        document.getElementById('materi-header').style.display = 'flex';
        document.getElementById('materi-footer').style.display = 'flex';
        
        // Dynamically build progress dots
        buildProgressDots();
        
        updateSlidesUI();
    }

    function buildProgressDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        levelSlides.forEach((slideNum, idx) => {
            const dot = document.createElement('span');
            dot.className = 'progress-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('data-target-slide', slideNum);
            dot.addEventListener('click', () => {
                currentSlideIndex = idx;
                currentSlide = levelSlides[currentSlideIndex];
                updateSlidesUI();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Attach level map button click events
    document.querySelectorAll('.level-map-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lvl = parseInt(btn.getAttribute('data-level'), 10);
            startLevel(lvl);
        });
    });

    // Back to map buttons
    document.querySelectorAll('#materi-home-btn, [id="materi-level-map"] .back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.id === 'materi-home-btn') {
                e.stopPropagation();
                exitLevelToMap();
            }
        });
    });

    // Expose for external SPA syncing
    window.ZatlokaMateri = {
        refreshLevelMapUI,
        showLevelMap,
        startLevel
    };


    // 3. SLIDE NAVIGATION ENGINE
    function updateSlidesUI() {
        // Reset any atmospheric vignette overlay on slide transition
        const screenVignetteGlobal = document.getElementById('screen-vignette-global');
        if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay';
        const vignetteOverlayL22 = document.getElementById('vignette-overlay-l22');
        if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay';

        slides.forEach(slide => {
            slide.classList.remove('active');
            if (parseInt(slide.getAttribute('data-slide')) === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Ensure navigation footer is visible
        const footer = document.getElementById('materi-footer');
        if (footer) footer.style.display = 'flex';

        // Update progress text (based on level slides)
        slideNumDisplay.textContent = `${currentSlideIndex + 1} / ${levelSlides.length}`;

        // Update header metadata
        if (slideMetadata[currentSlide]) {
            levelBadge.textContent = slideMetadata[currentSlide].level;
            slideTitle.textContent = slideMetadata[currentSlide].title;
        }

        // Update dots
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.getAttribute('data-target-slide')) === currentSlide) {
                dot.classList.add('active');
            }
        });

        // Trigger Mascot dialogue on entry to a new level
        triggerLevelMascotTalk();
    }

    // Footer buttons event binding
    prevBtn.onclick = () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            currentSlide = levelSlides[currentSlideIndex];
            updateSlidesUI();
        } else {
            exitLevelToMap();
        }
    };

    nextBtn.onclick = () => {
        if (currentSlideIndex < levelSlides.length - 1) {
            currentSlideIndex++;
            currentSlide = levelSlides[currentSlideIndex];
            updateSlidesUI();
        } else {
            if (currentLevel) {
                showLevelCompleteModal(currentLevel);
            } else {
                exitLevelToMap(true);
            }
        }
    };

    // Modal Pilihan Akhir Level (Lanjut ke Kuis / Kembali ke Peta)
    function showLevelCompleteModal(levelNum) {
        clearAllVignettes();
        
        // Tandai materi level ini selesai di sistem progresi
        if (window.ZatlokaProgression) {
            window.ZatlokaProgression.completeMateri(levelNum);
        }

        const levelNames = {
            1: "Wujud Zat & Model Partikel",
            2: "Perubahan Wujud Zat",
            3: "Perubahan Fisika & Kimia",
            4: "Kerapatan & Massa Jenis"
        };

        const modal = document.getElementById('materi-level-complete-modal');
        if (!modal) {
            exitLevelToMap(true);
            return;
        }

        const titleEl = document.getElementById('materi-complete-title');
        const descEl = document.getElementById('materi-complete-desc');
        const badgeEl = document.getElementById('materi-complete-badge');
        const quizLvlSpan = document.getElementById('materi-complete-quiz-lvl');

        if (badgeEl) badgeEl.textContent = `LEVEL ${levelNum} SELESAI!`;
        if (titleEl) titleEl.textContent = `Selamat! Materi Level ${levelNum} Tuntas`;
        if (descEl) descEl.innerHTML = `Kamu telah menyelesaikan seluruh materi <strong>${levelNames[levelNum] || `Level ${levelNum}`}</strong>. Kuis untuk Level ${levelNum} sekarang telah terbuka!`;
        if (quizLvlSpan) quizLvlSpan.textContent = levelNum;

        modal.classList.remove('hidden');

        // Button 1: Langsung Lanjut ke Kuis Level Ini
        const btnGoQuiz = document.getElementById('btn-materi-go-quiz');
        if (btnGoQuiz) {
            btnGoQuiz.onclick = () => {
                modal.classList.add('hidden');
                resetMateriSlides();
                showLevelMap();
                if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                    window.ZatlokaApp.navigateTo('quiz');
                }
                if (window.ZatlokaKuis && typeof window.ZatlokaKuis.startKuis === 'function') {
                    window.ZatlokaKuis.startKuis(levelNum);
                }
            };
        }

        // Button 2: Kembali ke Peta Level
        const btnGoMap = document.getElementById('btn-materi-go-map');
        if (btnGoMap) {
            btnGoMap.onclick = () => {
                modal.classList.add('hidden');
                exitLevelToMap(true);
            };
        }
    }

    // 4. MASCOT (KIMA) CONTROLLER
    function initKimaMascot() {
        if (!document.getElementById('kima-lottie')) return;
        
        try {
            kimaLottie = lottie.loadAnimation({
                container: document.getElementById('kima-lottie'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: window.KIMA_MASCOT_DATA
            });
        } catch (e) {
            console.log("Lottie failed to load, falling back. Error: ", e);
        }
    }

    function showMascotBubble(text) {
        if (mascotTimeout) clearTimeout(mascotTimeout);
        
        mascotBubbleText.textContent = text;
        mascotContainer.classList.add('visible');

        mascotTimeout = setTimeout(() => {
            mascotContainer.classList.remove('visible');
        }, 6000);
    }

    function triggerLevelMascotTalk() {
        if (currentSlide === 1) {
            showMascotBubble("Hebat! Kamu menemukan petunjuk baru, mari amati wujud zat!");
        } else if (currentSlide === 3) {
            showMascotBubble("Es Daluman segar sekali! Mari pelajari pelelehan zat!");
        } else if (currentSlide === 8) {
            showMascotBubble("Perhatikan bagan perubahan wujud zat dan arah perpindahan kalornya!");
        } else if (currentSlide === 9) {
            showMascotBubble("Klik tombol pada kartu untuk memicu perubahannya, lalu balik kartu untuk mempelajari konsepnya!");
        } else if (currentSlide === 10) {
            showMascotBubble("Wah, kolam air! Mari uji kerapatan benda-benda ini!");
        }
    }

    // Initialize mascot immediately
    initKimaMascot();

    // 5. POPUP SYSTEM HANDLERS
    function openMateriPopup(htmlContent) {
        popupBody.innerHTML = htmlContent;
        popupOverlay.style.display = 'flex';
        popupOverlay.offsetHeight; // Force reflow
        popupOverlay.classList.add('active');
    }

    function closeMateriPopup() {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    }

    popupClose.addEventListener('click', closeMateriPopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) closeMateriPopup();
    });

    // 6. LEVEL 1.1: ARAK BALI HOTSPOTS
    const hotspots = {
        bambu: {
            element: document.getElementById('hotspot-bambu'),
            title: 'Wujud Padat (Bambu Suling)',
            text: 'Bambu penyulingan memiliki wujud <strong>PADAT</strong>. Zat dalam wujud padat memiliki bentuk dan volume yang selalu tetap, serta tidak berubah meskipun dipindahkan ke tempat yang berbeda.'
        },
        tetesan: {
            element: document.getElementById('hotspot-tetesan'),
            title: 'Wujud Cair (Tetesan Arak)',
            text: 'Tetesan arak memiliki wujud <strong>CAIR</strong>. Zat dalam wujud cair memiliki volume yang tetap, tetapi bentuknya selalu berubah mengikuti bentuk wadah penampungnya.'
        },
        uap: {
            element: document.getElementById('hotspot-uap'),
            title: 'Wujud Gas (Uap Panas)',
            text: 'Uap panas yang mengepul memiliki wujud <strong>GAS</strong>. Zat dalam wujud gas tidak memiliki bentuk dan volume yang tetap; bentuk dan volumenya selalu berubah memenuhi seluruh ruang yang ditempatinya.'
        }
    };

    Object.keys(hotspots).forEach(key => {
        const hotspot = hotspots[key];
        if (hotspot.element) {
            hotspot.element.addEventListener('click', () => {
                const content = `
                    <div class="popup-inner-wujud">
                        <h3>${hotspot.title}</h3>
                        <p>${hotspot.text}</p>
                    </div>
                `;
                openMateriPopup(content);

                if (!clickedHotspots[key]) {
                    clickedHotspots[key] = true;
                    if (clickedHotspots.bambu && clickedHotspots.tetesan && clickedHotspots.uap) {
                        setTimeout(() => {
                            showMascotBubble("Hebat, kamu menemukan semua wujud zat di penyulingan ini!");
                        }, 500);
                    }
                }
            });
        }
    });

    // 7. LEVEL 1.2: TAB HANDLERS
    const tabButtons = document.querySelectorAll('.tab-materi-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === `tab-${targetTab}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 8. LEVEL 2.1: ES DALUMAN (STATE SWAPPING & CROSS-FADE ANIMATION)
    const dalumanImgPadat = document.getElementById('daluman-img-padat');
    const dalumanImgCair = document.getElementById('daluman-img-cair');
    const btnPanasDaluman = document.getElementById('btn-panas-daluman');
    const btnBekuDaluman = document.getElementById('btn-beku-daluman');
    const dalumanTextDesc = document.getElementById('daluman-text-desc');

    if (btnPanasDaluman && btnBekuDaluman) {
        btnPanasDaluman.addEventListener('click', () => {
            if (dalumanImgPadat) dalumanImgPadat.style.opacity = '0';
            if (dalumanImgCair) dalumanImgCair.style.opacity = '1';
            if (dalumanTextDesc) {
                dalumanTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #d97706; font-size: 0.95rem; font-weight: 700;">1. Meleleh (Padat → Cair)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari padat menjadi cair (contoh: es batu yang dipanaskan hingga mencair).</li>
                            <li><strong>Penyebab:</strong> Adanya penyerapan energi panas dari api atau perpindahan panas dari lingkungan sekitar.</li>
                            <li><strong>Mekanisme Partikel:</strong> Panas memberikan energi bagi partikel untuk bergetar lebih cepat. Terbentuk rongga antarpartikel yang lebih renggang, serta ikatan antarpartikel melemah secara bertahap hingga zat berubah wujud menjadi cair.</li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Daluman mencair saat menyerap energi panas!");
        });

        btnBekuDaluman.addEventListener('click', () => {
            if (dalumanImgPadat) dalumanImgPadat.style.opacity = '1';
            if (dalumanImgCair) dalumanImgCair.style.opacity = '0';
            if (dalumanTextDesc) {
                dalumanTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">2. Membeku (Cair → Padat)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari cair menjadi padat (contoh: air yang dimasukkan ke dalam freezer menjadi es).</li>
                            <li><strong>Penyebab:</strong> Pelepasan energi panas karena suhu yang sangat dingin (panas keluar ke udara sekitar atau lingkungan).</li>
                            <li><strong>Mekanisme Partikel:</strong> Kehilangan panas membuat partikel air bergerak lebih lambat dan saling mendekat. Terbentuk ikatan yang lebih kuat antarpartikel sehingga partikel tidak bisa bebas bergerak lagi dan hanya bergetar di tempat.</li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Daluman kembali membeku saat melepaskan energi panas!");
        });
    }

    // 9. LEVEL 2.2: ARAK (MENGUAP & MENGEMBUN)
    const btnDidihL22 = document.getElementById('btn-didih-l22');
    const btnDinginL22 = document.getElementById('btn-dingin-l22');
    const arakImgDefault = document.getElementById('arak-img-default');
    const arakImgHeating = document.getElementById('arak-img-heating');
    const arakImgCooling = document.getElementById('arak-img-cooling');
    const arakTextCol = document.getElementById('arak-text-col') || document.getElementById('evap-text-l22');
    const screenVignetteGlobal = document.getElementById('screen-vignette-global');

    if (btnDidihL22 && btnDinginL22) {
        btnDidihL22.addEventListener('click', () => {
            // Logika Animasi Fade Gambar: arak_2_heating opacity = 1, arak_3_cooling opacity = 0
            if (arakImgHeating) arakImgHeating.style.opacity = '1';
            if (arakImgCooling) arakImgCooling.style.opacity = '0';

            // Ubah state/warna tombol agar terlihat aktif
            btnDidihL22.classList.add('active');
            btnDinginL22.classList.remove('active');

            // Efek visual atmosfer layar
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-red';

            // Render teks di Kolom Kanan: Materi PENGUAPAN (Sains & Etnosains)
            if (arakTextCol) {
                arakTextCol.innerHTML = `
                    <div class="arak-content-fade">
                        <div style="display: inline-block; background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                            🔥 Proses Pemanasan (Menyerap Kalor)
                        </div>
                        <h3 style="margin: 0 0 0.4rem 0; color: #b91c1c; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                            1. Menguap & Mendidih (Cair → Gas)
                        </h3>
                        <p style="margin: 0 0 0.5rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                            <strong>Kearifan Etnosains Bali:</strong> Wadah tembaga di atas tungku batu bata dipanaskan menggunakan bara api kayu bakar. Kalor panas diserap oleh cairan bahan arak (tuak nira) hingga mendidih. Alkohol memiliki titik didih lebih rendah (~78°C) dibanding air (~100°C), sehingga partikel alkohol akan menguap lebih dahulu membubung naik ke bagian atas wadah penyulingan.
                        </p>
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0 0 0.3rem 0; color: #991b1b; font-size: 0.82rem; font-weight: 700;">Konsep Sains Penting:</h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #374151; line-height: 1.45; display: flex; flex-direction: column; gap: 0.25rem;">
                                <li><strong>Menguap:</strong> Perubahan wujud zat dari cair menjadi uap (gas) yang terjadi di permukaan zat dalam wujud cair pada suhu tertentu dan dapat terjadi di bawah titik didih.</li>
                                <li><strong>Mendidih:</strong> Perubahan wujud cair menjadi gas yang terjadi di seluruh bagian zat dalam wujud cair pada titik didihnya (ditandai dengan munculnya gelembung-gelembung air yang naik ke permukaan).</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            if (typeof showMascotBubble === 'function') {
                showMascotBubble("Cairan tuak arak di panci menyerap kalor hingga mendidih dan menguap!");
            }
        });

        btnDinginL22.addEventListener('click', () => {
            // Logika Animasi Fade Gambar: arak_3_cooling opacity = 1, arak_2_heating opacity = 0
            if (arakImgCooling) arakImgCooling.style.opacity = '1';
            if (arakImgHeating) arakImgHeating.style.opacity = '0';

            // Ubah state/warna tombol agar terlihat aktif
            btnDinginL22.classList.add('active');
            btnDidihL22.classList.remove('active');

            // Efek visual atmosfer layar
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-blue';

            // Render teks di Kolom Kanan: Materi PENGEMBUNAN / KONDENSASI (Sains & Etnosains)
            if (arakTextCol) {
                arakTextCol.innerHTML = `
                    <div class="arak-content-fade">
                        <div style="display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                            ❄️ Proses Pendinginan (Melepaskan Kalor)
                        </div>
                        <h3 style="margin: 0 0 0.4rem 0; color: #1d4ed8; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                            2. Mengembun / Kondensasi (Gas → Cair)
                        </h3>
                        <p style="margin: 0 0 0.5rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                            <strong>Kearifan Etnosains Bali (Destilasi Arak Bali):</strong> Uap arak yang membubung diarahkan melewati pipa bambu panjang (<em>bumbung penyulingan</em>). Faktor lingkungan luar berperan besar karena pipa bambu bersentuhan langsung dengan udara sekitar yang bersuhu lebih dingin, sehingga berfungsi sebagai kondensor alami. Akibat pengaruh lingkungan yang sejuk ini, uap panas di dalam pipa melepaskan kalor secara cepat dan terkondensasi menjadi tetesan arak cair murni yang mengalir ke penampungan.
                        </p>
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0 0 0.3rem 0; color: #1e40af; font-size: 0.82rem; font-weight: 700;">Konsep Sains Penting:</h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #374151; line-height: 1.45; display: flex; flex-direction: column; gap: 0.25rem;">
                                <li><strong>Mengembun:</strong> Perubahan wujud zat dari gas menjadi cair (kebalikan dari proses menguap).</li>
                                <li><strong>Faktor Penyebab & Pengaruh Lingkungan:</strong> Terjadi karena adanya perbedaan suhu dengan lingkungan sekitar yang lebih dingin. Lingkungan luar menyerap panas dari uap, sehingga terjadi perpindahan kalor keluar sistem secara signifikan.</li>
                                <li><strong>Mekanisme Partikel:</strong> Akibat pengaruh lingkungan yang mendinginkan sistem tersebut, partikel-partikel gas kehilangan energi kinetiknya, memperlambat gerakannya, lalu saling mendekat, merapat, dan berikatan kembali membentuk tetesan zat dalam wujud cair.</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            if (typeof showMascotBubble === 'function') {
                showMascotBubble("Uap gas arak mendingin di dalam bambu dan mengembun!");
            }
        });
    }

    // 10. LEVEL 2.3: BARUS (SUBLIMASI)
    const btnPanasBarus = document.getElementById('btn-panas-barus');
    const sublimBg = document.getElementById('sublim-bg');
    const sublimKapur = document.getElementById('sublim-kapur');
    const sublimGas = document.getElementById('sublim-gas');
    const sublimTextDesc = document.getElementById('sublim-text-desc');

    if (btnPanasBarus) {
        btnPanasBarus.addEventListener('click', () => {
            if (sublimKapur) sublimKapur.style.opacity = '0'; // Kapur memudar
            if (sublimGas) {
                sublimGas.style.opacity = '0.85';
                sublimGas.style.transform = 'translateY(-25px)';
            }
            if (sublimTextDesc) {
                sublimTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #b45309; font-size: 0.95rem; font-weight: 700;">1. Menyublim (Padat → Gas)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari padat langsung menjadi gas tanpa melalui tahapan cair terlebih dahulu.</li>
                            <li><strong>Contoh:</strong> Es kering (<em>dry ice</em>) yang digunakan untuk menciptakan efek kabut; dan Kapur barus (kamper) di dalam lemari pakaian yang lama-kelamaan habis menguap ke udara, yang dipengaruhi oleh adanya suhu lingkungan.</li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Kapur barus menyublim langsung menjadi gas aroma wangi!");
        });
    }

    // 10.5 LEVEL 2.4: GARAM KUSAMBA (PEMBENTUKAN KRISTAL)
    const saltSunSlider = document.getElementById('salt-sun-slider');
    const saltWaterImg = document.getElementById('salt-water-img');
    const saltCrystalsImg = document.getElementById('salt-crystals-img');
    const saltSteamImg = document.getElementById('salt-steam-img');
    const saltDynamicStatus = document.getElementById('salt-dynamic-status');
    const saltValDisplay = document.getElementById('salt-val-display');

    function updateSaltSliderUI(val) {
        const opacityWater = (100 - val) / 100;
        const opacityCrystals = val / 100;

        if (saltWaterImg) saltWaterImg.style.opacity = opacityWater;
        if (saltCrystalsImg) saltCrystalsImg.style.opacity = opacityCrystals;

        // Evaporation steam opacity curve (reaches max at 50% and fades out by 100%)
        if (val > 0 && val < 100) {
            const steamOpacity = Math.sin((val / 100) * Math.PI) * 0.85;
            if (saltSteamImg) saltSteamImg.style.opacity = steamOpacity;
        } else {
            if (saltSteamImg) saltSteamImg.style.opacity = 0;
        }

        if (saltValDisplay) saltValDisplay.textContent = val;

        // Logika pengkondisian teks dinamis berdasarkan slider:
        // a. Jika slider berada di angka 0% hingga 30%:
        // b. Jika slider berada di angka 31% hingga 79%:
        // c. Jika slider berada di angka 80% hingga 100%:
        if (saltDynamicStatus) {
            if (val <= 30) {
                saltDynamicStatus.textContent = "Air laut masih mendominasi; panas matahari mulai memasok energi untuk memulai penguapan pelarut.";
                saltDynamicStatus.style.background = "#f0f9ff";
                saltDynamicStatus.style.borderLeftColor = "#0284c7";
                saltDynamicStatus.style.color = "#0369a1";
            } else if (val <= 79) {
                saltDynamicStatus.textContent = "Panas matahari mempercepat penguapan air ke udara, partikel zat terlarut mulai saling mendekat.";
                saltDynamicStatus.style.background = "#fffbeb";
                saltDynamicStatus.style.borderLeftColor = "#f59e0b";
                saltDynamicStatus.style.color = "#b45309";
            } else {
                saltDynamicStatus.textContent = "Air seluruhnya menguap, meninggalkan endapan kristal garam padat murni di wadah.";
                saltDynamicStatus.style.background = "#f0fdf4";
                saltDynamicStatus.style.borderLeftColor = "#16a34a";
                saltDynamicStatus.style.color = "#15803d";
            }
        }

        if (val === 100) {
            showMascotBubble("Air laut menguap habis meninggalkan endapan kristal garam Kusamba!");
        }
    }

    if (saltSunSlider) {
        saltSunSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            updateSaltSliderUI(val);
        });
    }

    // 11. LEVEL 2.5: TERMOMETER TITIK DIDIH & LELEH
    const tempSlider = document.getElementById('temp-slider-l24');
    const tempDisplay = document.getElementById('temp-val-display');
    const tempFill = document.getElementById('thermometer-fill');
    const tempTextDesc = document.getElementById('temp-text-desc');

    function updateWaterState(val) {
        const waterContainer = document.getElementById('water-container');
        const waterStatePill = document.getElementById('water-state-pill');
        if (!waterContainer) return;

        // Reset state classes
        waterContainer.classList.remove('is-frozen', 'is-freezing', 'is-liquid', 'is-heating', 'is-boiling');

        let freezeFactor = 0;
        let boilFactor = 0;

        if (val < 0) {
            // Transisi membeku bertahap dari 0C turun menuju -20C
            freezeFactor = Math.abs(val) / 20.0; // 0.05 di -1C hingga 1.0 di -20C

            if (val === -20) {
                // Membeku Sempurna hanya pada titik beku -20C (gelombang berhenti, es padat)
                waterContainer.classList.add('is-frozen');
                if (waterStatePill) {
                    waterStatePill.textContent = '❄️ Titik Beku (Es Padat Sempurna)';
                    waterStatePill.style.background = '#e0f2fe';
                    waterStatePill.style.color = '#0284c7';
                    waterStatePill.style.borderColor = '#bae6fd';
                }
            } else {
                // Membeku sedikit demi sedikit dengan transisi halus (tetap terlihat proses membeku/mencair)
                waterContainer.classList.add('is-freezing');
                if (waterStatePill) {
                    const percent = Math.round(freezeFactor * 100);
                    waterStatePill.textContent = `❄️ Proses Membeku (${percent}%)`;
                    waterStatePill.style.background = '#e0f2fe';
                    waterStatePill.style.color = '#0284c7';
                    waterStatePill.style.borderColor = '#bae6fd';
                }
            }
        } else if (val <= 60) {
            // Wujud Cair normal (0C s.d. 60C)
            freezeFactor = 0;
            boilFactor = 0;
            waterContainer.classList.add('is-liquid');
            if (waterStatePill) {
                waterStatePill.textContent = val === 0 ? '💧 Titik Leleh (Mencair)' : '💧 Wujud Cair (Air)';
                waterStatePill.style.background = '#f0f9ff';
                waterStatePill.style.color = '#0284c7';
                waterStatePill.style.borderColor = '#bae6fd';
            }
        } else if (val < 100) {
            // Transisi memanas menuju titik didih (60C s.d. 99C): gelembung & uap mulai muncul bertahap
            freezeFactor = 0;
            boilFactor = (val - 60) / 40.0; // 0.025 di 61C hingga 0.975 di 99C
            waterContainer.classList.add('is-liquid', 'is-heating');
            if (waterStatePill) {
                const percent = Math.round(boilFactor * 100);
                waterStatePill.textContent = `♨️ Mulai Memanas (${percent}%)`;
                waterStatePill.style.background = '#fff7ed';
                waterStatePill.style.color = '#ea580c';
                waterStatePill.style.borderColor = '#ffedd5';
            }
        } else if (val === 100) {
            // Titik Didih Sempurna pada 100C: gelembung aktif & uap tebal membubung
            freezeFactor = 0;
            boilFactor = 1.0;
            waterContainer.classList.add('is-boiling');
            if (waterStatePill) {
                waterStatePill.textContent = '♨️ Titik Didih (Uap & Mendidih)';
                waterStatePill.style.background = '#fff1f2';
                waterStatePill.style.color = '#e11d48';
                waterStatePill.style.borderColor = '#fecdd3';
            }
        }

        // Terapkan faktor freeze & boil ke CSS variabel secara dinamis dan presisi
        waterContainer.style.setProperty('--freeze-factor', freezeFactor.toFixed(3));
        waterContainer.style.setProperty('--boil-factor', boilFactor.toFixed(3));
    }

    if (tempSlider) {
        // Inisialisasi awal saat halaman dimuat
        updateWaterState(parseInt(tempSlider.value || 25));

        tempSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (tempDisplay) tempDisplay.textContent = val;
            
            // Adjust thermometer graphic fill (range -20 to 100 -> total 120)
            const percent = (val + 20) / 120;
            const fillHeight = 10 + (percent * 90); // 10% to 100%
            if (tempFill) tempFill.style.height = `${fillHeight}%`;

            const tempBulb = document.getElementById('thermometer-bulb');

            // Update wujud wadah air (CSS Water Container)
            updateWaterState(val);

            if (val === -20) {
                // a. Suhu menyentuh tepat -20C memicu keterangan Titik Beku sepenuhnya
                if (tempFill) tempFill.style.background = 'linear-gradient(to top, #0284c7, #38bdf8)';
                if (tempBulb) tempBulb.style.background = '#0284c7';
                if (tempDisplay) tempDisplay.style.background = '#e0f2fe';

                tempTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">1. Titik Beku (Membeku: Zat Padat / Es)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
                            <li><strong>Pengertian:</strong> Suhu tertentu ketika suatu zat dalam wujud cair mulai membeku dan berubah wujud menjadi zat dalam wujud padat sepenuhnya.</li>
                            <li><strong>Perubahan Wujud:</strong> Zat dalam Wujud Cair &rarr; Zat dalam Wujud Padat (Contoh: Air cair yang berubah menjadi es batu).</li>
                            <li><strong>Kondisi Suhu:</strong> Ketika suatu zat mencapai titik bekunya, pelepasan energi panas (pendinginan) membuat partikel-partikel zat dalam wujud cair yang tadinya bergerak bebas mulai melambat, mendekat, dan terikat kaku membentuk struktur padat. Suhu zat akan tetap konstan selama proses pembekuan berlangsung hingga seluruh cairan berubah menjadi padat.</li>
                            <li><strong>Contoh dalam Kehidupan:</strong> Air murni memiliki titik beku standar pada suhu 0 derajat Celcius di tekanan normal. Pendinginan air di bawah titik beku (hingga suhu -20 derajat Celcius di dalam lemari pendingin/freezer) mengubah air cair menjadi es batu yang padat dan keras.</li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Suhu -20°C! Air membeku sepenuhnya menjadi es batu yang padat!");
            } else if (val < 0) {
                // Suhu di bawah 0C sebelum -20C (-19C s.d. -1C): Tampilkan suhu dan proses pembekuan bertahap
                if (tempFill) tempFill.style.background = 'linear-gradient(to top, #0284c7, #38bdf8)';
                if (tempBulb) tempBulb.style.background = '#0284c7';
                if (tempDisplay) tempDisplay.style.background = '#e0f2fe';

                tempTextDesc.innerHTML = `Suhu air saat ini berada pada <strong>${val}°C</strong> (proses pembekuan es bertahap). Es mulai terbentuk sedikit demi sedikit dan baru membeku sempurna pada Titik Beku <strong>-20°C</strong>. Geser hingga menyentuh <strong>-20°C</strong> untuk penjelasan Titik Beku lengkap!`;
            } else if (val === 0) {
                // b. Suhu 0C memicu state "Titik Leleh/Lebur"
                if (tempFill) tempFill.style.background = 'linear-gradient(to top, #0ea5e9, #38bdf8)';
                if (tempBulb) tempBulb.style.background = '#0ea5e9';
                if (tempDisplay) tempDisplay.style.background = '#e0f2fe';

                tempTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">2. Titik Leleh (Mencair: Zat Padat ke Zat Cair)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
                            <li><strong>Pengertian:</strong> Suhu tertentu ketika suatu zat dalam wujud padat mulai mencair dan berubah wujud menjadi zat dalam wujud cair sepenuhnya.</li>
                            <li><strong>Perubahan Wujud:</strong> Zat dalam Wujud Padat &rarr; Zat dalam Wujud Cair (Contoh: Es batu yang berubah menjadi air cair).</li>
                            <li><strong>Kondisi Suhu:</strong> Ketika suatu zat mencapai titik lelehnya, penambahan kalor (panas) membuat partikel-partikel zat dalam wujud padat yang tadinya bergetar rapat mulai longgar, merenggang, dan mencair. Suhu zat akan tetap konstan selama proses pelelehan berlangsung hingga seluruh zat dalam wujud padat berubah menjadi cair.</li>
                            <li><strong>Contoh dalam Kehidupan:</strong> Es murni memiliki titik leleh pada suhu 0 derajat Celcius. Logam emas memiliki titik leleh yang sangat tinggi (1.064 derajat Celcius) sehingga harus dipanaskan dengan api khusus oleh perajin perhiasan di Bali untuk bisa dicetak.</li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Suhu 0°C! Ini adalah Titik Leleh es!");
            } else if (val === 100) {
                // c. Suhu 100C memicu state "Titik Didih" (Zat Gas/Uap)
                if (tempFill) tempFill.style.background = 'linear-gradient(to top, #ef4444, #f87171)';
                if (tempBulb) tempBulb.style.background = '#ef4444';
                if (tempDisplay) tempDisplay.style.background = '#fee2e2';

                tempTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #dc2626; font-size: 0.95rem; font-weight: 700;">3. Titik Didih (Menguap: Zat Cair ke Gas)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
                            <li><strong>Pengertian:</strong> Suhu tertentu ketika suatu zat dalam wujud cair mulai mendidih dan berubah wujud menjadi gas (uap) secara serentak di seluruh bagian zat dalam wujud cair.</li>
                            <li><strong>Perubahan Wujud:</strong> Zat dalam Wujud Cair &rarr; Gas / Uap (Contoh: Air mendidih di dalam panci yang mengeluarkan uap).</li>
                            <li><strong>Kondisi Suhu:</strong> Berbeda dengan penguapan biasa (yang bisa terjadi di permukaan pada suhu berapa pun), titik didih terjadi pada suhu tetap di mana tekanan uap jenuh cairan sama dengan tekanan udara luar. Saat tercapai, suhu cairan tidak akan naik lagi melebihi titik didihnya sebelum seluruh cairan habis menguap.</li>
                            <li><strong>Contoh dalam Kehidupan:</strong> Air murni memiliki titik didih standar pada suhu 100 derajat Celcius di tekanan normal. Pada proses penyulingan arak Bali (destilasi), uap alkohol dan air dipisahkan berdasarkan perbedaan titik didihnya masing-masing.</li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Suhu 100°C! Air mencapai Titik Didih dan menguap!");
            } else {
                if (val >= 60) {
                    if (tempFill) tempFill.style.background = 'linear-gradient(to top, #ea580c, #f97316)';
                    if (tempBulb) tempBulb.style.background = '#ea580c';
                    if (tempDisplay) tempDisplay.style.background = '#ffedd5';

                    tempTextDesc.innerHTML = `Suhu air saat ini berada pada <strong>${val}°C</strong> (proses pemanasan menuju titik didih, mulai timbul gelembung & uap). Geser hingga menyentuh tepat <strong>100°C</strong> untuk mengamati Titik Didih sempurna!`;
                } else {
                    if (tempFill) tempFill.style.background = 'linear-gradient(to top, #f59e0b, #fbbf24)';
                    if (tempBulb) tempBulb.style.background = '#f59e0b';
                    if (tempDisplay) tempDisplay.style.background = '#fef3c7';

                    tempTextDesc.innerHTML = `Suhu air saat ini berada pada <strong>${val}°C</strong> (wujud cair). Geser ke suhu minus (hingga <strong>-20°C</strong>) untuk melihat kondisi Membeku / Titik Beku, ke <strong>0°C</strong> untuk Titik Leleh, atau ke <strong>100°C</strong> untuk Titik Didih!`;
                }
            }
        });
    }

    // 12. LEVEL 3: FLASHCARDS PERUBAHAN FISIKA & KIMIA (INTERACTIVE TRIGGER & FLIP)
    const cardFisika = document.getElementById('card-fisika');
    const cardKimia = document.getElementById('card-kimia');
    const btnInteractFisika = document.getElementById('btn-interact-fisika');
    const btnInteractKimia = document.getElementById('btn-interact-kimia');
    const imgFisikaPadat = document.getElementById('card-fisika-padat');
    const imgFisikaCair = document.getElementById('card-fisika-cair');
    const pillFisika = document.getElementById('pill-fisika');
    const hintFisika = document.getElementById('hint-fisika');
    const imgKimiaFresh = document.getElementById('card-kimia-fresh');
    const imgKimiaBurnt = document.getElementById('card-kimia-burnt');
    const imgKimiaSmoke = document.getElementById('card-kimia-smoke');
    const pillKimia = document.getElementById('pill-kimia');
    const hintKimia = document.getElementById('hint-kimia');

    let fisikaTransformed = false;
    let kimiaTransformed = false;

    function setFisikaMeltedState(isMelted, showSpeech = true) {
        fisikaTransformed = isMelted;
        if (imgFisikaPadat) imgFisikaPadat.style.opacity = isMelted ? '0' : '1';
        if (imgFisikaCair) imgFisikaCair.style.opacity = isMelted ? '1' : '0';

        if (btnInteractFisika) {
            btnInteractFisika.innerHTML = isMelted
                ? '<span class="btn-icon">❄️</span> <span class="btn-text">Bekukan Kembali</span>'
                : '<span class="btn-icon">🧊</span> <span class="btn-text">Cairkan Es Batu</span>';
            btnInteractFisika.classList.toggle('active-state', isMelted);
        }

        if (pillFisika) {
            pillFisika.textContent = isMelted ? '💧 Es Mencair (Cair)' : '🧊 Es Batu Beku (Padat)';
            pillFisika.style.background = isMelted ? '#dbeafe' : '#e0f2fe';
            pillFisika.style.color = isMelted ? '#1d4ed8' : '#0369a1';
        }

        if (hintFisika) {
            hintFisika.innerHTML = isMelted
                ? '<span class="tap-icon">🔄</span> <span class="hint-text">Ketuk kartu untuk membalik!</span>'
                : '<span class="tap-icon">👇</span> <span class="hint-text">Klik tombol atau kartu untuk mencairkan es</span>';
            hintFisika.classList.toggle('unlocked', isMelted);
        }

        if (isMelted && showSpeech) {
            showMascotBubble("Es batu mencair saat menyerap panas! Wujudnya berubah menjadi cair tanpa zat baru. Sekarang ketuk kartu untuk membalik!");
        }
    }

    function setKimiaBurntState(isBurnt, showSpeech = true) {
        kimiaTransformed = isBurnt;
        if (imgKimiaFresh) imgKimiaFresh.style.opacity = isBurnt ? '0' : '1';
        if (imgKimiaBurnt) imgKimiaBurnt.style.opacity = isBurnt ? '1' : '0';
        if (imgKimiaSmoke) {
            imgKimiaSmoke.style.opacity = isBurnt ? '0.9' : '0';
            if (isBurnt) {
                imgKimiaSmoke.classList.add('smoking');
            } else {
                imgKimiaSmoke.classList.remove('smoking');
            }
        }

        if (btnInteractKimia) {
            btnInteractKimia.innerHTML = isBurnt
                ? '<span class="btn-icon">🔄</span> <span class="btn-text">Padamkan Dupa</span>'
                : '<span class="btn-icon">🔥</span> <span class="btn-text">Nyalakan Dupa</span>';
            btnInteractKimia.classList.toggle('active-state', isBurnt);
        }

        if (pillKimia) {
            pillKimia.textContent = isBurnt ? '🔥 Dupa Terbakar (Abu & Gas)' : '🕯️ Batang Dupa Utuh';
            pillKimia.style.background = isBurnt ? '#fee2e2' : '#fef2f2';
            pillKimia.style.color = isBurnt ? '#b91c1c' : '#991b1b';
        }

        if (hintKimia) {
            hintKimia.innerHTML = isBurnt
                ? '<span class="tap-icon">🔄</span> <span class="hint-text">Ketuk kartu untuk membalik!</span>'
                : '<span class="tap-icon">👇</span> <span class="hint-text">Klik tombol atau kartu untuk menyalakan dupa</span>';
            hintKimia.classList.toggle('unlocked', isBurnt);
        }

        if (isBurnt && showSpeech) {
            showMascotBubble("Api membakar dupa menghasilkan zat baru berupa abu dan gas asap! Ketuk kartu untuk membalik dan pelajari cirinya!");
        }
    }

    if (btnInteractFisika) {
        btnInteractFisika.addEventListener('click', (e) => {
            e.stopPropagation();
            setFisikaMeltedState(!fisikaTransformed);
        });
    }

    if (btnInteractKimia) {
        btnInteractKimia.addEventListener('click', (e) => {
            e.stopPropagation();
            setKimiaBurntState(!kimiaTransformed);
        });
    }

    if (cardFisika) {
        cardFisika.addEventListener('click', (e) => {
            const isFlipped = cardFisika.classList.contains('is-flipped') || cardFisika.classList.contains('flipped');
            if (isFlipped) {
                cardFisika.classList.remove('is-flipped', 'flipped');
                return;
            }

            if (!fisikaTransformed) {
                setFisikaMeltedState(true);
            } else {
                cardFisika.classList.add('is-flipped', 'flipped');
            }
        });
    }

    if (cardKimia) {
        cardKimia.addEventListener('click', (e) => {
            const isFlipped = cardKimia.classList.contains('is-flipped') || cardKimia.classList.contains('flipped');
            if (isFlipped) {
                cardKimia.classList.remove('is-flipped', 'flipped');
                return;
            }

            if (!kimiaTransformed) {
                setKimiaBurntState(true);
            } else {
                cardKimia.classList.add('is-flipped', 'flipped');
            }
        });
    }

    // 13. LEVEL 4.1: DENSITY DRAG AND DROP (UNIVERSAL POINTER EVENTS: MOBILE & DESKTOP)
    const dragBambu = document.getElementById('density-drag-bambu');
    const dragTelur = document.getElementById('density-drag-telur');
    const dragKoin = document.getElementById('density-drag-koin');
    const densityPond = document.getElementById('density-pond');
    const pondBambu = document.getElementById('pond-floater-bambu');
    const pondTelur = document.getElementById('pond-floater-telur');
    const pondKoin = document.getElementById('pond-sinker-koin');
    const btnWaterFresh = document.getElementById('btn-water-fresh');
    const btnWaterSalt = document.getElementById('btn-water-salt');
    const pondWaterBadge = document.getElementById('pond-water-badge');

    let currentWaterType = 'fresh'; // 'fresh' (Air Biasa, default) or 'salt' (Air Garam)

    function updateEggPosition() {
        if (!pondTelur) return;
        if (currentWaterType === 'salt') {
            pondTelur.classList.remove('telur-tenggelam');
            pondTelur.classList.add('telur-melayang');
        } else {
            pondTelur.classList.remove('telur-melayang');
            pondTelur.classList.add('telur-tenggelam');
        }
    }

    function setWaterType(type, triggerFeedback = true) {
        currentWaterType = type;
        if (btnWaterFresh && btnWaterSalt) {
            if (type === 'salt') {
                btnWaterSalt.classList.add('active');
                btnWaterFresh.classList.remove('active');
            } else {
                btnWaterFresh.classList.add('active');
                btnWaterSalt.classList.remove('active');
            }
        }

        if (pondWaterBadge) {
            if (type === 'salt') {
                pondWaterBadge.textContent = 'Kondisi: Air Garam';
                pondWaterBadge.classList.add('salt');
            } else {
                pondWaterBadge.textContent = 'Kondisi: Air Biasa';
                pondWaterBadge.classList.remove('salt');
            }
        }

        updateEggPosition();

        if (triggerFeedback) {
            if (droppedItems.telur) {
                if (type === 'salt') {
                    showMascotBubble("Air garam ditambahkan! Massa jenis air meningkat sehingga telur melayang naik!");
                } else {
                    showMascotBubble("Air diganti air biasa! Massa jenis air lebih kecil sehingga telur tenggelam ke dasar.");
                }
            } else {
                if (type === 'salt') {
                    showMascotBubble("Kondisi kolam diubah ke Air Garam! Coba seret telur ke kolam.");
                } else {
                    showMascotBubble("Kondisi kolam diubah ke Air Biasa! Coba seret telur ke kolam.");
                }
            }
        }
    }

    if (btnWaterFresh) {
        btnWaterFresh.addEventListener('click', () => {
            if (currentWaterType !== 'fresh') setWaterType('fresh', true);
        });
    }

    if (btnWaterSalt) {
        btnWaterSalt.addEventListener('click', () => {
            if (currentWaterType !== 'salt') setWaterType('salt', true);
        });
    }

    function updatePondIndicatorState() {
        if (!densityPond) return;
        const count = (droppedItems.bambu ? 1 : 0) + (droppedItems.telur ? 1 : 0) + (droppedItems.koin ? 1 : 0);
        if (count === 3) {
            densityPond.classList.add('all-items');
            densityPond.classList.remove('has-items');
        } else if (count > 0) {
            densityPond.classList.add('has-items');
            densityPond.classList.remove('all-items');
        } else {
            densityPond.classList.remove('has-items', 'all-items');
        }
    }

    // 13.1 Drop Action Logic
    function handleDropItem(itemType) {
        if (itemType === 'bambu' && !droppedItems.bambu) {
            droppedItems.bambu = true;
            if (dragBambu) dragBambu.classList.add('hidden');
            if (pondBambu) {
                pondBambu.classList.remove('hidden');
                pondBambu.offsetHeight; // force reflow
                pondBambu.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showBambuDensityPopup();
            }, 450);
        } else if (itemType === 'telur' && !droppedItems.telur) {
            droppedItems.telur = true;
            if (dragTelur) dragTelur.classList.add('hidden');
            if (pondTelur) {
                updateEggPosition();
                pondTelur.classList.remove('hidden');
                pondTelur.offsetHeight;
                pondTelur.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showTelurDensityPopup();
            }, 450);
        } else if (itemType === 'koin' && !droppedItems.koin) {
            droppedItems.koin = true;
            if (dragKoin) dragKoin.classList.add('hidden');
            if (pondKoin) {
                pondKoin.classList.remove('hidden');
                pondKoin.offsetHeight;
                pondKoin.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showKoinDensityPopup();
            }, 450);
        }
    }

    // 13.2 Return/Reset Dropped Items from Pond Back to Tray
    function returnItemFromPond(itemType) {
        if (itemType === 'bambu' && droppedItems.bambu) {
            droppedItems.bambu = false;
            if (pondBambu) {
                pondBambu.classList.add('hidden');
                pondBambu.style.opacity = '0';
            }
            if (dragBambu) {
                dragBambu.classList.remove('hidden', 'dragging-original');
                dragBambu.style.opacity = '1';
                dragBambu.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Bambu potong dikembalikan ke wadah!");
        } else if (itemType === 'telur' && droppedItems.telur) {
            droppedItems.telur = false;
            if (pondTelur) {
                pondTelur.classList.add('hidden');
                pondTelur.style.opacity = '0';
            }
            if (dragTelur) {
                dragTelur.classList.remove('hidden', 'dragging-original');
                dragTelur.style.opacity = '1';
                dragTelur.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Telur mentah dikembalikan ke wadah!");
        } else if (itemType === 'koin' && droppedItems.koin) {
            droppedItems.koin = false;
            if (pondKoin) {
                pondKoin.classList.add('hidden');
                pondKoin.style.opacity = '0';
            }
            if (dragKoin) {
                dragKoin.classList.remove('hidden', 'dragging-original');
                dragKoin.style.opacity = '1';
                dragKoin.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Koin logam dikembalikan ke wadah!");
        }
    }

    // Attach click and pointerup listeners to pond items so they can always be clicked to return
    [
        { el: pondBambu, type: 'bambu' },
        { el: pondTelur, type: 'telur' },
        { el: pondKoin, type: 'koin' }
    ].forEach(({ el, type }) => {
        if (el) {
            const handleReturn = (e) => {
                e.preventDefault();
                e.stopPropagation();
                returnItemFromPond(type);
            };
            el.addEventListener('click', handleReturn);
            el.addEventListener('pointerup', handleReturn);
        }
    });

    // 13.3 Universal Pointer Drag System (Seamless Touch on Mobile + Mouse on Desktop)
    const densityDragItems = [dragBambu, dragTelur, dragKoin];

    densityDragItems.forEach(item => {
        if (!item) return;

        let startX = 0, startY = 0;
        let isDragging = false;
        let ghostEl = null;
        let dragOffset = { x: 0, y: 0 };
        const itemType = item.getAttribute('data-item');

        const onPointerDown = (e) => {
            // Only primary button (left mouse) or touch
            if (e.button && e.button !== 0) return;
            if (droppedItems[itemType]) return;

            // Cleanup any ghost element
            document.querySelectorAll('.density-drag-ghost').forEach(g => g.remove());

            startX = e.clientX;
            startY = e.clientY;
            isDragging = false;
            ghostEl = null;

            const rect = item.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            window.addEventListener('pointermove', onPointerMove, { passive: false });
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        };

        const onPointerMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dist = Math.hypot(dx, dy);

            // Drag threshold (> 5px) to separate tap vs drag
            if (!isDragging && dist > 5) {
                isDragging = true;
                const rect = item.getBoundingClientRect();
                ghostEl = item.cloneNode(true);
                ghostEl.classList.add('density-drag-ghost');
                ghostEl.style.width = `${rect.width}px`;
                ghostEl.style.height = `${rect.height}px`;
                ghostEl.style.left = `${e.clientX - dragOffset.x}px`;
                ghostEl.style.top = `${e.clientY - dragOffset.y}px`;
                document.body.appendChild(ghostEl);

                item.classList.add('dragging-original');
            }

            if (isDragging && ghostEl) {
                if (e.cancelable) e.preventDefault();
                ghostEl.style.left = `${e.clientX - dragOffset.x}px`;
                ghostEl.style.top = `${e.clientY - dragOffset.y}px`;

                if (densityPond) {
                    const pondRect = densityPond.getBoundingClientRect();
                    const isOver = (
                        e.clientX >= pondRect.left &&
                        e.clientX <= pondRect.right &&
                        e.clientY >= pondRect.top &&
                        e.clientY <= pondRect.bottom
                    );
                    if (isOver) {
                        densityPond.classList.add('dragover');
                    } else {
                        densityPond.classList.remove('dragover');
                    }
                }
            }
        };

        const onPointerUp = (e) => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);

            if (densityPond) densityPond.classList.remove('dragover');

            if (!isDragging) {
                // Click fallback: direct tap to drop into pond
                if (!droppedItems[itemType]) {
                    handleDropItem(itemType);
                }
                return;
            }

            isDragging = false;

            // Check if dropped inside densityPond
            let droppedInside = false;
            if (densityPond) {
                const pondRect = densityPond.getBoundingClientRect();
                droppedInside = (
                    e.clientX >= pondRect.left &&
                    e.clientX <= pondRect.right &&
                    e.clientY >= pondRect.top &&
                    e.clientY <= pondRect.bottom
                );
            }

            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }

            item.classList.remove('dragging-original');

            if (droppedInside && !droppedItems[itemType]) {
                handleDropItem(itemType);
            }
        };

        item.addEventListener('pointerdown', onPointerDown);

        // Native HTML5 Drag fallback for desktop browsers
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', itemType);
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    // Native Dragover & Drop support on densityPond
    if (densityPond) {
        densityPond.addEventListener('dragover', (e) => {
            e.preventDefault();
            densityPond.classList.add('dragover');
        });
        densityPond.addEventListener('dragleave', () => {
            densityPond.classList.remove('dragover');
        });
        densityPond.addEventListener('drop', (e) => {
            e.preventDefault();
            densityPond.classList.remove('dragover');
            const itemType = e.dataTransfer.getData('text/plain');
            if (itemType) handleDropItem(itemType);
        });
    }

    function showBambuDensityPopup() {
        const content = `
            <div class="popup-zoom-density">
                <div class="zoom-graphic-box">
                    <img src="assets/images/level4/zoom-bambu.png" alt="Struktur Bambu Zoom">
                </div>
                <div class="zoom-details">
                    <h3>Bambu Mengapung</h3>
                    <p>Bambu memiliki struktur dengan banyak rongga udara di dalamnya, sehingga partikel penyusunnya tidak terlalu rapat. Syarat Fisika: &rho;<sub>benda</sub> &lt; &rho;<sub>cairan</sub> (0,8 g/cm³ &lt; 1,0 g/cm³).</p>
                    
                    <div class="formula-container" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #e0f2fe; padding: 0.5rem; border-radius: 8px; font-weight: 800; color: #0284c7; margin-top: 0.5rem;">
                        Rumus Massa Jenis: &rho; = m / V
                    </div>
                </div>
            </div>
        `;
        openMateriPopup(content);
    }

    function showTelurDensityPopup() {
        let content = '';
        if (currentWaterType === 'salt') {
            // KONDISI 2: AIR GARAM (Teks lama)
            content = `
                <div class="popup-zoom-density">
                    <div class="zoom-graphic-box" style="display:flex; justify-content:center; align-items:center;">
                        <img src="assets/images/level4/telur-mentah.png" alt="Telur Melayang" style="max-height:100px; object-fit:contain;">
                    </div>
                    <div class="zoom-details">
                        <h3>Telur Melayang</h3>
                        <p>Penambahan garam Kusamba meningkatkan kerapatan partikel terlarut dalam air sehingga massa jenis air garam menjadi sama persis dengan massa jenis telur. Syarat Fisika: &rho;<sub>benda</sub> = &rho;<sub>cairan</sub> (1,0 g/cm³ = 1,0 g/cm³).</p>
                    </div>
                </div>
            `;
        } else {
            // KONDISI 1: AIR BIASA (State Awal - Teks Revisi Dosen Validator)
            content = `
                <div class="popup-zoom-density">
                    <div class="zoom-graphic-box" style="display:flex; justify-content:center; align-items:center;">
                        <img src="assets/images/level4/telur-mentah.png" alt="Telur Tenggelam" style="max-height:100px; object-fit:contain;">
                    </div>
                    <div class="zoom-details">
                        <h3>Telur Tenggelam</h3>
                        <p>Massa jenis air bersih atau air tawar lebih kecil daripada massa jenis telur segar, sehingga cairan tidak mampu menahan berat benda ke atas. Akibatnya, telur akan turun dan tenggelam sampai ke dasar wadah. Syarat Fisika: &rho;<sub>benda</sub> &gt; &rho;<sub>cairan</sub> (massa jenis benda lebih besar dari massa jenis cairan).</p>
                    </div>
                </div>
            `;
        }
        openMateriPopup(content);
    }

    function showKoinDensityPopup() {
        const content = `
            <div class="popup-zoom-density">
                <div class="zoom-graphic-box">
                    <img src="assets/images/level4/zoom-logam.png" alt="Struktur Logam Zoom">
                </div>
                <div class="zoom-details">
                    <h3>Koin Logam Tenggelam</h3>
                    <p>Koin logam tersusun atas partikel atom yang sangat amat rapat tanpa rongga udara, sehingga jumlah massa per satuan volumenya sangat besar. Syarat Fisika: &rho;<sub>benda</sub> &gt; &rho;<sub>cairan</sub> (7,8 g/cm³ &gt; 1,0 g/cm³).</p>
                </div>
            </div>
        `;
        openMateriPopup(content);
    }

    // 14. SLIDE 9 & 10 ACTION BUTTONS & RESET ENGINE
    const btnFinalHome = document.getElementById('btn-final-home');
    const btnFinalQuiz = document.getElementById('btn-final-quiz');

    if (btnFinalHome) {
        btnFinalHome.addEventListener('click', () => {
            showLevelCompleteModal(4);
        });
    }

    if (btnFinalQuiz) {
        btnFinalQuiz.addEventListener('click', () => {
            showLevelCompleteModal(4);
        });
    }

    // Reset simulator states when leaving the screen
    function resetMateriSlides() {
        clearAllVignettes();
        currentSlide = 1;
        currentSlideIndex = 0;

        const completeModal = document.getElementById('materi-level-complete-modal');
        if (completeModal) completeModal.classList.add('hidden');
        
        // Reset hotspots clicks
        clickedHotspots.bambu = false;
        clickedHotspots.tetesan = false;
        clickedHotspots.uap = false;
        
        // Reset Level 2.1
        if (typeof dalumanImgPadat !== 'undefined' && dalumanImgPadat) dalumanImgPadat.style.opacity = '1';
        if (typeof dalumanImgCair !== 'undefined' && dalumanImgCair) dalumanImgCair.style.opacity = '0';
        if (typeof dalumanTextDesc !== 'undefined' && dalumanTextDesc) dalumanTextDesc.innerHTML = 'Es Daluman dalam kondisi beku (padat). Pilih aksi "Panaskan Es" untuk melihat proses pelelehan zat dalam wujud padat!';

        // Reset Level 2.2 (Split View Arak Bali)
        const arakDefaultEl = document.getElementById('arak-img-default');
        const arakHeatingEl = document.getElementById('arak-img-heating');
        const arakCoolingEl = document.getElementById('arak-img-cooling');
        const btnDidihEl = document.getElementById('btn-didih-l22');
        const btnDinginEl = document.getElementById('btn-dingin-l22');
        const arakTextColEl = document.getElementById('arak-text-col') || document.getElementById('evap-text-l22');

        if (arakDefaultEl) arakDefaultEl.style.opacity = '1';
        if (arakHeatingEl) arakHeatingEl.style.opacity = '0';
        if (arakCoolingEl) arakCoolingEl.style.opacity = '0';
        if (btnDidihEl) btnDidihEl.classList.remove('active');
        if (btnDinginEl) btnDinginEl.classList.remove('active');
        if (arakTextColEl) {
            arakTextColEl.innerHTML = `
                <div class="arak-content-fade">
                    <div style="display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                        🏺 Etnosains Tradisi Bali
                    </div>
                    <h3 style="margin: 0 0 0.4rem 0; color: #0f172a; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                        Penyulingan Arak Tradisional Bali
                    </h3>
                    <p style="margin: 0 0 0.6rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                        Masyarakat Bali secara turun-temurun memproduksi arak dari fermentasi tuak nira kelapa atau lontar melalui metode <strong>penyulingan (destilasi)</strong>. Proses tradisional ini menerapkan dua perubahan wujud zat sekaligus: <strong>menguap</strong> dan <strong>mengembun</strong>.
                    </p>
                    <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #334155; line-height: 1.4;">
                        👉 <strong>Misi Penyelidikan:</strong><br>
                        Klik tombol <span style="color: #dc2626; font-weight: 700;">🔥 Didihkan Cairan</span> untuk mengamati proses pemanasan dan perubahan wujud cair ke gas (menguap).<br>
                        Klik tombol <span style="color: #2563eb; font-weight: 700;">❄️ Dinginkan Uap</span> untuk mengamati proses pendinginan dan perubahan wujud gas kembali menjadi cair (mengembun).
                    </div>
                </div>
            `;
        }

        // Reset Level 2.3
        if (typeof sublimKapur !== 'undefined' && sublimKapur) sublimKapur.style.opacity = '1';
        if (typeof sublimGas !== 'undefined' && sublimGas) {
            sublimGas.style.opacity = '0';
            sublimGas.style.transform = 'translateY(0)';
        }
        if (typeof sublimTextDesc !== 'undefined' && sublimTextDesc) sublimTextDesc.innerHTML = 'Tekan tombol "Panaskan Kapur Barus" untuk mengamati proses menyublim zat dalam wujud padat menjadi gas!';

        // Reset Level 2.4
        if (typeof saltSunSlider !== 'undefined' && saltSunSlider) {
            saltSunSlider.value = 0;
        }
        if (typeof updateSaltSliderUI === 'function') {
            updateSaltSliderUI(0);
        } else {
            if (typeof saltWaterImg !== 'undefined' && saltWaterImg) saltWaterImg.style.opacity = '1';
            if (typeof saltCrystalsImg !== 'undefined' && saltCrystalsImg) saltCrystalsImg.style.opacity = '0';
            if (typeof saltSteamImg !== 'undefined' && saltSteamImg) saltSteamImg.style.opacity = '0';
        }

        // Reset Level 2.5
        if (typeof tempSlider !== 'undefined' && tempSlider) {
            tempSlider.value = 25;
            tempSlider.dispatchEvent(new Event('input'));
        }

        // Reset Level 3
        dupaGameCompleted = false;
        if (typeof cardFisika !== 'undefined' && cardFisika) {
            cardFisika.classList.remove('is-flipped', 'flipped');
        }
        if (typeof cardKimia !== 'undefined' && cardKimia) {
            cardKimia.classList.remove('is-flipped', 'flipped');
        }
        if (typeof setFisikaMeltedState === 'function') {
            setFisikaMeltedState(false, false);
        }
        if (typeof setKimiaBurntState === 'function') {
            setKimiaBurntState(false, false);
        }

        // Reset Level 4.1
        if (typeof setWaterType === 'function') {
            setWaterType('fresh', false);
        }
        droppedItems.bambu = false;
        droppedItems.telur = false;
        droppedItems.koin = false;
        if (typeof dragBambu !== 'undefined' && dragBambu) {
            dragBambu.classList.remove('hidden', 'dragging-original');
            dragBambu.style.opacity = '1';
            dragBambu.style.transform = 'none';
        }
        if (typeof dragTelur !== 'undefined' && dragTelur) {
            dragTelur.classList.remove('hidden', 'dragging-original');
            dragTelur.style.opacity = '1';
            dragTelur.style.transform = 'none';
        }
        if (typeof dragKoin !== 'undefined' && dragKoin) {
            dragKoin.classList.remove('hidden', 'dragging-original');
            dragKoin.style.opacity = '1';
            dragKoin.style.transform = 'none';
        }
        if (typeof pondBambu !== 'undefined' && pondBambu) {
            pondBambu.classList.add('hidden');
            pondBambu.style.opacity = '0';
        }
        if (typeof pondTelur !== 'undefined' && pondTelur) {
            pondTelur.classList.add('hidden');
            pondTelur.style.opacity = '0';
        }
        if (typeof pondKoin !== 'undefined' && pondKoin) {
            pondKoin.classList.add('hidden');
            pondKoin.style.opacity = '0';
        }
        if (typeof updatePondIndicatorState === 'function') {
            updatePondIndicatorState();
        }
    }

    // Initialize Level Map view
    showLevelMap();
});
