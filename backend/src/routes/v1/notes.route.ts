import { notesController } from '../../controllers/index.ts';
import auth from '../../middlewares/auth.ts';
import validate from '../../middlewares/validate.ts';
import { notesValidation } from '../../validations/index.ts';
import express from 'express';

const router = express.Router();

// All routes require authentication
router
    .route('/')
    .post(auth('manageNotes'), validate(notesValidation.createNote), notesController.createNote)
    .get(auth('manageNotes'), validate(notesValidation.getNotes), notesController.getNotes);

router
    .route('/:id')
    .get(auth('manageNotes'), validate(notesValidation.getNoteById), notesController.getNoteById)
    .put(auth('manageNotes'), validate(notesValidation.updateNote), notesController.updateNote)
    .delete(auth('manageNotes'), validate(notesValidation.deleteNote), notesController.deleteNote);

export default router;

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management and operations
 */

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note
 *               content:
 *                 type: string
 *                 description: The content of the note
 *             example:
 *               title: Meeting Notes
 *               content: Discussed project roadmap and next steps...
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 *
 *   get:
 *     summary: Get all notes
 *     description: Get all notes for the authenticated user with optional filtering and sorting.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query to filter notes by title or content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, content, createdAt, updatedAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (default is desc)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 total:
 *                   type: integer
 *                   description: Total number of notes matching the filter
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note
 *     description: Get a specific note by ID for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 *
 *   put:
 *     summary: Update a note
 *     description: Update a specific note by ID for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note
 *               content:
 *                 type: string
 *                 description: The content of the note
 *             example:
 *               title: Updated Meeting Notes
 *               content: Updated content with additional information...
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 *
 *   delete:
 *     summary: Delete a note
 *     description: Delete a specific note by ID for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the note
 *         title:
 *           type: string
 *           description: The title of the note
 *         content:
 *           type: string
 *           description: The content of the note
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Note creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Note last update timestamp
 *       example:
 *         id: ckx1y2z3a
 *         title: Meeting Notes
 *         content: Discussed project roadmap and next steps...
 *         createdAt: 2025-10-31T10:30:45Z
 *         updatedAt: 2025-10-31T10:35:45Z
 */
