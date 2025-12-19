// 歌曲数据
const songs = [
  { title: "K歌之王", artist: "陈奕迅", src: "mp3/陈奕迅 - K歌之王.flac", cover: "img/K歌之王.jpg", mv: "mp4/陈奕迅 - K歌之王.mp4" },
  { title: "给我一首歌的时间", artist: "周杰伦", src: "mp3/周杰伦 - 给我一首歌的时间.mp3", cover: "img/给我一首歌的时间.jpg", mv: "mp4/白厄PV最后一幕4K无水印.mp4" },
  { title: "搁浅", artist: "周杰伦", src: "mp3/周杰伦 - 搁浅.mp3", cover: "img/搁浅.jpg", mv: "mp4/白厄PV最后一幕4K无水印.mp4" },
];

let currentSongIndex = 0;
const audio = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playModeBtn = document.getElementById("play-mode");
const volumeToggle = document.getElementById("volume-toggle");
const volumeSlider = document.getElementById("volume");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const songTitleEl = document.getElementById("song-title");
const artistEl = document.getElementById("artist");

// 静音状态变量
let isMuted = false;
let previousVolume = 1;

// 播放模式变量
let playMode = 'order'; // order: 顺序播放, loop: 单曲循环, random: 随机播放

// 倍速控制变量
let playbackSpeed = 1.0;

// 加载歌曲
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songTitleEl.textContent = song.title;
  artistEl.textContent = `歌手：${song.artist}`;
  document.querySelector(".album-cover").src = song.cover;
}

// 播放
function playSong() {
  audio.play();
  playPauseBtn.innerHTML = '<img src="img/暂停.png" alt="暂停">';
  document.querySelector('.vinyl').classList.add('playing');
  // 同时旋转专辑封面
  document.querySelector('.album-cover').classList.add('playing');
}

// 暂停
function pauseSong() {
  audio.pause();
  playPauseBtn.innerHTML = '<img src="img/继续播放.png" alt="播放">';
  document.querySelector('.vinyl').classList.remove('playing');
  // 同时旋转专辑封面
  document.querySelector('.album-cover').classList.remove('playing');
}

// 切换播放状态
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// 上一曲
prevBtn.addEventListener("click", () => {
  if (playMode === 'random') {
    // 随机播放模式下，上一首也随机
    currentSongIndex = getRandomIndex();
  } else {
    // 顺序播放或单曲循环模式
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentSongIndex);
  playSong();
});

