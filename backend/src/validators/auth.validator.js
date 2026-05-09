const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.alphanum": "Kullanıcı adı sadece harf ve rakam içerebilir",
        "string.min": "Kullanıcı adı en az 3 karakter olmalı",
        "string.max": "Kullanıcı adı en fazla 30 karakter olmalı",
        "any.required": "Kullanıcı adı zorunludur"
    }),
    display_name: Joi.string().min(2).max(50).required().messages({
        "string.min": "Görünen ad en az 2 karakter olmalı",
        "string.max": "Görünen ad en fazla 50 karakter olmalı",
        "any.required": "Görünen ad zorunludur"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Geçerli bir email adresi giriniz",
        "any.required": "Email adresi zorunludur"
    }),
    password: Joi.string().min(8).max(72).pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required().messages({
        "string.min": "Şifre en az 8 karakter olmalı",
        "string.max": "Şifre en fazla 72 karakter olmalı",
        "string.pattern.base": "Şifre en az bir harf ve bir rakam içermelidir",
        "any.required": "Şifre zorunludur"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Geçerli bir email adresi giriniz",
        "any.required": "Email adresi zorunludur"
    }),
    password: Joi.string().required().messages({
        "any.required": "Şifre zorunludur"
    })
});

const refreshSchema = Joi.object({
    refresh_token: Joi.string().required().messages({
        "any.required": "Refresh token zorunludur"
    })
});

module.exports = {registerSchema, loginSchema, refreshSchema}