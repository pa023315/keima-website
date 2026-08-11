# KEIMA 桂馬數位企業形象網站設計規格

日期：2026-08-11  
狀態：已完成設計方向確認，待使用者審閱文件

## 1. 專案目標

建立 KEIMA／桂馬數位的繁中與英文企業形象網站。網站以品牌呈現為優先，主要服務企業客戶、潛在合作夥伴與商務合作對象。使用者應在進入網站後 5 至 10 秒內感受到專業、可信任、精準、現代與克制的品牌氣質。

本次交付範圍為本機可執行網站與正式 Production Build 驗證，不包含公開部署、CMS、後台、表單、Analytics 或其他追蹤工具。

## 2. 已確認的產品決策

- 網站語言：繁體中文與英文。
- 內容架構：單頁長卷軸；繁中與英文各有可靜態輸出的語言路由。
- 內容狀態：人物、服務、正式品牌文案、人物照片、Email 與法律資訊尚未提供。
- 缺少內容的處理：使用明確、可辨識、集中管理的內容待補狀態，不虛構任何公司資訊。
- 聯絡方式：只呈現 Email，不建立聯絡表單。Email 未確認前不產生可點擊的 `mailto:` 連結。
- 內容維護：不使用 CMS；所有雙語內容集中於型別化內容設定檔。
- 字體：KEIMA 目前沒有正式品牌字體。本網站使用的字體不宣稱為 KEIMA 官方字體。
- 交付：完成本機網站與 Production Build 驗證，不部署。

## 3. 品牌素材與使用規則

### 3.1 官方 Logo 系統

正式實作只使用使用者提供的官方 SVG：

- 彩色橫式 Logo。
- 彩色單獨圖標。
- 單色標準字。
- 單色橫式 Logo。
- 單色單獨圖標。

Desktop 導覽優先使用彩色橫式 Logo，寬度不得低於 120px。Mobile 導覽空間不足時切換為單獨圖標，最小尺寸為 24px。深色段落依背景使用官方單色反白版本。Logo 周圍保留至少一個圖標眼睛高度的保護空間。

禁止重畫、拆解、扭曲、旋轉、變更比例、字距、圖標與標準字距離、加入描邊或陰影，亦不得將 Logo 變形為動畫元素。

### 3.2 色彩系統

核心色彩固定為：

- KEIMA Ink：`#12120E`。
- KEIMA Paper：`#F1EFE7`。
- KEIMA Cyan：`#2EB8C6`。

建議視覺權重為 Paper 約 70%、Ink 約 25%、Cyan 約 5%。Cyan 只使用於細線、狀態、焦點、連結互動、切角與短暫動態節點，不作為大面積背景。

支援 UI 色彩沿用需求文件定義的 Surface、Typography、Border、Accent 與 Interaction Tokens。只有在對比度、Hover、Disabled 或技術需求下才可小幅調整支援色，不得更動三個核心色。

### 3.3 品牌幾何與數位轉譯

KEIMA Logo 的主要視覺特徵為馬首朝向、桂葉切片、銳利切面、幾何標準字、均衡負空間與清晰的 Symbol／Wordmark 關係。

網站將這些特徵延伸為：

- 斜向切割與方向性遮罩。
- 偏移格線與局部跨欄。
- 細線框與受控負空間。
- 文字切片與段落擦拭。
- Paper 與 Ink 之間的單次深色轉場。

品牌辨識主要由 Typography、Grid、Whitespace、Composition、Motion 與 Contrast 建立，不重複堆疊 Logo。

## 4. 視覺方向

採用已確認的「Directional Editorial」方向。

整體使用現代無襯線字、12 欄偏移格線、超大字級、斜向切面與大面積留白。視覺應兼具企業可信度與 Creative Studio 的作品感。Paper 為主要舞台；只在 Contact 前後安排一個 Ink 深色段落，形成記憶點與閱讀節奏。

禁止使用：

- 主要色彩漸層、Glow、Neon 或藍紫科技配色。
- Glassmorphism、黑金精品模板或大量陰影。
- 過度圓角卡片、三卡式套版或每區相同的 Fade Up。
- 粒子、彈跳、Elastic、過度 Spring 或快速閃動。
- 未授權或來源不明的正式圖片。

## 5. Typography

### 5.1 字體組合

- 英文：Instrument Sans Variable。
- 繁中：Noto Sans TC。

正式實作自託管字型檔並只載入需要的字重。英文以較緊的字距和幾何節奏呼應 Logo；繁中增加行高與字距，以維持大字級下的可讀性。兩個語言版本不強制使用完全相同的字級與斷行。

### 5.2 字級系統

