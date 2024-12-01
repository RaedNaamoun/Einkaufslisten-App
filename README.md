# Einkaufslisten-App

Eine Full-Stack-Webanwendung zur Verwaltung von Einkaufslisten mit der Möglichkeit, Rezepte aus einer externen API (Spoonacular) zu durchsuchen und basierend darauf Einkaufslisten zu generieren.

---

## **Inhaltsverzeichnis**

1. [Funktionalitäten](#funktionalitäten)
2. [Freestyle Tasks](#freestyle-tasks)
3. [Struktur der Routen](#struktur-der-routen)
4. [Installation und Einrichtung](#installation-und-einrichtung)
5. [Testen](#testen)

---

## **Funktionalitäten**

### **Backend**
- **Einkaufslisten**
  - Erstellen, Abrufen, Bearbeiten und Löschen von Einkaufslisten.
  - Priorisierung und Sortierung nach Priorität.
  - Suche nach Einkaufslisten anhand von Namen oder Beschreibungen.
  - Abrufen von Einkaufslisten, die einen bestimmten Artikel enthalten.

- **Artikel**
  - Hinzufügen, Bearbeiten und Löschen von Artikeln in einer Einkaufsliste.
  - Abrufen aller Artikel einer bestimmten Einkaufsliste.

### **Frontend**
- Benutzeroberfläche zur Verwaltung von Einkaufslisten und Artikeln.
- Dynamische Priorisierung und Sortierung von Listen.
- Integration externer Rezeptdaten mit Zutatenanzeige.

---
## **Freestyle Tasks**
### **Freestyle Task #1: Prioritäten für Einkaufslisten**
Dieses Feature ermöglicht es dem Benutzer, Prioritäten zu Einkaufslisten hinzuzufügen und diese nach Priorität zu sortieren. Dadurch können wichtige Einkaufslisten hervorgehoben und organisiert werden.
### **Funktionalitäten**
- Benutzer können beim Erstellen oder Bearbeiten einer Einkaufsliste eine Priorität festlegen.
- Prioritäten sind in drei Kategorien unterteilt:
    - Hoch (1)
    - Mittel (2)
    - Niedrig (3, Standardwert)
- Einkaufslisten werden automatisch nach ihrer Priorität sortiert angezeigt (Höchste Priorität zuerst).
- Benutzer können die Priorität einer bestehenden Einkaufsliste jederzeit ändern.
### **Freestyle Task #2: Einkaufslisten auf Basis von Rezepten generieren**
Dieses Feature ermöglicht es Benutzern, Rezepte mithilfe der Spoonacular API zu suchen und die Zutaten dieser Rezepte direkt in eine Einkaufsliste zu integrieren. Dadurch wird die Planung und Erstellung von Einkaufslisten erheblich vereinfacht.
### **Funktionalitäten**
- Benutzer können nach Rezepten basierend auf Stichwörtern suchen (z. B. "Pasta").
- Die App zeigt eine Liste von Rezepten mit Bildern und Namen an.
- Benutzer können auf ein Rezept klicken, um die Liste der Zutaten anzuzeigen.
- Zutaten können direkt in die Einkaufsliste übernommen werden.
### **Wie wird es verwendet?**
- Um SPOONACULAR api zu benutzen, müssen Sie ein Konto bei https://spoonacular.com/food-api erstellen, einen neuen api-Schlüssel generieren und ihn in der .env-Datei SPOONACULAR_API_KEY=Ihr_api_key hinzufügen
---

## **Struktur der Routen**

### **Backend-Routen**

| Methode | Route                                | Beschreibung                                            |
|---------|--------------------------------------|--------------------------------------------------------|
| `GET`   | `/api/shopping-lists`               | Abrufen aller Einkaufslisten, sortiert nach Priorität. |
| `POST`  | `/api/shopping-lists`               | Neue Einkaufsliste erstellen.                          |
| `PUT`   | `/api/shopping-lists/:id`           | Einkaufsliste bearbeiten.                              |
| `DELETE`| `/api/shopping-lists/:id`           | Einkaufsliste löschen.                                 |
| `PUT`   | `/api/shopping-lists/:id/priority`  | Priorität einer Einkaufsliste aktualisieren.           |
| `GET`   | `/api/shopping-lists/search`        | Einkaufslisten nach Namen oder Beschreibung suchen.    |
| `GET`   | `/api/shopping-lists/items/:itemName`| Einkaufslisten mit einem bestimmten Artikel abrufen.  |
| `POST`  | `/api/shopping-lists/:id/items`     | Artikel zu einer Einkaufsliste hinzufügen.             |
| `GET`   | `/api/shopping-lists/:id/items`     | Artikel einer Einkaufsliste abrufen.                  |
| `PUT`   | `/api/shopping-lists/:listId/items/:itemId`| Artikel in einer Einkaufsliste bearbeiten.         |
| `DELETE`| `/api/shopping-lists/:listId/items/:itemId`| Artikel aus einer Einkaufsliste löschen.            |
| `GET`   | `/api/recipes/search`               | Rezepte basierend auf Suchbegriffen abrufen.           |
| `GET`   | `/api/recipes/:id/ingredients`      | Zutaten eines Rezepts abrufen.                         |
| `POST`  | `/recipes/:id/add-to-shopping-list` | Zutaten eines Rezepts zu einer neuen Einkaufsliste hinzufügen|
---

## **Installation und Einrichtung**

### **Klonen Sie das Repository:**
```bash
   git clone https://code.fbi.h-da.de/istranaam/fwe-ws-24-25-767551.git
```
### **Neue Postgres-Datenbank erstellen**
- Erstellen Sie zuerst eine neue Postgres-Datenbank mit pgAdmin, die Sie zum Beispiel (shopping_list) nennen können.
- die Erstellung der Tabellen ist automatisiert, sie werden automatisch erstellt, nachdem Sie den Server gestartet haben.

### **Erstelle eine .env-Datei im backend Verzeichnis mit folgendem Inhalt:**
```bash
DB_USER=your_user
DB_HOST=localhost
DB_NAME=shopping_list
DB_PASSWORD=your_password
DB_PORT=5432
SPOONACULAR_API_KEY=your_api_key
```
### **Verwaltung der Abhängigkeiten in der Anwendung**

### **Backend**
```bash
cd backend
npm install
npm run dev
```
### **Frontend**
```bash
cd shopping-list-frontend
npm install
npm start
```

## **Testen**

### **Unit Tests mit Jest und Supertest**
```bash
cd backend
npm install
npm test
```