import Joi from 'joi';

export class ValidationSchema {
    public static authUser() {
        return Joi.object().options({ abortEarly: false }).keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });
    }

    public static invitePlayer() {
        return Joi.object().options({ abortEarly: false }).keys({
            userId: Joi.string().required(),
        });
    }
}
