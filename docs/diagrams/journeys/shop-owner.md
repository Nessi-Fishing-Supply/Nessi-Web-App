# Shop Owner Flows

Create shop, manage settings, invite members, roles & permissions, transfer ownership, delete shop.

## Create Shop

```mermaid
flowchart TD
    A{How does user get here?} --> B["Post-onboarding: chose 'Shop' seller type"]
    A --> C["Dashboard: /dashboard/shop/create"]
    A --> D["Seller opt-in modal: 'Create a shop'"]

    B --> E[Shop Creation Form]
    C --> E
    D --> E

    E --> F[Enter shop name]
    F --> G["Auto-generate slug from name"]
    G --> H["checkShopSlugAvailable(slug)"]
    H --> I{Available?}
    I -->|No| J[Show error, suggest alternatives]
    I -->|Yes| K[Enter description]
    K --> L["POST /api/shops"]
    L --> LA{Member at 5-shop limit?}
    LA -->|Yes| LB["409 SHOP_LIMIT_REACHED"]
    LA -->|No| M{Server-side}
    M --> N["Reserve slug in slugs table (atomic)"]
    M --> O["Create shop row (owner_id = user)"]
    M --> P["Add owner to shop_members with owner role"]
    M --> Q["Set is_seller = true on member"]
    N & O & P & Q --> R[Shop created]
    R --> S["Redirect to /dashboard/shop/settings"]
```

## Shop Settings

```mermaid
flowchart TD
    A["/dashboard/shop/settings"] --> B{Sections}

    B --> C[Shop Details]
    C --> C1[Inline-edit name]
    C --> C2["Edit slug (availability check)"]
    C --> C3[Edit description]
    C --> C4["Upload avatar (200x200 WebP)"]

    B --> D[Hero Banner]
    D --> D1[Upload image]
    D1 --> D2["Sharp: max 1200x400, WebP"]
    D2 --> D3[Stored in profile-assets bucket]

    B --> E[Shop Members]
    E --> E1[View current members with roles]
    E --> E2[Invite new member]
    E --> E3[Remove member]
    E --> E4[Change member role]

    B --> F[Subscription]
    F --> F1["Stripe subscription placeholder (not built)"]

    B --> G[Ownership Transfer]
    G --> G1[Select new owner from members]
    G1 --> G2[Two-step confirmation modal]
    G2 --> G3["POST /api/shops/[id]/ownership"]
    G3 --> G4[New owner gets owner role]
    G3 --> G5[Old owner becomes manager]

    B --> H[Delete Shop]
    H --> H1[Type shop name to confirm]
    H1 --> H2["DELETE /api/shops/[id]"]
    H2 --> H3{Server-side cleanup}
    H3 --> H4[Delete avatar from storage]
    H3 --> H5[Delete hero banner from storage]
    H3 --> H6[Delete all shop listing photos]
    H3 --> H7[Soft-delete shop row]
    H3 --> H8[Release slug]
```

## Member Management

```mermaid
flowchart TD
    A[Owner views Shop Members section] --> B[See member list with roles]

    B --> C{Invite member}
    C --> D[Enter email + select role]
    D --> E{Validation}
    E -->|Invalid email/role| F[400 error]
    E -->|Valid| G{Server-side checks}
    G -->|"Members + pending invites >= 5"| H["409 MEMBER_LIMIT_REACHED"]
    G -->|Already a member| I[409 already a member]
    G -->|Duplicate pending invite| J[409 duplicate invite]
    G -->|All clear| K["POST /api/shops/[id]/invites"]
    K --> L[Insert shop_invites row with 7-day expiry]
    L --> M[Send invite email via Resend]
    M --> N["Recipient clicks /invite/{token} → invite acceptance flow"]

    B --> O{Resend invite}
    O --> P["POST /api/shops/[id]/invites/[inviteId]/resend"]
    P --> Q[Regenerate token + reset expiry to 7 days]
    Q --> R[Resend invite email with new token]

    B --> S{Revoke invite}
    S --> T["DELETE /api/shops/[id]/invites/[inviteId]"]
    T --> U["Set status = 'revoked'"]

    B --> V{Remove member}
    V --> W["DELETE /api/shops/[id]/members/[memberId]"]
    W --> X[Member removed from shop_members]
    X --> Y{Was member in shop context?}
    Y -->|Yes| Z["403 on next API call → context revocation"]
    Y -->|No| AA[No immediate effect]
```

