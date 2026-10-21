import Joi from "joi";

export const createZombieSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Название должно быть строкой",
    "string.empty": "Название не может быть пустым",
    "string.min": "Название должно быть не меньше 3 символов",
    "string.max": "Название не должно превышать 50 символов",
    "any.required": "Название обязательно",
  }),
  description: Joi.string().min(15).max(300).required().messages({
    "string.base": "Описание должно быть",
    "string.empty": "Описание не может быть пустым",
    "string.min": "Описание должно быть не меньше 15 символов",
    "string.max": "Описание не может превышать 300 символов",
    "any.required": "Описание обязательно",
  }),
  dangerLevel: Joi.number().integer().min(0).max(10).required().messages({
    "number.base": "Уровень должен быть числом",
    "number.integer": "Уровень должен быть целым числом",
    "number.min": "Минимальное значение уровня - 0",
    "number.max": "Максимальное значение уровня - 10",
    "any.required": "Уровень опасности обязателен",
  }),
  specifics: Joi.object().optional().messages({
    "object.base": "Особенности должны быть словарём",
  }),
});

export const updateZombieSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.base": "Название должно быть строкой",
    "string.empty": "Название не может быть пустым",
    "string.min": "Название должно быть не меньше 3 символов",
    "string.max": "Название не должно превышать 50 символов",
  }),
  description: Joi.string().min(15).max(300).optional().messages({
    "string.base": "Описание должно быть",
    "string.empty": "Описание не может быть пустым",
    "string.min": "Описание должно быть не меньше 15 символов",
    "string.max": "Описание не может превышать 300 символов",
  }),
  dangerLevel: Joi.number().integer().min(0).max(10).optional().messages({
    "number.base": "Уровень должен быть числом",
    "number.integer": "Уровень должен быть целым числом",
    "number.min": "Минимальное значение уровня - 0",
    "number.max": "Максимальное значение уровня - 10",
  }),
  specifics: Joi.object().optional().messages({
    "object.base": "Особенности должны быть словарём",
  }),
});
