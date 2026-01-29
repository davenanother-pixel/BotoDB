# BotoDB — Mini-Script Driven Data Release Framework

![BotoDB Logo](https://via.placeholder.com/150)

**BotoDB** is a declarative data release framework for websites and scripts. It allows your code to produce data locally (e.g., in `localStorage`) and release it to a hidden internal database **only when authorized via a mini-script**. This ensures **safe, controlled data collection** without exposing database APIs to your site scripts.

---

## Table of Contents

1. [Core Concepts](#core-concepts)  
2. [Installation](#installation)  
3. [Folder Structure](#folder-structure)  
4. [Site Script Example](#site-script-example)  
5. [Mini-Script Documentation](#mini-script-documentation)  
6. [Framework Usage](#framework-usage)  
7. [Internal Database](#internal-database)  
8. [Optional `.boto` Files](#optional-boto-files)  
9. [Error Handling](#error-handling)  
10. [License](#license)

---

## Core Concepts

- **Mini-Scripts**: Small declarative instructions at the end of site scripts that authorize data transfer.  
- **Local Storage Buffer**: Data is first stored in `localStorage` or temporary memory. The site cannot directly send it to the database.  
- **Framework**: Reads mini-scripts, extracts data from local storage, and appends it to BotoDB.  
- **Internal Database**: Hidden storage managed by the framework. Sites never access it directly.  
- **Optional `.boto` Files**: Only needed for batch operations, maintenance, or advanced automation.

---

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/BotoDB.git
cd BotoDB
Install dependencies (Node.js is required):

npm install jsdom
Run the framework:

node run.js
This will process all site scripts with mini-scripts and store the data internally.

Folder Structure
project-root/
│
├─ site/
│  └─ app.html           ← Website or script containing mini-script
│
├─ BotoDB/
│  ├─ framework.js       ← Parses mini-scripts and extracts data
│  ├─ database.js        ← Internal database logic
│  └─ storage.json       ← Hidden storage of all data
│
└─ run.js                ← Entry point to run the framework
Site Script Example
Example site script with normal code and mini-script:

<!DOCTYPE html>
<html>
<body>
  <script>
    // Normal website logic
    localStorage.setItem("USERS", JSON.stringify([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]));
  </script>

  <!--
  #BOTO
  SEND DATA BotoDB: USERS
  FROM localStorage
  KEY USERS
  CLEAR AFTER SEND
  END BOTO
  -->
</body>
</html>
The browser ignores the mini-script.

The framework reads it and pulls USERS from local storage.

Mini-Script Documentation
Mini-scripts authorize the framework to send data to BotoDB.

Syntax:

#BOTO
SEND DATA BotoDB: <CHANNEL_NAME>
FROM localStorage
KEY <LOCALSTORAGE_KEY>
[CLEAR AFTER SEND]
END BOTO
Fields
Field	Description
SEND DATA BotoDB: <CHANNEL>	Declares the destination channel in the internal DB.
FROM localStorage	Indicates the source is browser localStorage.
KEY <KEY>	Specifies which localStorage key contains the data.
CLEAR AFTER SEND	Optional; clears the localStorage key after successful transfer.
END BOTO	Required; marks the end of the mini-script.
Example:
#BOTO
SEND DATA BotoDB: USERS
FROM localStorage
KEY USERS
CLEAR AFTER SEND
END BOTO
Framework Usage
Run the framework:

node run.js
Steps performed by the framework:

Scans site/script files for mini-scripts.

Executes the site/script in a sandbox (browser or JSDOM).

Reads the data from localStorage based on mini-script instructions.

Appends data to the internal BotoDB store.

Clears localStorage if instructed.

Developer Notes:

Site scripts do not call BotoDB.

Mini-scripts are the only bridge.

Works with any scripting language that can be parsed for mini-scripts (JS, HTML, Python comments, etc.).

Internal Database
Stored in BotoDB/storage.json.

Structure example:

{
  "createdAt": "2026-01-28T00:00:00.000Z",
  "channels": {
    "USERS": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  }
}
Channels are created automatically when first used.

Data is append-only; sites never modify it directly.

Optional .boto Files
.boto files are optional and allow:

Batch ingestion of multiple site scripts

Database inspection, printing, or clearing

Scheduled ingestion operations

Migration or transformations

Example .boto for batch ingestion:

STORE DATA FROM site/app.html
STORE DATA FROM site/analytics.html
PRINT STORE
Error Handling
Situation	Result
Missing mini-script	Framework ignores file, data remains in localStorage
Malformed mini-script	Transfer blocked, error logged
Key missing in localStorage	Error, no send
Send succeeds	Data appended to BotoDB, optionally clears localStorage
DB offline	Data remains buffered in localStorage
License
MIT License — free to use and modify.
