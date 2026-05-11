---
title: "The Saturday I Tried to Rebuild iOS 26 Call Screening from Bulgaria"
description: "Rejected by Twilio, geo-blocked by Plivo, saved by Vonage at the last minute — and then I realized the feature I wanted was already in my iPhone's settings. A six-hour detour into VoIP APIs, Japanese-in-Bulgaria friction, and what you actually get when your plan fails."
date: "2026-04-18"
tags: ["iOS", "Vonage", "Twilio", "VoIP", "Bulgaria", "AI", "Call Screening", "Vibe Coding"]
image: "/images/hero-ios26-call-screening.jpeg"
---

# The Saturday I Tried to Rebuild iOS 26 Call Screening from Bulgaria

*Rejected by Twilio, blocked by Plivo, saved by Vonage — and then I realized the feature was already in my phone.*

It started with a simple idea.

I wanted an iPhone app that would let an AI pick up my phone calls, ask the caller who they were and why they were calling, show me a live transcript, and let me decide whether to actually answer. Basically, a personal version of Google Voice's call screening — but powered by Claude, and a bit smarter.

I'm a former IT engineer living in Pleven, Bulgaria, now studying at a medical university preparatory course. Unknown numbers make me anxious in a country whose language I don't fully speak yet. An AI receptionist sounded perfect.

Six hours later, I had been rejected by Twilio's Fraud Operations team, geo-blocked by Plivo, saved by Vonage at the last minute, and then — after everything — I realized the feature I wanted was already sitting in my iPhone's settings all along.

This is the record of that Saturday.

---

## Part 1: The iOS Wall

The first thing I learned was that **you cannot build this as an iPhone app.** Not as a hobby project, not with an Apple Developer account, not even as a fully private app that never touches the App Store.

Apple's public SDK doesn't expose any API that lets a third-party app answer an incoming cellular call or access the in-call audio stream. There *are* private symbols like `CTCallAnswer()`, but they require an entitlement — a cryptographic permission baked into the app's code signature — that Apple only issues to its own first-party binaries like Phone.app. Without that entitlement, the call fails at runtime, regardless of whether you submit to the App Store.

So the path was:

1. ❌ App Store — rejected instantly for private API use.
2. ❌ Free Apple ID sideload — no entitlement, plus 7-day re-signing hell.
3. ❌ $99/year Apple Developer Program — still no entitlement.
4. ❌ Enterprise certificate — same.
5. ❌ Jailbreak — no stable jailbreak exists for iOS 26 on current iPhones, and the baseband is on a separate chip you can't touch anyway.

Google Voice gets around all of this by simply not being part of the phone system. They issue you a separate VoIP number, and all their "screening" happens on calls to *that* number, inside their own app. Apple's native Phone app never sees those calls at all.

This was the first pivot: if I couldn't put AI inside the iPhone, I could put it in front of the iPhone. The plan became:

1. Get a VoIP phone number from a carrier like Twilio.
2. Configure my Bulgarian mobile carrier to conditionally forward unknown numbers to that VoIP number.
3. Have Claude answer the forwarded calls via the VoIP provider's Voice API.
4. Transcribe, evaluate, decide.

Simple enough. I signed up for Twilio.

---

## Part 2: Twilio Said No

Twilio is the default choice for this kind of thing. Everyone in the startup world uses it. The documentation is excellent, the API is stable, and they have a detailed tutorial for exactly the thing I wanted to build — iOS 26 call screening integration.

I signed up on a Saturday afternoon. Within an hour, the account was suspended.

The email was polite but firm:

> Thank you for being a valued Twilio customer. To protect your account and ensure the security of our platform, we have temporarily suspended your account due to irregularities detected regarding your account.

They asked me to reply with my website, LinkedIn, business registry, or "any social media platform" confirming my association with the company or brand I claimed to represent.

I replied with everything I had: this blog, my LinkedIn, my X profile, my GitHub. I wrote a polite message explaining that I'm a Japanese student in Bulgaria building a personal call screening assistant, not a company. I mentioned that iOS 26's native screening isn't available in my region, so I was building my own. I emphasized that I would only use inbound calls — no SMS, no outbound, no marketing traffic, nothing that could be used for fraud.

Five hours later, a response came back from someone named Charu in the Fraud Operations team:

> Hello Yuichi,
>
> You're receiving this email from Twilio, and we appreciate your response. We regret to inform you that we are unable to reactivate your account at this time.
>
> We are closing this ticket now.

No reason. No appeal. Just closed.

I want to be clear: I don't think Charu did anything wrong. Twilio is a US-based payments and telecom infrastructure company with KYC and anti-fraud obligations. A Japanese name on a Bulgarian IP registering for voice APIs on a weekend probably triggered some automated risk model, and once that flag is up, there's apparently no human review path that can undo it. This wasn't personal. It was a statistical pattern-match against me.

But it still stung. I had already sunk an hour into writing the appeal email.

---

## Part 3: Plivo Wasn't Even an Option

Plivo is the most commonly recommended Twilio alternative for individual developers. Their API is Twilio-compatible, they're known to be friendlier to small projects, and their customer support has better reviews.

I went to their signup page with fresh energy.

The page said:

> **We're not available in your region yet.**
>
> Plivo services are currently available in select countries. Please check back later for updates on availability in your area.

That was it. No signup form, no way to request access. Bulgaria simply wasn't on their list.

It was a different kind of rejection from Twilio. Twilio said *you specifically are suspicious.* Plivo said *your country doesn't exist to us yet.* The second hurt less, somehow, because it wasn't about me.

