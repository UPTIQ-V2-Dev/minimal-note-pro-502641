import Joi from 'joi';

const createNote = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required()
    })
};

const getNotes = {
    query: Joi.object().keys({
        query: Joi.string(),
        sortBy: Joi.string().valid('title', 'content', 'createdAt', 'updatedAt'),
        sortOrder: Joi.string().valid('asc', 'desc')
    })
};

const getNoteById = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

const updateNote = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            content: Joi.string()
        })
        .min(1)
};

const deleteNote = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

export default {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
