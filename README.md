
# Website Security Hardening

To protect the ProShop application from common exploits and reduce its attack surface, we implemented the following industry-standard hardening techniques.

ProShop is a full-featured eCommerce platform built with the MERN Stack (MongoDB, Express, React, Node.js). While it functions as a robust retail system, its primary objective is to demonstrate industry-standard web security, secure coding practices, and server hardening.

## Vulnerability Assessment (OWASP ZAP)

### Before:
<img src="_README/BEFORE (1).jpg" alt="_README/BEFORE (1).jpg" width="70%">

### After:
<img src="_README/AFTER (1).png" alt="_README/AFTER (1).png" width="50%">


# Server Hardening Implementation

### 1. HTTP Header Protection

We used Helmet.js middleware to secure the server by automatically setting and stripping specific HTTP headers:

* Disabled `X-Powered-By`: Prevented attackers from identifying the backend (Express.js), making it harder to target version-specific exploits.
* `X-Content-Type-Options: nosniff`: Forced browsers to strictly follow the declared MIME types, preventing script injection via uploaded files.
* `X-Frame-Options: DENY`: Blocked the site from being rendered in `iframes` to eliminate Clickjacking attacks.

### 2. Content Security Policy (CSP)

We defined a strict CSP to control which resources are allowed to load:

* Restricted Sources: Scripts, styles, and images are only allowed from `self` (our domain) or trusted providers like PayPal.
* Frame Ancestors: Set to `'none'` to ensure no unauthorized third-party site can embed our store.

### 3. Authentication & Cookie Security

Since we use JWT (JSON Web Tokens) for sessions, we hardened the storage mechanism:

* HTTP-Only Cookies: Prevents JavaScript from accessing the token, effectively stopping XSS-based token theft.
* SameSite=Strict: Ensures cookies are only sent for first-party requests, mitigating CSRF (Cross-Site Request Forgery).
* Secure Flag: In production, cookies are transmitted strictly over HTTPS.

### 4. Data & API Security

* CORS Policy: Restricted API access to our specific frontend domain instead of using a wildcard `*`.
* Cache-Control: Added `no-store` and `no-cache` headers for routes containing sensitive user data (e.g., profile or order history) to prevent data being left in public browser caches.
* Input Sanitization: Implemented middleware to validate MongoDB ObjectIds and reject malformed requests before they reach the database logic.

### 5. Infrastructure & Error Handling

* Environment Variables: Kept all sensitive keys (JWT Secret, MongoDB URI, PayPal Client ID) in `.env` files, ensuring they are never hardcoded or pushed to version control.
* Production Error Suppression: Configured a centralized error handler that sends generic messages to the user while logging full stack traces only on the server, preventing Information Disclosure.

