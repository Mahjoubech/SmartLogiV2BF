# 📦 SmartLogi V2 - Frontend Application

### Solution de gestion logistique intelligente pour SmartLogi Maroc (Fullstack App)

---

## 🌟 Contexte du Projet

SmartLogi V2 est l'interface frontend d'une solution complète de gestion logistique pour **SmartLogi Maroc**.  
Elle permet de :

- Gérer efficacement les expéditions de colis (création, assignation, suivi)
- Coordonner une flotte de livreurs avec des zones géographiques dédiées
- Assurer la traçabilité complète des statuts de livraison en temps réel
- Offrir des tableaux de bord optimisés pour chaque rôle (Manager, Livreur, Client)

**Notes importantes :**  
- Application **Single Page Application (SPA)** développée avec Angular 16+
- Design moderne et responsive utilisant **TailwindCSS**
- Communication via API REST avec le backend Spring Boot
- Gestion des rôles : `MANAGER`, `LIVREUR`, `CLIENT`

---

## 🏛️ Architecture Technique

**Structure modulaire Angular :**

| Module | Description |
| :--- | :--- |
| **Auth** | Gestion de la connexion, inscription et sécurité (Guards) |
| **Dashboard** | Espaces dédiés (Manager Dashboard, Livreur Dashboard) |
| **Home** | Page d'accueil publique et suivi de colis |
| **Core** | Services singletons (API, Auth), Interceptors, Guards |
| **Shared** | Composants réutilisables (Navbar, Cards, Loaders) |

**Structure de projet :**

```plaintext
📁 SmartlogiV2_FrontEnd/
├── src/
│   ├── app/
│   │   ├── Core/           # Services, Guards, Interceptors
│   │   ├── Modules/        # Feature Modules (Auth, Dashboard, Home)
│   │   ├── Shared/         # Composants partagés
│   │   └── app.component.ts
│   ├── assets/             # Images, Icons
│   ├── environments/       # Config API (Dev/Prod)
│   └── styles.css          # Tailwind imports
├── angular.json
├── package.json
└── README.md
```

---

## 🛠️ Fonctionnalités Principales

### 1️⃣ Espace Manager

* **Gestion des Colis** :  
  - Liste filtrable : "All", "Ready" (prêts à assigner), "Assigned" (actifs).  
  - Badges de statut dynamiques.  
  - Assignation intelligente des livreurs selon la zone géographique.
* **Gestion du Personnel** :  
  - CRUD des livreurs.  
  - Visualisation rapide des zones et véhicules assignés.
* **Suivi** : Historique complet des événements de chaque colis.

### 2️⃣ Espace Livreur

* **Tableau de Bord Personnel** :  
  - Métriques clés (Total livrés, Revenus, À collecter).  
  - Liste des tâches triée par priorité.
* **Mise à jour de Statut** :  
  - Changement de statut (ex: `EN_TRANSIT`, `LIVRE`, `EN_STOCK`).  
  - Ajout de commentaires obligatoires pour la traçabilité.
* **Notifications** : Alertes pour les nouvelles assignations.

### 3️⃣ Espace Client / Public

* **Création d'Expédition** : Wizard étape par étape pour créer un colis.
* **Suivi** : Tracking public via numéro de colis.

---

## 🚀 Technologies Utilisées

| Technologie              | Rôle                            |
| :----------------------- | :------------------------------ |
| **Angular 16+**          | Framework Frontend              |
| **TailwindCSS 3**        | Styling & Responsive Design     |
| **TypeScript**           | Logique applicative typée       |
| **RxJS**                 | Gestion d'états et flux asynchrones |
| **Heroicons**            | Iconographie SVG moderne        |
| **JWT**                  | Gestion de l'authentification   |

---

## 📸 Aperçu de l'Application

### Manager Dashboard - Vue "Ready to Assign"
*(Interface permettant d'identifier rapidement les colis non assignés)*

### Livreur Dashboard - Vue Mobile
*(Interface optimisée pour l'utilisation sur le terrain)*

### Modal de Tracking
*(Historique détaillé des statuts d'un colis)*

---

## ⚙️ Lancement de l’Application

1.  **Prérequis** : Node.js (v16+) et npm installés.
2.  **Installation des dépendances** :

```bash
npm install
```

3.  **Lancement du serveur de développement** :

```bash
ng serve
```

4.  **Accès** : Ouvrir `http://localhost:4200/` dans votre navigateur.

---

## 🧾 Modalité Pédagogique

* **Clean Code** : Architecture modulaire et séparation des préoccupations.
* **UX/UI** : Interface utilisateur soignée ("Premium Feel") avec feedbacks visuels.
* **Intégration** : Consommation fluide de l'API Backend.

---

## 📧 Contact

**👤 Mahjoub Cherkaoui**
📧 [mahjoubcherkaoui50@gmail.com](mailto:mahjoubcherkaoui@gmail.com)
💼 [GitHub – Mahjoubech](https://github.com/Mahjoubech)
