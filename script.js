// AnubiiX Site JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
});

function initializeSite() {
    // Loading screen
    const loading = document.getElementById('loading');
    const mainContent = document.querySelector('.main-content');
    
    loading.style.display = 'none';
    mainContent.style.opacity = '1';
    
    // Show home section by default
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('home').style.display = 'block';
    
    // Initialize features
    initializeScrollAnimations();
    initializeNavigation();
    initializeServerStatus();

    
    // Update counters
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 30000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function scrollToSection(sectionId) {
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
    
    // Hide all sections except home
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('home').style.display = 'block';
    
    if (sectionId !== 'home') {
        const section = document.getElementById(sectionId);
        if (section) {
            document.getElementById('home').style.display = 'none';
            section.style.display = 'block';
            
            // Initialize skin gallery if accessing skins section
            if (sectionId === 'skins') {
                initializeSkinGallery();
            }
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Server Status
function initializeServerStatus() {
    updateServerStatus();
    setInterval(updateServerStatus, 60000); // Update every minute
}

function updateServerStatus() {
    // Simulate server status updates
    const playerCount = Math.floor(Math.random() * 100) + 200;
    document.getElementById('player-count').textContent = `${playerCount}/500 jogadores`;
}



// Player Count Updates
function updatePlayerCounts() {
    const javaPlayers = Math.floor(Math.random() * 80) + 120;
    const bedrockPlayers = Math.floor(Math.random() * 60) + 60;
    
    document.getElementById('java-players').textContent = javaPlayers;
    document.getElementById('bedrock-players').textContent = bedrockPlayers;
    
    // Update total count
    const totalPlayers = javaPlayers + bedrockPlayers;
    document.getElementById('player-count').textContent = `${totalPlayers}/500 jogadores`;
}

// Modal System
function openModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => openModal(to), 300);
}

function openConnectionModal(type) {
    openModal(type);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id.replace('-modal', '');
        closeModal(modalId);
    }
});

// Copy IP Function
function copyIP(ip) {
    const button = event.target.closest('.copy-btn');
    const originalContent = button.innerHTML;
    
    navigator.clipboard.writeText(ip).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        showNotification(`IP copiado: ${ip}`, 'success');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        showNotification(`IP copiado: ${ip}`, 'success');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid ${colors[type]};
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: white;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// User Database
let users = JSON.parse(localStorage.getItem('users')) || [];

// Form Handling
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('auth-form')) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Check if it's register form
        if (e.target.id === 'register-form' || e.target.id === 'google-signup-form') {
            if (!validateRegistration(e.target)) {
                return;
            }
        }
        
        // Check if it's login form
        if (e.target.closest('#login-modal')) {
            if (!validateLogin(e.target)) {
                return;
            }
        }
        
        // Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            submitBtn.style.opacity = '1';
            
            showNotification('Operação realizada com sucesso!', 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                
                // Close modal
                const modal = e.target.closest('.modal');
                if (modal) {
                    const modalId = modal.id.replace('-modal', '');
                    closeModal(modalId);
                }
                
                e.target.reset();
            }, 2000);
        }, 1500);
    }
});

// Validation Functions
function validateRegistration(form) {
    const inputs = form.querySelectorAll('input');
    let email, username, password, confirmPassword;
    
    inputs.forEach(input => {
        if (input.type === 'email') email = input.value;
        if (input.placeholder.includes('Nick') || input.placeholder.includes('usuário')) username = input.value;
        if (input.type === 'password' && input.placeholder === 'Senha') password = input.value;
        if (input.type === 'password' && (input.placeholder.includes('Confirmar') || input.placeholder.includes('Verificação'))) confirmPassword = input.value;
    });
    
    // Check password match
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return false;
    }
    
    // Check email exists
    if (users.find(user => user.email === email)) {
        showNotification('Este email já está cadastrado!', 'error');
        return false;
    }
    
    // Check username exists
    if (users.find(user => user.username === username)) {
        showNotification('Este nome de usuário já existe!', 'error');
        return false;
    }
    
    // Save user
    users.push({ email, username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    return true;
}

function validateLogin(form) {
    const emailInput = form.querySelector('input[type="text"]');
    const passwordInput = form.querySelector('input[type="password"]');
    
    const emailOrUsername = emailInput.value;
    const password = passwordInput.value;
    
    const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
    
    if (!user) {
        showNotification('Email/usuário ou senha incorretos!', 'error');
        return false;
    }
    
    return true;
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            const modalId = modal.id.replace('-modal', '');
            closeModal(modalId);
        });
    }
    
    // Quick navigation
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                scrollToSection('home');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('about');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('features');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('support');
                break;
        }
    }
});

