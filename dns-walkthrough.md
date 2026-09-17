# DNS Walkthrough: How the Internet Finds a Website (PF-04)

---

### 1. What DNS Does
The **Domain Name System (DNS)** is the address book of the internet. Humans remember memorable names like `shreetam.netlify.app` or `google.com`, but computers route packets using numeric IP addresses (like `104.198.14.52`). DNS translates human-readable domain names into computer-routable IP addresses.

---

### 2. What a CNAME Record Is
A **CNAME (Canonical Name) record** is an alias pointer. Instead of mapping a domain name directly to a static IP address (which an `A` record does), a CNAME points one domain name to another domain name.

* **Example:** When you configure a custom domain like `portfolio.shreetam.com` to point to `yourname.netlify.app`, you create a CNAME record. If Netlify migrates their hosting servers to new IP addresses, your custom domain continues resolving seamlessly because it points to Netlify's domain rather than a hardcoded IP.

---

### 3. What Actually Happens: The Complete Resolution Loop

When a user types `https://shreetam.netlify.app` into their browser and presses Enter, this request lifecycle occurs:

```text
[Browser Cache] 
      │ (Cache Miss)
      ▼
[Recursive Resolver (ISP / 8.8.8.8)]
      │ 
      ├── 1. Query Root Server (".") ─────────> Returns TLD Server for ".app"
      ├── 2. Query TLD Server (".app") ───────> Returns Authoritative Nameserver for "netlify.app"
      └── 3. Query Authoritative Nameserver ──> Returns IP Address (A/AAAA) or Alias (CNAME)
      │
      ▼
[Host Answers over HTTPS (Port 443)] ──> Browser Renders Webpage