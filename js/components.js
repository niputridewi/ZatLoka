/* ==========================================================================
   ZATLOKA COMPONENT & MODAL MANAGER
   Mengatur logika dialog (Bantuan & Profil), Unggah & Kompresi Foto Profil,
   First-Time Onboarding, serta sinkronisasi state profil siswa di localStorage.
   ========================================================================== */

// Helper untuk menghasilkan Data URL Base64 Avatar Siluet Default (JPEG Kompresi Ringan)
function getDefaultAvatarBase64() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'assets/images/logo-undiksha.webp';

        // Background gradient melingkar (Cyan/Blue Theme ZatLoka)
        const grad = ctx.createLinearGradient(0, 0, 160, 160);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#0369a1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(80, 80, 80, 0, Math.PI * 2);
        ctx.fill();

        // Lingkaran border halus putih
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Kepala siluet putih
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(80, 60, 26, 0, Math.PI * 2);
        ctx.fill();

        // Bahu & badan siluet putih
        ctx.beginPath();
        ctx.ellipse(80, 130, 48, 36, 0, Math.PI, 0, true);
        ctx.fill();

        return canvas.toDataURL('image/jpeg', 0.75);
    } catch (e) {
        console.warn('Fallback canvas avatar gagal:', e);
        return 'assets/images/logo-undiksha.webp';
    }
}

// Helper untuk kompresi file gambar menggunakan HTML5 Canvas
// CRITICAL RULE: Batas max-dimension 300px & JPEG 0.7 agar hemat localStorage
function compressImageFile(file, maxDimension = 300, quality = 0.7) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('File tidak ditemukan'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Pertahankan aspect ratio dengan batas maxDimension
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                // Gambar ulang pada HTML5 Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Gagal mendapatkan 2D context canvas'));
                    return;
                }

                // Latar belakang putih jika gambar memiliki transparansi PNG
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Ekspor ke JPEG kualitas sedang (0.7)
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = (err) => reject(err);
            img.src = event.target.result;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

class ComponentManager {
    constructor(appState) {
        this.state = appState;
        this.tempCompressedPhoto = null;
        this.isOnboarding = false;
        this.initDOM();
        this.bindEvents();
        this.syncLockedInputsState();
    }

    initDOM() {
        // Modal elements
        this.modals = {
            help: document.getElementById('help-modal'),
            profile: document.getElementById('profile-modal')
        };
        
        // Buttons
        this.buttons = {
            helpOpen: document.getElementById('help-btn'),
            profileOpen: document.getElementById('profile-widget'),
            saveProfile: document.getElementById('save-profile-btn'),
            uploadPhoto: document.getElementById('btn-upload-photo'),
            avatarUploadBox: document.getElementById('avatar-upload-box'),
            profilePrintBtn: document.getElementById('profile-print-btn'),
            modalCloseBtn: document.getElementById('profile-modal-close-btn'),
            cancelBtn: document.getElementById('profile-cancel-btn'),
            backupDataBtn: document.getElementById('btn-backup-data'),
            restoreDataBtn: document.getElementById('btn-restore-data'),
            resetAccountBtn: document.getElementById('btn-reset-account')
        };
        
        // Input fields
        this.inputs = {
            studentName: document.getElementById('student-name-input'),
            studentNis: document.getElementById('student-nis-input'),
            photoFile: document.getElementById('profile-photo-input'),
            restoreFile: document.getElementById('restore-file-input')
        };

        // Profile UI Display Elements (modal & widget)
        this.display = {
            widgetName: document.getElementById('widget-name'),
            widgetRank: document.getElementById('widget-rank'),
            widgetExp: document.getElementById('widget-exp'),
            widgetAvatar: document.getElementById('widget-avatar'),
            modalRank: document.getElementById('profile-rank-val'),
            modalExp: document.getElementById('profile-exp-val'),
            modalTitle: document.getElementById('profile-modal-title'),
            avatarLarge: document.getElementById('profile-avatar-large'),
            avatarHint: document.getElementById('avatar-photo-hint'),
            onboardingBanner: document.getElementById('onboarding-welcome-banner'),
            statsDisplay: document.getElementById('profile-stats-display'),
            lockBadge: document.getElementById('profile-lock-badge'),
            dataManagement: document.getElementById('profile-data-management'),
            backupStatus: document.getElementById('backup-process-status'),
            backupStatusIcon: document.getElementById('backup-status-icon'),
            backupStatusText: document.getElementById('backup-status-text')
        };
    }

