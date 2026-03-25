# Member & Shop User Journey

> **NOTE:** This is the original monolith journey diagram from early development. For current, maintained diagrams see [`docs/diagrams/journeys/`](journeys/README.md). This file is kept for historical reference.

Complete user journey covering guest checkout, member registration, buyer/seller paths, and shop creation.

## Account Tiers Overview

```mermaid
graph LR
    G["Guest"] -->|"Sign up"| MB["Member (Buyer)"]
    MB -->|"Toggle is_seller"| MS["Member (Seller)"]
    MS -->|"Toggle off"| MB
    MB -->|"Create shop"| SH["Shop Owner"]
    MS -->|"Create shop"| SH
    SH -->|"Create another"| SH2["Multi-Shop Owner"]
```

## Registration & Onboarding Flow

```mermaid
flowchart TD
    START(("Visit Nessi")) --> BROWSE["Browse & Discover"]
    BROWSE --> BUY_GUEST{"Want to buy?"}
    BUY_GUEST -->|"No account"| GUEST_CHECKOUT["Guest Checkout (future)"]
    BUY_GUEST -->|"Create account"| REGISTER["Register (email + password)"]

    REGISTER --> ONBOARD_1["Step 1: Avatar, Display Name, Handle"]
    ONBOARD_1 --> ONBOARD_BRANCH{"How will you use Nessi?"}

    ONBOARD_BRANCH -->|"I'm here to buy"| BUYER_PATH["Step 3: Fishing Preferences
    Species, Techniques, Home State"]
    BUYER_PATH --> BUYER_DONE["Lean Buyer Dashboard"]

    ONBOARD_BRANCH -->|"Buy and sell"| SELLER_PATH["Step 3: Fishing Preferences"]
    SELLER_PATH --> SELL_CHOICE{"How do you want to sell?"}

    SELL_CHOICE -->|"Free"| FREE_SELLER["Step 4a: Seller Terms + Stripe Setup
    is_seller = true"]
    FREE_SELLER --> SELLER_DONE["Full Dashboard (Selling Enabled)"]

    SELL_CHOICE -->|"Shop (Premium)"| SHOP_CREATE["Step 4b: Shop Name, Handle, Avatar
    Subscription Signup"]
    SHOP_CREATE --> SHOP_DONE["Full Dashboard + Shop Context"]

    style GUEST_CHECKOUT fill:#f0f0f0,stroke:#999,stroke-dasharray: 5 5
    style BUYER_DONE fill:#d4edda
    style SELLER_DONE fill:#d4edda
    style SHOP_DONE fill:#cce5ff
```

## Dashboard Context Switching

```mermaid
flowchart TD
    LOGIN(("Login")) --> MEMBER_CTX["Member Context
    Avatar: Kyle Holloway
    Dashboard: Purchases, Reviews"]

    MEMBER_CTX --> NAV_DROP["Navbar Dropdown"]
    NAV_DROP -->|"Switch to shop"| SHOP_CTX["Shop Context
    Avatar: Kyle's Tackle
    Dashboard: Listings, Orders, Analytics"]

    SHOP_CTX --> NAV_DROP2["Navbar Dropdown"]
    NAV_DROP2 -->|"Switch to member"| MEMBER_CTX
    NAV_DROP2 -->|"Switch to other shop"| SHOP_CTX2["Other Shop Context"]

    subgraph MEMBER_DASH["Member Dashboard"]
        M_BUY["Purchases"]
        M_LISTINGS["My Listings (if is_seller)"]
        M_REVIEWS["Reviews (buyer + seller)"]
        M_SETTINGS["Settings (is_seller toggle)"]
        M_CTA["Start Selling / Create Shop CTAs"]
    end

    subgraph SHOP_DASH["Shop Dashboard"]
        S_LISTINGS["Shop Listings"]
        S_ORDERS["Shop Orders"]
        S_ANALYTICS["Analytics"]
        S_SETTINGS["Shop Settings"]
        S_MEMBERS["Team Members (premium)"]
    end

    MEMBER_CTX --> MEMBER_DASH
    SHOP_CTX --> SHOP_DASH
```

## Seller Opt-In (Post-Onboarding)

```mermaid
flowchart TD
    BUYER_DASH["Buyer-Only Dashboard"] --> CTA{"Start Selling CTA"}
    CTA --> CHOICE{"How do you want to sell?"}

    CHOICE -->|"Free"| MINI_ONBOARD["Seller Terms
    Stripe Connect Setup"]
    MINI_ONBOARD --> TOGGLE["is_seller = true"]
    TOGGLE --> SELLER_DASH["Dashboard + Selling Features"]

    CHOICE -->|"Shop"| SHOP_FLOW["Shop Creation Flow
    Name, Handle, Avatar
    Subscription"]
    SHOP_FLOW --> SHOP_DASH["Shop Context Available"]

    SELLER_DASH -->|"Upsell triggers"| UPSELL{"Hit a limit?"}
    UPSELL -->|"Image limit"| SHOP_FLOW
    UPSELL -->|"Listing cap"| SHOP_FLOW
    UPSELL -->|"Want video"| SHOP_FLOW
    UPSELL -->|"Want analytics"| SHOP_FLOW
    UPSELL -->|"Want team"| SHOP_FLOW

    style UPSELL fill:#fff3cd
```

