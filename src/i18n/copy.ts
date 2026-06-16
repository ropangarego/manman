export type AppLanguage = 'English' | 'Indonesian';

type CopyKey =
  | 'nav.home'
  | 'nav.study'
  | 'nav.library'
  | 'nav.progress'
  | 'nav.settings'
  | 'common.back'
  | 'common.next'
  | 'common.cancel'
  | 'common.close'
  | 'common.reset'
  | 'common.logout'
  | 'common.type'
  | 'common.stage'
  | 'common.accuracy'
  | 'common.nextReview'
  | 'common.components'
  | 'common.breakdown'
  | 'common.builtFrom'
  | 'common.mnemonic'
  | 'common.related'
  | 'common.example'
  | 'common.soon'
  | 'common.saving'
  | 'common.updating'
  | 'common.sending'
  | 'auth.signInTitle'
  | 'auth.signInSub'
  | 'auth.signUpTitle'
  | 'auth.signUpSub'
  | 'auth.email'
  | 'auth.name'
  | 'auth.password'
  | 'auth.signIn'
  | 'auth.signUp'
  | 'auth.forgotPassword'
  | 'auth.noAccount'
  | 'auth.hasAccount'
  | 'auth.createAccount'
  | 'auth.useExisting'
  | 'auth.working'
  | 'home.title'
  | 'home.subtitle'
  | 'home.todaySession'
  | 'home.duration'
  | 'home.description'
  | 'home.startStudy'
  | 'home.quickStats'
  | 'home.quickStatsSub'
  | 'home.streak'
  | 'home.words'
  | 'home.currentFocus'
  | 'home.currentFocusSub'
  | 'library.title'
  | 'library.subtitle'
  | 'library.search'
  | 'library.contentType'
  | 'library.noItems'
  | 'library.noItemsSub'
  | 'library.loadMore'
  | 'library.back'
  | 'library.report'
  | 'progress.title'
  | 'progress.subtitle'
  | 'progress.wordsLearned'
  | 'progress.reviewsDue'
  | 'progress.wordStrength'
  | 'progress.wordStrengthSub'
  | 'progress.wordStrengthEmpty'
  | 'progress.wordStrengthEmptySub'
  | 'progress.weeklyActivity'
  | 'progress.weeklyActivitySub'
  | 'progress.learningPath'
  | 'progress.learningPathSub'
  | 'progress.morePacksInLibrary'
  | 'progress.weakAreas'
  | 'progress.weakAreasSub'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.profile'
  | 'settings.profileDetails'
  | 'settings.profileDetailsSub'
  | 'settings.changePassword'
  | 'settings.changePasswordSub'
  | 'settings.resetLearningProgress'
  | 'settings.resetLearningProgressSub'
  | 'settings.learning'
  | 'settings.study'
  | 'settings.display'
  | 'settings.app'
  | 'settings.offline'
  | 'settings.account'
  | 'settings.admin'
  | 'settings.adminPanel'
  | 'settings.adminPanelSub'
  | 'settings.support'
  | 'settings.reportIssue'
  | 'settings.reportIssueSub'
  | 'settings.dangerZone'
  | 'settings.sessionSize'
  | 'settings.script'
  | 'settings.scriptSub'
  | 'settings.pinyinDisplay'
  | 'settings.pinyinSub'
  | 'settings.toneColors'
  | 'settings.toneColorsSub'
  | 'settings.reviewStyle'
  | 'settings.reviewStyleSub'
  | 'settings.sound'
  | 'settings.soundSub'
  | 'settings.speechSpeed'
  | 'settings.speechSpeedSub'
  | 'settings.hints'
  | 'settings.hintsSub'
  | 'settings.language'
  | 'settings.languageSub'
  | 'settings.darkMode'
  | 'settings.darkModeSub'
  | 'settings.offlineMode'
  | 'settings.offlineModeSub'
  | 'settings.downloads'
  | 'settings.downloadsSub'
  | 'settings.installApp'
  | 'settings.installAppSub'
  | 'settings.logoutSub'
  | 'study.session'
  | 'study.sessionPlan'
  | 'study.learningNew'
  | 'study.quickPractice'
  | 'study.reviewDue'
  | 'study.summary'
  | 'study.unlockedContent'
  | 'study.completed'
  | 'study.new'
  | 'study.reviews'
  | 'study.start'
  | 'study.practiceThis'
  | 'study.noNewLessons'
  | 'study.noNewLessonsSub'
  | 'study.noReviewsToday'
  | 'study.noReviewsTodaySub'
  | 'study.noStudyTasksTitle'
  | 'study.noStudyTasksSub'
  | 'study.tip'
  | 'study.tipText'
  | 'study.buildGreeting'
  | 'study.whatMeaning'
  | 'study.complete'
  | 'study.niceWork'
  | 'study.saved'
  | 'study.studied'
  | 'study.unlocked'
  | 'study.viewUnlocks'
  | 'study.unlockTitle'
  | 'study.unlockCopy'
  | 'study.another'
  | 'study.done'
  | 'onboarding.welcomeCopy'
  | 'onboarding.getStarted'
  | 'onboarding.scriptTitle'
  | 'onboarding.scriptSub'
  | 'onboarding.simplifiedSub'
  | 'onboarding.traditionalSub'
  | 'onboarding.notSure'
  | 'onboarding.notSureSub'
  | 'onboarding.familiarityTitle'
  | 'onboarding.familiaritySub'
  | 'onboarding.beginner'
  | 'onboarding.beginnerSub'
  | 'onboarding.some'
  | 'onboarding.someSub'
  | 'onboarding.sessionTitle'
  | 'onboarding.sessionSub'
  | 'onboarding.quickCheck'
  | 'onboarding.quickCheckSub'
  | 'onboarding.questionProgress'
  | 'onboarding.chooseClosest'
  | 'onboarding.seeRecommendation'
  | 'onboarding.recommendTitle'
  | 'onboarding.recommendSome'
  | 'onboarding.recommendBeginner'
  | 'onboarding.introPackTitle'
  | 'onboarding.startLearning'
  | 'sheets.stageTitle'
  | 'sheets.stageSub'
  | 'sheets.sessionSizeSub'
  | 'sheets.scriptTitle'
  | 'sheets.pinyinAlways'
  | 'sheets.pinyinAlwaysSub'
  | 'sheets.pinyinLessonOnly'
  | 'sheets.pinyinLessonOnlySub'
  | 'sheets.pinyinHidden'
  | 'sheets.pinyinHiddenSub'
  | 'sheets.pinyinOff'
  | 'sheets.pinyinOffSub'
  | 'sheets.reviewSimple'
  | 'sheets.reviewSimpleSub'
  | 'sheets.reviewMixed'
  | 'sheets.reviewMixedSub'
  | 'sheets.reviewTypedSub'
  | 'sheets.speechSpeedTitle'
  | 'sheets.speechSpeedSub'
  | 'sheets.speedSlowSub'
  | 'sheets.speedNormalSub'
  | 'sheets.speedFastSub'
  | 'sheets.downloadTitle'
  | 'sheets.downloadSub'
  | 'sheets.downloaded'
  | 'sheets.downloadedSub'
  | 'sheets.refreshOffline'
  | 'sheets.refreshOfflineSub'
  | 'sheets.installTitle'
  | 'sheets.installSub'
  | 'sheets.installReady'
  | 'sheets.installReadySub'
  | 'sheets.installUnavailable'
  | 'sheets.installUnavailableSub'
  | 'sheets.installButton'
  | 'sheets.passwordResetTitle'
  | 'sheets.passwordResetSub'
  | 'sheets.passwordResetButton'
  | 'sheets.updatePasswordTitle'
  | 'sheets.updatePasswordSub'
  | 'sheets.profileTitle'
  | 'sheets.profileSub'
  | 'sheets.profileName'
  | 'sheets.profileEmail'
  | 'sheets.saveProfile'
  | 'sheets.changePasswordTitle'
  | 'sheets.changePasswordSub'
  | 'sheets.currentPassword'
  | 'sheets.newPassword'
  | 'sheets.confirmPassword'
  | 'sheets.updatePassword'
  | 'sheets.resetLearningTitle'
  | 'sheets.resetLearningSub'
  | 'sheets.logoutTitle'
  | 'sheets.logoutSub'
  | 'report.title'
  | 'report.sub'
  | 'report.describe'
  | 'report.optional'
  | 'report.placeholder'
  | 'report.submit'
  | 'toast.reportSent'
  | 'toast.logout'
  | 'toast.sessionSize'
  | 'toast.script'
  | 'toast.pinyin'
  | 'toast.reviewStyle'
  | 'toast.speechSpeed'
  | 'toast.language'
  | 'toast.offlineRefresh'
  | 'toast.toneColorsOn'
  | 'toast.toneColorsOff'
  | 'toast.soundOn'
  | 'toast.soundOff'
  | 'toast.hintsOn'
  | 'toast.hintsOff'
  | 'toast.darkEnabled'
  | 'toast.lightEnabled'
  | 'toast.offlineOn'
  | 'toast.offlineOff'
  | 'toast.signedIn'
  | 'toast.accountCreated'
  | 'toast.checkEmail'
  | 'toast.profileUpdated'
  | 'toast.profileSyncError'
  | 'toast.changePasswordPlaceholder'
  | 'toast.passwordUpdated'
  | 'toast.learningProgressReset'
  | 'toast.passwordResetPlaceholder'
  | 'toast.installOpened'
  | 'toast.installUnavailable';