    // Cek apakah profil (Nama & NIS) sudah tersimpan dan terkunci permanen
    isProfileLocked() {
        const savedName = (localStorage.getItem('student_name') || localStorage.getItem('studentName') || '').trim();
        const savedNis = (localStorage.getItem('student_nis') || '').trim();
        return savedName !== '' && savedName !== 'Siswa Baru' && savedNis !== '';
    }

    // Sinkronisasi status readonly/disabled pada input Nama dan NIS
    syncLockedInputsState() {
        const locked = this.isProfileLocked();
        const savedName = localStorage.getItem('student_name') || localStorage.getItem('studentName') || '';
        const savedNis = localStorage.getItem('student_nis') || '';

        if (this.inputs.studentName) {
            if (locked) {
                this.inputs.studentName.value = savedName;
                this.inputs.studentName.disabled = true;
                this.inputs.studentName.readOnly = true;
            } else {
                this.inputs.studentName.disabled = false;
                this.inputs.studentName.readOnly = false;
            }
        }

        if (this.inputs.studentNis) {
            if (locked) {
                this.inputs.studentNis.value = savedNis;
                this.inputs.studentNis.disabled = true;
                this.inputs.studentNis.readOnly = true;
            } else {
                this.inputs.studentNis.disabled = false;
                this.inputs.studentNis.readOnly = false;
            }
        }

        if (this.display.lockBadge) {
            this.display.lockBadge.style.display = locked ? 'inline-block' : 'none';
        }
    }

