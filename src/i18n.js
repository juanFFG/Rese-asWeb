import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        bar_Reviews: 'Reviews',
        bar_MyReviews: ' My Reviews',
        language: 'Language',
        change_language: 'Change Language',
        comments: 'Comments',
        login: 'Login',
        register: 'Register',
        LoginFirst: 'You have to log in first to make your first review.',
        noComments: 'there are no comments'
    },
    es: {
        welcome: 'Bienvenido',
        review: 'Reseña',
        language: 'Idioma',
        change_language: 'Cambiar Idioma'
    }
};

const i18n = createI18n({
    locale: 'es',
    messages
});

export default i18n;