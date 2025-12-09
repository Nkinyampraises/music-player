'use strict';

/**
 * All music information
 */
const musicData = [
  {
    backgroundImage: "./assets/images/first.jpeg",
    posterUrl: "./assets/images/first.jpeg",
    title: "Happy Moments (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Tonion",
    musicPath: "./assets/music/music-1.mp3",
  },
  {
    backgroundImage: "./assets/images/sec.jpeg",
    posterUrl: "./assets/images/sec.jpeg",
    title: "We Are Going To Be Ok (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Jhove",
    musicPath: "./assets/music/music-2.mp3",
  },
  {
    backgroundImage: "./assets/images/third.jpeg",
    posterUrl: "./assets/images/third.jpeg",
    title: "Winter Meadow",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x  juniorodeo",
    musicPath: "./assets/music/music-3.mp3",
  },
  {
    backgroundImage: "./assets/images/forth.jpeg",
    posterUrl: "./assets/images/forth.jpeg",
    title: "From Where We Started",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-4.mp3",
  },
  {
    backgroundImage: "./assets/images/fifth.jpeg",
    posterUrl: "./assets/images/fifth.jpeg",
    title: "Where I Found You",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-5.mp3",
  },
];

// --- DOM Elements ---
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progressBarContainer');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

const currentCover = document.getElementById('currentCover');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const albumName = document.getElementById('albumName');

const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumeSlider');

const playlistContainer = document.getElementById('playlistContainer');

// Mobile DOM Elements
const playPauseBtnMobile = document.getElementById('playPauseBtnMobile');
const playPauseIconMobile = document.getElementById('playPauseIconMobile');
const prevBtnMobile = document.getElementById('prevBtnMobile');
const nextBtnMobile = document.getElementById('nextBtnMobile');
const progressBarMobile = document.getElementById('progressBarMobile');
const progressBarContainerMobile = document.getElementById('progressBarContainerMobile');
const currentTimeMobile = document.getElementById('currentTimeMobile');
const totalTimeMobile = document.getElementById('totalTimeMobile');
const currentCoverMobile = document.getElementById('currentCoverMobile');
const currentTitleMobile = document.getElementById('currentTitleMobile');
const currentArtistMobile = document.getElementById('currentArtistMobile');
const albumNameMobile = document.getElementById('albumNameMobile');

const toggleViewBtn = document.getElementById('toggleViewBtn');
const toggleViewIcon = document.getElementById('toggleViewIcon');
const nowPlayingView = document.getElementById('nowPlayingView');
const playlistView = document.getElementById('playlistView');


// --- Audio Player State ---
let currentSongIndex = 0;
let isPlaying = false;
let isMobilePlaylistView = false;

const audio = new Audio();

// --- Functions ---

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Load a song
function loadSong(index) {
    const song = musicData[index];
    currentSongIndex = index;
    audio.src = song.musicPath;

    // Update Desktop UI
    currentCover.src = song.posterUrl;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    albumName.textContent = song.album;

    // Update Mobile UI
    currentCoverMobile.src = song.posterUrl;
    currentTitleMobile.textContent = song.title;
    currentArtistMobile.textContent = song.artist;
    albumNameMobile.textContent = song.album;
    
    // Update background
    document.body.style.backgroundImage = `url(${song.backgroundImage})`;

    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
        totalTimeMobile.textContent = formatTime(audio.duration);
    });

    updatePlaylistHighlight();
}

// Play song
function playSong() {
    isPlaying = true;
    audio.play();
    playPauseIcon.className = 'bi bi-pause-fill';
    playPauseIconMobile.className = 'bi bi-pause-circle-fill';
    updatePlaylistHighlight();
}

// Pause song
function pauseSong() {
    isPlaying = false;
    audio.pause();
    playPauseIcon.className = 'bi bi-play-fill';
    playPauseIconMobile.className = 'bi bi-play-circle-fill';
    updatePlaylistHighlight();
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + musicData.length) % musicData.length;
    loadSong(currentSongIndex);
    playSong();
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % musicData.length;
    loadSong(currentSongIndex);
    playSong();
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    
    progressBar.style.width = `${progressPercent}%`;
    progressBarMobile.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(currentTime);
    currentTimeMobile.textContent = formatTime(currentTime);
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Set volume
function setVolume(e) {
    audio.volume = e.target.value / 100;
    updateVolumeIcon(e.target.value);
}

// Update volume icon
function updateVolumeIcon(volume) {
    if (volume == 0) {
        volumeIcon.className = 'bi bi-volume-mute-fill';
    } else if (volume < 50) {
        volumeIcon.className = 'bi bi-volume-down-fill';
    } else {
        volumeIcon.className = 'bi bi-volume-up-fill';
    }
}

// Toggle mute
function toggleMute() {
    if (audio.volume > 0) {
        audio.dataset.previousVolume = audio.volume; // Store previous volume
        audio.volume = 0;
        volumeSlider.value = 0;
        updateVolumeIcon(0);
    } else {
        const previousVolume = audio.dataset.previousVolume || 0.7; // Default to 70% if not set
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume * 100;
        updateVolumeIcon(previousVolume * 100);
    }
}

// Render playlist
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    musicData.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.index = index;

        item.innerHTML = `
            <div class="playlist-item-cover">
                <img src="${song.posterUrl}" alt="${song.title}">
                <div class="playlist-item-overlay">
                    <i class="bi bi-play-fill"></i>
                </div>
            </div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration"></div>
        `;
        
        const tempAudio = new Audio(song.musicPath);
        tempAudio.addEventListener('loadedmetadata', () => {
            const durationEl = item.querySelector('.playlist-item-duration');
            if (durationEl) {
                durationEl.textContent = formatTime(tempAudio.duration);
            }
        });

        item.addEventListener('click', () => {
            loadSong(index);
            playSong();
            if (window.innerWidth <= 768 && isMobilePlaylistView) {
                toggleMobileView();
            }
        });
        playlistContainer.appendChild(item);
    });
}

// Update playlist highlighting
function updatePlaylistHighlight() {
    const items = playlistContainer.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        const overlayIcon = item.querySelector('.playlist-item-overlay i');
        if (index === currentSongIndex) {
            item.classList.add('active');
            if (overlayIcon) {
                overlayIcon.className = isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill';
            }
        } else {
            item.classList.remove('active');
            if (overlayIcon) {
                overlayIcon.className = 'bi bi-play-fill';
            }
        }
    });
}

// Toggle mobile view between now playing and playlist
function toggleMobileView() {
    isMobilePlaylistView = !isMobilePlaylistView;
    
    if (isMobilePlaylistView) {
        nowPlayingView.classList.add('hide');
        playlistView.classList.add('show');
        toggleViewIcon.className = 'bi bi-x-lg';
    } else {
        nowPlayingView.classList.remove('hide');
        playlistView.classList.remove('show');
        toggleViewIcon.className = 'bi bi-list';
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    // Playback controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    playPauseBtnMobile.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    prevBtnMobile.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    nextBtnMobile.addEventListener('click', nextSong);

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);

    // Progress bar
    progressBarContainer.addEventListener('click', setProgress);
    progressBarContainerMobile.addEventListener('click', setProgress);

    // Volume controls
    volumeSlider.addEventListener('input', setVolume);
    volumeBtn.addEventListener('click', toggleMute);

    // Mobile view toggle
    toggleViewBtn.addEventListener('click', toggleMobileView);
}

// --- Initialize Player ---
function init() {
    renderPlaylist();
    loadSong(currentSongIndex);
    setupEventListeners();
    audio.volume = volumeSlider.value / 100;
}

document.addEventListener('DOMContentLoaded', init);