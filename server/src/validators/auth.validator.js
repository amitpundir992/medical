import {z} from "zod";

const signupSchema = z.object({
username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(2, { message: "Name must be at least of 2 chars." })
    .max(255, { message: "Name must not be more than 255 characters" }),

email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address"})
    .min(3, { message: "Email must be at least of 3 chars." })
    .max(255, { message: "Email must not be more than 255 characters" }),
password: z
    .string({ required_error: "Password is required" })
    .min(3, { message: "Password must be at least of 3 chars." })
    .max(1024, { message: "Password can't be greater than 1024 characters" }),

});

export default signupSchema;