// 下一曲
nextBtn.addEventListener("click", () => {
  if (playMode === 'random') {
    // 随机播放模式
    currentSongIndex = getRandomIndex();
  } else {
    // 顺序播放或单曲循环模式
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  playSong();
});

// 歌曲播放结束时的处理
audio.addEventListener('ended', () => {
  if (playMode === 'loop') {
    // 单曲循环模式，重新播放当前歌曲
    audio.currentTime = 0;
    playSong();
  } else {
    // 顺序播放或随机播放模式，自动播放下一首
    if (playMode === 'random') {
      currentSongIndex = getRandomIndex();
    } else {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    playSong();
  }
});

// 显示模式切换弹窗
function showModeAlert(message) {
  // 创建弹窗元素
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: bold;
    z-index: 1000;
    animation: fadeInOut 2s ease-in-out;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  `;
  alertDiv.textContent = message;

  // 添加到页面
  document.body.appendChild(alertDiv);

  // 2秒后移除弹窗
  setTimeout(() => {
    alertDiv.remove();
  }, 2000);
}

// 切换播放模式
playModeBtn.addEventListener("click", () => {
  // 切换播放模式
  if (playMode === 'order') {
    playMode = 'loop'; // 顺序播放 -> 单曲循环
    playModeBtn.innerHTML = '<img src="img/mode1.png" alt="单曲循环">';
    audio.loop = true;
    showModeAlert('切换到：单曲循环模式');
  } else if (playMode === 'loop') {
    playMode = 'random'; // 单曲循环 -> 随机播放
    playModeBtn.innerHTML = '<img src="img/mode3.png" alt="随机播放">';
    audio.loop = false;
    showModeAlert('切换到：随机播放模式');
  } else {
    playMode = 'order'; // 随机播放 -> 顺序播放
    playModeBtn.innerHTML = '<img src="img/mode2.png" alt="顺序播放">';
    audio.loop = false;
    showModeAlert('切换到：顺序播放模式');
  }
});

// 随机获取下一首歌曲索引
function getRandomIndex() {
  // 确保不重复当前歌曲
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentSongIndex && songs.length > 1);
  return randomIndex;
}

// 音量控制
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  if (audio.volume > 0) {
    isMuted = false;
    volumeToggle.innerHTML = '<img src="img/音量.png" alt="音量">';
    previousVolume = audio.volume;
  } else {
    // 手动拖动到静音位置
    isMuted = true;
    volumeToggle.innerHTML = '<img src="img/静音.png" alt="静音">';
  }
});

// 静音/取消静音
volumeToggle.addEventListener("click", () => {
  if (isMuted) {
    // 取消静音
    audio.volume = previousVolume;
    volumeSlider.value = previousVolume;
    volumeToggle.innerHTML = '<img src="img/音量.png" alt="音量">';
    isMuted = false;
  } else {
    // 静音
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    volumeToggle.innerHTML = '<img src="img/静音.png" alt="静音">';
    isMuted = true;
  }
});

// 进度条更新
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progress.value = percent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// 设置总时长
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

// 拖动进度条跳转
progress.addEventListener("input", () => {
  const time = (progress.value / 100) * audio.duration;
  audio.currentTime = time;
});

// 时间格式化
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

// 倍速控制
const speedDisplay = document.getElementById('speed-display');
const speedOptions = document.querySelectorAll('.speed-option');

// 倍速选项点击事件
if (speedOptions.length > 0) {
  speedOptions.forEach(option => {
    option.addEventListener('click', () => {
      playbackSpeed = parseFloat(option.getAttribute('data-speed'));
      audio.playbackRate = playbackSpeed;
      speedDisplay.textContent = `${playbackSpeed}X`;
    });
  });
}

// MV功能
const mvBtn = document.getElementById('mv-btn');
const mvModal = document.getElementById('mv-modal');
const mvPlayer = document.getElementById('mv-player');
const closeBtn = document.getElementsByClassName('close')[0];

if (mvBtn) {
  mvBtn.addEventListener('click', () => {
    const currentSong = songs[currentSongIndex];
    if (currentSong.mv) {
      // 设置MV视频源
      mvPlayer.src = currentSong.mv;
      // 显示模态窗口
      mvModal.style.display = 'block';
      // 自动播放MV
      mvPlayer.play();
    } else {
      alert('当前歌曲暂无MV资源');
    }
  });
}

// 关闭MV播放窗口
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    // 隐藏模态窗口
    mvModal.style.display = 'none';
    // 暂停并重置视频
    mvPlayer.pause();
    mvPlayer.currentTime = 0;
  });
}

// 点击模态窗口外部关闭
if (mvModal) {
  mvModal.addEventListener('click', (event) => {
    if (event.target === mvModal) {
      // 隐藏模态窗口
      mvModal.style.display = 'none';
      // 暂停并重置视频
      mvPlayer.pause();
      mvPlayer.currentTime = 0;
    }
  });
}

// ESC键关闭MV
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mvModal.style.display === 'block') {
    // 隐藏模态窗口
    mvModal.style.display = 'none';
    // 暂停并重置视频
    mvPlayer.pause();
    mvPlayer.currentTime = 0;
  }
});

// 列表功能
const listBtn = document.getElementById('list-btn');
if (listBtn) {
  listBtn.addEventListener('click', () => {
    let songList = '播放列表：\n';
    songs.forEach((song, index) => {
      songList += `${index + 1}. ${song.title} - ${song.artist}\n`;
    });
    alert(songList);
    // 这里可以添加实际的播放列表显示逻辑，例如打开侧边栏或模态框显示歌曲列表
  });
}

// 音频错误处理
audio.addEventListener('error', (e) => {
  console.error('音频播放错误:', e);
  console.error('错误代码:', audio.error.code);
  console.error('错误信息:', audio.error.message);
  alert('音频播放错误: 无法播放当前歌曲，请检查文件路径或格式');
});

// 初始化
loadSong(currentSongIndex);
