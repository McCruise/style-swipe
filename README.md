# Style Swipe

A social fashion app where users can share photos of their outfits, haircuts, and personal style choices. Other users can swipe right to approve or left to disapprove of different looks, creating an interactive community for style feedback and inspiration.

## Tech Stack

- **React** - Frontend framework for building the user interface
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Local Storage** - Browser storage for persisting user data and posts

## Development Milestones

### Milestone 1: User Profile & Photo Upload
- Users can create a profile with their name
- Users can upload and display photos of their outfits/styles
- Profile data is saved to local storage
- **Test**: Create a profile, upload a photo, refresh the page - profile and photo should persist

### Milestone 2: Photo Feed Display
- Display all uploaded photos in a scrollable feed
- Each photo shows the user's name and the uploaded image
- Photos are loaded from local storage on page load
- **Test**: Upload multiple photos from different users, verify all appear in the feed

### Milestone 3: Swipe Functionality
- Implement swipe gestures (or click buttons) to swipe left (disapprove) or right (approve)
- Show next photo in queue after swiping
- Track swipe actions in local storage
- **Test**: Swipe through photos, verify smooth transitions and that swiped photos are marked

### Milestone 4: Swipe History & Statistics
- Display a history of all swipes (approved/disapproved items)
- Show statistics: total swipes, approval rate, etc.
- Allow users to view their swipe history
- **Test**: Swipe on several photos, check history page shows correct counts and items

### Milestone 5: Filter & Search
- Filter photos by user name
- Search functionality to find specific posts
- Display filtered results in the feed
- **Test**: Search for a specific user's name, verify only their photos appear
