// Sistema de Autenticação AnubiiX
import { signInWithGoogle, signOutUser, getCurrentUser, auth } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Verificar usuário logado
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUI();
        });
    }

    async loginWithGoogle() {
        try {
            showNotification('Conectando com Google...', 'info');
            const user = await signInWithGoogle();
            showNotification(`Bem-vindo, ${user.displayName}!`, 'success');
            this.closeAuthModal();
        } catch (error) {
            showNotification('Erro no login. Tente novamente.', 'error');
            console.error('Login error:', error);
        }
    }

    async logout() {
        try {
            await signOutUser();
            showNotification('Logout realizado com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro no logout.', 'error');
        }
    }

    updateUI() {
        const loginBtn = document.querySelector('.btn-login');
        const userMenu = document.querySelector('.user-menu');

        if (this.currentUser) {
            // Usuário logado
            loginBtn.innerHTML = `
                <img src="${this.currentUser.photoURL}" alt="Avatar" class="user-avatar">
                <span>${this.currentUser.displayName}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            loginBtn.onclick = () => this.toggleUserMenu();
            
            // Criar menu do usuário se não existir
            if (!userMenu) {
                this.createUserMenu();
            }
        } else {
            // Usuário não logado
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Entrar</span>
            `;
            loginBtn.onclick = () => this.showAuthModal();
            
            // Remover menu do usuário
            if (userMenu) {
                userMenu.remove();
            }
        }
    }

    createUserMenu() {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-info">
                <img src="${this.currentUser.photoURL}" alt="Avatar">
                <div>
                    <div class="user-name">${this.currentUser.displayName}</div>
                    <div class="user-email">${this.currentUser.email}</div>
                </div>
            </div>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item" onclick="window.location.href='painel.html'">
                <i class="fas fa-cog"></i> Painel
            </a>
            <a href="#" class="menu-item" onclick="authSystem.logout()">
                <i class="fas fa-sign-out-alt"></i> Sair
            </a>
        `;
        
        document.querySelector('.nav-container').appendChild(userMenu);
    }

    toggleUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    }

    showAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="authSystem.closeAuthModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Entrar no AnubiiX</h2>
                    <button class="modal-close" onclick="authSystem.closeAuthModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Faça login para acessar recursos exclusivos do servidor!</p>
                    <button class="btn-google" onclick="authSystem.loginWithGoogle()">
                        <i class="fab fa-google"></i>
                        Continuar com Google
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    closeAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Inicializar sistema
const authSystem = new AuthSystem();
window.authSystem = authSystem;