    bindEvents() {
        // Open Help Modal
        if (this.buttons.helpOpen) {
            this.buttons.helpOpen.addEventListener('click', () => this.openModal('help'));
        }

        // Open Profile Modal via Capsule Widget (Langsung klik profil kapsul)
        if (this.buttons.profileOpen) {
            this.buttons.profileOpen.addEventListener('click', () => {
                this.openModal('profile', { isOnboarding: false });
            });
        }

        // Close buttons (all elements with close-modal-btn)
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Jangan izinkan tutup jika dalam mode onboarding (wajib isi)
                if (this.isOnboarding && btn.getAttribute('data-modal') === 'profile-modal') {
                    return;
                }
                const modalId = btn.getAttribute('data-modal');
                this.closeModalById(modalId);
            });
        });

        // Close on overlay click (hanya jika bukan onboarding)
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (this.isOnboarding && modal === this.modals.profile) {
                            return; // cegah tutup saat onboarding
                        }
                        this.closeModal(modal);
                    }
                });
            }
        });

        // Trigger Upload Photo saat tombol atau kotak avatar diklik
        const triggerPhotoUpload = () => {
            if (this.inputs.photoFile) {
                this.inputs.photoFile.click();
            }
        };

        if (this.buttons.uploadPhoto) {
            this.buttons.uploadPhoto.addEventListener('click', triggerPhotoUpload);
        }
        if (this.buttons.avatarUploadBox) {
            this.buttons.avatarUploadBox.addEventListener('click', triggerPhotoUpload);
        }

        // Event listener saat file foto dipilih
        if (this.inputs.photoFile) {
            this.inputs.photoFile.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
                    return;
                }

                if (this.display.avatarHint) {
                    this.display.avatarHint.textContent = '⏳ Mengompresi foto...';
                    this.display.avatarHint.style.color = '#0284c7';
                }

                try {
                    // Jalankan kompresi HTML5 Canvas (max 300px, quality 0.7)
                    const compressedBase64 = await compressImageFile(file, 300, 0.7);
                    this.tempCompressedPhoto = compressedBase64;

                    // Preview langsung ke UI modal profil
                    if (this.display.avatarLarge) {
                        this.display.avatarLarge.src = compressedBase64;
                    }

                    if (this.display.avatarHint) {
                        this.display.avatarHint.textContent = '✅ Foto berhasil diunggah & dikompresi!';
                        this.display.avatarHint.style.color = '#059669';
                    }
                } catch (err) {
                    console.error('Kompresi gambar gagal:', err);
                    alert('Gagal memproses gambar. Silakan coba gambar lain.');
                    if (this.display.avatarHint) {
                        this.display.avatarHint.textContent = '❌ Gagal memproses gambar.';
                        this.display.avatarHint.style.color = '#e11d48';
                    }
                }
            });
        }

        // Save Profile button
        if (this.buttons.saveProfile) {
            this.buttons.saveProfile.addEventListener('click', () => this.handleSaveProfile());
        }

        // Print Report button in Profile modal
        if (this.buttons.profilePrintBtn) {
            this.buttons.profilePrintBtn.addEventListener('click', async (e) => {
                if (window.ZatlokaKuis) {
                    await window.ZatlokaKuis.printReport(null, e.currentTarget);
                }
            });
        }

        // Backup Data button
        if (this.buttons.backupDataBtn) {
            this.buttons.backupDataBtn.addEventListener('click', async () => {
                await this.handleBackupData();
            });
        }

        // Restore Data button (pemicu input file JSON tersembunyi)
        if (this.buttons.restoreDataBtn && this.inputs.restoreFile) {
            this.buttons.restoreDataBtn.addEventListener('click', () => {
                this.inputs.restoreFile.value = '';
                this.inputs.restoreFile.click();
            });
        }

        // Event listener saat file JSON dipilih untuk Pulihkan Data
        if (this.inputs.restoreFile) {
            this.inputs.restoreFile.addEventListener('change', (e) => {
                this.handleRestoreFileSelect(e);
            });
        }

        // Reset Account button
        if (this.buttons.resetAccountBtn) {
            this.buttons.resetAccountBtn.addEventListener('click', () => {
                this.handleResetAccount();
            });
        }
        
        // Form submit on enter
        if (this.inputs.studentName) {
            this.inputs.studentName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSaveProfile();
                }
            });
        }
        if (this.inputs.studentNis) {
            this.inputs.studentNis.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSaveProfile();
                }
            });
        }
    }

    // Modal Actions
    openModal(type, options = {}) {
        const modal = this.modals[type];
        if (!modal) return;

        if (type === 'profile') {
            this.isOnboarding = !!options.isOnboarding;
            this.tempCompressedPhoto = null; // Reset foto sementara

            const currentName = localStorage.getItem('student_name') || localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || '';
            const currentNis = localStorage.getItem('student_nis') || '';
            const currentPhoto = localStorage.getItem('studentPhoto') || getDefaultAvatarBase64();
            const locked = this.isProfileLocked();

            // Set foto preview
            if (this.display.avatarLarge) {
                this.display.avatarLarge.src = currentPhoto;
            }

            // Reset teks hint foto
            if (this.display.avatarHint) {
                this.display.avatarHint.textContent = 'Dari Galeri atau Kamera HP';
                this.display.avatarHint.style.color = '#64748b';
            }

            // Sembunyikan status proses backup saat modal baru dibuka
            if (this.display.backupStatus) {
                this.display.backupStatus.style.display = 'none';
            }

            if (this.isOnboarding && !locked) {
                // Tampilan khusus First-Time Onboarding
                if (this.display.onboardingBanner) this.display.onboardingBanner.style.display = 'flex';
                if (this.buttons.modalCloseBtn) this.buttons.modalCloseBtn.style.display = 'none';
                if (this.buttons.cancelBtn) this.buttons.cancelBtn.style.display = 'none';
                if (this.buttons.profilePrintBtn) this.buttons.profilePrintBtn.style.display = 'none';
                if (this.display.statsDisplay) this.display.statsDisplay.style.display = 'none';
                if (this.display.modalTitle) this.display.modalTitle.textContent = 'Daftar Detektif Sains Baru';
                if (this.buttons.saveProfile) this.buttons.saveProfile.textContent = 'Mulai Petualangan 🚀';

                if (this.inputs.studentName) {
                    this.inputs.studentName.value = currentName && currentName !== 'Siswa Baru' ? currentName : '';
                    setTimeout(() => this.inputs.studentName.focus(), 300);
                }
                if (this.inputs.studentNis) {
                    this.inputs.studentNis.value = currentNis;
                }
            } else {
                // Tampilan Profil & Pengaturan Normal
                if (this.display.onboardingBanner) this.display.onboardingBanner.style.display = 'none';
                if (this.buttons.modalCloseBtn) this.buttons.modalCloseBtn.style.display = 'block';
                if (this.buttons.cancelBtn) this.buttons.cancelBtn.style.display = 'inline-block';
                if (this.buttons.profilePrintBtn) this.buttons.profilePrintBtn.style.display = 'inline-block';
                if (this.display.statsDisplay) this.display.statsDisplay.style.display = 'flex';
                if (this.display.modalTitle) this.display.modalTitle.textContent = 'Profil & Pengaturan Detektif Zat';
                if (this.buttons.saveProfile) this.buttons.saveProfile.textContent = 'Simpan';

                if (this.inputs.studentName) {
                    this.inputs.studentName.value = currentName && currentName !== 'Siswa Baru' ? currentName : '';
                }
                if (this.inputs.studentNis) {
                    this.inputs.studentNis.value = currentNis;
                }
            }

            // Terapkan penguncian input jika Nama & NIS sudah tersimpan
            this.syncLockedInputsState();
        }

        modal.style.display = 'flex';
        // Force redraw/reflow for smooth scale transition
        modal.offsetHeight;
        modal.classList.add('active');
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modal.style.display = 'none';
                }
            }, 300);
        }
    }

    closeModalById(modalId) {
        const modal = document.getElementById(modalId);
        this.closeModal(modal);
    }

    // TUGAS 1: Save profile logic dengan Konfirmasi Awal & Penguncian Permanen
    handleSaveProfile() {
        const locked = this.isProfileLocked();

        // Jika profil sudah terkunci permanen, hanya izinkan pembaruan foto profil
        if (locked) {
            if (this.tempCompressedPhoto) {
                this.state.profile.photo = this.tempCompressedPhoto;
                localStorage.setItem('studentPhoto', this.tempCompressedPhoto);
                this.updateProfileUI();
            }
            this.closeModal(this.modals.profile);
            return;
        }

        const inputName = this.inputs.studentName ? this.inputs.studentName.value.trim() : '';
        const inputNis = this.inputs.studentNis ? this.inputs.studentNis.value.trim() : '';
        
        if (!inputName) {
            alert('Nama lengkap wajib diisi untuk melanjutkan!');
            if (this.inputs.studentName) this.inputs.studentName.focus();
            return;
        }

        // --- KODE CHEAT DEVELOPER ---
        if (inputName === 'DEV-UNLOCK') {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.devUnlockAll();
            }
            const devNis = inputNis || 'DEV-001';
            this.state.profile.name = 'Developer Master';
            this.state.profile.nis = devNis;
            this.state.profile.rank = 'Master Sains';
            localStorage.setItem('student_name', 'Developer Master');
            localStorage.setItem('studentName', 'Developer Master');
            localStorage.setItem('zatloka_profile_name', 'Developer Master');
            localStorage.setItem('student_nis', devNis);
            this.syncLockedInputsState();
            this.updateProfileUI();
            this.isOnboarding = false;
            this.closeModal(this.modals.profile);
            alert("🔓 Kode Cheat 'DEV-UNLOCK' Berhasil!\n\nSeluruh Level Materi 1-4, Kuis 1-4, dan Gelar Master Sains berhasil dibuka sepenuhnya!");
            return;
        }

        if (inputName === 'DEV-RESET') {
            localStorage.clear();
            window.location.reload();
            return;
        }

        if (!inputNis) {
            alert('Nomor Induk Siswa (NIS) wajib diisi untuk melanjutkan!');
            if (this.inputs.studentNis) this.inputs.studentNis.focus();
            return;
        }

        // Popup Konfirmasi Penguncian Permanen Nama & NIS
        const isConfirmed = window.confirm(
            "Apakah Nama dan NIS Anda sudah benar? Data ini akan dikunci permanen dan tidak dapat diubah tanpa mengulang seluruh progres permainan dari awal."
        );
        if (!isConfirmed) {
            return;
        }

        // Tentukan foto profil yang akan disimpan (Foto baru terkompresi / Foto lama / Fallback Siluet)
        let finalPhoto = this.tempCompressedPhoto || localStorage.getItem('studentPhoto');
        if (!finalPhoto) {
            finalPhoto = getDefaultAvatarBase64();
        }

        // Update state internal
        this.state.profile.name = inputName;
        this.state.profile.nis = inputNis;
        this.state.profile.photo = finalPhoto;
        
        // Simpan ke localStorage (student_name, student_nis, serta key kompatibilitas)
        localStorage.setItem('student_name', inputName);
        localStorage.setItem('studentName', inputName);
        localStorage.setItem('zatloka_profile_name', inputName);
        localStorage.setItem('student_nis', inputNis);
        localStorage.setItem('studentPhoto', finalPhoto);
        
        // Kunci input Nama & NIS menjadi disabled / readonly
        this.syncLockedInputsState();

        // Update seluruh UI (Header, Kapsul Profil, dsb.)
        this.updateProfileUI();
        
        const wasOnboarding = this.isOnboarding;
        this.isOnboarding = false;

        // Tutup modal profil
        this.closeModal(this.modals.profile);

        // Langsung arahkan ke halaman Menu Utama (Home Screen)
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
            homeScreen.classList.add('active');
            this.state.currentScreen = 'home';
        }

        // Jika ini adalah onboarding pertama, putar musik pembuka BGM jika belum berputar
        if (wasOnboarding) {
            const bgmPlayer = document.getElementById('bgm-player');
            if (bgmPlayer && !this.state.audio.muted) {
                bgmPlayer.play().catch(e => console.log('BGM Play after onboarding: ', e));
            }
        }
    }

    // TUGAS 2: Reset Akun dengan Hukuman Progres
    handleResetAccount() {
        const isConfirmed = window.confirm(
            "PERINGATAN! Mereset akun akan menghapus SELURUH progres, EXP, dan riwayat Anda untuk kembali ke nol. Lanjutkan?"
        );
        if (isConfirmed) {
            localStorage.clear();
            window.location.reload();
        }
    }

    // Helper menampilkan visual status pemrosesan Backup / Restore
    showBackupStatus(type, message) {
        if (!this.display.backupStatus) return;
        this.display.backupStatus.style.display = 'flex';
        this.display.backupStatus.className = 'backup-process-status';

        if (type === 'loading') {
            if (this.display.backupStatusIcon) this.display.backupStatusIcon.textContent = '⏳';
        } else if (type === 'success') {
            this.display.backupStatus.classList.add('status-success');
            if (this.display.backupStatusIcon) this.display.backupStatusIcon.textContent = '✅';
        } else if (type === 'error') {
            this.display.backupStatus.classList.add('status-error');
            if (this.display.backupStatusIcon) this.display.backupStatusIcon.textContent = '⚠️';
        }

        if (this.display.backupStatusText) {
            this.display.backupStatusText.textContent = message;
        }
    }

    // TUGAS 3A: Backup Data (Ekspor ke SaveData_ZatLoka_[NIS].json)
    async handleBackupData() {
        let studentName = (localStorage.getItem('student_name') || localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || '').trim();
        let studentNis = (localStorage.getItem('student_nis') || '').trim();

        // Jika belum tersimpan di localStorage namun pengguna sudah mengetik di kolom input, simpan & kunci terlebih dahulu
        if (!studentName || studentName === 'Siswa Baru' || !studentNis) {
            const typedName = this.inputs.studentName ? this.inputs.studentName.value.trim() : '';
            const typedNis = this.inputs.studentNis ? this.inputs.studentNis.value.trim() : '';

            if (!typedName || typedName === 'Siswa Baru') {
                alert('Mohon isi Nama Lengkap Siswa terlebih dahulu sebelum melakukan Backup Data.');
                if (this.inputs.studentName) this.inputs.studentName.focus();
                return;
            }
            if (!typedNis) {
                alert('Mohon isi Nomor Induk Siswa (NIS) terlebih dahulu sebelum melakukan Backup Data.');
                if (this.inputs.studentNis) this.inputs.studentNis.focus();
                return;
            }

            const isConfirmed = window.confirm(
                "Apakah Nama dan NIS Anda sudah benar? Data ini akan dikunci permanen dan tidak dapat diubah tanpa mengulang seluruh progres permainan dari awal."
            );
            if (!isConfirmed) {
                return;
            }

            let finalPhoto = this.tempCompressedPhoto || localStorage.getItem('studentPhoto') || getDefaultAvatarBase64();
            localStorage.setItem('student_name', typedName);
            localStorage.setItem('studentName', typedName);
            localStorage.setItem('zatloka_profile_name', typedName);
            localStorage.setItem('student_nis', typedNis);
            localStorage.setItem('studentPhoto', finalPhoto);
            this.syncLockedInputsState();
            this.updateProfileUI();

            studentName = typedName;
            studentNis = typedNis;
        }

        const btn = this.buttons.backupDataBtn;
        const originalBtnHtml = btn ? btn.innerHTML : '💾 Backup Data';

        try {
            // Tampilkan visual pemrosesan sedang membuat backup
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '⏳ Memproses...';
            }
            this.showBackupStatus('loading', 'Sedang menyusun dan membuat file Backup Data...');

            // Kumpulkan seluruh data relevan dari localStorage
            const backupData = {
                student_name: studentName,
                student_nis: studentNis,
                studentName: studentName,
                zatloka_profile_name: studentName,
                zatloka_profile_rank: localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan',
                zatloka_profile_exp: localStorage.getItem('zatloka_profile_exp') || '0',
                zatloka_exp: localStorage.getItem('zatloka_exp') || '0',
                zatloka_linear_progress: localStorage.getItem('zatloka_linear_progress') || null,
                studentPhoto: localStorage.getItem('studentPhoto') || null,
                zatloka_audio_muted: localStorage.getItem('zatloka_audio_muted') || 'false'
            };

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !(key in backupData)) {
                    backupData[key] = localStorage.getItem(key);
                }
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            const fileName = `SaveData_ZatLoka_${studentNis}.json`;
            const jsonBlob = new Blob([jsonString], { type: 'application/json' });
            const jsonFile = new File([jsonBlob], fileName, { type: 'application/json' });

            // Deteksi apakah berjalan di lingkungan Mobile / Android APK WebView
            const isMobileOrAPK = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                                  window.location.protocol === 'file:';

            if (isMobileOrAPK && navigator.canShare && navigator.canShare({ files: [jsonFile] })) {
                // EKSEKUSI UNTUK APK / MOBILE VIA WEB SHARE API
                await new Promise(resolve => setTimeout(resolve, 400));
                await navigator.share({
                    files: [jsonFile],
                    title: 'Backup Data ZatLoka',
                    text: `File cadangan (backup) progres Detektif Zat (${studentName} - NIS: ${studentNis}).`
                });
                this.showBackupStatus('success', `File backup "${fileName}" berhasil dibagikan/disimpan!`);
            } else if (!isMobileOrAPK && typeof window.showSaveFilePicker === 'function') {
                // EKSEKUSI WEBSITE DESKTOP: Panggil showSaveFilePicker langsung saat user gesture masih aktif
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'ZatLoka Backup File (.json)',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
                this.showBackupStatus('loading', `Sedang menulis data ke "${fileName}"...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                const writable = await fileHandle.createWritable();
                await writable.write(jsonBlob);
                await writable.close();
                this.showBackupStatus('success', `Backup berhasil disimpan sebagai "${fileName}"!`);
            } else {
                // FALLBACK BROWSER DESKTOP STANDAR (a.download)
                await new Promise(resolve => setTimeout(resolve, 500));
                const blobUrl = URL.createObjectURL(jsonBlob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    if (a.parentNode) document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                }, 4000);
                this.showBackupStatus('success', `Backup selesai! File "${fileName}" berhasil diunduh.`);
            }
        } catch (err) {
            if (err && err.name === 'AbortError') {
                this.showBackupStatus('error', 'Penyimpanan file backup dibatalkan oleh pengguna.');
            } else {
                console.warn('Fallback ke unduhan langsung karena:', err);
                // Jika showSaveFilePicker atau share gagal karena alasan izin, jalankan fallback unduhan langsung
                try {
                    const fallbackNis = localStorage.getItem('student_nis') || 'Siswa';
                    const fileName = `SaveData_ZatLoka_${fallbackNis}.json`;
                    const backupObj = {};
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k) backupObj[k] = localStorage.getItem(k);
                    }
                    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        if (a.parentNode) document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                    }, 4000);
                    this.showBackupStatus('success', `Backup selesai! File "${fileName}" berhasil diunduh.`);
                } catch (fallbackErr) {
                    this.showBackupStatus('error', 'Gagal membuat file backup.');
                }
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalBtnHtml;
            }
        }
    }

    // TUGAS 3B: Pulihkan Data (Impor & Validasi Anti-Cheat berdasarkan NIS)
    handleRestoreFileSelect(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsedData = JSON.parse(event.target.result);
                if (!parsedData || typeof parsedData !== 'object') {
                    throw new Error('Isi file bukan objek JSON yang valid.');
                }

                // 1. Baca 'student_nis' dari dalam file JSON yang diunggah
                const uploadedNis = parsedData.student_nis !== undefined && parsedData.student_nis !== null
                    ? String(parsedData.student_nis).trim()
                    : '';

                if (!uploadedNis) {
                    alert('File tidak valid: Data NIS (student_nis) tidak ditemukan di dalam file JSON.');
                    e.target.value = '';
                    return;
                }

                // 2. Bandingkan dengan 'student_nis' yang saat ini aktif di localStorage perangkat
                const activeNis = (localStorage.getItem('student_nis') || '').trim();
                const activeName = (localStorage.getItem('student_name') || localStorage.getItem('studentName') || '').trim();
                const isAppEmpty = !activeNis && (!activeName || activeName === 'Siswa Baru');

                // 3. Jika aplikasi masih kosong (belum ada profil) ATAU data NIS COCOK PERSIS
                if (isAppEmpty || activeNis === uploadedNis) {
                    const restoredName = (parsedData.student_name || parsedData.studentName || parsedData.zatloka_profile_name || 'Siswa ZatLoka').trim();

                    // Timpa localStorage dengan data dari JSON
                    Object.keys(parsedData).forEach(key => {
                        const val = parsedData[key];
                        if (val !== null && val !== undefined) {
                            if (typeof val === 'object') {
                                localStorage.setItem(key, JSON.stringify(val));
                            } else {
                                localStorage.setItem(key, String(val));
                            }
                        }
                    });

                    // Pastikan sinkronisasi identitas utama
                    localStorage.setItem('student_name', restoredName);
                    localStorage.setItem('studentName', restoredName);
                    localStorage.setItem('zatloka_profile_name', restoredName);
                    localStorage.setItem('student_nis', uploadedNis);

                    window.location.reload();
                } else {
                    // 4. JIKA TIDAK COCOK, tolak pemulihan dan munculkan alert error
                    alert("GAGAL! File data ini milik siswa lain (NIS tidak cocok). Anda tidak dapat memulihkan progres milik orang lain.");
                    e.target.value = '';
                }
            } catch (err) {
                console.error('Gagal memproses file pemulihan JSON:', err);
                alert('Gagal memulihkan data: File yang dipilih bukan file JSON cadangan ZatLoka yang valid.');
                e.target.value = '';
            }
        };

        reader.onerror = () => {
            alert('Gagal membaca file yang dipilih.');
            e.target.value = '';
        };

        reader.readAsText(file);
    }

    // Helper to calculate rank based on Passed Quizzes
    getRank(exp) {
        if (window.ZatlokaProgression) {
            const data = window.ZatlokaProgression.get();
            if (data.passedKuis.includes(4)) return 'Master Sains';
            if (data.passedKuis.includes(3)) return 'Ilmuwan Muda';
            if (data.passedKuis.includes(2)) return 'Penjelajah Materi';
            if (data.passedKuis.includes(1)) return 'Detektif Pemula';
            return 'Calon Ilmuwan';
        }
        return localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan';
    }

    // Sync state into UI elements (Header capsule, modal, widgets)
    updateProfileUI() {
        const profile = this.state.profile;
        
        // Ambil nama & NIS dari localStorage
        const studentName = localStorage.getItem('student_name') || localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || profile.name || 'Siswa Baru';
        const studentNis = localStorage.getItem('student_nis') || profile.nis || '';
        profile.name = studentName;
        profile.nis = studentNis;

        // Ambil foto dari localStorage (studentPhoto atau fallback siluet)
        const studentPhoto = localStorage.getItem('studentPhoto') || profile.photo || getDefaultAvatarBase64();
        profile.photo = studentPhoto;

        // Calculate rank dynamically based on progression
        const calculatedRank = this.getRank(profile.exp || 0);
        profile.rank = calculatedRank;
        localStorage.setItem('zatloka_profile_rank', calculatedRank);

        const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || profile.exp || 0;
        profile.exp = currentExp;

        // Render teks nama & status di widget kapsul
        if (this.display.widgetName) this.display.widgetName.textContent = studentName;
        if (this.display.widgetRank) this.display.widgetRank.textContent = calculatedRank;
        if (this.display.widgetExp) this.display.widgetExp.textContent = `✨ ${currentExp} EXP`;
        
        // Render foto di widget header Menu Utama
        if (this.display.widgetAvatar) {
            this.display.widgetAvatar.src = studentPhoto;
        }

        // Render foto di modal profil
        if (this.display.avatarLarge) {
            this.display.avatarLarge.src = studentPhoto;
        }

        // Render data di modal
        if (this.display.modalRank) this.display.modalRank.textContent = calculatedRank;
        if (this.display.modalExp) this.display.modalExp.textContent = `${currentExp} EXP`;

        // Pastikan status readonly/disabled input Nama & NIS tersinkronisasi
        this.syncLockedInputsState();
    }
}

window.ComponentManager = ComponentManager;
window.getDefaultAvatarBase64 = getDefaultAvatarBase64;
window.compressImageFile = compressImageFile;