## Product Ownership Model

```mermaid
erDiagram
    MEMBERS ||--o{ LISTINGS : "member_id (personal listings)"
    SHOPS ||--o{ LISTINGS : "shop_id (shop listings)"
    MEMBERS ||--o{ SHOPS : "owner_id"
    MEMBERS ||--o{ SHOP_MEMBERS : "member_id"
    SHOPS ||--o{ SHOP_MEMBERS : "shop_id"
    SHOP_ROLES ||--o{ SHOP_MEMBERS : "role_id"
    MEMBERS ||--o{ ADDRESSES : "user_id (max 5)"
    MEMBERS ||--|| SLUGS : "slug (globally unique)"
    SHOPS ||--|| SLUGS : "slug (globally unique)"
    SHOPS ||--o{ SHOP_INVITES : "shop_id"

    MEMBERS {
        uuid id PK
        text display_name
        text slug UK
        boolean is_seller
    }

    SHOPS {
        uuid id PK
        uuid owner_id FK
        text shop_name
        text slug UK
        timestamptz deleted_at
    }

    SHOP_MEMBERS {
        uuid shop_id FK
        uuid member_id FK
        uuid role_id FK
    }

    SHOP_ROLES {
        uuid id PK
        text name
        boolean is_system
        jsonb permissions
    }

    SHOP_INVITES {
        uuid id PK
        uuid shop_id FK
        text email
        uuid role_id FK
        text status
        timestamptz expires_at
    }

    LISTINGS {
        uuid id PK
        uuid seller_id FK
        uuid member_id FK
        uuid shop_id FK
        text title
        integer price_cents
        listing_status status
    }

    ADDRESSES {
        uuid id PK
        uuid user_id FK
        text label
        boolean is_default
    }

    SLUGS {
        text slug PK
        text entity_type
        uuid entity_id
    }
```

## Public Page Routing

```mermaid
flowchart LR
    URL_MEMBER["/member/kyle-holloway-4829"] --> MEMBER_PAGE["Member Profile Page"]
    URL_SHOP["/shop/kyles-tackle"] --> SHOP_PAGE["Shop Page"]

    subgraph MEMBER_PAGE
        MP_AVATAR["Avatar + Name + Handle"]
        MP_BIO["Bio + Fishing Prefs"]
        MP_REVIEWS["Buyer + Seller Reviews"]
        MP_LISTINGS["Listings (if is_seller)"]
    end

    subgraph SHOP_PAGE
        SP_BANNER["Hero Banner (premium)"]
        SP_AVATAR["Shop Avatar + Name"]
        SP_BADGE["Verified Badge (premium)"]
        SP_DESC["Description"]
        SP_LISTINGS["Shop Listings"]
        SP_REVIEWS["Shop Reviews"]
    end
```

## Account Deletion Flow

```mermaid
flowchart TD
    DELETE_REQ["Member requests account deletion"] --> OWN_SHOP{"Owns any shops?"}

    OWN_SHOP -->|"Yes"| BLOCKED["Deletion blocked
    'Delete or transfer your shop first'"]
    BLOCKED --> TRANSFER["Transfer Ownership
    (double confirmation)"]
    BLOCKED --> DELETE_SHOP["Delete Shop
    (confirmation modal)"]

    TRANSFER --> DEMOTED["Former owner → manager
    Can now leave shop"]
    DEMOTED --> OWN_SHOP

    DELETE_SHOP --> OWN_SHOP

    OWN_SHOP -->|"No"| CONFIRM["Confirmation modal
    'This cannot be undone'"]
    CONFIRM --> CASCADE["Cascade:
    auth.users deleted
    → members row deleted
    → member products deleted
    → shop_members entries deleted
    → slugs entry cleaned up
    → storage files cleaned up"]

    style BLOCKED fill:#f8d7da
    style CASCADE fill:#d4edda
```

## is_seller Toggle Guards

```mermaid
flowchart TD
    TOGGLE["Member toggles is_seller OFF"] --> CHECK{"Preconditions met?"}

    CHECK -->|"Active orders exist"| BLOCKED_ORDERS["Toggle disabled
    'Finish active transactions first'"]
    CHECK -->|"Active listings exist"| BLOCKED_LISTINGS["Toggle disabled
    'Close active listings first'"]
    CHECK -->|"All clear"| TOGGLE_OFF["is_seller = false
    Listings: is_visible = false
    Seller features hidden"]

    TOGGLE_OFF -->|"Later"| TOGGLE_ON["Toggle is_seller ON
    Listings restored
    Seller features visible"]

    style BLOCKED_ORDERS fill:#fff3cd
    style BLOCKED_LISTINGS fill:#fff3cd
```