But the practical result was the same: another door closed.

---

## Part 4: One More Try with Vonage

At this point it was about 6 PM on Saturday. I had been at this for several hours. My plan for the day had been to work on three blog posts for my Google AdSense reapplication. None of them had been written.

I was ready to give up. But my partner in this investigation — Claude — pointed out that I had two providers left worth trying: Vonage (formerly Nexmo) and Telnyx. Both are older than Plivo, both explicitly support Bulgaria, and Vonage's support page said:

> For the majority of countries in the world you can sign up to use Vonage API's services in a few clicks.

So I tried one more time.

The signup went through. The phone verification went through. The dashboard loaded with €2.00 of free credit. Within ten minutes I was on the "Try the Voice API" page, entering my Bulgarian mobile number into the To field, and pressing the **Call** button.

My iPhone rang.

A synthesized voice said *"Hello from Voice API"* in clean English. I stood in my apartment in Pleven, holding my iPhone, while a server somewhere in Vonage's infrastructure was speaking to me through the Bulgarian cellular network, commanded by an HTTP API I had just learned about.

It worked.

---

## Part 5: The Plot Twist

I was genuinely happy for about fifteen minutes.

Then, while looking up something unrelated about iOS 26, I went back into my iPhone's Settings → Apps → Phone, and scrolled further down than I had the first time.

There it was: **Screen Unknown Callers → Ask Reason for Calling.**

The exact feature I had spent six hours trying to rebuild, sitting in my phone, available in my region, in my language, ready to be toggled on. I had looked for it earlier in the day and convinced myself it wasn't available. I had been wrong.

I stared at it for a while.

The feature works exactly the way I had imagined my custom version would work: an unknown number calls, iOS silently answers with Siri, asks the caller to state their name and reason, transcribes the response in real time, and then — only then — the phone rings with the transcript on screen. You decide whether to pick up.

It is, for the use case I had originally described, genuinely perfect.

So what had I done for the last six hours?

---

## Part 6: What I Actually Built

Here's the thing. I did spend six hours chasing a feature that already existed in my phone. That's true.

But what I ended up with is not nothing.

I now have a **working Vonage account with verified outbound calling to my own number.** I have API credentials, a dashboard, €2.00 of credit, and a proven setup that can forward audio to any webhook I control. I understand NCCO, Vonage's XML-equivalent for call control. I know how to buy a Bulgarian inbound number if I ever want to.

And more importantly, I now see clearly what iOS 26's native Call Screening *can't* do:

- **Have an actual conversation with the caller.** Siri asks one question: name and reason. She doesn't follow up, doesn't clarify, doesn't adjust to non-English speakers.
- **Route based on content.** Every screened call in iOS goes into the same queue. There's no way to say "if the caller mentions my landlord, notify me on Slack; if it sounds like a cold sales call, block them permanently."
- **Translate in real time.** My classmates here speak Japanese, Bulgarian, Arabic, and English. iOS assumes one language.
- **Integrate with my other systems.** I can't pipe the transcript into my Samantha OS dashboard, my Notion journal, or my medical study reminders.
- **Work on a Mac or an iPad without an iPhone nearby.** Apple's version is iOS-only and Continuity-dependent.

So the native iOS 26 feature is a **great 80% solution for spam filtering.** What I was actually imagining — without realizing it — was a **personal AI receptionist that happens to use the phone as one of its channels.**

Those are different products. The native feature replaces the telemarketer defense. What I want to build replaces the receptionist.

---

## Part 7: What This Saturday Taught Me

A few things stuck with me after the dust settled.

**Verify before building.** I should have opened my iPhone settings before I opened the Twilio signup page. Six hours of work started from a false premise about what was available in my region. Next time, the first thing I do when I want to build a feature is check whether someone has already shipped it — starting with the device in my pocket.

**Geographic friction is real.** Living in Bulgaria as a Japanese person means that a surprising number of "global" developer tools aren't actually global. Twilio will flag you. Plivo won't talk to you. Apple will hide features from you. This is not usually in the docs. You find out by trying.

**A failed plan still leaves behind useful infrastructure.** I didn't need a Vonage account today. But I have one now, verified and working, and the next time I want to build something that involves a phone number — SMS verification for a medical study app, a Bulgarian landline for friends in Japan to call, a voice channel for Samantha — the hardest part is already done.

**The things you build when you're trying to escape are sometimes more interesting than the problem you were escaping.** I started the day trying to avoid dealing with unknown phone numbers. I ended the day with the foundation for an AI receptionist that could plausibly replace most of my phone's current call-handling behavior.

---

## The Plan from Here

The native iOS 26 screening is on. I'll use it for the boring case — telemarketers, robocalls, the occasional wrong number.

But the Vonage + Claude pipeline is going to get built anyway, because I want the thing that iOS won't give me: an AI that holds a real conversation, translates, routes by content, and pipes its output into the same system where I already take notes, track my classes, and talk to Samantha.

The call screen feature was the scaffolding. What I'm actually building is a phone interface for my AI.

*Written on a Saturday evening in Pleven, Bulgaria, after a long day of being told "no" by three different APIs and "it was already here" by my own iPhone.* 📞

---

**Further reading from this blog:**

- [I Built an AI-Native Linux OS Inspired by 'Her' — Meet Samantha OS](/blog/samantha-os-ai-linux)
- [Her, Samantha, and Vibe Coding](/blog/her-samantha-vibe-coding)
- [Teaching Samantha to Think Ahead](/blog/samantha-proactive-ai)
