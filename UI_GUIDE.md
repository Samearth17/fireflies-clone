# UI_GUIDE.md

# Fireflies.ai Clone --- UI & UX Design Guide

## Design Goal

Create a clean, modern workspace inspired by Fireflies.ai with emphasis
on readability, productivity, and fast navigation.

## Global Design System

### Colors

-   Background: Off-white (#F8FAFC equivalent)
-   Cards: White
-   Primary Accent: Indigo/Blue
-   Success: Green
-   Warning: Amber
-   Error: Red
-   Borders: Light gray

### Typography

-   Font: Inter
-   Heading: 24--32px
-   Body: 14--16px
-   Caption: 12px
-   Medium font-weight for labels.

### Border Radius

-   Cards: 16px
-   Buttons: 10px
-   Inputs: 10px

### Shadows

-   Soft card shadows only.
-   Avoid heavy elevation.

------------------------------------------------------------------------

# Layout

Desktop:

    ------------------------------------------------------
     Sidebar | Top Bar
             |--------------------------------------------
             | Dashboard / Meeting Content
    ------------------------------------------------------

Responsive: - Sidebar collapses below tablet. - Mobile uses drawer
navigation.

------------------------------------------------------------------------

# Sidebar

Contains: - Logo - Meetings - Search - Settings (placeholder) - Profile
avatar

Behavior: - Fixed height - Sticky - Icon + label - Active page
highlighted

------------------------------------------------------------------------

# Dashboard

Top Area: - Search bar - Filter button - Sort dropdown

Meeting Cards: Display: - Title - Date - Duration - Participant
avatars - Summary preview

Card Behavior: - Hover elevation - Entire card clickable - Context menu
(edit/delete)

Empty State: - Illustration - "No meetings found"

Loading: - Skeleton cards

------------------------------------------------------------------------

# Meeting Detail Page

Split Layout

    -------------------------------------------------------
     Transcript | Summary
                | Action Items
                | Media Player
    -------------------------------------------------------

Transcript should occupy \~65% width.

Summary column \~35%.

------------------------------------------------------------------------

# Transcript Panel

Each transcript segment shows: - Speaker avatar/initial - Speaker name -
Timestamp - Transcript text

Interactions: - Click timestamp → seek player. - Current playing segment
highlighted. - Search highlights matching words. - Auto-scroll optional.

------------------------------------------------------------------------

# Media Player

Placeholder audio controls: - Play - Pause - Seek bar - Current time -
Duration

Transcript and seek bar stay synchronized.

------------------------------------------------------------------------

# AI Summary Panel

Cards: - Meeting Overview - Key Topics - Decisions - Action Items

Each section separated with spacing.

------------------------------------------------------------------------

# Action Items

Each task contains: - Checkbox - Description - Owner - Due date

Allow: - Edit - Complete - Delete

Completed tasks appear visually distinct.

------------------------------------------------------------------------

# Forms

Meeting Create/Edit Fields: - Title - Date - Duration - Participants -
Transcript upload/paste

Validation: - Inline errors - Required indicators

------------------------------------------------------------------------

# Search Experience

Dashboard: - Instant filtering.

Transcript: - Highlight matches. - Previous/Next match controls
(optional).

------------------------------------------------------------------------

# Notifications

Toast messages: - Meeting created - Updated - Deleted - Action
completed - Upload successful

Top-right placement.

------------------------------------------------------------------------

# Loading States

Use skeletons for: - Dashboard cards - Transcript - Summary - Action
list

Avoid blank screens.

------------------------------------------------------------------------

# Accessibility

-   Keyboard navigation
-   Visible focus rings
-   ARIA labels
-   Sufficient color contrast

------------------------------------------------------------------------

# Animations

-   150--250ms transitions
-   Fade for modals
-   Hover lift for cards
-   Smooth sidebar interactions

Keep animations subtle.

------------------------------------------------------------------------

# Component Inventory

-   Sidebar
-   TopNavbar
-   SearchBar
-   FilterDropdown
-   MeetingCard
-   TranscriptPanel
-   TranscriptRow
-   TimestampBadge
-   AudioPlayer
-   SummaryCard
-   ActionItemCard
-   Modal
-   Toast
-   AvatarGroup
-   EmptyState
-   SkeletonLoader
-   ConfirmDialog

------------------------------------------------------------------------

# Responsiveness

Desktop: full layout

Tablet: - Smaller summary panel - Collapsible sidebar

Mobile: - Drawer navigation - Stacked transcript & summary - Bottom
action buttons

------------------------------------------------------------------------

# UX Principles

-   Minimize clicks.
-   Always preserve context.
-   Fast search.
-   Clear visual hierarchy.
-   Consistent spacing.
-   Professional SaaS appearance.
