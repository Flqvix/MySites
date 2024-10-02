const clickToEnter = document.getElementById('clickToEnter');
const audio = new Audio('/audioBg.mp3');
const bg = document.getElementById('bg');

clickToEnter.addEventListener('click', () => {
    document.getElementById('body').classList.remove('hidden');
    clickToEnter.style.display = 'none';
    audio.play();
    audio.volume = 0.2;
    bg.play();
});

const pause = document.getElementById('pause');
pause.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        audio.volume = 0.2;
        pause.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
        audio.pause();
        pause.innerHTML = '<i class="fa-solid fa-volume-mute"></i>';
    }
});

const texts = [
    "student",
    "web developer",
    "i love my gf"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const currentText = texts[textIndex];
    const subtitle = document.getElementById('subtitle');

    if (!isDeleting && charIndex < currentText.length) {
        subtitle.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
        charIndex++;
        typingSpeed = 65;
    } else if (isDeleting && charIndex > 0) {
        subtitle.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
        charIndex--;
        typingSpeed = 40;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            textIndex = (textIndex + 1) % texts.length;
        }
        typingSpeed = isDeleting ? 1000 : 500;
    }

    setTimeout(typeWriter, typingSpeed);
}

typeWriter();

const style = document.createElement('style');
style.textContent = `
  @keyframes blink {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
  .cursor {
    animation: blink 0.7s infinite;
  }
`;
document.head.appendChild(style);

let originalTitle = document.title;
let currentTitle = originalTitle;
let isRemoving = true;

function animateTitle() {
    if (isRemoving) {
        if (currentTitle.length > 1) {
            currentTitle = currentTitle.slice(0, -1);
            setTimeout(animateTitle, 500);
        } else {
            isRemoving = false;
            animateTitle();
        }
    } else {
        if (currentTitle.length < originalTitle.length) {
            currentTitle = originalTitle.slice(0, currentTitle.length + 1);
            setTimeout(animateTitle, 500);
        } else {
            isRemoving = true;
            setTimeout(animateTitle, 500);
        }
    }

    document.title = currentTitle;
}

animateTitle();

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.lanyard.rest/v1/users/536483081897639937')
        .then(res => res.json())
        .then(data => {
            const presence_image = document.getElementById('presence-image');
            const pfp_image = document.getElementById('pfp-image');

            document.getElementById('username').textContent = data.data.discord_user.global_name;
            document.getElementById('pfp-image').src = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${data.data.discord_user.avatar}?size=1024&width=0&height=256`;
            if (data.data.spotify) {
                document.getElementById('status').innerHTML = `<i class="fa-brands fa-spotify"></i> ${data.data.spotify.song}`;
                presence_image.style.opacity = '1';
                presence_image.src = data.data.spotify.album_art_url;
            } else {
                document.getElementById('status').textContent = 'Not listening to anything.';
                presence_image.style.opacity = '0';
            }

            switch (data.data.discord_status) {
                case 'online':
                    pfp_image.style.borderColor = 'var(--online)';
                    pfp_image.style.boxShadow = '0 0 25px var(--online)';
                    break;
                case 'idle':
                    pfp_image.style.borderColor = 'var(--idle)';
                    pfp_image.style.boxShadow = '0 0 25px var(--idle)';
                    break;
                case 'dnd':
                    pfp_image.style.borderColor = 'var(--dnd)';
                    pfp_image.style.boxShadow = '0 0 25px var(--dnd)';
                    break;
                case 'offline':
                    pfp_image.style.borderColor = 'var(--offline)';
                    pfp_image.style.boxShadow = '0 0 25px var(--offline)';
                    break;
                default:
                    break;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});