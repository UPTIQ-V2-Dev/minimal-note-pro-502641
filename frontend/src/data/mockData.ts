import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { Note, NotesListResponse, NoteResponse } from '@/types/notes';

export const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};

// Mock Notes Data
export const mockNotes: Note[] = [
    {
        id: '1',
        title: 'Meeting Notes - Product Planning',
        content:
            'Discussed the upcoming product roadmap for Q1. Key points:\n- Focus on user experience improvements\n- Implement new dashboard features\n- Review current performance metrics\n\nAction items:\n- Schedule follow-up with design team\n- Prepare wireframes by Friday',
        createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T14:22:00Z').toISOString()
    },
    {
        id: '2',
        title: 'Ideas for Weekend Project',
        content:
            'Some ideas for the weekend coding project:\n\n1. Build a simple task manager\n2. Create a weather app with geolocation\n3. Implement a note-taking app with markdown support\n4. Build a personal finance tracker\n\nLeaning towards the task manager since it would be most useful for daily productivity.',
        createdAt: new Date('2024-01-14T09:15:00Z').toISOString(),
        updatedAt: new Date('2024-01-14T09:15:00Z').toISOString()
    },
    {
        id: '3',
        title: 'Recipe - Homemade Pizza',
        content:
            'Ingredients:\n- 2 cups flour\n- 1 cup warm water\n- 1 tsp salt\n- 1 tbsp olive oil\n- 1 tsp active dry yeast\n- Pizza sauce\n- Mozzarella cheese\n- Toppings of choice\n\nInstructions:\n1. Mix yeast with warm water, let sit for 5 minutes\n2. Combine flour and salt in a bowl\n3. Add water mixture and olive oil\n4. Knead for 8-10 minutes\n5. Let rise for 1 hour\n6. Roll out, add toppings, bake at 475°F for 12-15 minutes',
        createdAt: new Date('2024-01-13T18:45:00Z').toISOString(),
        updatedAt: new Date('2024-01-13T19:30:00Z').toISOString()
    },
    {
        id: '4',
        title: 'Book Recommendations',
        content:
            'Books to read this year:\n\n📚 Fiction:\n- "The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid\n- "Project Hail Mary" by Andy Weir\n- "Klara and the Sun" by Kazuo Ishiguro\n\n📖 Non-Fiction:\n- "Atomic Habits" by James Clear\n- "The Psychology of Money" by Morgan Housel\n- "Digital Minimalism" by Cal Newport\n\nCurrently reading "Atomic Habits" - great insights on building better habits through small changes.',
        createdAt: new Date('2024-01-12T16:20:00Z').toISOString(),
        updatedAt: new Date('2024-01-12T16:20:00Z').toISOString()
    },
    {
        id: '5',
        title: 'Travel Planning - Summer Trip',
        content:
            'Planning summer vacation to Europe:\n\n🗓️ Dates: July 15-30\n🌍 Countries: Spain, France, Italy\n\nSpain (July 15-20):\n- Madrid (2 days)\n- Barcelona (3 days)\n\nFrance (July 20-25):\n- Paris (3 days)\n- Nice (2 days)\n\nItaly (July 25-30):\n- Rome (2 days)\n- Florence (2 days)\n- Venice (1 day)\n\nTo-do:\n✅ Book flights\n🔲 Reserve accommodations\n🔲 Research local attractions\n🔲 Check passport expiration',
        createdAt: new Date('2024-01-11T11:10:00Z').toISOString(),
        updatedAt: new Date('2024-01-16T08:45:00Z').toISOString()
    }
];

export const mockNotesListResponse: NotesListResponse = {
    notes: mockNotes,
    total: mockNotes.length
};

export const mockNoteResponse = (id: string): NoteResponse => {
    const note = mockNotes.find(n => n.id === id);
    if (!note) {
        throw new Error(`Note with id ${id} not found`);
    }
    return { note };
};
