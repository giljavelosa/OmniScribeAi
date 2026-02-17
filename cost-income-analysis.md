# OmniScribe Cost Analysis & Income Projection

**Date:** February 12, 2026

---

## COST STRUCTURE (Per User Per Month)

### Variable Costs (scales with usage)

| Cost Item | MD/PA (20 min × 20/day) | Therapist (50 min × 6/day) | PT/OT/SLP (90 min × 8/day) |
|---|---|---|---|
| Deepgram transcription ($0.0043/min) | $37.84 | $28.38 | $68.11 |
| AI note generation (Claude Sonnet ~$0.03/note) | $13.20 | $3.96 | $5.28 |
| **Total variable/user/mo** | **$51.04** | **$32.34** | **$73.39** |

*Assumes 22 working days/month*

### Fixed Costs (monthly, regardless of users)

| Item | Cost/mo | Notes |
|---|---|---|
| 4 DigitalOcean droplets | $96 | Current setup |
| Domain + SSL | $2 | ~$15/year |
| Email service (SendGrid free tier) | $0 | Up to 100 emails/day |
| Error monitoring (Sentry free) | $0 | Up to 5K events |
| Auth service (Clerk free tier) | $0 | Up to 10K MAUs |
| **Total fixed** | **~$98/mo** | |

### Fixed Costs at Scale (500+ users)

| Item | Cost/mo | Notes |
|---|---|---|
| Upgraded servers (8 vCPU, 16GB) | $384 | 4 × $96 |
| Managed database (DO) | $60 | PostgreSQL managed |
| CDN (Cloudflare free) | $0 | |
| Auth service (Clerk pro) | $25 | |
| Error monitoring | $26 | Sentry team |
| Customer support tool | $50 | Intercom starter |
| SOC 2 compliance (Vanta) | $833 | ~$10K/year |
| **Total fixed at scale** | **~$1,378/mo** | |

---

## PRICING vs. MARGIN ANALYSIS

### Per-User Margins by Tier

| Tier | Price | MD Margin | Therapist Margin | PT Margin |
|---|---|---|---|---|
| **Starter ($29/mo)** | $29 | -$22.04 ❌ | -$3.34 ❌ | -$44.39 ❌ |
| **Professional ($59/mo)** | $59 | +$7.96 ✅ | +$26.66 ✅ | -$14.39 ❌ |
| **Clinical ($89/mo)** | $89 | +$37.96 ✅ | +$56.66 ✅ | +$15.61 ✅ |
| **Enterprise (custom)** | $129+ | +$77.96 ✅ | +$96.66 ✅ | +$55.61 ✅ |

**Key insight:** The Starter tier loses money on almost everyone. It's a funnel — get them in, upsell to Professional/Clinical. Limit Starter to 50 notes/month to control losses.

**PT/rehab users MUST be on Clinical tier ($89)** to be profitable. Good news: no competitor offers rehab features at all, so $89 for something only OmniScribe has is an easy sell.

---

## INCOME PROJECTIONS

### Scenario 1: Conservative (Bootstrapped)
*Slow organic growth, no marketing spend*

| Month | Users | Mix | MRR | Variable Costs | Fixed Costs | Net Profit |
|---|---|---|---|---|---|---|
| 1-3 | 0 (building) | — | $0 | $0 | $98 | -$294 |
| 4 | 10 beta (free) | — | $0 | $400 | $98 | -$498 |
| 5 | 20 (10 free, 10 paid) | 5 Pro, 5 Clinical | $740 | $800 | $98 | -$158 |
| 6 | 40 (10 free, 30 paid) | 15 Pro, 15 Clinical | $2,220 | $1,500 | $98 | +$622 |
| 9 | 100 | 20 Start, 50 Pro, 30 Clin | $5,250 | $4,200 | $200 | +$850 |
| 12 | 250 | 50 Start, 120 Pro, 80 Clin | $15,570 | $10,500 | $500 | +$4,570 |
| 18 | 500 | 100 Start, 240 Pro, 160 Clin | $31,060 | $21,000 | $1,378 | +$8,682 |

**Break-even: Month 6 (~30 paying users)**
**Year 1 ARR: ~$187K**
**Year 1.5 ARR: ~$373K**

### Scenario 2: Moderate (Small Seed Round)
*$100K seed, targeted marketing to PT/OT/SLP communities*

| Month | Users | MRR | Net Profit | Cumulative |
|---|---|---|---|---|
| 1-3 | 0 (building) | $0 | -$5,098 | -$15,294 |
| 4 | 30 beta | $0 | -$1,698 | -$16,992 |
| 5 | 50 (30 paid) | $2,220 | +$322 | -$16,670 |
| 6 | 100 | $5,250 | +$950 | -$15,720 |
| 9 | 300 | $17,700 | +$4,200 | -$3,120 |
| 12 | 750 | $44,250 | +$12,750 | +$35,130 |
| 18 | 2,000 | $124,000 | +$42,000 | +$218,130 |

**Break-even: Month 10**
**Year 1 ARR: ~$531K**
**Year 1.5 ARR: ~$1.49M**

### Scenario 3: Aggressive (VC-Backed)
*$500K+ seed, sales team, conference presence, partnerships*

| Month | Users | MRR | ARR |
|---|---|---|---|
| 6 | 200 | $12,000 | $144K |
| 12 | 1,500 | $93,750 | $1.13M |
| 18 | 5,000 | $325,000 | $3.9M |
| 24 | 15,000 | $975,000 | $11.7M |

*Freed hit ~$15M ARR with 25K users. This is achievable with similar execution.*

---

