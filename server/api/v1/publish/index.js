import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";

export const postPublish = async (req, res, next) => {
  try {
    const payload = req.body;

    // const input = { ...payload };
    // await schema.validateAsync(input);

    console.log({ payload });

    // const { data } = await axios.get();

    setTimeout(() => {
      res.json({ success: true });
    }, 2000);
  } catch (error) {
    next(error);
  }
};