const copy: Record<CopyKey, Record<AppLanguage, string>> = {
  'nav.home': { English: 'Home', Indonesian: 'Beranda' },
  'nav.study': { English: 'Study', Indonesian: 'Belajar' },
  'nav.library': { English: 'Library', Indonesian: 'Koleksi' },
  'nav.progress': { English: 'Progress', Indonesian: 'Progres' },
  'nav.settings': { English: 'Settings', Indonesian: 'Pengaturan' },
  'common.back': { English: 'Back', Indonesian: 'Kembali' },
  'common.next': { English: 'Next', Indonesian: 'Lanjut' },
  'common.cancel': { English: 'Cancel', Indonesian: 'Batal' },
  'common.close': { English: 'Close', Indonesian: 'Tutup' },
  'common.reset': { English: 'Reset', Indonesian: 'Reset' },
  'common.logout': { English: 'Logout', Indonesian: 'Keluar' },
  'common.type': { English: 'Type', Indonesian: 'Jenis' },
  'common.stage': { English: 'Stage', Indonesian: 'Tahap' },
  'common.accuracy': { English: 'Accuracy', Indonesian: 'Akurasi' },
  'common.nextReview': { English: 'Next review', Indonesian: 'Review berikutnya' },
  'common.components': { English: 'Components', Indonesian: 'Komponen' },
  'common.breakdown': { English: 'Breakdown', Indonesian: 'Uraian' },
  'common.builtFrom': { English: 'Built from', Indonesian: 'Dibentuk dari' },
  'common.mnemonic': { English: 'Mnemonic', Indonesian: 'Jembatan ingatan' },
  'common.related': { English: 'Related', Indonesian: 'Terkait' },
  'common.example': { English: 'Example', Indonesian: 'Contoh' },
  'common.soon': { English: 'Soon', Indonesian: 'Nanti' },
  'common.saving': { English: 'Saving...', Indonesian: 'Menyimpan...' },
  'common.updating': { English: 'Updating...', Indonesian: 'Memperbarui...' },
  'common.sending': { English: 'Sending...', Indonesian: 'Mengirim...' },
  'auth.signInTitle': { English: 'Welcome back', Indonesian: 'Selamat datang lagi' },
  'auth.signInSub': {
    English: 'Sign in to continue your Mandarin practice on this device.',
    Indonesian: 'Masuk untuk melanjutkan latihan Mandarin di perangkat ini.',
  },
  'auth.signUpTitle': { English: 'Create your account', Indonesian: 'Buat akun' },
  'auth.signUpSub': {
    English: 'Create a Manman! account to save your learning progress later.',
    Indonesian: 'Buat akun Manman! untuk menyimpan progres belajar nanti.',
  },
  'auth.email': { English: 'Email', Indonesian: 'Email' },
  'auth.name': { English: 'Name', Indonesian: 'Nama' },
  'auth.password': { English: 'Password', Indonesian: 'Password' },
  'auth.signIn': { English: 'Sign in', Indonesian: 'Masuk' },
  'auth.signUp': { English: 'Sign up', Indonesian: 'Daftar' },
  'auth.forgotPassword': { English: 'Forgot password?', Indonesian: 'Lupa password?' },
  'auth.noAccount': { English: 'New here?', Indonesian: 'Baru di sini?' },
  'auth.hasAccount': { English: 'Already have an account?', Indonesian: 'Sudah punya akun?' },
  'auth.createAccount': { English: 'Create account', Indonesian: 'Buat akun' },
  'auth.useExisting': { English: 'Use existing account', Indonesian: 'Pakai akun yang ada' },
  'auth.working': { English: 'Working...', Indonesian: 'Memproses...' },
  'home.title': { English: 'Nǐ hǎo, Learner', Indonesian: 'Nǐ hǎo, Pelajar' },
  'home.subtitle': { English: 'Ready for today’s Mandarin?', Indonesian: 'Siap belajar Mandarin hari ini?' },
  'home.todaySession': { English: 'Today’s Session', Indonesian: 'Sesi Hari Ini' },
  'home.duration': { English: 'Duration', Indonesian: 'Durasi' },
  'home.description': {
    English: 'A short plan with new words, quick practice, and due reviews.',
    Indonesian: 'Rencana singkat berisi kata baru, latihan cepat, dan review jatuh tempo.',
  },
  'home.startStudy': { English: 'Start Study', Indonesian: 'Mulai Belajar' },
  'home.quickStats': { English: 'Quick stats', Indonesian: 'Ringkasan' },
  'home.quickStatsSub': { English: 'A simple snapshot from your local practice.', Indonesian: 'Ringkasan sederhana dari latihan lokalmu.' },
  'home.streak': { English: 'Streak', Indonesian: 'Runtun' },
  'home.words': { English: 'Words', Indonesian: 'Kata' },
  'home.currentFocus': { English: 'Current focus', Indonesian: 'Fokus sekarang' },
  'home.currentFocusSub': {
    English: 'These will appear naturally during study sessions.',
    Indonesian: 'Ini akan muncul secara alami saat sesi belajar.',
  },
  'library.title': { English: 'Library', Indonesian: 'Koleksi' },
  'library.subtitle': {
    English: 'Explore the Mandarin content available in Manman.',
    Indonesian: 'Jelajahi materi Mandarin yang tersedia di Manman.',
  },
  'library.search': {
    English: 'Search hanzi, pinyin, meaning...',
    Indonesian: 'Cari hanzi, pinyin, arti...',
  },
  'library.contentType': { English: 'Content type', Indonesian: 'Jenis konten' },
  'library.noItems': { English: 'No items found', Indonesian: 'Tidak ada item' },
  'library.noItemsSub': { English: 'Try a different search or filter.', Indonesian: 'Coba pencarian atau filter lain.' },
  'library.loadMore': { English: 'Load more', Indonesian: 'Muat lagi' },
  'library.back': { English: 'Back to Library', Indonesian: 'Kembali ke Koleksi' },
  'library.report': { English: 'Report an issue', Indonesian: 'Laporkan masalah' },
  'progress.title': { English: 'Progress', Indonesian: 'Progres' },
  'progress.subtitle': {
    English: 'Track word strength, activity, and what unlocks next.',
    Indonesian: 'Pantau kekuatan kata, aktivitas, dan konten berikutnya.',
  },
  'progress.wordsLearned': { English: 'Words learned', Indonesian: 'Kata dipelajari' },
  'progress.reviewsDue': { English: 'Reviews due', Indonesian: 'Review jatuh tempo' },
  'progress.wordStrength': { English: 'Word strength', Indonesian: 'Kekuatan kata' },
  'progress.wordStrengthSub': { English: 'Counts words only.', Indonesian: 'Hanya menghitung kata.' },
  'progress.wordStrengthEmpty': { English: 'No word strength yet', Indonesian: 'Belum ada kekuatan kata' },
  'progress.wordStrengthEmptySub': {
    English: 'Study a few words first, then your progress will appear here.',
    Indonesian: 'Pelajari beberapa kata dulu, lalu progresmu akan muncul di sini.',
  },
  'progress.weeklyActivity': { English: 'Weekly activity', Indonesian: 'Aktivitas mingguan' },
  'progress.weeklyActivitySub': { English: 'Minutes per day.', Indonesian: 'Menit per hari.' },
  'progress.learningPath': { English: 'Learning path', Indonesian: 'Jalur belajar' },
  'progress.learningPathSub': { English: 'How starter content opens up.', Indonesian: 'Cara konten awal terbuka bertahap.' },
  'progress.morePacksInLibrary': {
    English: 'More packs are available in Library.',
    Indonesian: 'Paket lainnya tersedia di Koleksi.',
  },
  'progress.weakAreas': { English: 'Weak areas', Indonesian: 'Area lemah' },
  'progress.weakAreasSub': { English: 'Shown after enough reviews.', Indonesian: 'Muncul setelah review cukup.' },
  'settings.title': { English: 'Settings', Indonesian: 'Pengaturan' },
  'settings.subtitle': {
    English: 'Tune study, display, app, and account options.',
    Indonesian: 'Atur belajar, tampilan, aplikasi, dan akun.',
  },
  'settings.profile': { English: 'Profile', Indonesian: 'Profil' },
  'settings.profileDetails': { English: 'Name & email', Indonesian: 'Nama & email' },
  'settings.profileDetailsSub': { English: 'Local learner profile for now.', Indonesian: 'Profil learner lokal untuk sementara.' },
  'settings.changePassword': { English: 'Change password', Indonesian: 'Ubah password' },
  'settings.changePasswordSub': {
    English: 'Update your account password.',
    Indonesian: 'Ubah password akunmu.',
  },
  'settings.resetLearningProgress': { English: 'Reset learning progress', Indonesian: 'Reset progres belajar' },
  'settings.resetLearningProgressSub': {
    English: 'Clear local SRS, stats, and activity only.',
    Indonesian: 'Hapus SRS, statistik, dan aktivitas lokal saja.',
  },
  'settings.learning': { English: 'Learning', Indonesian: 'Belajar' },
  'settings.study': { English: 'Study', Indonesian: 'Sesi' },
  'settings.display': { English: 'Display', Indonesian: 'Tampilan' },
  'settings.app': { English: 'App', Indonesian: 'Aplikasi' },
  'settings.offline': { English: 'Offline', Indonesian: 'Offline' },
  'settings.account': { English: 'Account & data', Indonesian: 'Akun & data' },
  'settings.admin': { English: 'Developer / Admin', Indonesian: 'Developer / Admin' },
  'settings.adminPanel': { English: 'Admin Panel', Indonesian: 'Panel Admin' },
  'settings.adminPanelSub': {
    English: 'Review content QA and user reports.',
    Indonesian: 'Periksa QA konten dan laporan pengguna.',
  },
  'settings.support': { English: 'Support', Indonesian: 'Dukungan' },
  'settings.reportIssue': { English: 'Report an issue', Indonesian: 'Laporkan masalah' },
  'settings.reportIssueSub': {
    English: 'Send feedback about the app or your account.',
    Indonesian: 'Kirim masukan tentang aplikasi atau akunmu.',
  },
  'settings.dangerZone': { English: 'Danger Zone', Indonesian: 'Area Berisiko' },
  'settings.sessionSize': { English: 'Session size', Indonesian: 'Ukuran sesi' },
  'settings.script': { English: 'Script', Indonesian: 'Aksara' },
  'settings.scriptSub': { English: 'Chinese character set.', Indonesian: 'Pilihan aksara Mandarin.' },
  'settings.pinyinDisplay': { English: 'Pinyin display', Indonesian: 'Tampilan pinyin' },
  'settings.pinyinSub': { English: 'Control how much help you see.', Indonesian: 'Atur seberapa banyak bantuan yang terlihat.' },
  'settings.toneColors': { English: 'Tone colors', Indonesian: 'Warna nada' },
  'settings.toneColorsSub': { English: 'Show tone dots and tone hints.', Indonesian: 'Tampilkan titik nada dan petunjuk nada.' },
  'settings.reviewStyle': { English: 'Review style', Indonesian: 'Gaya review' },
  'settings.reviewStyleSub': { English: 'Choose how reviews feel. Coming later.', Indonesian: 'Pilih gaya review. Segera hadir.' },
  'settings.sound': { English: 'Sound', Indonesian: 'Suara' },
  'settings.soundSub': { English: 'Play pronunciation audio.', Indonesian: 'Putar audio pelafalan.' },
  'settings.speechSpeed': { English: 'Speech speed', Indonesian: 'Kecepatan suara' },
  'settings.speechSpeedSub': {
    English: 'Preview Mandarin pronunciation speed.',
    Indonesian: 'Coba kecepatan pelafalan Mandarin.',
  },
  'settings.hints': { English: 'Tutorial hints', Indonesian: 'Petunjuk belajar' },
  'settings.hintsSub': { English: 'Show helper tips for beginners.', Indonesian: 'Tampilkan petunjuk untuk pemula.' },
  'settings.language': { English: 'Language', Indonesian: 'Bahasa' },
  'settings.languageSub': { English: 'App interface language.', Indonesian: 'Bahasa antarmuka aplikasi.' },
  'settings.darkMode': { English: 'Dark mode', Indonesian: 'Mode gelap' },
  'settings.darkModeSub': { English: 'Switch app appearance.', Indonesian: 'Ubah tampilan aplikasi.' },
  'settings.offlineMode': { English: 'Offline mode', Indonesian: 'Mode offline' },
  'settings.offlineModeSub': { English: 'Keep starter content available on this device.', Indonesian: 'Simpan konten awal di perangkat ini.' },
  'settings.downloads': { English: 'Manage downloads', Indonesian: 'Kelola unduhan' },
  'settings.downloadsSub': { English: 'Refresh the saved starter pack.', Indonesian: 'Segarkan starter pack tersimpan.' },
  'settings.installApp': { English: 'Add app shortcut', Indonesian: 'Tambah pintasan aplikasi' },
  'settings.installAppSub': { English: 'Open Manman! from your home screen.', Indonesian: 'Buka Manman! dari layar utama.' },
  'settings.logoutSub': { English: 'Sign out on this device.', Indonesian: 'Keluar dari perangkat ini.' },
  'study.session': { English: 'Study session', Indonesian: 'Sesi belajar' },
  'study.sessionPlan': { English: 'Session plan', Indonesian: 'Rencana sesi' },
  'study.learningNew': { English: 'Learning new word', Indonesian: 'Belajar kata baru' },
  'study.quickPractice': { English: 'Quick practice', Indonesian: 'Latihan cepat' },
  'study.reviewDue': { English: 'Review due item', Indonesian: 'Review item jatuh tempo' },
  'study.summary': { English: 'Session summary', Indonesian: 'Ringkasan sesi' },
  'study.unlockedContent': { English: 'Unlocked content', Indonesian: 'Konten terbuka' },
  'study.completed': { English: 'completed', Indonesian: 'selesai' },
  'study.new': { English: 'New', Indonesian: 'Baru' },
  'study.reviews': { English: 'Reviews', Indonesian: 'Review' },
  'study.start': { English: 'Start', Indonesian: 'Mulai' },
  'study.practiceThis': { English: 'Practice this', Indonesian: 'Latih ini' },
  'study.noNewLessons': { English: 'No new lessons right now', Indonesian: 'Belum ada pelajaran baru sekarang' },
  'study.noNewLessonsSub': {
    English: 'You have introduced all new items in this pack.',
    Indonesian: 'Kamu sudah mengenal semua item baru di paket ini.',
  },
  'study.noReviewsToday': { English: 'No reviews today', Indonesian: 'Tidak ada review hari ini' },
  'study.noReviewsTodaySub': {
    English: 'Learn new items now, then reviews will appear when they are due.',
    Indonesian: 'Pelajari item baru sekarang, lalu review akan muncul saat jatuh tempo.',
  },
  'study.noStudyTasksTitle': { English: 'Nothing due right now', Indonesian: 'Belum ada yang perlu dikerjakan' },
  'study.noStudyTasksSub': {
    English: 'There are no new lessons or due reviews in this pack right now.',
    Indonesian: 'Belum ada pelajaran baru atau review jatuh tempo di paket ini.',
  },
  'study.tip': { English: 'Tip', Indonesian: 'Tip' },
  'study.tipText': {
    English: 'Colored dots under pinyin show the tone of each syllable.',
    Indonesian: 'Titik berwarna di bawah pinyin menunjukkan nada tiap suku kata.',
  },
  'study.buildGreeting': { English: 'Build the greeting', Indonesian: 'Bentuk sapaannya' },
  'study.whatMeaning': { English: 'What does this mean?', Indonesian: 'Apa artinya?' },
  'study.complete': { English: 'Session complete', Indonesian: 'Sesi selesai' },
  'study.niceWork': { English: 'Nice work. Session {{number}} is complete.', Indonesian: 'Bagus. Sesi {{number}} selesai.' },
  'study.saved': {
    English: 'Your starter pack items were saved and your greeting reviews were refreshed.',
    Indonesian: 'Item starter pack tersimpan dan review sapaan diperbarui.',
  },
  'study.studied': { English: 'Studied', Indonesian: 'Dilatih' },
  'study.unlocked': { English: 'Unlocked', Indonesian: 'Terbuka' },
  'study.viewUnlocks': { English: 'View unlocks', Indonesian: 'Lihat yang terbuka' },
  'study.unlockTitle': { English: 'New greeting practice is ready.', Indonesian: 'Latihan sapaan baru siap.' },
  'study.unlockCopy': {
    English: 'Because these items reached Familiar, related starter-pack content can now appear in future sessions.',
    Indonesian: 'Karena item ini mencapai Familiar, konten terkait bisa muncul di sesi berikutnya.',
  },
  'study.another': { English: 'Study another session', Indonesian: 'Belajar sesi lagi' },
  'study.done': { English: 'Done', Indonesian: 'Selesai' },
  'onboarding.welcomeCopy': {
    English: 'Learn practical Mandarin in short daily sessions. Lessons, quick practice, reviews, and unlocks in one guided flow.',
    Indonesian: 'Belajar Mandarin praktis dalam sesi singkat. Pelajaran, latihan, review, dan unlock dalam satu alur.',
  },
  'onboarding.getStarted': { English: 'Get started', Indonesian: 'Mulai' },
  'onboarding.scriptTitle': { English: 'Which Chinese script do you want?', Indonesian: 'Aksara Mandarin mana yang kamu mau?' },
  'onboarding.scriptSub': { English: 'You can change this later in Settings.', Indonesian: 'Bisa diubah nanti di Pengaturan.' },
  'onboarding.simplifiedSub': { English: 'Used in Mainland China, Singapore, and Malaysia.', Indonesian: 'Dipakai di Tiongkok Daratan, Singapura, dan Malaysia.' },
  'onboarding.traditionalSub': { English: 'Used in Taiwan, Hong Kong, and Macau.', Indonesian: 'Dipakai di Taiwan, Hong Kong, dan Makau.' },
  'onboarding.notSure': { English: 'Not sure', Indonesian: 'Belum yakin' },
  'onboarding.notSureSub': { English: 'We’ll start with Simplified for now.', Indonesian: 'Kita mulai dengan Simplified dulu.' },
  'onboarding.familiarityTitle': { English: 'How familiar are you with Mandarin?', Indonesian: 'Seberapa familiar kamu dengan Mandarin?' },
  'onboarding.familiaritySub': { English: 'This helps us choose your starting point.', Indonesian: 'Ini membantu memilih titik mulai.' },
  'onboarding.beginner': { English: 'Absolute beginner', Indonesian: 'Pemula total' },
  'onboarding.beginnerSub': { English: 'Start from zero.', Indonesian: 'Mulai dari nol.' },
  'onboarding.some': { English: 'I know some basics', Indonesian: 'Saya tahu sedikit dasar' },
  'onboarding.someSub': { English: 'I know a few words, greetings, or simple sentences.', Indonesian: 'Saya tahu beberapa kata, sapaan, atau kalimat sederhana.' },
  'onboarding.sessionTitle': { English: 'How much do you want per session?', Indonesian: 'Mau belajar seberapa banyak per sesi?' },
  'onboarding.sessionSub': { English: 'This controls daily session size, not a long-term goal.', Indonesian: 'Ini mengatur ukuran sesi harian, bukan target jangka panjang.' },
  'onboarding.quickCheck': { English: 'Quick check', Indonesian: 'Cek cepat' },
  'onboarding.quickCheckSub': { English: 'A few questions to avoid starting too basic.', Indonesian: 'Beberapa pertanyaan agar tidak mulai terlalu dasar.' },
  'onboarding.questionProgress': { English: 'Question {{current}} of {{total}}', Indonesian: 'Pertanyaan {{current}} dari {{total}}' },
  'onboarding.chooseClosest': { English: 'Choose the closest answer.', Indonesian: 'Pilih jawaban yang paling dekat.' },
  'onboarding.seeRecommendation': { English: 'See recommendation', Indonesian: 'Lihat rekomendasi' },
  'onboarding.recommendTitle': { English: 'Recommended start', Indonesian: 'Rekomendasi mulai' },
  'onboarding.recommendSome': { English: 'Based on your quick check, start here and adjust later if needed.', Indonesian: 'Berdasarkan cek cepat, mulai dari sini dan sesuaikan nanti jika perlu.' },
  'onboarding.recommendBeginner': { English: 'We’ll start from the basics and build up gradually.', Indonesian: 'Kita mulai dari dasar dan naik bertahap.' },
  'onboarding.introPackTitle': { English: 'Quick Mandarin intro', Indonesian: 'Pengenalan Mandarin singkat' },
  'onboarding.startLearning': { English: 'Start learning', Indonesian: 'Mulai belajar' },
  'sheets.stageTitle': { English: 'Choose stage', Indonesian: 'Pilih tahap' },
  'sheets.stageSub': { English: 'Filter Library by memory strength.', Indonesian: 'Filter Koleksi berdasarkan kekuatan ingatan.' },
  'sheets.sessionSizeSub': { English: 'Choose duration and daily load together.', Indonesian: 'Pilih durasi dan jumlah belajar sekaligus.' },
  'sheets.scriptTitle': { English: 'Script', Indonesian: 'Aksara' },
  'sheets.pinyinAlways': { English: 'Always', Indonesian: 'Selalu' },
  'sheets.pinyinAlwaysSub': { English: 'Show pinyin in lessons and reviews.', Indonesian: 'Tampilkan pinyin di pelajaran dan review.' },
  'sheets.pinyinLessonOnly': { English: 'Lesson only', Indonesian: 'Hanya pelajaran' },
  'sheets.pinyinLessonOnlySub': { English: 'Show pinyin while learning, hide in reviews.', Indonesian: 'Tampilkan saat belajar, sembunyikan saat review.' },
  'sheets.pinyinHidden': { English: 'Hidden in review', Indonesian: 'Sembunyi saat review' },
  'sheets.pinyinHiddenSub': { English: 'Hide pinyin during review questions.', Indonesian: 'Sembunyikan pinyin saat pertanyaan review.' },
  'sheets.pinyinOff': { English: 'Off', Indonesian: 'Mati' },
  'sheets.pinyinOffSub': { English: 'Hide pinyin everywhere.', Indonesian: 'Sembunyikan pinyin di semua tempat.' },
  'sheets.reviewSimple': { English: 'Simple', Indonesian: 'Sederhana' },
  'sheets.reviewSimpleSub': { English: 'Multiple choice with automatic feedback.', Indonesian: 'Pilihan ganda dengan feedback otomatis.' },
  'sheets.reviewMixed': { English: 'Mixed', Indonesian: 'Campuran' },
  'sheets.reviewMixedSub': { English: 'Meaning, pinyin, tone, and sentence checks.', Indonesian: 'Cek arti, pinyin, nada, dan kalimat.' },
  'sheets.reviewTypedSub': { English: 'Coming later.', Indonesian: 'Nanti.' },
  'sheets.speechSpeedTitle': { English: 'Speech speed', Indonesian: 'Kecepatan suara' },
  'sheets.speechSpeedSub': {
    English: 'Preview with 你好吗, then choose the speed that feels easiest to follow.',
    Indonesian: 'Coba dengan 你好吗, lalu pilih kecepatan yang paling mudah diikuti.',
  },
  'sheets.speedSlowSub': { English: 'Best for first exposure.', Indonesian: 'Cocok untuk pertama kali dengar.' },
  'sheets.speedNormalSub': { English: 'Natural learning pace.', Indonesian: 'Kecepatan belajar natural.' },
  'sheets.speedFastSub': { English: 'Closer to everyday speech.', Indonesian: 'Lebih dekat ke percakapan sehari-hari.' },
  'sheets.downloadTitle': { English: 'Manage downloads', Indonesian: 'Kelola unduhan' },
  'sheets.downloadSub': { English: 'Offline pack storage.', Indonesian: 'Penyimpanan pack offline.' },
  'sheets.downloaded': { English: 'Downloaded', Indonesian: 'Terunduh' },
  'sheets.downloadedSub': { English: 'Foundations pack is ready offline.', Indonesian: 'Pack Foundations siap offline.' },
  'sheets.refreshOffline': { English: 'Refresh offline content', Indonesian: 'Segarkan konten offline' },
  'sheets.refreshOfflineSub': { English: 'Update the saved practice pack.', Indonesian: 'Perbarui pack latihan tersimpan.' },
  'sheets.installTitle': { English: 'Add app shortcut', Indonesian: 'Tambah shortcut app' },
  'sheets.installSub': {
    English: 'Install Manman! so it opens like a native app.',
    Indonesian: 'Pasang Manman! agar terbuka seperti app native.',
  },
  'sheets.installReady': { English: 'Install from this browser', Indonesian: 'Pasang dari browser ini' },
  'sheets.installReadySub': {
    English: 'Use the browser install prompt when it appears.',
    Indonesian: 'Gunakan prompt instal dari browser saat muncul.',
  },
  'sheets.installUnavailable': { English: 'Browser menu shortcut', Indonesian: 'Shortcut dari menu browser' },
  'sheets.installUnavailableSub': {
    English: 'If the install button is unavailable, use your browser menu and choose Add to Home Screen or Install app.',
    Indonesian: 'Jika tombol instal belum tersedia, gunakan menu browser lalu pilih Add to Home Screen atau Install app.',
  },
  'sheets.installButton': { English: 'Install app', Indonesian: 'Pasang app' },
  'sheets.passwordResetTitle': { English: 'Reset password', Indonesian: 'Reset password' },
  'sheets.passwordResetSub': {
    English: 'Enter your account email and we will send a reset link.',
    Indonesian: 'Masukkan email akunmu dan kami akan mengirim link reset.',
  },
  'sheets.passwordResetButton': { English: 'Send reset link', Indonesian: 'Kirim link reset' },
  'sheets.updatePasswordTitle': { English: 'Set a new password', Indonesian: 'Buat password baru' },
  'sheets.updatePasswordSub': {
    English: 'Enter a new password for your account.',
    Indonesian: 'Masukkan password baru untuk akunmu.',
  },
  'sheets.profileTitle': { English: 'Edit profile', Indonesian: 'Edit profil' },
  'sheets.profileSub': {
    English: 'Update the learner name and account email.',
    Indonesian: 'Ubah nama pelajar dan email akun.',
  },
  'sheets.profileName': { English: 'Name', Indonesian: 'Nama' },
  'sheets.profileEmail': { English: 'Email', Indonesian: 'Email' },
  'sheets.saveProfile': { English: 'Save profile', Indonesian: 'Simpan profil' },
  'sheets.changePasswordTitle': { English: 'Change password', Indonesian: 'Ubah password' },
  'sheets.changePasswordSub': {
    English: 'Use at least 6 characters for the new password.',
    Indonesian: 'Gunakan minimal 6 karakter untuk password baru.',
  },
  'sheets.currentPassword': { English: 'Current password', Indonesian: 'Password sekarang' },
  'sheets.newPassword': { English: 'New password', Indonesian: 'Password baru' },
  'sheets.confirmPassword': { English: 'Confirm password', Indonesian: 'Konfirmasi password' },
  'sheets.updatePassword': { English: 'Update password', Indonesian: 'Update password' },
  'sheets.resetLearningTitle': { English: 'Reset learning progress?', Indonesian: 'Reset progres belajar?' },
  'sheets.resetLearningSub': {
    English: 'This clears local word strength, reviews, activity, and session stats. Your profile and settings stay unchanged.',
    Indonesian: 'Ini menghapus kekuatan kata, review, aktivitas, dan statistik sesi lokal. Profil dan pengaturan tetap aman.',
  },
  'sheets.logoutTitle': { English: 'Logout?', Indonesian: 'Keluar?' },
  'sheets.logoutSub': { English: 'You can sign back in later. This will return to onboarding.', Indonesian: 'Kamu bisa masuk lagi nanti. Ini akan kembali ke onboarding.' },
  'report.title': { English: 'Report issue', Indonesian: 'Laporkan masalah' },
  'report.sub': { English: 'What seems wrong with this item?', Indonesian: 'Apa yang salah dengan item ini?' },
  'report.describe': { English: 'Describe the issue', Indonesian: 'Jelaskan masalahnya' },
  'report.optional': { English: 'optional', Indonesian: 'opsional' },
  'report.placeholder': { English: 'Example: tone should be 3rd tone here...', Indonesian: 'Contoh: nadanya seharusnya nada 3 di sini...' },
  'report.submit': { English: 'Submit report', Indonesian: 'Kirim laporan' },
  'toast.reportSent': { English: 'Thanks — your report was sent.', Indonesian: 'Terima kasih — laporan terkirim.' },
  'toast.logout': { English: 'Logged out.', Indonesian: 'Sudah keluar.' },
  'toast.sessionSize': { English: 'Session size updated to {{value}}', Indonesian: 'Ukuran sesi diubah ke {{value}}' },
  'toast.script': { English: 'Script changed to {{value}}', Indonesian: 'Aksara diubah ke {{value}}' },
  'toast.pinyin': { English: 'Pinyin display updated to {{value}}', Indonesian: 'Tampilan pinyin diubah ke {{value}}' },
  'toast.reviewStyle': { English: 'Review style updated to {{value}}', Indonesian: 'Gaya review diubah ke {{value}}' },
  'toast.speechSpeed': { English: 'Speech speed updated to {{value}}', Indonesian: 'Kecepatan suara diubah ke {{value}}' },
  'toast.language': { English: 'Language changed to {{value}}', Indonesian: 'Bahasa diubah ke {{value}}' },
  'toast.offlineRefresh': { English: 'Offline content refreshed.', Indonesian: 'Konten offline diperbarui.' },
  'toast.toneColorsOn': { English: 'Tone colors turned on', Indonesian: 'Warna nada dinyalakan' },
  'toast.toneColorsOff': { English: 'Tone colors turned off', Indonesian: 'Warna nada dimatikan' },
  'toast.soundOn': { English: 'Sound turned on', Indonesian: 'Suara dinyalakan' },
  'toast.soundOff': { English: 'Sound turned off', Indonesian: 'Suara dimatikan' },
  'toast.hintsOn': { English: 'Tutorial hints turned on', Indonesian: 'Petunjuk tutorial dinyalakan' },
  'toast.hintsOff': { English: 'Tutorial hints turned off', Indonesian: 'Petunjuk tutorial dimatikan' },
  'toast.darkEnabled': { English: 'Dark mode enabled', Indonesian: 'Mode gelap aktif' },
  'toast.lightEnabled': { English: 'Light mode enabled', Indonesian: 'Mode terang aktif' },
  'toast.offlineOn': { English: 'Offline mode enabled', Indonesian: 'Mode offline aktif' },
  'toast.offlineOff': { English: 'Offline mode disabled', Indonesian: 'Mode offline mati' },
  'toast.signedIn': { English: 'Signed in', Indonesian: 'Sudah masuk' },
  'toast.accountCreated': { English: 'Account created', Indonesian: 'Akun dibuat' },
  'toast.checkEmail': {
    English: 'Account created. Check your email to confirm sign in.',
    Indonesian: 'Akun dibuat. Cek email untuk konfirmasi masuk.',
  },
  'toast.profileUpdated': { English: 'Profile updated', Indonesian: 'Profil diperbarui' },
  'toast.profileSyncError': {
    English: 'Saved locally. Could not sync profile yet.',
    Indonesian: 'Tersimpan lokal. Profil belum bisa disinkronkan.',
  },
  'toast.changePasswordPlaceholder': {
    English: 'Password updated.',
    Indonesian: 'Password diperbarui.',
  },
  'toast.passwordUpdated': { English: 'Password updated.', Indonesian: 'Password diperbarui.' },
  'toast.learningProgressReset': { English: 'Learning progress reset', Indonesian: 'Progres belajar direset' },
  'toast.passwordResetPlaceholder': {
    English: 'Password reset link sent.',
    Indonesian: 'Link reset password terkirim.',
  },
  'toast.installOpened': { English: 'Install prompt opened', Indonesian: 'Prompt instal dibuka' },
  'toast.installUnavailable': {
    English: 'Use your browser menu to add Manman! to your home screen.',
    Indonesian: 'Gunakan menu browser untuk menambahkan Manman! ke home screen.',
  },
};