建立 Display、H1、H2、H3、Body Large、Body、Small 與 Caption 八個層級。Desktop Hero 使用約 `clamp(5rem, 11vw, 12rem)` 的 Display 範圍；Mobile 重新編排文字順序、斷行與比例，不採 Desktop 等比例縮小。

## 6. 單頁資訊架構

### 6.1 Navigation

- 固定於頁面頂部。
- Desktop 使用官方彩色橫式 Logo；Mobile 使用官方單獨圖標。
- 導覽項目：Home、About、Services、Contact。
- 提供 `中文／EN` 語言切換。
- 語言切換使用前端路由，不整頁刷新；目前段落位置在可合理保留時保持不變。
- 導覽會顯示目前閱讀區域並支援鍵盤操作。

### 6.2 Hero／Home

目的：在第一屏建立 KEIMA 的品牌印象，而非呈現一般 Landing Page Hero。

內容包含官方 Logo、雙語品牌定位待補狀態、大型 Typography、偏移文字與斜向 Ink 幾何面。首屏不使用「標題＋段落＋CTA＋圖片」的制式排列。捲動時大型文字產生輕微速度差，Ink 切面延伸至下一區。

### 6.3 About

目的：以 Founder／Consultant／Creative Director Profile 的方式呈現公司背後人物。

版面使用非對稱 Editorial Grid、人物圖像區、個人定位、簡介、經歷、專長、合作經驗、關注領域與理念。人物資料與照片未提供時，顯示清楚的內容待補標記，不顯示假姓名、假職稱、假經歷或 Skills Progress Bar。

### 6.4 Services

目的：展示 KEIMA 實際運作中的品牌、服務、產品或專案。

Desktop 採 Sticky Index：左側固定服務序號與視覺區，右側隨閱讀切換內容。每項內容支援名稱、英文名稱、Logo、一句定位、簡介、服務內容、目標客群、URL、圖片與目前狀態。資料未提供時顯示 `內容待補／Content pending`，不建立假服務、假客戶或假案例。

Mobile 取消重型 Sticky 與視差，改為垂直索引與循序閱讀。

### 6.5 Contact／Footer

目的：以完整、有記憶點的 Ending Experience 邀請企業合作。

Contact 位於主要 Ink 深色段落，以大型 Email Typography 呈現。正式 Email 未提供時顯示 `商務 Email 待提供／Business email pending`，且不產生可點擊連結。Footer 整合官方 Logo、雙語導覽、社群、版權與法律資訊待補欄位。

## 7. Motion 與互動系統

### 7.1 動態原則

動態必須 Smooth、Elegant、Subtle、Premium 與 Controlled。動畫用於建立層級、方向與段落關係，不延遲內容閱讀或操作。

### 7.2 主要動態

- 首次進場：導覽、Hero 標題與幾何切面依序使用遮罩揭露。
- Hero：大型文字產生非常輕微的 Scroll-linked 速度差。
- About：人像遮罩與文字欄位使用不同節奏展開。
- Services：Sticky Index 隨閱讀進度切換序號、細線與內容。
- Section Transition：使用斜向遮罩或 Paper／Ink 擦拭連接段落。
- Contact：深色段落受控進場，Email 底線與箭頭回應 Hover／Focus。

所有動畫優先使用 `transform`、`opacity` 與少量 `clip-path`。不得建立大量同步 Scroll Listener；Scroll-linked 動態透過 Motion 的值系統或瀏覽器觀察機制完成。

### 7.3 Reduced Motion 與觸控

在 `prefers-reduced-motion: reduce` 下取消視差、位移與長時間遮罩，內容直接呈現或只保留極短透明度變化。Mobile 降低動畫複雜度，所有重要互動的觸控目標至少 44px。

## 8. 技術架構

### 8.1 技術選型

- Next.js App Router。
- TypeScript。
- Modern CSS 與 CSS Variables。
- Motion for React，僅用於重要動態。
- Next.js Static Export，輸出可由靜態主機提供的 HTML、CSS 與 JavaScript。

不使用 Tailwind、制式 UI Library、CMS、後端、表單服務或 Analytics。

### 8.2 路由與雙語資料流

- `/zh-TW/`：繁體中文版單頁網站。
- `/en/`：英文版單頁網站。
- 根路徑提供明確的預設語言入口，不依賴伺服器 Redirect。
- 語言切換使用 Next.js Client Navigation，在兩個靜態路由間切換。
- 使用者語言偏好儲存在瀏覽器；無儲存值時以繁中為預設。
- 每個語言路由輸出自己的 `lang`、Title、Description、Canonical 與 `hreflang` Metadata。

### 8.3 元件邊界

