document.addEventListener('DOMContentLoaded', function() {

    // Lógica para o Acordeão do FAQ
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
            if (isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

});

// LÓGICA PARA O MENU MOBILE
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const icon = mobileMenuIcon ? mobileMenuIcon.querySelector('.material-icons') : null; 

// Abre e fecha o menu pelo mesmo botão
if (mobileMenuIcon) {
    mobileMenuIcon.addEventListener('click', () => {
        
        mainNav.classList.toggle('mobile-open');

        if (mainNav.classList.contains('mobile-open')) {
            icon.textContent = 'close'; 
        } else {
            icon.textContent = 'menu'; 
        }
    });
}

// Fecha o menu e reseta o ícone ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('mobile-open')) {
            mainNav.classList.remove('mobile-open');
            icon.textContent = 'menu'; 
        }
    });
});

// LÓGICA PARA O PLAYER DE VÍDEO DO YOUTUBE 
let player;

function onYouTubeIframeAPIReady() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return; 

    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'iIj0aELQh14', 
        playerVars: {
            'origin': window.location.origin,
            'playsinline': 1,
            'autoplay': 0, 
            'controls': 0, 
            'rel': 0, 
            'modestbranding': 1, 
            'iv_load_policy': 3 
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

const playButton = document.getElementById('play-button');
const videoWrapper = document.querySelector('.video-wrapper');

if (playButton) {
    playButton.addEventListener('click', () => {
        if (player) {
            player.playVideo();
        }
    });
}

function onPlayerStateChange(event) {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (event.data == YT.PlayerState.PLAYING) {
        videoWrapper.classList.add('playing');
    } 
    else if (event.data == YT.PlayerState.ENDED) {
        player.stopVideo(); 
        videoWrapper.classList.remove('playing');
    }
}

// --- LÓGICA PARA O FORMULÁRIO DE LEADS (INTEGRAÇÃO BACKEND) ---
const leadForm = document.getElementById('lead-form');

// URL DA API (Altere para o endereço de produção quando publicar o back-end)
const API_BASE_URL = 'https://residencialjardins.condigtal.com.br'; 

if (leadForm) {
    leadForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitButton.innerHTML;
        
        // Feedback visual de carregamento
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="material-icons rotating">sync</span> Enviando...';

        // Captura os dados
        const rawReason = document.querySelector('input[name="reason"]:checked').value;
        let reasonText = rawReason;

        // Traduz o valor do radio button para texto bonito
        switch(rawReason) {
            case 'demonstracao': reasonText = "Solicitação de Demonstração do Sistema"; break;
            case 'suporte': reasonText = "Cliente solicitando Suporte Técnico"; break;
            case 'outro': reasonText = "Outro motivo / Contato Geral"; break;
        }

        const formData = {
            name: document.getElementById('lead-name').value,
            email: document.getElementById('lead-email').value,
            whatsapp: document.getElementById('lead-whatsapp').value,
            reason: reasonText
        };

        try {
            const response = await fetch(`${API_BASE_URL}/public/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Sucesso! Recebemos seus dados. Em breve nossa equipe entrará em contato.');
                leadForm.reset();
            } else {
                throw new Error('Erro na resposta do servidor');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível enviar sua solicitação no momento. Por favor, tente novamente ou entre em contato via WhatsApp.');
        } finally {
            // Restaura o botão
            submitButton.disabled = false;
            submitButton.innerHTML = originalBtnText;
        }
    });
}