export function translate(language: AppLanguage, key: CopyKey, values: Record<string, string | number> = {}) {
  const template = copy[key]?.[language] ?? copy[key]?.English ?? key;

  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{{${name}}}`, String(value)),
    template,
  );
}

export function textFor(language: AppLanguage, english: string, indonesian?: string) {
  return language === 'Indonesian' && indonesian ? indonesian : english;
}

export function optionLabel(language: AppLanguage, value: string) {
  const labels: Record<string, Record<AppLanguage, string>> = {
    Light: { English: 'Light', Indonesian: 'Ringan' },
    Standard: { English: 'Standard', Indonesian: 'Standar' },
    Intense: { English: 'Intense', Indonesian: 'Intens' },
    Simplified: { English: 'Simplified', Indonesian: 'Sederhana' },
    Traditional: { English: 'Traditional', Indonesian: 'Tradisional' },
    English: { English: 'English', Indonesian: 'Inggris' },
    Indonesian: { English: 'Indonesian', Indonesian: 'Indonesia' },
    Learning: { English: 'Learning', Indonesian: 'Belajar' },
    'Not started': { English: 'Not started', Indonesian: 'Belum dimulai' },
    Familiar: { English: 'Familiar', Indonesian: 'Familiar' },
    Strong: { English: 'Strong', Indonesian: 'Kuat' },
    Mastered: { English: 'Mastered', Indonesian: 'Dikuasai' },
    'Long-term': { English: 'Long-term', Indonesian: 'Jangka panjang' },
    All: { English: 'All', Indonesian: 'Semua' },
    Hanzi: { English: 'Hanzi', Indonesian: 'Hanzi' },
    Words: { English: 'Words', Indonesian: 'Kata' },
    Sentences: { English: 'Sentences', Indonesian: 'Kalimat' },
    Patterns: { English: 'Patterns', Indonesian: 'Pola' },
    Always: { English: 'Always', Indonesian: 'Selalu' },
    'Lesson only': { English: 'Lesson only', Indonesian: 'Hanya pelajaran' },
    'Hidden in review': { English: 'Hidden in review', Indonesian: 'Sembunyi saat review' },
    Off: { English: 'Off', Indonesian: 'Mati' },
    Simple: { English: 'Simple', Indonesian: 'Sederhana' },
    Mixed: { English: 'Mixed', Indonesian: 'Campuran' },
    Typed: { English: 'Typed', Indonesian: 'Ketik' },
    Slow: { English: 'Slow', Indonesian: 'Pelan' },
    Normal: { English: 'Normal', Indonesian: 'Normal' },
    Fast: { English: 'Fast', Indonesian: 'Cepat' },
  };

  return labels[value]?.[language] ?? value;
}
