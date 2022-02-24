export const getTest = async (req, res, next) => {
  console.log(`curl http://localhost:8000/api/test`);
  res.json({ success: true });
}
