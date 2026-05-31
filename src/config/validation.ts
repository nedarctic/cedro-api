import * as Joi from 'joi';

export const validationSchema = Joi.object({
    DATABASE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    R2_ACCOUNT_ID: Joi.string().required(),
    R2_ACCESS_KEY_ID: Joi.string().required(),
    R2_SECRET_ACCESS_KEY: Joi.string().required(),
    R2_BUCKET_NAME: Joi.string().required(),
    R2_PUBLIC_URL: Joi.string().uri().required(),
    R2_S3_API_URL: Joi.string().uri().required(),
});