## USER ACQUISITION COST ESTIMATES

| Channel | CAC | Notes |
|---|---|---|
| Organic/SEO (template library) | $0-5 | Twofold's strategy — build public templates, rank on Google |
| Reddit/community marketing | $0-10 | r/physicaltherapy, r/psychotherapy, Facebook groups |
| Conference booth (APTA, AOTA) | $50-100 | $2K booth + travel / 20-40 signups |
| Google Ads ("AI medical scribe") | $80-150 | Competitive healthcare SaaS keywords |
| Referral program ("Refer 2, get 1 year free") | $30-50 | Twofold does this — proven in the space |
| Clinical educator partnerships | $5-15 | Free accounts for programs, students convert |
| EHR partnership co-marketing | $10-30 | WebPT/TherapyNotes referrals |

**Target blended CAC: $30-50**
**Target LTV: $700-1,200** (12-18 month retention × $59-89/mo)
**LTV:CAC ratio: 15-30x** (healthy is 3x+)

---

## REVENUE BY SPECIALTY (Addressable Market)

| Specialty | US Providers | TAM (if all used OmniScribe) | Realistic 1% capture |
|---|---|---|---|
| Physical Therapists | 250,000 | $267M/yr | $2.67M/yr |
| Occupational Therapists | 130,000 | $139M/yr | $1.39M/yr |
| Speech-Language Pathologists | 160,000 | $171M/yr | $1.71M/yr |
| Licensed Therapists/Counselors | 600,000 | $425M/yr | $4.25M/yr |
| Psychiatrists | 45,000 | $32M/yr | $320K/yr |
| Primary Care (FM/IM) | 210,000 | $149M/yr | $1.49M/yr |
| PA-C/NP | 400,000 | $283M/yr | $2.83M/yr |
| **Total** | **1,795,000** | **$1.47B/yr** | **$14.7M/yr** |

**Rehab alone (PT+OT+SLP) = 540,000 providers = $577M TAM**
Even 1% = $5.77M ARR. And NO competitor is fighting you for it.

---

## BREAK-EVEN ANALYSIS

### Minimum Viable Business (just covering costs)

| Fixed Costs | $98/mo (current) |
|---|---|
| Avg revenue per paid user | $74/mo (blended Pro + Clinical) |
| Avg variable cost per user | $45/mo (blended) |
| **Contribution margin/user** | **$29/mo** |
| **Users to break even** | **4 paying users** |

You only need **4 paying customers** to cover current infrastructure. That's it.

### Comfortable Sustainability (paying yourself $5K/mo)

| Target | Amount |
|---|---|
| Your salary | $5,000/mo |
| Fixed costs | $500/mo (slightly upgraded) |
| Total needed | $5,500/mo |
| Contribution margin/user | $29/mo |
| **Users needed** | **~190 paying users** |

### Real Business ($10K/mo profit + reinvestment)

| Target | Amount |
|---|---|
| Your salary | $8,000/mo |
| Fixed costs | $1,378/mo |
| Marketing budget | $2,000/mo |
| Dev contractor | $3,000/mo |
| Total needed | $14,378/mo |
| Contribution margin/user | $29/mo |
| **Users needed** | **~496 paying users** |

---

## YEAR 1 P&L PROJECTION (Conservative)

| | Q1 | Q2 | Q3 | Q4 | Total |
|---|---|---|---|---|---|
| **Revenue** | $0 | $4,960 | $21,750 | $46,710 | $73,420 |
| **Transcription costs** | $0 | $2,400 | $9,450 | $19,800 | $31,650 |
| **AI generation costs** | $0 | $240 | $945 | $1,980 | $3,165 |
| **Infrastructure** | $294 | $394 | $600 | $1,000 | $2,288 |
| **Domain/tools** | $50 | $50 | $100 | $200 | $400 |
| **Marketing** | $0 | $500 | $1,000 | $2,000 | $3,500 |
| **Total Costs** | $344 | $3,584 | $12,095 | $24,980 | $41,003 |
| **Net Profit** | -$344 | +$1,376 | +$9,655 | +$21,730 | **+$32,417** |

**Year 1 net profit (conservative): ~$32K**
**Year 1 net profit (moderate): ~$85K**

---

## KEY TAKEAWAYS

1. **$200 Deepgram credit = 3 months of free testing.** Zero risk to start.
2. **Break-even at just 4 paying users.** Infrastructure is cheap.
3. **Rehab is the money play.** 540K providers, zero competition, higher tier pricing ($89).
4. **Therapists are the most profitable users** — short-ish sessions, high volume, lowest variable cost.
5. **PT users need Clinical tier** to be margin-positive. But they have no alternative, so they'll pay.
6. **Year 1 realistic ARR: $73K-187K** depending on growth pace.
7. **The $1.47B TAM is real** — 1.8M providers in the US who document daily.
8. **LTV:CAC ratio of 15-30x** means every dollar spent on marketing returns $15-30.

---

## WHAT GIL NEEDS TO SPEND RIGHT NOW

| Item | Cost | Status |
|---|---|---|
| DigitalOcean (4 droplets) | $96/mo | ✅ Running |
| Deepgram (transcription) | $0 (free $200 credit) | Signing up |
| Anthropic API (Claude Sonnet) | ~$5-20/mo during dev | Need API key |
| Domain name | ~$12/year | Need to purchase |
| USPTO provisional patent (3x) | $480 ($160 each) | Drafts ready |
| **Total to launch MVP:** | **~$108/mo + $492 one-time** | |

You can get from here to a live, working product for **under $600 total** and **~$100/month**. That's it.
