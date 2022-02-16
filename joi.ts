import Joi from "joi";

export const addPostSchema = Joi.object({
  title: Joi.string()
    .required()
    .error(() => new Error("Title is required")),
  text: Joi.string()
    .required()
    .error(() => new Error("Text is required")),
  userId: Joi.string()
    .length(24)
    .required()
    .error((errors) => {
      if (errors[0].code === "string.length") {
        return new Error("userId is invalid");
      }
      return new Error("userId is required");
    }),
});

export const deletePostSchema = Joi.object({
  userId: Joi.string()
    .length(24)
    .required()
    .error((errors) => {
      if (errors[0].code === "string.length") {
        return new Error("userId is invalid");
      }
      return new Error("userId is required");
    }),
})