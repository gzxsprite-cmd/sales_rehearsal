# 02 User Flow

## Main user story

A sales person is preparing for a customer discussion about VMS.

The sales person wants to check:
- how to explain VMS
- how the customer may react
- whether the current explanation is convincing
- what knowledge is still missing

## Main flow

### Step 1 — Home
User opens the demo.

The page should immediately tell the user:
- this is a sales rehearsal tool
- the main action is to start a rehearsal

Main CTA:
- Start Rehearsal

### Step 2 — Setup
The user selects the basic rehearsal context.

For v0.1, the setup should stay very light.

User selects:
- customer
- time limit: 10 / 20 / 30 minutes

Defaulted:
- product: VMS
- role: Project Director
- scenario: First Introduction

### Step 3 — Chat starts
The simulated customer speaks first.

The first line should sound realistic and slightly challenging.

The purpose is to immediately pull the sales person into a real conversation context.

### Step 4 — Conversation loop
The user replies.
The simulated customer continues.

The chat should feel like:
- a realistic business conversation
- not a knowledge quiz
- not a chatbot Q&A

The customer should:
- ask questions
- challenge vague statements
- react differently depending on answer quality
- carry some time pressure

### Step 5 — Ending
The conversation can end in multiple ways:
- user clicks End
- max turns reached
- customer decides to stop

The ending should feel like a real customer stopping the discussion, not like a system timeout.

### Step 6 — Review
Immediately after ending, show a structured review page.

The review page must contain:
- outcome (red / yellow / green)
- good points
- unclear points
- risk points
- knowledge coaching
- suggested phrasing
- next action suggestion

### Step 7 — Next action
The user can:
- retry the same scenario
- start a new rehearsal