- `Layout`：全域結構、Metadata 與語言環境。
- `Navigation`：Logo 切換、段落導覽、語言切換與 Scroll State。
- `Hero`：品牌首屏與開場動態。
- `About`：人物專題版面與內容狀態。
- `Services`／`ServiceItem`：Sticky Index 與服務內容。
- `Contact`：Email 狀態與 Ending Experience。
- `Footer`：Logo、導覽、社群、版權與法律資訊。
- `Motion primitives`：Reveal、Mask、Section Transition 與 Reduced Motion 共用行為。
- `Typography`／`Media`：受控的文字與媒體呈現介面。

避免把整頁寫在單一元件，也避免為了形式而過度抽象。

### 8.4 內容模型

雙語內容設定檔以 TypeScript 型別定義，包含：

- 導覽與介面文字。
- Hero 品牌定位。
- About 人物資料與照片狀態。
- Services 陣列與各欄位狀態。
- Contact Email、社群、公司與法律資訊。

每個未提供的重要欄位都必須明確區分為 `pending`，UI 依狀態顯示待補提示，不使用 Lorem Ipsum 或看似正式的假資料。

### 8.5 錯誤與退化處理

網站不依賴遠端資料。缺少圖片時顯示符合品牌比例的媒體待補區；Email 為 `pending` 時不輸出 `mailto:`；缺少非必要社群或法律資料時顯示待補標記或隱藏該連結，不輸出無效 URL。JavaScript 不可用時，核心內容、語言路由與基本導覽仍可閱讀。

## 9. Responsive、效能與 Accessibility

### 9.1 Responsive

採 12 欄 Desktop、6 欄 Tablet、4 欄 Mobile 的設計基準，實際欄寬、Gutter 與 Margin 依視窗微調。驗證尺寸包含 1920、1440、1280、1024、768、430、390 與 375px。

重點檢查 Hero 斷行、Logo 版本切換、導覽、Sticky 退化、圖片裁切、觸控、Viewport Height 與中英文文字長度差異。

### 9.2 效能

- 自託管並限制字型字重。
- 圖片使用適合的尺寸、格式、Responsive Source 與 Lazy Loading。
- 首屏避免巨大未壓縮媒體與不必要影片。
- Motion 只載入需要功能，避免大量 Re-render 與同步 Scroll Listener。
- 控制 LCP、CLS、Bundle Size 與 Mobile 動畫成本。

### 9.3 Accessibility

- Semantic HTML 與合理 Heading 階層。
- Skip Link、鍵盤導覽與可見 Focus State。
- Touch Target 至少 44px。
- 正確 Alt Text；待補圖片使用非誤導性的狀態描述。
- 色彩對比符合閱讀需求，Cyan 不單獨作為唯一狀態訊號。
- 完整支援 `prefers-reduced-motion`。

## 10. SEO 與 Metadata

每個語言路由提供獨立 Title、Description、Canonical、Open Graph、Social Preview、`hreflang` 與正確語言屬性。建立 Favicon、Sitemap 與 Robots。未提供正式品牌文案前，Metadata 使用明確的內部待補狀態，不發布或部署含假文案的版本。

## 11. 驗證與驗收

### 11.1 自動驗證

- TypeScript 型別檢查。
- ESLint。
- Production Build 與 Static Export。
- 雙語內容模型、路由與待補狀態的單元測試。
- Navigation、語言切換與 Email 狀態的互動測試。

### 11.2 瀏覽器與視覺驗證

- 驗證繁中與英文路由可直接開啟。
- 驗證導覽、語言切換、Anchor State 與鍵盤操作。
- 驗證指定 Desktop、Tablet 與 Mobile 尺寸。
- 驗證一般 Motion 與 Reduced Motion。
- 檢查 Console Error、破圖、無效連結、Overflow、Layout Shift 與文字裁切。

### 11.3 完成標準

- 官方 Logo 使用正確，尺寸與保護空間符合規範。
- 只使用 KEIMA Ink、Paper、Cyan 與已定義的支援 UI 色。
- 網站具有 Directional Editorial 的辨識度，沒有套版、SaaS 或 AI Landing Page 氣質。
- Desktop 與 Mobile 均有完整且不同的構圖策略。
- Scroll Motion 明顯、連續、克制，且 Reduced Motion 正確。
- 沒有虛構資料、Lorem Ipsum、無效 Email 或假連結。
- Production Build 與 Static Export 成功，沒有明顯 Console Error。

## 12. 實作順序

正式實作依序進行：Brand Assets 與 Tokens、Global Layout、Typography、Content Model、Navigation、Hero、About、Services、Contact／Footer、Motion、Responsive、Accessibility、Performance、SEO、Build 與最終 QA。

此順序遵循 Brand → Layout → Typography → Content → Motion → Polish，避免先做動畫再補內容結構。
