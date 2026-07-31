# Graph Report - .  (2026-07-16)

## Corpus Check
- 152 files · ~431,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 228 nodes · 143 edges · 7 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `CarCard()` - 6 edges
2. `formatPrice()` - 6 edges
3. `extractImageUrl()` - 6 edges
4. `getCarInquiryLink()` - 5 edges
5. `CarDetailPageClient()` - 4 edges
6. `getWhatsAppLink()` - 4 edges
7. `CarDetailPageServer()` - 3 edges
8. `formatKms()` - 3 edges
9. `getOptimizedImage()` - 3 edges
10. `seed()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `extractImageUrl()`  [INFERRED]
  frontend\src\app\catalog\[slug]\page.js → frontend\src\lib\utils.js
- `AdminSellRequestsPage()` --calls--> `formatPrice()`  [INFERRED]
  frontend\src\app\admin\sell-requests\page.js → frontend\src\lib\utils.js
- `CarDetailLayout()` --calls--> `extractImageUrl()`  [INFERRED]
  frontend\src\app\catalog\[slug]\layout.js → frontend\src\lib\utils.js
- `CarDetailPageServer()` --calls--> `extractImageUrl()`  [INFERRED]
  frontend\src\app\catalog\[slug]\page.js → frontend\src\lib\utils.js
- `EmiCalculator()` --calls--> `formatPrice()`  [INFERRED]
  frontend\src\components\EmiCalculator.jsx → frontend\src\lib\utils.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (15): CarCard(), CarDetailPageClient(), CarImage(), EmiCalculator(), ContactPage(), extractImageUrl(), formatKms(), formatPrice() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (2): isTokenBlacklisted(), protect()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (2): seed(), connectDB()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): CarDetailPageServer(), generateMetadata(), getCarData()

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (2): FeaturedCarsServer(), getFeaturedCars()

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (2): getBanners(), PromoBannersServer()

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (2): getTestimonials(), TestimonialsServer()

## Knowledge Gaps
- **Thin community `Community 3`** (6 nodes): `authMiddleware.js`, `adminOnly()`, `blacklistToken()`, `generateToken()`, `isTokenBlacklisted()`, `protect()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (4 nodes): `db.js`, `seed.js`, `seed()`, `connectDB()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (3 nodes): `FeaturedCarsServer.jsx`, `FeaturedCarsServer()`, `getFeaturedCars()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (3 nodes): `PromoBannersServer.jsx`, `getBanners()`, `PromoBannersServer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `TestimonialsServer.jsx`, `getTestimonials()`, `TestimonialsServer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `extractImageUrl()` connect `Community 0` to `Community 6`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `CarCard()` (e.g. with `extractImageUrl()` and `getOptimizedImage()`) actually correct?**
  _`CarCard()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `formatPrice()` (e.g. with `AdminSellRequestsPage()` and `CarCard()`) actually correct?**
  _`formatPrice()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `extractImageUrl()` (e.g. with `CarDetailLayout()` and `generateMetadata()`) actually correct?**
  _`extractImageUrl()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getCarInquiryLink()` (e.g. with `CarCard()` and `CarDetailPageClient()`) actually correct?**
  _`getCarInquiryLink()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `CarDetailPageClient()` (e.g. with `formatPrice()` and `formatKms()`) actually correct?**
  _`CarDetailPageClient()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._