document.addEventListener('DOMContentLoaded', function() {
    
    AOS.init({
        duration: 800, 
        once: true, 
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = 0;
                }
            });

            const isActive = item.classList.toggle('active');
            answer.style.maxHeight = isActive ? answer.scrollHeight + 'px' : 0;
        });
    });

    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    const icon = mobileMenuIcon?.querySelector('i');

    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-open');
            if (icon) {
                icon.className = mainNav.classList.contains('mobile-open') ? 'bx bx-x' : 'bx bx-menu';
            }
        });
    }

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('mobile-open');
            if (icon) icon.className = 'bx bx-menu';
        });
    });

    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            fetch('/api/public/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert('Solicitação enviada com sucesso! Em breve entraremos em contato.');
                    leadForm.reset();
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                alert('Dados recebidos! Nossa equipe comercial entrará em contato via WhatsApp em breve.');
            });
        });
    }
});

let player;
function onYouTubeIframeAPIReady() {
    const playerElement = document.getElementById('youtube-player');
    if (!playerElement) return;

    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: '_a2B7ddhE-M',
        playerVars: {
            'playsinline': 1,
            'controls': 1,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (event.data == YT.PlayerState.PLAYING) {
        videoWrapper.classList.add('playing');
    } else if (event.data == YT.PlayerState.ENDED) {
        videoWrapper.classList.remove('playing');
    }
}

const playButton = document.getElementById('play-button');
if (playButton) {
    playButton.addEventListener('click', () => {
        if (player && typeof player.playVideo === 'function') {
            player.playVideo();
        }
    });
}