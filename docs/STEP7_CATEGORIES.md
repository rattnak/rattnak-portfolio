# Step 7: assign categories

One block per row. Edit the `categories:` line and nothing else, then tell me
to apply it. I run exactly what is written here, so a row you do not touch
keeps the value it has now.

Valid values: DEVELOP, DESIGN, LEADERSHIP, OPEN_SOURCE
A row may have several. It may not have none (a CHECK constraint rejects that,
and an uncategorized row would vanish from every filter chip).

The current values are placeholders from the migration, chosen to keep the grid
looking exactly as it does today: every project became {DEVELOP} and every
achievement became {LEADERSHIP}. Assigning the real values is the point of the
merge, and it is the one part I should not guess at.

Where a row's own text suggests something, it is noted as `hint:`. Ignore the
hints freely, they are read off the tldr and skills, not off knowing the work.

---
## fhsu-gamepulse
  type:       project
  date:       Nov 2025
  skills:     Expo, React Native, TypeScript
  tldr:       A React Native mobile application that transforms live stadium experiences by connecting thousands of fans through synchronized, interactive light shows powered by a Node.js Express backend.
  categories: DEVELOP, DESIGN

## quickpay-mobile-app
  type:       project
  date:       Aug 2025
  skills:     Expo, Figma, React Native, Stripe, TypeScript
  tldr:       A React Native mobile application that simplifies personal finance management by unifying multiple bank accounts, enabling QR code payments, and providing interactive budget visualization th
  hint: skills mention design tooling, may be {DEVELOP, DESIGN}
  categories: DEVELOP, DESIGN

## fhsu-blackboard-data-queries
  type:       project
  date:       Feb 2025
  skills:     Snowflake, SQL
  tldr:       A collection of 50 production-ready Snowflake SQL queries that analyze educational data from Fort Hays State University's Blackboard learning management system through Anthology Illuminate. 
  categories: DEVELOP

## lofi-focus-timer
  type:       project
  date:       Sep 2025
  skills:     Firebase, IndexedDB, JavaScript
  tldr:       A Progressive Web App (PWA) implementing the Pomodoro Technique with offline-first architecture. Built with vanilla JavaScript, Firebase Firestore, and IndexedDB, it provides dual-layer data
  hint: skills mention design tooling, may be {DEVELOP, DESIGN}
  categories: DEVELOP, DESIGN

## ibtss-26-ai-learning-passport
  type:       project
  date:       Jun 2026
  skills:     Next.js, PostgreSQL
  tldr:       A digital passport web app for the IBTSS 2026 Pre-Conference Workshop on AI in Higher Education. Participants register, visit workshop stations, scan QR codes to collect stamps, receive reso
  categories: DEVELOP, DESIGN

## syncia
  type:       project
  date:       Apr 2026
  skills:     Next.js, OAuth, PostgreSQL
  tldr:       A project coordination platform for FHSU student teams built with Next.js 15, Supabase, and Microsoft Graph. Features Azure AD SSO restricted to @fhsu.edu accounts, project workspaces with r
  hint: skills mention design tooling, may be {DEVELOP, DESIGN}
  categories: DEVELOP, DESIGN

## ed2go-modern-campus-etl
  type:       project
  date:       May 2026
  skills:     Python
  tldr:       A Python ETL pipeline that extracts course catalog data from the Ed2Go Partner API (SOAP/XML) and loads it into Modern Campus Lifelong Learning Extended Education (Destiny One) for FHSU's Pr
  categories: DEVELOP

## modern-cryptography-rsa-aes
  type:       project
  date:       Aug 2025
  skills:     Python, Security
  tldr:       A web application implementing RSA (asymmetric) and AES (symmetric) cryptographic algorithms from scratch in pure Python, with a Flask REST API and a React + Tailwind frontend. Includes RSA 
  categories: DEVELOP

## harvard-wecode-2026-distinguished-tech-fellow
  type:       achievement / Fellowship
  date:       Oct 2025
  skills:     Leadership, Community
  tldr:       Selected as a Tech Fellow for Harvard WECode 2026, a leading student-led women-in-tech conference.
  categories: LEADERSHIP

## ncae-cybergames-2025-west-region
  type:       achievement / Competition
  date:       Mar 2025
  skills:     Security, Problem Solving
  tldr:       Represented Fort Hays State University in a regional CTF competition, helping the team score 1,450 points across Exploitation, Cryptography, OSINT, and Network Security challenges.
  hint: text suggests built or engineered something alongside LEADERSHIP
  categories: LEADERSHIP

## student-representative-speaker-dichi-academy-launch
  type:       achievement / Program
  date:       Jun 2024
  skills:     Public Speaking, Full-Stack Development
  tldr:       Selected as student representative to deliver a speech at the launching ceremony of DICHI Academy's Full-Stack Developer Trainee program.
  hint: text suggests built or engineered something alongside LEADERSHIP
  categories: LEADERSHIP, DEVELOP, DESIGN

## huawei-seeds-for-the-future-global-ambassador-2024
  type:       achievement / Program
  date:       Mar 2024
  skills:     AI, Leadership
  tldr:       Selected as one of 10 Global Ambassadors worldwide and Asia-Pacific's Top 1 Seed, representing the program at international innovation and digital talent events.
  categories: LEADERSHIP

## handong-unesco-unitwin-top-3-participant
  type:       achievement / Program
  date:       Jan 2024
  skills:     Data Analysis, Data Visualization
  tldr:       Placed in the top 3 of the HANDONG UNESCO UNITWIN data science program.
  hint: text suggests built or engineered something alongside LEADERSHIP
  categories: LEADERSHIP

## cambodian-seed-delegate-cop28-uae
  type:       achievement / Delegate
  date:       Dec 2023
  skills:     Leadership, Research
  tldr:       Selected as Cambodia's delegate to COP28 in Dubai as part of the Huawei Seeds for the Future 2.0 program, representing the country at the UN Climate Change Conference.
  categories: LEADERSHIP

## t4g-yourmedi
  type:       achievement / Competition
  date:       Aug 2023
  skills:     (none)
  tldr:       Led a team of 7 students to receive 2nd Place in the 2023 Huawei Seeds For The Future Tech4Good competing against 17 teams from South Korea, Thailand, Laos, Cambodia, Vietnam
  hint: text suggests built or engineered something alongside LEADERSHIP
  categories: LEADERSHIP, DESIGN

## cambodian-seed-delegate-huawei-seeds-for-the-future-2023
  type:       achievement / Delegate
  date:       Aug 2023
  skills:     AI, Leadership
  tldr:       Selected as Cambodia's delegate for the Huawei Seeds for the Future 2023 program, traveling to China for the summit.
  categories: LEADERSHIP

## founder-safesangkum
  type:       achievement / Venture
  date:       Nov 2022
  skills:     Leadership, Project Management
  tldr:       Founded SafeSangkum, a startup developed through the Techo Startup Center incubation track, covering business model design, pitching, and go-to-market strategy.
  hint: text suggests built or engineered something, design work alongside LEADERSHIP
  categories: LEADERSHIP, DESIGN

