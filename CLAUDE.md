# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Your English Bridge is an English learning platform focused on teaching the 1,500 most useful words through interactive word cards, practice exercises, and AI-powered features. The project is built with Next.js 15, uses MongoDB for word data and Supabase for user data, and supports Hebrew (RTL) as the primary UI language.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database & Content Scripts
All scripts require environment variables from `.env.local`:
```bash
npm run generate-words       # Generate/update word data in MongoDB
npm run update-mongo        # Update word IDs in MongoDB
npm run update-confused-words    # Update confused words field
npm run regenerate-sentences     # Regenerate example sentences for words
npm run list-words          # List words in range 1001-1500
npm run update-word         # Update word indexes
npm run validate-ps-field   # Validate part-of-speech field
npm run generate-coupons    # Generate coupon codes for subscriptions
```

## Architecture

### Database Strategy (Dual Database)
- **MongoDB**: Stores all word content (word, translations, inflections, examples, synonyms, confused words, etc.)
- **Supabase**: Manages all user-related data (users, subscriptions, progress, settings)

### Authentication Flow
- Uses NextAuth.js with Google OAuth provider (`src/lib/auth.js`)
- On first sign-in, users without a Supabase record are redirected to registration page
- JWT tokens include subscription status and user ID from Supabase
- Middleware protects API routes requiring authentication (`middleware.js`)
- Session includes subscription data that's refreshed every 24 hours

### Route Organization (Next.js 15 App Router)
Routes use grouped folders with parentheses for organization:
- `(routes)/words` - Main word learning interface with card and navigation
- `(routes)/practiceSpace` - Practice exercises (reading, writing, speaking, listening)
- `(routes)/wordLists` - Browse words by categories
- `(routes)/checkYourLevel` - Level assessment quiz
- `(routes)/(grammar)` - Grammar explanations (inflections, parts of speech, rules)
- `(routes)/(guides)` - Onboarding and guide pages (startLearn, personalGuide, levelSelection)
- `(routes)/(users)` - User-related pages (registration)
- `(routes)/(layout)` - Static pages (about, contact)

### Key Features Architecture

#### Word Card System (`src/app/(routes)/words`)
- **Server Component**: `page.js` fetches word data via `getWordByIndex()` and passes to client components
- **Context Providers**: Uses `ColorProvider` for rating colors, `WindowProvider` for additional info windows
- **Main Card**: Displays word, translation, part of speech, inflections, examples, synonyms, confused words
- **Navigation**: Wrapped in `NavigationWrapper` with personal guide, progress tracking, and index jumping
- **Virtual Tour**: Interactive tutorial system (`card/virtualTour/`) using tour context and overlay

#### Practice Space (`src/app/(routes)/practiceSpace`)
Services layer pattern:
- `services/generateStory.js` - AI-generated personalized reading stories
- `services/questionService.js` - Generate comprehension questions
- `services/writingService.js` - Writing exercises with AI feedback
- `services/voiceChatService.js` - AI conversation practice
- `services/wordsService.js` - Fetch challenging words for practice

API routes in `api/` handle AI integrations (OpenAI, Google TTS, STT)

#### Text-to-Speech System
- Google Cloud TTS API route: `src/app/api/tts/route.js`
- Client-side audio cache: `src/utils/audioCache.js`
- Audio button component: `src/components/features/AudioButton.js`
- Supports pronunciation for words, examples, and practice content

### Database Access Patterns

#### MongoDB (Word Data)
Connection: `src/lib/db/mongodb.js` - Uses connection pooling and global caching
Key functions:
- `getWordByIndex()` - Fetch single word by index number
- `getWordsByCategory()` - Fetch words filtered by category

#### Supabase (User Data)
Two clients in `src/lib/db/supabase.js`:
- `supabase` - Anonymous client for public operations
- `supabaseAdmin` - Service role client for privileged operations (auth callbacks, cron jobs)

User preferences: `src/lib/userPreferences.js` handles storing/fetching user settings

### Styling & UI
- **Tailwind CSS** with custom configuration
- **RTL Support**: HTML lang="he" dir="rtl" in root layout
- **Font**: Inter with Latin and Latin Extended subsets
- **Components**: Mix of custom components and Radix UI primitives (Alert Dialog, Select, Tooltip, Slot)
- **Animations**: Framer Motion for interactive elements

### Email System
Located in `src/lib/email/`:
- `config.js` - Email service configuration
- `mailer.js` - Send email functions
- `templates/welcome.js` - Welcome email template
- `templates/notification.js` - Notification templates

### Cron Jobs
- `vercel.json` defines scheduled tasks
- `/api/cron/check-subscriptions` runs daily at 9 AM to check subscription statuses

## Important Notes

### Hebrew Language Comments
Many code comments are in Hebrew - this is intentional for the developer. When adding new comments, follow existing language patterns in that file.

### Path Aliases
The `@` alias maps to `./src` directory (configured in `next.config.js` and `jsconfig.json`)

### Environment Variables Required
Check `.env.local` for:
- MongoDB connection (MONGODB_URI, MONGODB_DB)
- Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- NextAuth configuration (GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET)
- OpenAI API key (for practice features)
- Google Cloud credentials (for TTS)

### Database Scripts Usage
Before running database scripts:
1. Ensure `.env.local` has correct MongoDB credentials
2. Scripts use `node -r dotenv/config` to load environment variables
3. Most scripts modify production data - use with caution

### Word Data Structure
Words in MongoDB have these key fields:
- `index`: Unique number (1-1500)
- `word`: The English word
- `tr`: Hebrew translation
- `ps`: Part of speech
- `inf`: Inflections array
- `infl`: Inflections as string
- `ex`: Example sentences array
- `synonyms`: Related words
- `confused`: Commonly confused words
- `category`: Word grouping

### Subscription System
- Stored in Supabase `subscriptions` table
- Status field: 'active', 'inactive', 'expired'
- Types: subscription-based access control
- Checked in JWT callback and refreshed daily
- Cron job handles automatic status updates
