# Card blurbs and STAR results

Two things need your words. Edit the marked lines and hand the file back; I
apply exactly what is written.

## Part 1: card blurbs

The card clamps to two lines, roughly 160 characters at the card's font size.
Four blurbs are longer than that and get cut mid-sentence today. My drafts cut
the implementation tail (the "powered by a Node.js Express backend" clauses)
and keep what the thing does, since that is what a reader scanning the grid is
deciding on. They are drafts in your voice as I read it, not decisions: rewrite
freely.

The four rows already at or under the limit are listed with `blurb: (ok)` and
need nothing.

## Part 2: STAR results

Your eight project write-ups already run Problem / Solution / My Contributions,
which is STAR with the Result missing:

    The Problem        -> Situation + Task
    The Solution       -> Action
    My Contributions   -> Action (what you personally did)
    (missing)          -> Result

Result is the part I cannot write. It needs real outcomes: what shipped, who
used it, what changed, what it measured. One or two sentences each. If a
project has no measurable result, say so on the line and I will leave that
section out rather than pad it.

This is the same hole as the empty `outcome` column: the mono result line on
cards ("2 days to 20 min") has been blank for every project because no such
column ever existed. A short result line and the STAR Result are the same fact,
so the `result-line:` field below fills both.

---
## ibtss-26-ai-learning-passport
  blurb: (ok) 98 chars, fits two lines
              Digital passport web app for an FHSU AI-in-education conference workshop with QR stamp collection.

  result-line: 
  result-para: 

## ed2go-modern-campus-etl
  blurb: (ok) 106 chars, fits two lines
              Python ETL pipeline syncing course catalog data between Ed2Go and Modern Campus for FHSU's PCE department.

  result-line: 
  result-para: 

## syncia
  blurb: (ok) 103 chars, fits two lines
              Project coordination platform for FHSU student teams with Azure AD SSO and Microsoft Graph integration.

  result-line: 
  result-para: 

## fhsu-gamepulse
  blurb-now:  190 chars, truncates on the card
              A React Native mobile application that transforms live stadium experiences by connecting thousands of fans through synchronized, interactive light shows powered by a Node.js Express backend.
  blurb-new:  A mobile app that turns a stadium crowd into one synchronized light show, connecting thousands of fans in real time.
              (116 chars)

  result-line: 
  result-para: 

## lofi-focus-timer
  blurb-now:  457 chars, truncates on the card
              A Progressive Web App (PWA) that implements the Pomodoro Technique with offline-first architecture using dual-layer data persistence through Firebase Firestore and IndexedDB. The application provides a 25-minute focus timer and task management system that works seamlessly whether online or offline, automatically synchronizing data when connectivity is restored, ensuring users maintain uninterrupted productivity workflow regardless of network conditions.
  blurb-new:  A Pomodoro timer that keeps working offline, syncing your sessions back up whenever the connection returns.
              (107 chars)

  result-line: 
  result-para: 

## quickpay-mobile-app
  blurb-now:  275 chars, truncates on the card
              A React Native mobile application that simplifies personal finance management by unifying multiple bank accounts, enabling QR code payments, and providing interactive budget visualization through a non-custodial system powered by Plaid, Stripe, and a Node.js Express backend.
  blurb-new:  A mobile app that unifies multiple bank accounts, pays by QR code, and makes a budget you can actually read at a glance.
              (120 chars)

  result-line: 
  result-para: 

## modern-cryptography-rsa-aes
  blurb: (ok) 94 chars, fits two lines
              RSA and AES cryptographic algorithms implemented from scratch in Python with a React frontend.

  result-line: 
  result-para: 

## fhsu-blackboard-data-queries
  blurb-now:  452 chars, truncates on the card
              A collection of 50 production-ready Snowflake SQL queries that analyze educational data from Fort Hays State University's Blackboard learning management system through Anthology Illuminate. The queries extract insights about student engagement, course content compliance, assignment tracking, tool adoption, and institutional hierarchies to support data-driven decision-making within the Teaching Innovation and Learning Technologies (TILT) department.
  blurb-new:  Fifty production-ready SQL queries that turn Blackboard course data into answers about student engagement and tool adoption.
              (124 chars)

  result-line: 
  result-para: 

