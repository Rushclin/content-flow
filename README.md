# Content Flow 🚀

Une plateforme intelligente de génération de contenu alimentée par l'IA, conçue pour créer du contenu optimisé pour différentes plateformes sociales.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Captures d'écran](#captures-décran)
- [API](#api)
- [Contribuer](#contribuer)

## 🎯 Aperçu

Content Flow est une application web moderne qui permet aux utilisateurs de générer du contenu optimisé pour diverses plateformes sociales (LinkedIn, Twitter, Facebook, Instagram, etc.) en utilisant l'intelligence artificielle. L'application offre une interface intuitive pour personnaliser le ton, la longueur et le style du contenu généré.

### Pourquoi Content Flow ?

- **Gain de temps** : Générez du contenu de qualité en quelques secondes
- **Multi-plateforme** : Adapté automatiquement à chaque réseau social
- **Personnalisable** : Contrôlez le ton, la longueur et le style
- **Historique complet** : Retrouvez et continuez vos conversations
- **Optimisé pour le SEO** : Contenu structuré et pertinent

## ✨ Fonctionnalités

### 🎨 Génération de contenu
- **Génération intelligente** : Créez du contenu adapté à votre plateforme cible
- **Personnalisation avancée** :
  - Choix de la plateforme (LinkedIn, Twitter, Facebook, Instagram, etc.)
  - Sélection du ton (professionnel, décontracté, créatif, etc.)
  - Définition de la longueur (courte, moyenne, longue)
  - Ciblage de l'audience
- **Prévisualisation en temps réel** : Voyez le contenu généré instantanément

### 💬 Conversations intelligentes
- **Historique des conversations** : Accédez à toutes vos générations passées
- **Continuation de conversation** : Affinez et améliorez le contenu généré
- **Gestion contextuelle** : L'IA se souvient du contexte de la conversation

### 📊 Interface utilisateur
- **Dashboard intuitif** : Interface moderne et facile à utiliser
- **Mode public** : Page "Essayer" pour tester sans inscription
- **Sidebar dynamique** : Accès rapide aux conversations récentes
- **Responsive design** : Parfaitement adapté mobile, tablette et desktop

### 🔧 Fonctionnalités techniques
- **Authentification sécurisée** : Système d'auth JWT
- **Gestion d'état optimisée** : React Context API
- **Internationalisation** : Support multi-langues (FR/EN)
- **Notifications toast** : Feedback utilisateur en temps réel
- **Validation de formulaires** : Avec Zod et React Hook Form

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js Application               │
├─────────────────────────────────────────────┤
│  Pages Router                               │
│  ├─ Public Pages (/, /try-it)              │
│  ├─ Auth Pages (/login, /register)         │
│  └─ Protected Pages (/dashboard, /quick-off)│
├─────────────────────────────────────────────┤
│  Components Layer                           │
│  ├─ Layout Components (Public, Dashboard)  │
│  ├─ Common Components (Header, Sidebar)    │
│  ├─ Feature Components (MessageBubble)     │
│  └─ Form Components (ComposerForm)         │
├─────────────────────────────────────────────┤
│  State Management                           │
│  ├─ Auth Context                            │
│  ├─ Sidebar Context                         │
│  └─ Form State (React Hook Form)           │
├─────────────────────────────────────────────┤
│  API Layer                                  │
│  └─ Axios Instance (Interceptors)          │
└─────────────────────────────────────────────┘
```

### Flux de données

```
User Input → Form Validation → API Call → Response Processing → UI Update
     ↓              ↓              ↓              ↓                ↓
  Zod Schema   Hook Form    Axios Instance   TypeScript      React State
```

## 🛠️ Technologies utilisées

### Frontend Core
- **[Next.js 14](https://nextjs.org/)** - Framework React avec SSR/SSG
- **[React 18](https://react.dev/)** - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first

### Gestion d'état et formulaires
- **[React Hook Form](https://react-hook-form.com/)** - Gestion de formulaires performante
- **[Zod](https://zod.dev/)** - Validation de schémas TypeScript
- **[React Context API](https://react.dev/reference/react/useContext)** - Gestion d'état global

### UI/UX
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[React Hot Toast](https://react-hot-toast.com/)** - Notifications élégantes
- **[next-i18next](https://github.com/i18next/next-i18next)** - Internationalisation

### API et données
- **[Axios](https://axios-http.com/)** - Client HTTP
- **JWT** - Authentification sécurisée

## 📥 Installation

### Prérequis

- Node.js 18+
- npm/yarn/pnpm
- Un backend API compatible (voir section [API](#api))

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/content-flow.git
cd content-flow
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos configurations :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir l'application**
Visitez [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | Oui |
| `NEXT_PUBLIC_APP_URL` | URL de l'application frontend | Oui |

### Configuration i18n

Les traductions sont gérées dans le dossier `/public/locales/[langue]/` :
- `common.json` - Traductions communes
- `home.json` - Page d'accueil
- `try-it.json` - Page d'essai
- Etc.

## 🚀 Utilisation

### Pour les utilisateurs non authentifiés

1. Visitez la page d'accueil `/`
2. Cliquez sur "Essayer" ou visitez `/try-it`
3. Remplissez le formulaire de génération :
   - Sujet du contenu
   - Public cible
   - Ton souhaité
   - Longueur du contenu
   - Plateforme cible
4. Cliquez sur "Générer"
5. Copiez le contenu généré

### Pour les utilisateurs authentifiés

1. **Inscription/Connexion**
   - Visitez `/register` pour créer un compte
   - Ou `/login` pour vous connecter

2. **Génération de contenu**
   - Accédez au dashboard
   - Cliquez sur "Générer" ou visitez `/quick-off`
   - Remplissez le formulaire
   - Le contenu est généré et la conversation est sauvegardée

3. **Gestion des conversations**
   - Visualisez l'historique dans la sidebar
   - Cliquez sur une conversation pour la continuer
   - Affinez le contenu en ajoutant de nouvelles instructions

4. **Historique complet**
   - Visitez `/history` pour voir toutes vos conversations
   - Filtrez par plateforme, date, etc.
   - Accédez rapidement à n'importe quelle conversation

## 📁 Structure du projet

```
content-flow/
├── public/
│   ├── locales/          # Fichiers de traduction i18n
│   │   ├── en/
│   │   └── fr/
│   └── images/           # Images et assets
├── src/
│   ├── components/       # Composants React réutilisables
│   │   ├── chat/         # Composants de chat (MessageBubble)
│   │   ├── common/       # Composants communs (Header, Loading)
│   │   └── public/       # Composants publics (FormGeneration)
│   ├── context/          # Contexts React (Auth, Sidebar)
│   ├── layout/           # Layouts (Public, Dashboard)
│   │   ├── dashboard/    # Layout dashboard avec Sidebar
│   │   └── public/       # Layout public
│   ├── lib/              # Utilitaires et configurations
│   │   └── axios.ts      # Instance Axios configurée
│   ├── navigation/       # Configuration de navigation
│   ├── pages/            # Pages Next.js
│   │   ├── index.tsx     # Page d'accueil
│   │   ├── try-it/       # Page d'essai publique
│   │   ├── quick-off/    # Pages de génération
│   │   │   ├── index.tsx           # Nouvelle génération
│   │   │   └── [id]/index.tsx      # Détails conversation
│   │   ├── history/      # Historique des conversations
│   │   ├── login/        # Authentification
│   │   └── register/     # Inscription
│   ├── styles/           # Styles globaux
│   │   └── globals.css   # Styles Tailwind
│   └── types/            # Types TypeScript
│       └── chat.ts       # Types pour chat et conversations
├── .env.local            # Variables d'environnement (local)
├── next.config.js        # Configuration Next.js
├── tailwind.config.js    # Configuration Tailwind
├── tsconfig.json         # Configuration TypeScript
└── package.json          # Dépendances du projet
```

### Composants principaux

#### `MessageBubble`
Composant réutilisable pour afficher les messages de chat :
- Affichage différencié user/AI
- Badges de métadonnées (plateforme, ton, longueur)
- Fonctionnalité de copie
- Timestamps

#### `ComposerForm`
Formulaire de génération de contenu avec validation Zod :
- Champs contrôlés avec React Hook Form
- Validation en temps réel
- Support multi-plateforme

#### `Sidebar`
Navigation latérale avec historique de conversations :
- Affichage des 10 dernières conversations
- Navigation rapide
- Indicateur de conversation active

## 📸 Captures d'écran

### Page d'accueil
![Page d'accueil](./screenshots/home.png)
*Interface d'accueil avec présentation des fonctionnalités*

### Page d'essai
![Page d'essai](./screenshots/try-it.png)
*Testez la génération de contenu sans inscription*

### Dashboard - Nouvelle génération
![Dashboard génération](./screenshots/dashboard-generate.png)
*Interface de génération de contenu pour utilisateurs authentifiés*

### Conversation en cours
![Conversation](./screenshots/conversation.png)
*Vue d'une conversation avec historique des messages*

### Historique des conversations
![Historique](./screenshots/history.png)
*Liste complète de toutes les conversations avec métadonnées*

### Vue mobile
![Vue mobile](./screenshots/mobile.png)
*Interface responsive optimisée pour mobile*

> **Note**: Ajoutez vos captures d'écran dans un dossier `/screenshots/` à la racine du projet.

## 🔌 API

### Endpoints requis

L'application nécessite un backend avec les endpoints suivants :

#### Authentification
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/user
```

#### Génération de contenu
```
POST /api/content/generate
POST /api/content/generate-with-conversation
```

#### Conversations
```
GET  /api/conversations
GET  /api/conversations/:id
POST /api/conversations/:id/messages
```

### Structure des réponses

#### Génération avec conversation
```typescript
{
  "data": {
    "conversation": {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "metadata": {
        "platform": "string",
        "theme": "string"
      },
      "created_at": "timestamp",
      "updated_at": "timestamp"
    },
    "user_message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "user",
      "content": "string",
      "metadata": {},
      "created_at": "timestamp"
    },
    "assistant_message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "assistant",
      "content": "{\"output\": \"string\"}",
      "metadata": {},
      "created_at": "timestamp"
    },
    "generated_content": {
      "output": "string"
    }
  }
}
```

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests avec coverage
npm run test:coverage

# Lancer les tests e2e
npm run test:e2e
```

## 📦 Build et déploiement

### Build de production

```bash
npm run build
```

### Démarrer en mode production

```bash
npm run start
```

### Déploiement sur Vercel

Le moyen le plus simple de déployer Content Flow est d'utiliser la plateforme [Vercel](https://vercel.com) :

1. Pushez votre code sur GitHub
2. Importez le projet sur Vercel
3. Configurez les variables d'environnement
4. Déployez !

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/content-flow)

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment vous pouvez aider :

1. **Fork** le projet
2. **Créez** votre branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add: Amazing Feature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Conventions de code

- Utilisez TypeScript pour tous les nouveaux fichiers
- Suivez les conventions ESLint configurées
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez les fonctions complexes
- Utilisez des commits sémantiques (feat:, fix:, docs:, etc.)

## 📝 Changelog

Voir [CHANGELOG.md](./CHANGELOG.md) pour l'historique des modifications.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 👥 Auteurs

- **Novalitix Team** - *Développement initial*

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour l'excellent framework
- [Vercel](https://vercel.com) pour l'hébergement
- [Tailwind Labs](https://tailwindcss.com/) pour TailwindCSS
- Tous les contributeurs open-source

## 📞 Support

Pour toute question ou problème :
- Ouvrez une [issue](https://github.com/votre-username/content-flow/issues)
- Contactez-nous à support@novalitix.com
- Consultez la [documentation](https://docs.novalitix.com)

---

<div align="center">
  Fait avec ❤️ par l'équipe Novalitix
</div>
