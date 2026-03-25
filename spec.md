# Hip-Hop Weekly

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- **Home / Weekly Rundown**: Landing page with issue number, featured stories, trending artists, and news cards. Admin-editable.
- **Trending & Analytics**: Charts showing trending songs, artists, and topics using data visualizations (bar/line charts).
- **Underground Scene by Region**: US regions (East Coast, West Coast, South, Midwest) + international regions, each with artist highlights. Admin-editable.
- **Beats to Rap On (Weekly Charts)**: Ranked beat list with title, producer, BPM, genre, and audio link. Admin-managed.
- **Producer Tips**: Tip cards from named producers with body text. Admin-managed.
- **THE WATCH LIST**: A single prominent spotlight feature per publication cycle — artist name, bio, photo URL, social links. Admin-updateable.
- **Review Page**: Displays reviewed song submissions with artist, title, rating (1-5), commentary. Admin-managed.
- **Song Submission Form**: Public form collecting artist name, song title, genre, song link, contact email/phone. Stripe $5 fee placeholder (Stripe component installed but checkout deferred).
- **Subscriber Signup**: Form collecting email address for newsletter mailing list.
- **Admin Panel**: Role-protected admin dashboard to create/edit/delete all content types: rundown stories, watch list, underground scene entries, beat charts, producer tips, reviews, and view/manage submissions and subscribers.
- **Authorization**: Role-based access (admin vs public) to gate the admin panel.

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` and `stripe` components.
2. Generate Motoko backend with actors for: RundownStory, WatchList, RegionEntry, BeatChart, ProducerTip, Review, SongSubmission, Subscriber.
3. Build React frontend with navigation, all pages, admin panel gated by auth, and bold urban design matching design preview.
