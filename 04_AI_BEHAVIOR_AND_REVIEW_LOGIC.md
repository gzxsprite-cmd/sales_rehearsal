# 04 AI Behavior And Review Logic

## General principle

For v0.1, AI behavior is simulated with mock logic.

But the behavior must still reflect the real product concept.

The demo must represent 3 AI functions:
1. Customer Simulation
2. Conversation Evaluation
3. Knowledge Coaching

---

## 1. Customer Simulation

### Role
Main role in v0.1:
- Customer Project Director

### Scenario
- first introduction of VMS
- user tries to explain why this customer/project needs VMS

### Customer behavior expectations
The simulated customer should:
- speak first
- ask what VMS really does for the project
- challenge vague value statements
- react differently depending on user quality
- show limited time / patience
- end the conversation in a realistic way

### Tone
- realistic
- slightly critical
- business-like
- not hostile, but not too helpful

---

## 2. Conversation Evaluation

The review must produce a clear high-level outcome:
- Green
- Yellow
- Red

### Meaning
- Green: convincing enough to continue
- Yellow: partially convincing, but key gaps remain
- Red: not convincing enough yet

### Feedback sections
The review must include:
- Good Points
- Unclear Points
- Risk Points

### Feedback style
Feedback should feel:
- specific
- practical
- related to the actual conversation
- useful for improving the next round

Avoid generic statements like:
- “good communication”
- “needs improvement”
- “be more confident”

---

## 3. Knowledge Coaching

This is a key differentiator.

The demo must not stop at “what went wrong”.

It must also identify what knowledge the user likely lacked.

### Knowledge categories
Use these categories:
- Customer Context
- Product Value
- Competitor Insight
- Pricing / Business Logic

### Coaching output
The review should provide:
- missing knowledge type
- key knowledge to add
- suggested phrasing for next round

### Important principle
Do not only provide information.
Also provide something the user can say next time.

---

## Missing Knowledge handling

If the current demo content cannot provide enough detail, it should still show that a knowledge gap exists.

This supports the business concept that:
- sales gaps can expose enterprise knowledge gaps
- missing knowledge should be visible, not hidden
