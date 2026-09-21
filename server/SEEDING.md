# Database Seeding Guide

This guide explains how to seed your database with test data for the pet adoption application.

## What Gets Seeded?

The seed script creates:

- **6 test users** (1 admin + 5 regular users)
- **10 sample pets** (dogs and cats with detailed descriptions)
- **10 placeholder SVG images** (automatically generated with colors and initials)
- **7 adoption requests** with various statuses (pending, approved, rejected)
- **User favorites** data for testing the favorites feature

## Prerequisites

Make sure you have:

1. MongoDB running and accessible
2. A `.env` file in the `server` directory with `MONGO_URI` configured
3. All server dependencies installed (`npm install`)

Example `.env` file:

```
MONGO_URI=mongodb://localhost:27017/pet-adoption
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Running the Seed Script

### From the server directory:

```bash
npm run seed
```

### Or directly with Node:

```bash
node scripts/seedDatabase.js
```

## Test Credentials

After seeding, you can log in with:

**Admin Account:**

- Email: `admin@example.com`
- Password: `Admin@123`

**Regular User Account:**

- Email: `john@example.com`
- Password: `User@123`

**Other test users:**

- sarah@example.com / User@123
- mike@example.com / User@123
- emma@example.com / User@123
- robert@example.com / User@123

## Seeded Data Details

### Users

- Admin User (verified)
- John Smith (verified, has favorites)
- Sarah Johnson (verified, has favorites)
- Mike Davis (verified, has favorites)
- Emma Wilson (verified)
- Robert Brown (not verified - for testing email verification)

### Pets

1. **Buddy** - Golden Retriever (San Francisco)
2. **Whiskers** - Persian Cat (New York)
3. **Max** - German Shepherd (Los Angeles)
4. **Luna** - Siamese Kitten (Chicago)
5. **Charlie** - Labrador Retriever (Boston)
6. **Mittens** - Tabby Cat (Seattle)
7. **Daisy** - Beagle Puppy (Denver)
8. **Shadow** - Black Domestic Cat (Austin)
9. **Rocky** - Boxer (Miami)
10. **Bella** - Bengal Mix Cat (Portland)

### Placeholder Images

Each pet automatically gets a colorful SVG placeholder image generated with:

- Random color background (15 different colors for variety)
- Pet paw emoji 🐾
- Pet initials in large white text
- Pet name at the bottom

Images are saved as `.svg` files in the `uploads/` directory:

- `buddy.svg`, `whiskers.svg`, `max.svg`, etc.
- Accessible via `/uploads/[filename].svg` in your app
- Easy to replace with real images later by just uploading new files with the same names

### Adoption Requests

- Mix of pending, approved, and rejected statuses
- Multiple requests from same users to test relationships
- Real-world adoption request messages

## Important Notes

- The script **clears all existing data** before seeding to ensure a clean database
- All passwords are hashed using bcryptjs for security
- Timestamps are automatically added by MongoDB
- The script includes proper error handling

## Customizing Seed Data

To customize the seed data, edit `server/scripts/seedDatabase.js`:

1. **Add more users** - Edit the `seedUsers()` function
2. **Add more pets** - Edit the `seedPets()` function
3. **Add more adoption requests** - Edit the `seedAdoptionRequests()` function
4. **Change data clearing behavior** - Modify or remove the `await clearDatabase()` call in `seedDatabase()`

### Upgrading to Real Images

Currently, the seeding uses simple SVG placeholder images. To upgrade to real pet images later:

**Option 1: Use Placeholder Image Service (Fastest)**

- Replace image generation to use URLs from services like Unsplash or Picsum.photos
- No local files needed, just update the photo URLs in `seedPets()`

**Option 2: Download Real Images (Recommended)**

- Update `generatePlaceholderImages()` to download real pet images from a free API
- Save them to the uploads folder automatically
- Requires adding a library like `axios` for HTTP requests

**Option 3: Manually Upload Images**

- Generate placeholders as-is, then manually upload real images
- Replace files in `/uploads/` with actual pet photos
- Keep the same filenames to avoid updating the database

## Troubleshooting

### "MongoDB connected" error

- Ensure MongoDB is running
- Check that `MONGO_URI` in your `.env` file is correct

### "Cannot find module" errors

- Run `npm install` in the server directory to install dependencies

### Email verification issues

- The `robert@example.com` user is intentionally marked as unverified
- To verify manually, you can update the user in MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "robert@example.com" },
    { $set: { isVerified: true } },
  );
  ```

## Next Steps

After seeding:

1. Start the server with `npm run dev`
2. Start the client with `npm start` (from client directory)
3. Log in with test credentials
4. Test the adoption request flow, favorites, and admin features
