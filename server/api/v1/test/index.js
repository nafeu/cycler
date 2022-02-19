import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";

export const postTest = async (req, res, next) => {
  try {
    const { example } = req.body;

    const input = { example };

    await schema.validateAsync(input);

    // const { data } = await axios.get();

    // res.json({ ...data });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