## Ownership Transfer (Request/Accept/Cancel)

```mermaid
flowchart TD
    A[Owner clicks Transfer Ownership] --> B[Select new owner from current members]
    B --> C[Confirmation modal]
    C --> D["POST /api/shops/[id]/ownership"]
    D --> D1{Pending transfer exists?}
    D1 -->|Yes| D2["409 — cancel existing first"]
    D1 -->|No| E{Server-side: initiate}
    E --> F["Insert shop_ownership_transfers row (status: pending, 7-day expiry)"]
    E --> G["Look up transferee email via admin client"]
    G --> H["Send ownership transfer email (Resend)"]
    H --> I["Email contains link: /shop/transfer/{token}"]
    F --> J["Return { success: true }"]

    subgraph Cancel
        K[Owner clicks Cancel Transfer] --> L["DELETE /api/shops/[id]/ownership-transfer"]
        L --> M["Set status → cancelled"]
    end

    subgraph Accept
        N["Transferee clicks email link"] --> O["/shop/transfer/{token} page (#258)"]
        O --> P["GET /api/shops/ownership-transfer/[token]"]
        P --> P1{Validation}
        P1 -->|Not found/non-pending| Q1["404"]
        P1 -->|Expired| Q2["410"]
        P1 -->|Wrong user| Q3["403"]
        P1 -->|Valid| R[Show transfer details]
        R --> S[Transferee clicks Accept]
        S --> T["POST /api/shops/ownership-transfer/[token]/accept"]
        T --> U{Atomic swap}
        U --> V["shops.owner_id → new owner"]
        U --> W["New owner: role_id → OWNER"]
        U --> X["Old owner: role_id → MANAGER"]
        U --> Y["Transfer status → accepted"]
        V & W & X & Y --> Z[Ownership transferred]
    end

    style D2 fill:#ffcdd2
    style Q1 fill:#ffcdd2
    style Q2 fill:#ffcdd2
    style Q3 fill:#ffcdd2
```

## Roles & Permissions Page

```mermaid
flowchart TD
    A["/dashboard/shop/roles"] --> B{User's role?}
    B -->|Owner| C[Full page access]
    B -->|Manager| C
    B -->|Contributor| D["ShopRouteGuard → redirect to /dashboard"]

    C --> E[System Roles section]
    E --> F[RoleCard: Owner — all 6 domains at 'full']
    E --> G["RoleCard: Manager — listings/pricing/orders/messaging 'full', shop_settings 'view', members 'none'"]
    E --> H["RoleCard: Contributor — listings 'full' only"]
    F & G & H --> I[Each card shows PermissionMatrix grid]

    C --> J{"Owner sees 'Add Custom Role' button"}
    J --> K[Click → CustomRoleUpsellModal]
    K --> L["Premium plan gate (not yet available)"]

    style D fill:#ffcdd2
    style L fill:#fff3e0
```

## Role Assignment

```mermaid
flowchart TD
    A[Owner views Shop Members section] --> B[Each member row has RoleSelect dropdown]
    B --> C{Owner member?}
    C -->|Yes| D["Dropdown disabled — Owner role cannot be changed"]
    C -->|No| E[Select new role from dropdown]
    E --> F["PATCH /api/shops/[id]/members/[memberId]/role"]
    F --> G{Validation}
    G -->|Cannot assign Owner role| H[400 error]
    G -->|Valid| I[Optimistic cache update]
    I --> J["Toast: 'Role updated to {roleName}'"]
    J --> K[Member's permissions change immediately]

    style D fill:#f0f0f0
```