// Smooth scroll for navbar
document.querySelector('.navbar').addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        this.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        this.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .main-content {
        opacity: 0;
        transition: opacity 0.8s ease;
    }
`;
document.head.appendChild(style);

// Parallax effect for background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.floating-particles');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Connection card hover effects
document.querySelectorAll('.connection-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Feature card stagger animation
function staggerAnimation() {
    const cards = document.querySelectorAll('.feature-card, .resource-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize stagger animation when page loads
window.addEventListener('load', staggerAnimation);

// Dynamic particle creation
function createParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
        }
        50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles
createParticles();

// Google Signup Functions
function showGoogleSignup() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('google-signup-form').style.display = 'block';
    document.querySelector('.btn-google').style.display = 'none';
    document.querySelector('#register-modal .divider').style.display = 'none';
}

function hideGoogleSignup() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('google-signup-form').style.display = 'none';
    document.querySelector('.btn-google').style.display = 'flex';
    document.querySelector('#register-modal .divider').style.display = 'block';
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.querySelector('.btn-theme i');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeBtn.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        themeBtn.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeBtn = document.querySelector('.btn-theme i');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeBtn.className = 'fas fa-sun';
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});

// Show About Content
function showAboutContent() {
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.nav-link')[1].classList.add('active');
    
    const heroContent = document.querySelector('.hero-content');
    
    heroContent.innerHTML = `
        <div class="about-grid">
            <div class="about-card">
                <div class="card-icon pvp-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>PvP Noturno</h3>
                <p>Servidor tem PvP de noite liberado para batalhas épicas</p>
            </div>
            
            <div class="about-card">
                <div class="card-icon speed-icon">
                    <i class="fas fa-tachometer-alt"></i>
                </div>
                <h3>Otimizado</h3>
                <p>Servidor otimizado com apenas 15ms de latência</p>
            </div>
            
            <div class="about-card">
                <div class="card-icon support-icon">
                    <i class="fas fa-gamepad"></i>
                </div>
                <h3>Java & Bedrock</h3>
                <p>Suporte completo para ambas as versões do Minecraft</p>
            </div>
            
            <div class="about-card">
                <div class="card-icon security-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Anti-Cheat</h3>
                <p>Sistema avançado de proteção contra trapaças</p>
            </div>
        </div>
    `;
}

// Show Home Content
function showHomeContent() {
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.nav-link')[0].classList.add('active');
    
    const heroContent = document.querySelector('.hero-content');
    
    heroContent.innerHTML = `
        <h1 class="hero-title">
            <span class="title-main">AnubiiX</span>
        </h1>
        
        <p class="hero-description">
            Servidor Minecraft otimizado com suporte para Java e Bedrock Edition. 
            PvP liberado durante a noite para batalhas épicas!
        </p>

        <!-- Connection Cards -->
        <div class="connection-grid">
            <div class="connection-card java" onclick="openModal('java')">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fab fa-java"></i>
                    </div>
                    <div class="card-title">
                        <h3>Java Edition</h3>
                        <p>Versões 1.16 - 1.20</p>
                    </div>
                </div>
                <div class="card-stats">
                    <span class="stat">
                        <i class="fas fa-users"></i>
                        <span id="java-players">156</span>
                    </span>
                    <span class="stat">
                        <i class="fas fa-signal"></i>
                        <span>12ms</span>
                    </span>
                </div>
                <button class="connect-btn">
                    <i class="fas fa-play"></i>
                    Conectar
                </button>
            </div>

            <div class="connection-card bedrock" onclick="openModal('bedrock')">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="card-title">
                        <h3>Bedrock Edition</h3>
                        <p>Mobile & Console</p>
                    </div>
                </div>
                <div class="card-stats">
                    <span class="stat">
                        <i class="fas fa-users"></i>
                        <span id="bedrock-players">91</span>
                    </span>
                    <span class="stat">
                        <i class="fas fa-signal"></i>
                        <span>8ms</span>
                    </span>
                </div>
                <button class="connect-btn">
                    <i class="fas fa-play"></i>
                    Conectar
                </button>
            </div>
        </div>
    `;
}
// Skin Editor Functions
let canvas, ctx, isDrawing = false;

function initializeSkinEditor() {
    canvas = document.getElementById('skinCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    // Create default skin template
    createDefaultSkin();
    
    // Add drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

function createDefaultSkin() {
    ctx.fillStyle = '#C0A080';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw basic skin template
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(100, 50, 200, 100); // Head
    ctx.fillRect(150, 150, 100, 150); // Body
    ctx.fillRect(100, 150, 50, 100); // Left arm
    ctx.fillRect(250, 150, 50, 100); // Right arm
    ctx.fillRect(125, 300, 50, 100); // Left leg
    ctx.fillRect(225, 300, 50, 100); // Right leg
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const color = document.getElementById('brushColor').value;
    const size = document.getElementById('brushSize').value;
    
    ctx.fillStyle = color;
    ctx.fillRect(x - size/2, y - size/2, size, size);
}

function stopDrawing() {
    isDrawing = false;
}

function loadSkinFromUrl() {
    const url = document.getElementById('skinUrl').value;
    if (!url) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = function() {
        showNotification('Erro ao carregar skin da URL', 'error');
    };
    img.src = url;
}

function loadSkinFromFile() {
    const file = document.getElementById('skinFile').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function clearSkin() {
    createDefaultSkin();
}

function downloadSkin() {
    const link = document.createElement('a');
    link.download = 'minecraft-skin.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification('Skin baixada com sucesso!', 'success');
}

// Initialize skin editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeSkinEditor, 100);
});

// Ensure home section shows on page refresh
window.addEventListener('load', function() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('home').style.display = 'block';
});
// Skin Gallery Functions
let currentSkins = 0;
const skinsPerLoad = 40;

const skinNames = [
    'Steve', 'Alex', 'Herobrine', 'Enderman', 'Creeper', 'Zombie', 'Skeleton', 'Spider', 'Witch', 'Villager',
    'Iron Golem', 'Snow Golem', 'Blaze', 'Ghast', 'Pigman', 'Wither', 'Dragon', 'Guardian', 'Rabbit', 'Chicken',
    'Cow', 'Pig', 'Sheep', 'Wolf', 'Cat', 'Horse', 'Ninja', 'Pirate', 'Knight', 'Wizard', 'Archer', 'Warrior',
    'Mage', 'Assassin', 'Paladin', 'Demon', 'Angel', 'Robot', 'Cyborg', 'Alien', 'Vampire', 'Werewolf', 'Ghost',
    'Phantom', 'Samurai', 'Viking', 'Elf', 'Dwarf', 'Orc', 'Troll', 'Goblin', 'Dragon Slayer', 'Fire Mage',
    'Ice Wizard', 'Dark Knight', 'Light Paladin', 'Shadow Assassin', 'Blood Vampire', 'Moon Wolf', 'Sun Warrior',
    'Storm Mage', 'Earth Guardian', 'Water Elemental', 'Air Monk', 'Fire Demon', 'Ice Queen', 'Forest Ranger',
    'Desert Nomad', 'Mountain Climber', 'Ocean Explorer', 'Space Marine', 'Time Traveler', 'Dimension Walker',
    'Soul Reaper', 'Life Healer', 'Death Knight', 'Chaos Mage', 'Order Paladin', 'Void Hunter', 'Star Guardian',
    'Crystal Warrior', 'Metal Robot', 'Cyber Ninja', 'Neon Punk', 'Retro Gamer', 'Pixel Artist', 'Code Hacker',
    'Digital Ghost', 'Virtual Reality', 'Augmented Hero', 'Quantum Physicist', 'Bio Engineer', 'Gene Splicer',
    'Nano Soldier', 'Micro Spy', 'Macro Giant', 'Mini Warrior', 'Mega Boss', 'Ultra Fighter', 'Super Hero',
    'Hyper Speed', 'Turbo Racer', 'Nitro Boost', 'Rocket Launcher', 'Laser Shooter', 'Plasma Cannon', 'Ion Blaster'
];

const authors = [
    'SkinMaster', 'PixelArt', 'MinecraftPro', 'SkinCreator', 'ArtistMC', 'DesignGuru', 'CraftySkin', 'PixelWizard',
    'SkinLord', 'CreativeMC', 'ArtMaster', 'DesignPro', 'PixelCrafter', 'SkinArtist', 'BlockBuilder', 'CubeCreator',
    'VoxelMaster', 'TextureKing', 'ModelMaker', 'SkinDesigner', 'PixelPainter', 'ArtCrafter', 'DigitalArtist',
    'CreativePixel', 'MasterCrafter', 'SkinWizard', 'PixelMagic', 'ArtisticMC', 'DesignMaster', 'CraftArtist',
    'PixelGenius', 'SkinExpert', 'ArtProdigy', 'DesignLegend', 'PixelHero', 'SkinChampion', 'ArtVirtuoso',
    'DesignMaestro', 'PixelSage', 'SkinGuru', 'ArtMaven', 'DesignPhenom', 'PixelProdigy', 'SkinVanguard'
];

function generateRandomSkin() {
    const name = skinNames[Math.floor(Math.random() * skinNames.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const id = Math.floor(Math.random() * 10000);
    
    return {
        name: `${name} ${id}`,
        author: author,
        preview: generateSkinPreview()
    };
}

function generateSkinPreview() {
    const colors = [
        '#8B4513', '#DEB887', '#F4A460', '#CD853F', '#A0522D', '#654321', '#FF6B35', '#F7931E',
        '#FFD23F', '#06FFA5', '#118AB2', '#073B4C', '#EF476F', '#FFD166', '#06D6A0', '#7209B7',
        '#F72585', '#4361EE', '#4CC9F0', '#7209B7', '#F72585', '#4361EE', '#4CC9F0', '#560BAD',
        '#480CA8', '#3A0CA3', '#3F37C9', '#4361EE', '#4895EF', '#4CC9F0', '#52B788', '#40916C',
        '#2D6A4F', '#1B4332', '#081C15', '#FF8500', '#FF9500', '#FFAA00', '#FFBF00', '#FFD500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function loadSkins() {
    const gallery = document.getElementById('skinGallery');
    
    for (let i = 0; i < skinsPerLoad; i++) {
        const skin = generateRandomSkin();
        const skinElement = createSkinElement(skin);
        gallery.appendChild(skinElement);
    }
    
    currentSkins += skinsPerLoad;
}

function createSkinElement(skin) {
    const skinDiv = document.createElement('div');
    skinDiv.className = 'skin-item';
    skinDiv.onclick = () => downloadSkinFile(skin.name);
    
    skinDiv.innerHTML = `
        <div class="skin-preview" style="background: ${skin.preview}"></div>
        <div class="skin-name">${skin.name}</div>
        <div class="skin-author">por ${skin.author}</div>
    `;
    
    return skinDiv;
}

function loadMoreSkins() {
    if (currentSkins < 800) {
        loadSkins();
        
        if (currentSkins >= 800) {
            document.querySelector('.load-more button').textContent = 'Todas as skins carregadas';
            document.querySelector('.load-more button').disabled = true;
        }
    }
}

function searchSkins() {
    const searchTerm = document.getElementById('skinSearch').value.toLowerCase();
    const skinItems = document.querySelectorAll('.skin-item');
    
    skinItems.forEach(item => {
        const name = item.querySelector('.skin-name').textContent.toLowerCase();
        const author = item.querySelector('.skin-author').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || author.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function downloadSkinFile(skinName) {
    showNotification(`Baixando skin: ${skinName}`, 'success');
}

// Load initial skins when skins section is accessed
function initializeSkinGallery() {
    if (document.getElementById('skinGallery').children.length === 0) {
        loadSkins();
    }
}
// Support System Functions
function openTicketModal() {
    openModal('ticket');
}

function showFAQ() {
    const faqSection = document.getElementById('faqSection');
    if (faqSection.style.display === 'none') {
        faqSection.style.display = 'block';
    } else {
        faqSection.style.display = 'none';
    }
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}