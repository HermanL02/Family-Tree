# Family Tree Application

A beautiful vintage-styled family tree application built with Next.js, MongoDB, and React Flow. This application allows you to create, manage, and visualize your family history with an elegant old-world aesthetic.

## Features

- **User Authentication**: Secure login and registration system using NextAuth.js
- **Family Member Management**: Add, edit, and delete family members
- **Visual Family Tree**: Interactive tree visualization with drag-and-drop support
- **Relationship Tracking**: Connect family members as parents, children, and spouses
- **Vintage Design**: Beautiful old-world styling with parchment textures and sepia tones
- **Smooth Animations**: Framer Motion-powered animations for a delightful user experience
- **Responsive Design**: Works seamlessly across devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Visualization**: React Flow
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/family-tree
# For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/family-tree

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### First Time Setup

1. Navigate to the home page
2. Click "Get Started" to create an account
3. Fill in your name, email, and password
4. After registration, you'll be redirected to log in

### Creating Your Family Tree

1. After logging in, you'll see the dashboard
2. Click "Add Family Member" to create your first person
3. Fill in the details:
   - Name (required)
   - Gender (required)
   - Birth/Death dates (optional)
   - Description (optional)
   - Parents (select from existing male/female members)

4. Drag nodes around to organize your tree
5. Edit or delete members using the buttons on each node

### Relationships

- **Parents**: Select a father and/or mother when creating/editing a member
- **Children**: Automatically added when you set parents
- **Spouses**: Currently managed through the relationship IDs (future feature for UI management)

## Project Structure

```
Family-Tree/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── family-members/ # CRUD operations
│   │   └── register/       # User registration
│   ├── dashboard/          # Main dashboard page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── layout.tsx          # Root layout
├── components/              # React components
│   ├── providers/          # Context providers
│   └── tree/               # Family tree components
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   └── mongodb.ts          # Database connection
├── models/                  # Mongoose models
│   ├── User.ts
│   └── FamilyMember.ts
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Database Schema

### User
- email: string (unique)
- password: string (hashed)
- name: string
- createdAt: Date

### FamilyMember
- userId: ObjectId (reference to User)
- name: string
- gender: "male" | "female"
- birthDate: Date (optional)
- deathDate: Date (optional)
- description: string (optional)
- photoUrl: string (optional)
- fatherId: ObjectId (optional)
- motherId: ObjectId (optional)
- spouseIds: ObjectId[] (optional)
- childrenIds: ObjectId[] (optional)
- nodePosition: { x: number, y: number }

## Building for Production

```bash
npm run build
npm start
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Vintage Colors

The vintage color palette can be customized in `tailwind.config.ts`:

```typescript
vintage: {
  paper: "#f4e8d0",    // Background parchment
  dark: "#3d2817",     // Dark text
  sepia: "#704214",    // Primary brown
  light: "#f5deb3",    // Light background
  border: "#8b7355",   // Border color
}
```

### Adding Features

To add new features:
1. Create API routes in `app/api/`
2. Add components in `components/`
3. Update types in `types/index.ts`
4. Modify models in `models/` if database changes needed

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check that `MONGODB_URI` in `.env.local` is correct
- For Atlas, verify network access and database user permissions

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check that `NEXTAUTH_URL` matches your development URL

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Run `npm run build`

## Future Enhancements

- Photo upload for family members
- Print/export family tree as PDF
- Advanced relationship management (siblings, grandparents)
- Timeline view
- Family stories and documents
- Search and filter functionality
- Multiple family tree support

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please create an issue in the repository.
